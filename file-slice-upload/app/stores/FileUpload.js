import {
  observable,
  action,
} from 'mobx';
import { postDataPro } from 'app/utils/request';
import { objectStorageApi } from 'app/utils/api';
import { arrayRemove, formatSizeStr, mapMimeType } from 'app/utils/utils';

import openNotification from 'app/utils/openNotification';

/*
  操作流程说明：
  [01] get files - 前端加载文件
  [02] registry - 调用注册函数注册文件上传对象
  [03] startTasks - 开启文件上传队列任务
  [04] pause/continue/terminate/store - 其它操作(暂停/继续/终止/恢复)

  文件上传状态说明：
    1. uninitial - 未初始化，前端加载，尚未发送初始化请求
    2. pending - 准备状态，可能是pause/error -> pending
    3. uploading - 上传状态的任务；
    4. break - 上传完成状态的任务
    5. error - 错误状态的任务
    6. pause - 暂停状态的任务
    7. series - 可以被执行上传的文件，文件上传调用函数从此数组中拿到文件

  文件上传状态的转化关系：
    1. uninitial -> uploading/error/pause 未初始化 -> 其它态的转换
    2. pending -> uploading/error/pause 准备状态 -> 其它态的转换
    3. uploading -> error/pause/break 上传状态 -> 其它态的转换
    4. pause -> pending 暂停状态 -> 其它态的转换
    5. error -> pending 错误状态 -> 其它态的转换
 */

/*
  结构说明:
  (注: 只有声明 [* 外部可调用 *] 标识的函数可以在外部被调用)

  /---------- 静态属性 ----------/
    @fileStorage -- 虚拟的文件上传数据对象，用于存储文件上传进度和状态
    @files -- 添加的真实文件对象
    @filesCache --缓存的真实文件对象
    fileStorageMap -- 真实文件对象和虚拟文件对象的映射
    blockSize -- 分片上传大小
    multiTaskCount -- 并行上传数目
    taskType -- 存储任务执行情况

  /---------- 静态方法 ----------/
    initRequest -- 初始化一个文件分片上传进程[HTTP]
    uploadRequest -- 上传一个文件分片[HTTP]
    completeRequest -- 完成一个文件上传[HTTP]
    termRequest -- 终止一个文件上传[HTTP]
    listObjectParts -- 列举一个对象所有分片[HTTP]
    listBucketObjectParts -- 列举一个桶所有分片[HTTP]
    isSame -- 判断虚拟文件对象是否属于这个文件
    getSymbol -- 获取文件标志
    getSymbolFile -- 获取文件
    fileSymbol -- 特殊的文件对象属性标志
    uploadPartsList -- 获取分片列表

  /---------- mobx动作 ----------/
    storeUploadState -- 使用localStorage存储fileStorage对象
    setBlockSize -- 设置分片大小
    loadUploadState -- 从localStorage读取fileStorage对象
    updateUploadId -- 更新虚拟文件对象的上传进程ID
    complete -- 完成上传
    update -- 每个分片上传后更新本地上传信息记录
    upload -- 根据文件上传进度分割文件发起上传请求
    refreshTasks -- 刷新上传队列任务
    ----------------------------------------------------
    |-[03] uploadConfig -- 更新基础上传配置 [* 外部可调用 *]
    |-[03] uploadPause -- 暂停上传文件 [* 外部可调用 *]
    |-[03] uploadContinue -- 继续上传文件 [* 外部可调用 *]
    |-[03] uploadTerm -- 终止上传文件 [* 外部可调用 * ]
    |-[03] uploadRestore -- 重试长传状态错误的文件 [* 外部可调用 * ]
    |-[02] startTasks -- 开启上传队列任务 [* 外部可调用 *]
    |-[01] registry -- 注册文件上传队列任务 [* 外部可调用 *]
    ------------------------------------------------------
 */


class ObjectFragmentUpload {
  /* ------------------- observable attr ------------------- */

  @observable fileStorage = observable.map({
    /* [region]: [
        {
          name: file.name,
          size: file.size,
          type: file.type,
          prefix: '',
          state: 'uninitial' || 'pending' || 'uploading' || 'break' || 'pause' || 'error',
          index: 1,
          file,
          blockSize: '',
          initialized: false,
          total: Math.ceil(file.size / this.blockSize),
          partEtags: [],
          creationTime: '',
          completionTime: '',
          activePoint: new Date(), // 上传活跃点(用于预估上传速度)
          speed: '0 MB/S', // 上传速度
        }
    ] */
  })

  @observable loading = false

  @observable files = [] // 已被注册使用的文件列表

  @observable filesCache = [] // 临时缓存的文件列表

  @observable selectedKeys = [] // 选中的文件keys

  /* ------------------- static attr ------------------- */
  blockSize = (1024 * 1024 * 6);

  multiTaskCount = 6

  @observable taskType = {
    uninitial: [], // 未初始化的已注册文件
    pending: [], // 准备态
    uploading: [], // 上传态
    break: [], // 完成
    error: [], // 错误
    pause: [], // 暂停
    series: [], // 可被调用的文件列表
  };

  modalActions = null;
  ObjectMain = null;
  lang = null;

  /* ************************* static request ************************* */

  setModalActions = (modal, objectMain) => {
    this.modalActions = modal;
    this.ObjectMain = objectMain;
  }

  setLang = (lang) => {
    this.lang = lang;
  }

  /**
   * [upload 初始化分片上传]
   * @param  {[Object]} file    [被上传文件对象]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   */
  initRequest = (storageObject) => {
    // 初次进行状态转换
    const index = this.taskType[storageObject.state].indexOf(storageObject);
    this.taskType[storageObject.state].splice(index, 1);
    storageObject.state = 'uploading';
    this.taskType.uploading.push(storageObject);
    const params = {
      bucket: storageObject.region,
      object: storageObject.name,
      prefix: storageObject.prefix,
    };

    if (storageObject.size <= storageObject.blockSize) { // 单文件
      storageObject.creationTime = (new Date().toTimeString()).split(' ')[0];
      return Promise.resolve({ err: false, init: true });
    }

    return postDataPro(
      {
        ...params,
        ...{
          object: params.prefix + params.object,
        },
      },
      objectResourceApi.object.initFragmentUpload,
      'solve'
    ).then((data) => {
      if (data.code !== 200) {
        this.markError(storageObject);
        this.startTasks(params.bucket);
        openNotification('error', null, (data.result.data ? data.result.data.Code : this.lang.lang.uploadError));
        return { err: true, init: false };
      }
      this.updateUploadId(storageObject, data.result.InitiateMultipartUploadResult.UploadId, 'uploading');
      return { err: false, init: true };
    }, () => {
      this.updateUploadId(storageObject, null, 'error');
      console.log(`${params.bucket} ${params.object} init error!`);
    });
  }

  /**
   * [uploadRequest 上传分片请求]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   * @param  {[Object]} partData    [分片数据]
   * @param  {[Object]} file    [分片所属文件]
   */
  uploadRequest = ({ params, data, single }) => {
    const url = single ?
      objectResourceApi.object.putObjectUpload :
      objectResourceApi.object.putFragmentUpload;
    return postDataPro(
      {
        ...params,
        ...{
          object: params.prefix + params.object,
        },
      },
      url,
      'solve',
      data
    );
  }

  /**
   * [completeRequest 完成所有分片数据上传]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   * @param  {[String]}   _params.uploadId [upload id]
   * @param  {[String]}   _params.partEtags [upload id]
   * @param  {[Object]} file [文件对象]
   */
  @action completeRequest = (params, file) => {
    postDataPro(
      {
        ...{
          ...params,
          ...{
            object: params.prefix + params.object,
          },
        },
        partEtags: {
          CompleteMultipartUpload: {
            Part: params.partEtags.map(info => ({
              PartNumber: info.number,
              ETag: info.etag,
            })),
          },
        },
      },
      objectResourceApi.object.completeFragmentUpload
    ).then((data) => {
      this.complete(file, params.bucket);
    }).catch((error) => {
      this.startTasks(params.bucket);
      this.markError(file);
    });
  }

  /**
   * [termRequest 终止分片数据上传]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   * @param  {[String]}   _params.uploadId [upload id]
   * */
  termRequest = (params, termInitialized) => {
    postDataPro(
      params,
      objectResourceApi.object.termFragmentUpload
    ).then((data) => {
      termInitialized();
      console.log('term: ', data);
    }).catch((error) => {
      this.markError(params.file);
    });
  }

  /**
   * [listObjectParts 列举某个对象的所有分片数据]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   * @param  {[String]}   _params.uploadId [upload id]
   * */
  listObjectParts = (params) => {
    const data = null;
    postDataPro(
      params,
      objectResourceApi.object.listFragmentUpload
    ).then((data) => {
      console.log('list object: ', data);
    });
  }

  /**
   * [listBucketObjectParts 列举某个桶的所有对象分片任务]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   * @param  {[String]}   _params.uploadId [upload id]
   * @param  {Function} callback [回调]
   * */
  listBucketObjectParts = (params, callback) => {
    postDataPro(
      params,
      objectResourceApi.object.listBucketFragment
    ).then((data) => {
      console.log('list bucket: ', data);
    });
  }

  /* ************************* static function ************************* */

  isSame = (info, _file) => {
    const name1 = (info.webkitRelativePath ? info.webkitRelativePath : info.name);
    const name2 = (_file.webkitRelativePath ? _file.webkitRelativePath : _file.name);
    return (name1 === name2) && (info.size == _file.size) && (info.type == _file.type);
  }

  getSymbol = file => `${file.webkitRelativePath || file.name}_${file.type}_${file.size}`;

  getSymbolFile = symbol => this.files.find(file => symbol === this.getSymbol(file));

  findIsUploading = (symbol, bucket) => {
    let find = false;
    if (this.fileStorage.get(bucket)) {
      for (let i = 0; i < this.fileStorage.get(bucket).length; i += 1) {
        if (
          this.getSymbol(this.fileStorage.get(bucket)[i].file) === symbol &&
          this.fileStorage.get(bucket)[i].state !== 'break'
        ) {
          find = true;
          break;
        }
      }
    }
    return find;
  }

  getStorageObjectByID = (id, region) => (this.fileStorage.get(region) ? this.fileStorage.get(region).find(item => item.id === id) : null)

  // 是否正在上传
  isValidUploadingTask = object => !(
    !object
    || object.state === 'error'
    || object.state === 'break'
    || object.state === 'pause'
  )

  // 当前桶上传列表是否为空检测
  isUploadListEmpty = (region) => {
    if (window.sessionStorage.getItem('resource.bucket.details.bucket') === region && !this.fileStorage.get(region).find(item => item.state !== 'break')) {
      if (this.modalActions) {
        this.modalActions.showModal({
          title: this.lang.lang.tips,
          message: this.lang.lang.fileUploadDoneTips,
          type: 'info',
          okText: this.lang.lang.OK,
          cancelText: this.lang.lang.cancel,
          success: () => {
            if (sessionStorage.getItem('objectTree') === 'true') {
              this.ObjectMain.getObjectList('', '', '', true);
            } else {
              this.ObjectMain.getObjectTableList();
            }
            this.modalActions.hideModal();
          },
        });
      }
      return true;
    }
    return false;
  }

  /* ************************* computed ************************* */


  /* ************************* action ************************* */

  /**
   * 设置分片大小(MB)
   */
  @action
  setBlockSize = (num, notice) => {
    this.blockSize = ((Number(num) * 1024) || 6144) * 1024;
    window.sessionStorage.setItem('resource.bucket.upload.size', num);
    if (notice) openNotification('success', 200);
  }

  /**
   * [cacheFile 缓存即将注册的文件]
   */
  @action
  cacheFile = (files, bucket) => {
    // this.filesCache = [];
    const symbolArr = this.filesCache.map(file => this.getSymbol(file));
    const filtedFiles = [];
    let uploadingFileFound = false;
    files.forEach((file) => {
      if (!symbolArr.includes(this.getSymbol(file))) {
        if (this.findIsUploading(this.getSymbol(file), bucket)) {
          uploadingFileFound = true;
          filtedFiles.push(file.name);
        } else {
          this.filesCache.push(file);
          symbolArr.push(this.getSymbol(file));
        }
      }
    });
    if (!files.length) openNotification('warning', null, this.lang.lang.noFilCanBeUploaded);
    if (uploadingFileFound) openNotification('warning', null, this.lang.lang.uploadingFileReuploadTips + filtedFiles.join(', '));
  }

  /**
   * [clearCache 清除缓存]
   */
  @action
  clearCache = (file) => {
    if (file) {
      for (let i = 0; i < this.filesCache.length; i += 1) {
        if (this.isSame(this.filesCache[i], file)) {
          this.filesCache.splice(i, 1);
          break;
        }
      }
    } else {
      this.filesCache = [];
    }
  }

  /**
   * [selectItem 选择条目]
   */
  @action
  selectItem = (files) => {
    this.selectedKeys = files.map(file => file.id);
  }

  /**
   * 标记错误
   */
  @action
  markError = (storageObject) => {
    console.log('error', storageObject);
    const fileObject = storageObject;
    if (!fileObject) return;

    const status = fileObject.state;
    let index = this.taskType[status].indexOf(storageObject);
    if (index === -1) return;

    this.taskType[status].splice(index, 1);
    fileObject.state = 'error';
    fileObject.speed = '';
    this.taskType.error.push(storageObject);
    index = this.taskType.series.indexOf(storageObject);
    if (index !== -1) {
      this.taskType.series.splice(index, 1);
    }
  }


  /**
    * uploadConfig [上传配置]
    * @param  {[Number]} blockSize [上传块大小]
    * @param {[Number.Int]} multiTaskCount [同时上传任务数量]
    */
  @action
  uploadConfig = ({ blockSize, multiTaskCount }) => {
    const block = Number(blockSize);
    const multi = Number(multiTaskCount);
    if ((blockSize && !block) || (multiTaskCount && multi < 1)) return false;
    this.blockSize = block;
    this.multiTaskCount = block;
  }

  /**
   * [updateUploadId 更新初始化状态]
   * @param {[Object]} file [文件对象]
   * @param {[String]} uploadId [文件上传进程id]
   * @param {[Object]} state [文件初始化状态]
   */
  @action
  updateUploadId = (storageObject, uploadId, state) => {
    storageObject.uploadId = uploadId;
    storageObject.initialized = state === 'uploading';
    storageObject.state = state;
    storageObject.creationTime = (new Date().toTimeString()).split(' ')[0];

    if (state === 'error') {
      const index = this.taskType.uploading.indexOf(storageObject);
      this.taskType.uninitial.push(storageObject);
      this.taskType.uploading.splice(index, 1);
      this.taskType[state].push(storageObject);
    }
  };

  /**
   * [complete 完成上传]
   * @param {[Object]} file [文件对象]
   * @param {[String]} bucket [桶名]
   */
  @action
  complete = (storageObject) => {
    const index = this.taskType.uploading.indexOf(storageObject);
    this.taskType.uploading.splice(index, 1);
    this.taskType.break.push(storageObject);
    storageObject.completionTime = (new Date().toTimeString()).split(' ')[0];
    storageObject.state = 'break';
    storageObject.speed = '';
    storageObject.index = storageObject.total;

    this.startTasks(storageObject.region);
  };

  /**
   * [update 更新本地上传记录]
   * @param {[String]} region [桶名]
   * @param {[String]} etag [分片标志]
   * @param {[Function]} upload [继续上传回调]
   * @param {[Function]} complete [完成上传回调]
   */
  @action
  update = ({
    region, etag, size, id, index,
  }) => {
    const target = this.fileStorage.get(region);
    for (let i = 0; i < target.length; i += 1) {
      if (target[i].id === id) {
        target[i].speed = `${(size / 1024 / 1024 / (((new Date() - target[i].activePoint) / 1000))).toFixed(2)} MB/S`;
        if (target[i].speed === '0.00 MB/S') {
          target[i].speed = `${formatSizeStr(size)}/S`;
        }
        target[i].partEtags = target[i].partEtags.filter(etagItem => etagItem.number !== index);
        target[i].partEtags.push({
          number: index,
          etag,
        });
        // 最后一个分片恰好又暂停的情况
        if (index === target[i].total) {
          if (target[i].state === 'pause') {
            index -= 1;
          }
        }
        // 判断上传是否完成
        if (target[i].total === 0 || target[i].partEtags.toJS().length === target[i].total) {
          return {
            completed: true,
            etags: target[i].partEtags,
          };
        }
        return {
          completed: false,
        };
      }
    }
  }

  /**
   * [upload 分割文件发起上传请求]
   * @param  {[Object]} file    [description]
   * @param  {[Object]} _params [...]
   * @param  {[String]}   _params.bucket [bucket name]
   * @param  {[String]}   _params.object [object name]
   * @param  {[String]}   _params.uploadId [upload id]
   */
  @action
  upload = (storageObject) => {
    let params = {
      bucket: storageObject.region,
      object: storageObject.name,
      prefix: storageObject.prefix,
      uploadId: storageObject.uploadId,
    };
    let single = false; // 不分片
    /* 异常状态退出 */
    if (!this.isValidUploadingTask(storageObject)) return;

    if (storageObject.state === 'pending') {
      this.taskType.pending.splice(this.taskType.pending.indexOf(storageObject), 1);
      this.taskType.uploading.push(storageObject);
      storageObject.state = 'uploading';
    }

    const num = storageObject.index;

    if (num === 0 && storageObject.size <= storageObject.blockSize) {
      // 不用分片的情况
      single = true;
    } else if (num === storageObject.total) {
      // 所有分片都已经发出
      return;
    }
    const nextSize = Math.min((num + 1) * storageObject.blockSize, storageObject.size);
    const fileData = storageObject.file.slice(num * storageObject.blockSize, nextSize);
    params = Object.assign(params, {
      partNumber: num + 1,
    });
    storageObject.activePoint = new Date();

    this.uploadRequest({ params, data: fileData, single }).then((rsp) => {
      if (rsp.code !== 200) {
        openNotification('error', null, (rsp.result.data ? rsp.result.data.Code : this.lang.lang.uploadError));
        this.markError(storageObject);
        this.startTasks(params.bucket);
        return;
      }
      const { completed, etags } = this.update({
        region: params.bucket,
        etag: rsp.result.etag,
        size: fileData.size,
        id: storageObject.id,
        index: params.partNumber,
      });
      if (completed) {
        (single ?
          () => {
            this.complete(storageObject, params.bucket);
          } :
          (partEtags) => {
            this.completeRequest({
              bucket: params.bucket,
              uploadId: params.uploadId,
              object: params.object,
              prefix: params.prefix,
              partEtags,
            }, storageObject);
          })(etags);
      } else {
        this.upload(storageObject);
      }
    }).catch((error) => {
      this.markError(storageObject);
      this.startTasks(params.bucket);
      console.log(`${params.bucket}_${params.object} upload error: ${error}`);
    });
    storageObject.index += 1;
  }


  /**
   * [uploadTerm 暂停上传]
   * @param  {[Object]} file [文件对象]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   */
  @action
  uploadPause = ({
    all, select, region, id,
  }) => {
    const updateObjectPause = (object) => {
      if (!this.isValidUploadingTask(object)) return;
      if (object.state !== 'uninitial') {
        const index = this.taskType[object.state].indexOf(object);
        this.taskType[object.state].splice(index, 1);
      }
      const index = this.taskType.series.indexOf(object);
      if (index !== -1) {
        this.taskType.series.splice(index, 1);
      }
      this.taskType.pause.push(object);
      object.state = 'pause';
    };
    // single
    if (!all && !select) {
      // const tFile = this.getSymbolFile(this.getSymbol(file));
      // const storageObject = this.fileStorageMap.get(tFile);
      const storageObject = this.getStorageObjectByID(id, region);
      updateObjectPause(storageObject);
    // selected / all
    } else {
      if (!this.fileStorage.get(region)) return;
      this.fileStorage.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          updateObjectPause(object);
        }
        if (!select) {
          updateObjectPause(object);
        }
      });
      if (select) {
        this.selectedKeys = [];
      }
    }
    if (this.taskType.uploading.length <= this.multiTaskCount) {
      this.startTasks(region);
    }
    openNotification('success', 200);
  }


  /**
   * [uploadTerm 继续上传]
   * @param  {[Object]} file [文件对象]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   */
  @action
  uploadContinue = ({
    all, select, region, id,
  }) => {
    const updateObjectContinue = (object) => {
      if (object.state !== 'pause') return;
      const index = this.taskType.pause.indexOf(object);
      this.taskType.pause.splice(index, 1);
      object.state = 'pending';
      this.taskType.pending.push(object);
      this.taskType.series.push(object);
      this.startTasks(region);
    };
    if (!all && !select) {
      // const tFile = this.getSymbolFile(this.getSymbol(file));
      // const storageObject = this.fileStorageMap.get(tFile);
      const storageObject = this.getStorageObjectByID(id, region);
      updateObjectContinue(storageObject);
    } else {
      if (!this.fileStorage.get(region)) return;
      this.fileStorage.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          updateObjectContinue(object);
        }
        if (!select) {
          updateObjectContinue(object);
        }
      });
      if (select) {
        this.selectedKeys = [];
      }
    }

    // this.startTasks(region);
    // 刷新任务列表
    if (this.taskType.uploading.length <= this.multiTaskCount) {
      this.startTasks(region);
    }
    openNotification('success', 200);
  }

  /**
   * [uploadTerm 终止上传]
   * @param  {[Object]} file [文件对象]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   */
  @action
  uploadTerm = ({
    all, select, region, id,
  }) => {
    const termInitialized = (object) => {
      this.fileStorage.set(object.region, this.fileStorage.get(object.region).filter(obj => obj.id !== object.id));
      // arrayRemove(this.fileStorage.get(bucket), this.fileStorageMap.get(tFile));
      arrayRemove(this.files, object);
      arrayRemove(this.taskType.uninitial, object);
      arrayRemove(this.taskType.pending, object);
      arrayRemove(this.taskType.uploading, object);
      arrayRemove(this.taskType.break, object);
      arrayRemove(this.taskType.error, object);
      arrayRemove(this.taskType.pause, object);
      arrayRemove(this.taskType.series, object);
    };

    const checkInitialized = (object) => {
      if (object.initialized && (object.index !== object.total)) {
        this.termRequest({
          bucket: region,
          object: object.name,
          uploadId: object.uploadId,
          file: object.file,
        }, () => {
          termInitialized(object);
        });
      } else {
        termInitialized(object);
      }
    };

    if (!all && !select) {
      const storageObject = this.getStorageObjectByID(id, region);
      checkInitialized(storageObject);
    } else {
      if (!this.fileStorage.get(region)) return;
      this.fileStorage.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          checkInitialized(object);
        }
        if (!select) {
          checkInitialized(object);
        }
      });
      if (select) {
        this.selectedKeys = [];
      }
    }
    openNotification('success', 200);
  }

  /**
   * [uploadRestore 恢复错误状态的上传]
   * @param  {[String]} region [桶名]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   */
  @action
  uploadRestore = ({
    all, select, region, reset, id,
  }) => {
    const updateObjectRestore = (object) => {
      if (object.state !== 'error') return;
      if (reset) {
        object.index = 0;
        object.partEtags = [];
      }
      this.taskType.error.splice(this.taskType.error.indexOf(object), 1);
      object.state = 'pending';
      this.taskType.pending.push(object);
    };
    if (!all && !select) {
      // const tFile = this.getSymbolFile(this.getSymbol(file));
      // const storageObject = this.fileStorageMap.get(tFile);
      const storageObject = this.getStorageObjectByID(id, region);
      updateObjectRestore(storageObject);
      // updateObjectRestore(storageObject, tFile);
    } else {
      if (!this.fileStorage.get(region)) return;
      this.fileStorage.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          updateObjectRestore(object);
        }
        if (!select) {
          updateObjectRestore(object);
        }
      });
      if (select) {
        this.selectedKeys = [];
      }
    }

    // 刷新任务列表
    if (this.taskType.uploading.length <= this.multiTaskCount) {
      this.startTasks(region);
    }
    openNotification('success', 200);
  }

  /* 刷线任务列表 */
  @action
  refreshTasks = (region) => {
    // 统计空闲任务
    const storageObject = this.fileStorage.get(region);
    if (!storageObject) return;
    for (let i = 0; i < storageObject.length; i += 1) {
      if (
        storageObject[i].index !== storageObject[i].total
        && (storageObject[i].state === 'pending'
        || storageObject[i].state === 'uninitial')
      ) {
        if (!this.taskType.series.includes(storageObject[i])) {
          this.taskType.series.push(storageObject[i]);
        }
      }
    }
  }

  /**
   * [startTasks 开启上传任务队列]
   * @param  {[String]} region [桶名]
   */
  startTasks = (region) => {
    // 根据空闲任务类型和空闲任务并发限制开启空闲任务
    // let storageObject;
    this.refreshTasks(region);
    if (this.isUploadListEmpty(region)) return;

    const maxLength = this.multiTaskCount - this.taskType.uploading.length;
    const taskSeries = [];
    for (let i = 0; i < (maxLength) && this.taskType.series[i]; i += 1) {
      // const file = this.taskType.series.shift();
      const storageObject = this.taskType.series[i];
      if (storageObject.state === 'uploading') continue; // 上传中
      if (storageObject.state === 'pause') continue;
      taskSeries.push(storageObject);
    }

    let index;
    taskSeries.forEach((storageObject) => {
      index = this.taskType.series.indexOf(storageObject);
      index !== -1 && this.taskType.series.splice(index, 1);
      if (this.taskType.uninitial.includes(storageObject)) {
        this.initRequest(storageObject).then(({ err, init }) => {
          if (!err && init) {
            this.upload(storageObject);
          }
        });
      } else {
        this.upload(storageObject);
      }
    });
  }

  /**
   * [registry 注册上传文件信息]
   * @param {[Object]} file [文件对象]
   * @param {[String]} uploadId [文件上传进程id]
   * @param {[Object]} state [文件初始化状态]
   */
  @action registry = (files, region, prefix) => {
    let fileObj = null;
    this.loading = true;
    files.forEach((file) => {
      if (this.files.includes(file)) {
        return;
      }
      this.files.push(file);
      fileObj = {
        name: file.webkitRelativePath || file.name,
        prefix: prefix || '',
        size: file.size,
        type: file.type || mapMimeType((file.webkitRelativePath || file.name).split('.').pop()).type,
        state: 'uninitial',
        creationTime: '',
        completionTime: '',
        index: 0,
        file,
        initialized: false,
        partEtags: [],
        region,
        blockSize: this.blockSize,
        total: Math.ceil(file.size / this.blockSize),
        activePoint: new Date(),
        speed: '0 MB/S',
        id: encodeURIComponent(new Date() + file.name + file.type + file.size),
      };
      const obj = observable(fileObj);
      this.taskType.uninitial.push(obj);
      this.taskType.series.push(obj);
      if (!this.fileStorage.get(region)) {
        this.fileStorage.set(region, [obj]);
      } else {
        this.fileStorage.get(region).push(obj);
      }
      // this.fileStorageMap.set(file, obj);
    });
    this.loading = false;
  }
}

export default ObjectFragmentUpload;
