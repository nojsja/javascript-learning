import {
  observable,
  action,
} from 'mobx';
import { arrayRemove, formatSizeStr, mapMimeType } from 'utils/utils';
import { ipcRenderer } from 'electron';
import { notification } from 'antd';
import { configConsumerProps } from 'antd/lib/config-provider';

/**
* @name: FileUpload
* @description: 文件分片上传，支持上传记录和断点恢复
*/


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
  constructor() {
    ipcRenderer.on('shell', (event, { action, result }) => {
      switch (action) {
        case 'upload-clear':
          console.log('upload-clear');
          this.uploadClear();
          break;
        default:
          break;
      }
    });

    ipcRenderer.on('upload', (event, { action, result }) => {
      if (action === 'getUploadingTask') {
        ipcRenderer.send('upload-getUploadingTask', {
          code: 200,
          result: this.taskType.uploading.length,
        });
      }
    });
  }
  /* ------------------- observable attr ------------------- */

  @observable fileStorage = observable.map({})

  @observable fileStorageHistory = observable.map({})

  @observable loading = false

  @observable files = [] // 已被注册使用的文件列表

  @observable filesCache = [] // 临时缓存的文件列表

  @observable selectedKeys = [] // 选中的文件keys

  /* ------------------- static attr ------------------- */
  blockSize = (1024 * 1024 * 10);

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
  handleRefresh = () => ({});
  handleDrawerClose = () => ({});
  lang = null;

  /* ************************* static request ************************* */

  setModalActions = (modal, handleRefresh, handleDrawerClose) => {
    this.modalActions = modal;
    this.handleRefresh = handleRefresh;
    this.handleDrawerClose = handleDrawerClose;
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
    console.log('init => ', storageObject.name);
    // 初次进行状态转换
    arrayRemove(this.taskType[storageObject.state], storageObject);
    storageObject.state = 'uploading';
    this.taskType.uploading.push(storageObject);

    return ipcRenderer.invoke(
      'upload',
      {
        action: 'init',
        params: {
          host: storageObject.host,
          username: storageObject.username,
          file: {
            name: storageObject.file.name,
            type: storageObject.file.type,
            size: storageObject.file.size
          },
          abspath: storageObject.abspath,
          sharename: storageObject.sharename,
          prefix: storageObject.prefix,
          fragsize: this.blockSize,
        },
      }
    ).then((data) => {
      console.log('init: ', data);
      if (data.code !== 200) {
        this.markError(storageObject, data.result);
        this.startTasks(storageObject.region);
        notification['error']({
          message: this.lang.lang.error,
          description: this.lang.lang.uploadError
        });
        return { err: true, init: false };
      }
      this.updateUploadId(storageObject, {
        uploadId: data.result.uploadId,
        // size: data.result.size,
        total: data.result.total,
        state: 'uploading',
      });
      return { err: false, init: true };
    }, (error) => {
      console.log(error);
      this.updateUploadId(storageObject, {
        uploadId: null,
        size: 0,
        total: 0,
        state: 'error',
      });
      console.log(`${storageObject.sharename} ${storageObject.name} init error!`);
    });
  }

  /**
   * [getUploadRecordsRequest 获取上传记录]
   * @param  {[Object]} _params [...]
   */
  getUploadRecordsRequest = ({
    host, username, sharename, region, prefix,
  }) => {
    const symbol = `${host}_${username}_${sharename}`;
    let isFirstLoad = false;
    // this.fileStorageHistory.set(symbol, []);
    if (!this.fileStorageHistory.has(symbol)) {
      isFirstLoad = true;
      this.fileStorageHistory.set(symbol, []);
    }
    const uploadIdHistory = (this.fileStorageHistory.get(symbol)).map(record => record.uploadId);

    ipcRenderer.invoke('upload', {
      action: 'getUploadRecords',
      params: {
        host, username, sharename,
      },
    }).then((rsp) => {
      console.log(rsp);
      if (rsp.code === 200) {
        let fileObj;
        rsp.result.forEach((file) => {
          if (!uploadIdHistory.includes(file.uploadId)) {
            fileObj = {
              name: file.name,
              prefix,
              size: file.size,
              type: file.type,
              state: file.status,
              creationTime: file.startime,
              completionTime: file.endtime,
              index: file.index,
              file,
              initialized: false,
              partEtags: [],
              region,
              blockSize: this.blockSize,
              total: file.total,
              activePoint: new Date(),
              speed: '',
              id: file.uploadId,
              uploadId: file.uploadId,
              host: window.sessionStorage.getItem('rhinodisk_current_host'),
              username: window.sessionStorage.getItem('login_user'),
              abspath: file.abspath,
              sharename: file.sharename,
            };
            if (isFirstLoad) {
              this.fileStorageHistory.get(symbol).push(observable(fileObj));
            } else {
              this.fileStorageHistory.get(symbol).unshift(observable(fileObj));
            }
          }
        });
      }
    });
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
  @action completeRequest = (id, region, object) => {
    console.log('complete => ', id, region, object.name);
    ipcRenderer.invoke('upload', {
      action: 'complete',
      params: {
        uploadId: id,
      },
    }).then((data) => {
      console.log(data);
      this.complete(object, region);
    }).catch((error) => {
      console.log(error);
      this.startTasks(region);
      this.markError(object, error);
    });
  }

  /**
   * [termRequest 终止分片数据上传]
   * @param  {[String]} id [任务ID]
   * */
  termRequest = (id, region, termInitialized) => {
    console.log('term => ', id);
    const storageObject = this.getStorageObjectByID(id, region);
    ipcRenderer.invoke('upload', {
      action: 'removeRecord',
      params: {
        uploadId: storageObject.uploadId,
      },
    }).then((data) => {
      console.log(data);
      termInitialized();
    }).catch((error) => {
      this.markError(storageObject.file, error);
    });
  }

  /**
   * [termHistoryRequest 终止历史分上传记录]
   * @param  {[String]} id [任务ID]
   * */
  termHistoryRequest = (id, region, termInitialized) => {
    console.log('term => ', id);
    const storageObject = this.getStorageObjectByIDHistory(id, region);
    ipcRenderer.invoke('upload', {
      action: 'removeRecordHistory',
      params: {
        uploadId: storageObject.uploadId,
      },
    }).then((data) => {
      termInitialized();
    }).catch((error) => {
      this.markError(storageObject.file, error);
    });
  }

  /* ************************* static function ************************* */

  isSame = (info, _file) => {
    const name1 = (info.webkitRelativePath ? info.webkitRelativePath : info.name);
    const name2 = (_file.webkitRelativePath ? _file.webkitRelativePath : _file.name);
    return (name1 === name2) && (info.size == _file.size) && (info.type == _file.type);
  }

  getSymbol = file => `${file.webkitRelativePath || file.name}_${file.type}`;

  getSymbolFile = symbol => this.files.find(file => symbol === this.getSymbol(file));

  findIsUploading = (symbol, region) => {
    let find = false;
    if (this.fileStorage.get(region)) {
      for (let i = 0; i < this.fileStorage.get(region).length; i += 1) {
        if (
          this.getSymbol(this.fileStorage.get(region)[i].file) === symbol &&
          this.fileStorage.get(region)[i].state !== 'break'
        ) {
          find = true;
          break;
        }
      }
    }
    return find;
  }

  getStorageObjectByID = (id, region) => (this.fileStorage.get(region) ? this.fileStorage.get(region).find(item => item.id === id) : null)

  getStorageObjectByIDHistory = (id, region) => (this.fileStorageHistory.get(region) ? this.fileStorageHistory.get(region).find(item => item.id === id) : null)

  getSharenameAndPrepath = () => {
    return {
      prepath: '.',
      host: 'localhost',
      user: 'default',
      username: 'default',
      region: `${'localhost'}_${'default'}_${'default'}`,
      sharename: 'default'
    };
  }


  // 是否正在上传
  isValidUploadingTask = object => !(
    !object
    || object.state === 'error'
    || object.state === 'break'
    || object.state === 'pause'
  )

  // 上传队列检测
  uploadQueueCheck = () => {
    const dirname = window.sessionStorage.getItem('rhinodisk_cifs_dir_name');
    if (this.modalActions && dirname) {
      this.modalActions.showModal({
        title: this.lang.lang.tips,
        message: this.lang.lang.fileUploadDoneTips,
        type: 'info',
        okText: this.lang.lang.OK,
        cancelText: this.lang.lang.cancel,
        success: () => {
          this.handleRefresh();
          this.handleDrawerClose();
          this.modalActions.hideModal();
        },
      });
    }
  }

  // 当前桶上传列表是否为空检测
  isUploadListEmpty = (region, showModal = true) => {
    const { host, username, sharename } = this.getSharenameAndPrepath();
    let isEmpty = false;

    if (!this.fileStorage.get(region) || !this.fileStorage.get(region).length) return true;
    if (!this.fileStorage.get(region).find(item => (item.state !== 'break' && item.state !== 'error'))) {
      this.uploadRegionSync(region);
      isEmpty = true;
      if (`${host}_${username}_${sharename}` === region && showModal) this.uploadQueueCheck();
    }

    return isEmpty;
  }

  /* ************************* computed ************************* */


  /* ************************* action ************************* */

  /**
   * 设置分片大小(MB)
   */
  @action
  setBlockSize = (num, notice) => {
    this.blockSize = ((Number(num) * 1024) || 6144) * 1024;
    window.sessionStorage.setItem('upload.size', num);
    if (notice) notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success});
  }

  // 是否正在上传
  @action
  updateObjectPause = (object) => {
    if (!this.isValidUploadingTask(object)) return;
    if (object.state !== 'uninitial') {
      arrayRemove(this.taskType[object.state], object);
    }
    arrayRemove(this.taskType.series, object);
    this.taskType.pause.push(object);
    object.state = 'pause';
  };

  /**
   * 清除缓存
   */
  @action
  uploadClear = () => {
    this.fileStorage = observable.map({});
    this.fileStorageHistory = observable.map({});
    this.files = [];
    this.filesCache = [];
    this.taskType = {
      uninitial: [], // 未初始化的已注册文件
      pending: [], // 准备态
      uploading: [], // 上传态
      break: [], // 完成
      error: [], // 错误
      pause: [], // 暂停
      series: [], // 可被调用的文件列表
    };
  }

  /**
   * [cacheFile 缓存即将注册的文件]
   */
  @action
  cacheFile = (files, region) => {
    // this.filesCache = [];
    const symbolArr = this.filesCache.map(file => this.getSymbol(file));
    const filtedFiles = [];
    let uploadingFileFound = false;
    files.forEach((file) => {
      if (!symbolArr.includes(this.getSymbol(file))) {
        if (this.findIsUploading(this.getSymbol(file), region)) {
          uploadingFileFound = true;
          filtedFiles.push(file.name);
        } else {
          this.filesCache.push(file);
          symbolArr.push(this.getSymbol(file));
        }
      }
    });
    if (!files.length) notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFilCanBeUploaded});
    if (uploadingFileFound) notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.uploadingFileReuploadTips + filtedFiles.join(', ')});
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
  markError = (fileObject, error) => {
    console.log('mark error: ', error);
    if (!fileObject) return;

    // delete
    ipcRenderer.invoke('upload', {
      action: 'reset',
      params: {
        uploadId: fileObject.uploadId,
      },
    }).then((rsp) => {
      console.log('unlink', rsp.code, rsp.result);
    });

    const status = fileObject.state;
    let index = this.taskType[status].indexOf(fileObject);
    if (index === -1) return;

    this.taskType[status].splice(index, 1);
    fileObject.state = 'error';
    fileObject.speed = '';
    this.taskType.error.push(fileObject);
    arrayRemove(this.taskType.series, fileObject);
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
   * @param {[Number]} size [文件大小]
   * @param {[Object]} state [文件初始化状态]
   */
  @action
  updateUploadId = (object, {
    uploadId, state, total,
  }) => {
    console.log('updateUploadId => ', uploadId);
    object.uploadId = uploadId;
    object.initialized = state === 'uploading';
    object.state = state;
    object.total = total;
    object.creationTime = (new Date().toTimeString()).split(' ')[0];

    if (state === 'error') {
      arrayRemove(this.taskType.uploading, object);
      this.taskType.uninitial.push(object);
      this.taskType[state].push(object);
    }
  };

  /**
   * [complete 完成上传]
   * @param {[Object]} file [文件对象]
   * @param {[String]} region [区域]
   */
  @action
  complete = (object, region) => {
    console.log('complete => ', object.name, region);
    arrayRemove(this.taskType.uploading, object);
    this.taskType.break.push(object);
    object.completionTime = (new Date().toTimeString()).split(' ')[0];
    object.state = 'break';
    object.speed = '';
    object.index = object.total;

    this.startTasks(region);
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
    etag, index, storageObject
  }) => {
    const { size, blockSize } = storageObject;
    console.log('update => ', index);
    storageObject.speed = `${(blockSize / 1024 / 1024 / (((new Date() - storageObject.activePoint) / 1000))).toFixed(2)} MB/S`;
    if (blockSize >= size) {
      storageObject.speed = `${formatSizeStr(size)}/S`;
    }
    storageObject.partEtags = storageObject.partEtags.filter(etagItem => etagItem.number !== index);
    storageObject.partEtags.push({
      number: index,
      etag,
    });
    // 最后一个分片恰好又暂停的情况
    if (index === storageObject.total) {
      if (storageObject.state === 'pause') {
        index -= 1;
      }
    }
    // 判断上传是否完成
    if (storageObject.total === 0 || storageObject.partEtags.toJS().length === storageObject.total) {
      return {
        completed: true,
        etags: storageObject.partEtags,
      };
    }
    return {
      completed: false,
    };
  }

  /**
   * [upload 分割文件发起上传请求]
   * @param  {[Object]} file    [description]
   */
  @action
  upload = (object) => {
    const storageObject = object;
    /* 异常状态退出 */
    if (!this.isValidUploadingTask(storageObject)) return;

    if (storageObject.state === 'pending') {
      arrayRemove(this.taskType.pending, storageObject);
      this.taskType.uploading.push(storageObject);
      storageObject.state = 'uploading';
    }

    const num = storageObject.index;

    if (num === storageObject.total && storageObject.total !== 0) {
      // 所有分片都已经发出
      return;
    }
    
    const params = {
      index: storageObject.index,
      uploadId: storageObject.uploadId,
    };
    storageObject.activePoint = new Date();
    ipcRenderer.invoke('upload', {
      action: 'upload',
      params,
    }).then((rsp) => {
      console.log('upload: ', rsp);
      if (rsp.code !== 200) {
        notification['error']({ message: this.lang.lang.error, description: (rsp.result || this.lang.lang.uploadError)});
        this.markError(storageObject, rsp.result);
        this.startTasks(storageObject.region);
        return;
      }
      const { completed, etags } = this.update({
        etag: '',
        index: (storageObject.index + 1),
        storageObject
      });
      if (completed) {
        this.completeRequest(storageObject.uploadId, storageObject.region, storageObject);
      } else {
        this.upload(storageObject);
      }
    }).catch((error) => {
      this.markError(storageObject, error);
      this.startTasks(storageObject.region);
    });
    storageObject.index += 1;
  }

  /**
   * [uploadRegionSync 同步上传区域]
   * @param  {[String]} region [区域]
   */
  @action
  uploadRegionSync = region => ipcRenderer.invoke('upload', {
    action: '_storeUploadRecordsInFile',
    params: {
      region,
    },
  }).then((rsp) => {
    if (rsp.code === 200) {
      this.fileStorage.set(region, []);
      this.getUploadRecordsRequest({ ...this.getSharenameAndPrepath(), region });
    } else {
      notification['warning']({ message: this.lang.lang.warning, description: rsp.result})
    }
  })

  /**
   * [uploadPause 暂停上传]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [共享名]
   * @param  {[String]} id [任务ID]
   */
  @action
  uploadPause = ({
    all, select, region, id,
  }) => {
    let nofileSelected = false;

    // single
    if (!all && !select) {
      const storageObject = this.getStorageObjectByID(id, region);
      this.updateObjectPause(storageObject);
    // selected / all
    } else {
      if (!this.fileStorage.get(region)) return;
      this.fileStorage.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          this.updateObjectPause(object);
        }
        if (!select) {
          this.updateObjectPause(object);
        }
      });
      if (select) {
        nofileSelected = !(this.selectedKeys.length);
        this.selectedKeys = [];
      }
    }
    if (this.taskType.uploading.length <= this.multiTaskCount) {
      this.startTasks(region);
    }
    if (nofileSelected) {
      notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFileSelected})
    } else {
      notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success})
    }
  }


  /**
   * [uploadContinue 继续上传]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   * @param  {[String]} id [任务ID]
   */
  @action
  uploadContinue = ({
    all, select, region, id,
  }) => {
    let nofileSelected = false;
    const updateObjectContinue = (object) => {
      if (object.state !== 'pause') return;
      arrayRemove(this.taskType.pause, object);
      object.state = 'pending';
      this.taskType.pending.push(object);
      this.taskType.series.push(object);
      this.startTasks(region);
    };
    if (!all && !select) {
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
        nofileSelected = !(this.selectedKeys.length);
        this.selectedKeys = [];
      }
    }

    // this.startTasks(region);
    // 刷新任务列表
    if (this.taskType.uploading.length <= this.multiTaskCount) {
      this.startTasks(region);
    }
    if (nofileSelected) {
      notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFileSelected})
    } else {
      notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success})
    }
  }

  /**
   * [uploadTerm 终止上传]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   * @param  {[String]} id [任务ID]
   */
  @action
  uploadTerm = ({
    all, select, region, id,
  }) => {
    let nofileSelected = false;
    const termInitialized = (bucket, object) => {
      this.fileStorage.set(bucket, this.fileStorage.get(bucket).filter(obj => obj.id !== object.id));
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
        this.updateObjectPause(object);
        this.termRequest(object.id, region, () => {
          termInitialized(region, object);
        });
      } else {
        termInitialized(region, object);
      }
    };

    if (!all && !select) {
      const storageObject = this.getStorageObjectByID(id, region);
      checkInitialized(storageObject);
    } else {
      if (!this.fileStorage.get(region)) return;
      this.fileStorage.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          checkInitialized(object, object.file);
        }
        if (!select) {
          checkInitialized(object, object.file);
        }
      });
      if (select) {
        nofileSelected = !(this.selectedKeys.length);
        this.selectedKeys = [];
      }
    }
    if (nofileSelected) {
      notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFileSelected})
    } else {
      notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success})
    }
  }

  /**
   * [uploadTermHistory 终止历史上传]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   * @param  {[String]} id [任务ID]
   */
  @action
  uploadTermHistory = ({
    all, select, region, id,
  }) => {
    let nofileSelected = false;
    const termInitialized = (bucket, objectId) => {
      this.fileStorageHistory.set(bucket, this.fileStorageHistory.get(bucket).filter(obj => obj.id !== objectId));
    };

    const checkInitialized = (object) => {
      this.termHistoryRequest(object.id, region, () => {
        termInitialized(region, object.id);
      });
    };

    if (!all && !select) {
      const storageObject = this.getStorageObjectByIDHistory(id, region);
      checkInitialized(storageObject);
    } else {
      if (!this.fileStorageHistory.get(region)) return;
      this.fileStorageHistory.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          checkInitialized(object);
        }
        if (!select) {
          checkInitialized(object);
        }
      });
      if (select) {
        nofileSelected = !(this.selectedKeys.length);
        this.selectedKeys = [];
      }
    }
    if (nofileSelected) {
      notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFileSelected})
    } else {
      notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success})
    }
  }

  /**
   * [uploadRestore 恢复错误状态的上传]
   * @param  {[String]} region [桶名]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   * @param  {[Boolean]} reset [是否重置已经上传分片]
   */
  @action
  uploadRestore = ({
    all, select, region, reset, id,
  }) => {
    let nofileSelected = false;
    const updateObjectRestore = (object) => {
      if (object.state !== 'error') return;
      if (reset) {
        object.index = 0;
        object.partEtags = [];
      }
      arrayRemove(this.taskType.error, object);
      object.state = 'uninitial';
      this.taskType.uninitial.push(object);
    };
    if (!all && !select) {
      const storageObject = this.getStorageObjectByID(id, region);
      updateObjectRestore(storageObject);
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
        nofileSelected = !(this.selectedKeys.length);
        this.selectedKeys = [];
      }
    }

    // 刷新任务列表
    if (this.taskType.uploading.length <= this.multiTaskCount) {
      this.startTasks(region);
    }
    if (nofileSelected) {
      notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFileSelected})
    } else {
      notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success})
    }
  }

  /**
   * [uploadRestoreHistory 恢复错误状态的历史上传]
   * @param  {[String]} region [桶名]
   * @param  {[Boolean]} all [对所有文件操作]
   * @param  {[Boolean]} select [只对选中文件操作]
   * @param  {[String]} region [bucket名]
   * @param  {[Boolean]} reset [是否重置已经上传分片]
   */
  @action
  uploadRestoreHistory = ({
    all, select, region, reset, id,
  }) => {
    let nofileSelected = false;

    const updateObjectRestore = (object, tFile) => {
      if (object.state !== 'error') return;

      this.termHistoryRequest(object.id, region, () => {
        if (reset) {
          object.index = 0;
          object.partEtags = [];
        }
        this.fileStorageHistory.set(region, this.fileStorageHistory.get(region).filter(r => r.id !== object.id));
        this.registry([tFile], region, '');
        // 刷新任务列表
        if (this.taskType.uploading.length <= this.multiTaskCount) {
          this.startTasks(region);
        }
      });
    };

    if (!all && !select) {
      const storageObject = this.getStorageObjectByIDHistory(id, region);
      updateObjectRestore(storageObject, storageObject.file);
    } else {
      if (!this.fileStorageHistory.get(region)) return;
      this.fileStorageHistory.get(region).forEach((object) => {
        if (select && this.selectedKeys.includes(object.id)) {
          updateObjectRestore(object, object.file);
        }
        if (!select) {
          updateObjectRestore(object, object.file);
        }
      });
      if (select) {
        nofileSelected = !(this.selectedKeys.length);
        this.selectedKeys = [];
      }
    }
    if (nofileSelected) {
      notification['warning']({ message: this.lang.lang.warning, description: this.lang.lang.noFileSelected})
    } else {
      notification['success']({ message: this.lang.lang.success, description: this.lang.lang.success})
    }
  }

  /* 刷新任务列表 */
  @action
  refreshTasks = (region) => {
    // 统计空闲任务
    const storageObject = this.fileStorage.get(region);
    if (!storageObject) return;

    if (this.taskType.series.length >= this.multiTaskCount) return;

    for (let i = 0; i < storageObject.length; i += 1) {
      if (this.taskType.series.length === this.multiTaskCount) break;
      if (
        storageObject[i].index !== storageObject[i].total
        &&
        (storageObject[i].state === 'pending' || storageObject[i].state === 'uninitial')
        &&
        !this.taskType.series.includes(storageObject[i])
      ) {
        this.taskType.series.push(storageObject[i]);
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
      const storageObject = this.taskType.series[i];
      if (storageObject.state === 'uploading') continue; // 上传中
      if (storageObject.state === 'pause') continue;
      taskSeries.push(storageObject);
    }

    let index;
    taskSeries.forEach((storageObject) => {
      arrayRemove(this.taskType.series, storageObject);
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
        fileOrigin: file.fileOrigin,
        initialized: false,
        partEtags: [],
        region,
        blockSize: this.blockSize,
        total: '',
        activePoint: new Date(),
        speed: '0 MB/S',
        id: encodeURIComponent(`${new Date()}_${file.name}_${file.type}_${file.size}`),
        uploadId: '',
        host: 'localhost',
        username: 'default',
        abspath: file.abspath,
        sharename: 'default',
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
