const fs = require('fs');
const DataSet = require('./DataSet');
const uploadSchema = require('./schema/upload.schema');
const SudoPrompt = require('../utils/sudo-prompt');
const path = require('path');

const {
  getStringMd5, asynchronousLock,
  getTime, getRandomString
} = require('../utils/utils');

class Upload extends DataSet {
  constructor() {
    super('uploads', uploadSchema);
    this.sudo = new SudoPrompt();
    // 异步调用锁
    const asyncLock = asynchronousLock();
    this.asynchronousLock = asyncLock[0];
    this.asynchronousLockReset = asyncLock[1];
  }

  /**
    * _unlink [删除文件]
    * @param  {[String]} filepath [文件路径]
    * @return {[Promise]}
    */
  _unlink({filepath}) {
    return global.ipcUploadProcess.send('unlink', { filepath }, getRandomString());
  }

  /**
    * setUploadRecords [存储上传记录-文件中]
    * @param  {[String]} username [用户名]
    * @param  {[String]} host [主机名]
    * @param  {[String]} filename [文件名(附带相对路径名)]
    * @param  {[String]} size [文件大小]
    * @param  {[String]} sharename [共享名]
    * @param  {[String]} path [文件所在绝对路径]
    * @param  {[String]} date [上传日期]
    * @param  {[String]} fragsize [分片大小]
    * @param  {[String]} uploadId [任务ID]
    * @param  {[String]} status [上传状态 init | upload | error]
    */

  /**
    * storeUploadRecordsInFile [存储一条上传记录-文件中]
    * @param  {[String]} region [某个任务区域-可选参数]
    */
  storeUploadRecordsInFile(params = {}) {
    return new Promise(async(resolve) => {
      let res = [];
      const { region } = params;
      const uploadRecordsAll = await global.ipcUploadProcess.sendToAll('record-get-all', null);

      if (
        !uploadRecordsAll ||
        uploadRecordsAll.find((item) => item.error)
      ) return resolve({
        code: 600,
        result: global.lang.upload.syncDataFailed
      });
      
      uploadRecordsAll.length &&
      uploadRecordsAll.forEach(uploadRecords => {
        for (let key in uploadRecords.result) {
          if (region && (key !== region)) continue;
          (uploadRecords.result[key] || []).forEach(uploadObject => {
            if (uploadObject.status !== 'break') {
              uploadObject.status = 'error';
              try {
                console.log('--unlink', uploadObject.remotePath);
                fs.unlinkSync(uploadObject.remotePath);
              } catch (error) {
                console.log(error);
              }
            }
          });
          res = res.concat(uploadRecords.result[key] || []);
        }
      })
      
      await global.ipcUploadProcess.sendToAll('record-reset', { region });

      let { records, errors } = this.getState();
      records.unshift(...res);
      records = records.slice(0, 1000);

      this.setState({
        records,
        errors,
      }).then(() => {
        resolve({
          code: 200,
          result: region || '',
        });
      }).catch((err) => {
        resolve({
          code: 600,
          result: global.lang.upload.syncDataFailed
        });
      });
    });
  }

  /* -------------- 获取上传前缀路径 -------------- */
  getUploadPrepath() {
    return Promise.resolve(path.join(global.pathRuntime, 'upload'))
  }

  /**
    * getUploadRecords [获取上传记录]
    * @param  {[type]} param [desc]
    */
  getUploadRecords({ host, username, sharename }) {
    return new Promise((resolve) => {
      const { records } = this.getState();
      const check = (record1, record2) => (record1.host === record2.host && record1.username === record2.username && record1.sharename === record2.sharename);
      let result = records.filter(record => check(record, { host, username, sharename })).map(record => ({
        status: record.status,
        abspath: record.abspath,
        name: record.filename,
        type: '',
        size: record.size,
        host: record.host,
        index: record.index,
        total: record.total,
        username: record.username,
        sharename: record.sharename,
        uploadId: record.uploadId,
        startime: record.startime,
        endtime: record.endtime
      }));
      resolve({
        code: 200,
        result
      });
    });
  }

  /**
    * init [初始化上传]
    * @param  {[String]} host [主机名]
    * @param  {[String]} username [用户名]
    * @param  {[Object]} file [文件描述对象]
    * @param  {[String]} abspath [绝对路径]
    * @param  {[String]} sharename [共享名]
    * @param  {[String]} fragsize [分片大小]
    */
  init({ username, host, file, abspath, sharename, fragsize, prefix = '' }) {
    const date = Date.now();
    const uploadId = getStringMd5(date + file.name + file.type + file.size);
    let size = 0;

    return new Promise((resolve) => {
        this.getUploadPrepath()
        .then((pre) => {
          return global.ipcUploadProcess.send(
            'init-works',
            {
              username, host, sharename, pre, prefix, size: file.size, name: file.name, abspath, fragsize, record: 
              {
                host, // 主机
                filename: path.join(prefix, file.name), // 文件名
                size, // 文件大小
                fragsize, // 分片大小
                abspath, // 绝对路径
                startime: getTime(new Date().getTime()), // 上传日期
                endtime: '', // 上传日期
                uploadId, // 任务id
                index: 0,
                total: Math.ceil(size / fragsize),
                status: 'uploading' // 上传状态
              }
            },
            uploadId
          )
        })
      .then((rsp) => {
        resolve({
          code: rsp.error ? 600 : 200,
          result: rsp.result,
        });
      }).catch(err => {
        resolve({
          code: 600,
          result: err.toString()
        });
      });
    });
  }

  /**
    * upload [上传文件]
    * @param  {[String]} index [分片索引，0为起始值]
    * @param  {[String]} uploadId [上传任务ID]
    */
  upload({ uploadId, index }) {
    return new Promise(async (resolve) => {

      const record = await global.ipcUploadProcess.send('record-get', { uploadId }, uploadId);

      if (record.error) return resolve({ code: 600, result: lang.upload.readDataFailed });
      if (record.result.status !== 'uploading') return resolve({ code: 600, result: lang.upload.readDataFailed });
  
      const { filename, size, fragsize, abspath } = record.result;
  
      const position = fragsize * (index);
      const slicesize = ((fragsize * (index + 1)) <= size) ? fragsize : (size - fragsize * index);
      if (position > size) {
        return resolve({
          code: 600,
          result: lang.upload.upload_index_overflow
        });
      }

      new Promise(reso => {
        this.getUploadPrepath()
        .then((pre) => {
          global.ipcUploadProcess.send(
            'upload-works',
            { abspath, position, slicesize, filePath: path.join(pre, filename), uploadId, index },
            uploadId
          )
          .then((rsp) => {
            resolve({
              code: rsp.error ? 600 : 200,
              result: rsp.error || rsp.result
            });  
          });
        })
        .catch(err => {
          resolve({
            code: 600,
            result: err.toString()
          });
        });
      }
    )})
  }


  /**
    * reset [重置上传任务，删除已经上传的文件分片]
    * @param  {[String]} uploadId [上传任务ID]
    */
  reset({ uploadId }) {
    return new Promise( async(resolve) => {
      const record = await global.ipcUploadProcess.send('record-get', { uploadId }, uploadId);
      if (record.error || !record.result) return Promise.resolve({ code: 600, result: lang.upload.readDataFailed });
  
      const { filename } = record.result;
      this.getUploadPrepath()
        .then((pre) => {
          return this._unlink({filepath: path.join(pre, filename)});
        })
        .then((rsp) => {
          resolve(rsp);
        })
        .catch(err => {
          resolve({
            code: 600,
            result: err.toString()
          });
        })
    })
  }

  /**
    * reset [删除上传任务，如果没有上传完成或上传错误则删除已经上传的文件分片]
    * @param  {[String]} uploadId [上传任务ID]
    */
  removeRecord({ uploadId }) {
    
    return new Promise( async (resolve) => {
      const record = await global.ipcUploadProcess.send('record-get', { uploadId }, uploadId);
      if (record.error || !record.result) return Promise.resolve({ code: 600, result: lang.upload.readDataFailed });
  
  
      const { abspath, filename, status } = record;
        this.getUploadPrepath().then(rsp => {
          pre = rsp;
        })
        .then(() => global.ipcUploadProcess.send('close', { abspath }, uploadId))
        .then(() => {
          return global.ipcUploadProcess.send('record-remove', { uploadId }, uploadId);
        })
        .then(() => {
          if (status !== 'break') {
            return this._unlink({filepath: path.join(pre, filename)});
          } else {
            return Promise.resolve({
              code: 200
            });
          }
        })
        .then(rsp => {
          resolve(rsp);
        })
        .catch(err => {
          resolve({
            code: 600,
            result: err.toString()
          });
        });
    })
  }

  /**
    * reset [删除上传历史任务，如果没有上传完成或上传错误则删除已经上传的文件分片]
    * @param  {[String]} uploadId [上传任务ID]
    */
  removeRecordHistory({ uploadId }) {
    const record = this.get('records', { uploadId });
    if (!record) return Promise.resolve({ code: 600, result: lang.upload.readDataFailed });
    const { sharename, host, username, filename, status } = record;
    let pre;

    return new Promise(resolve => {
        this.getUploadPrepath({ host, username, sharename }).then(rsp => {
          pre = rsp;
        })
        .then(() => {
          return this.remove('records', { uploadId });
        })
        .then(() => {
          if (status !== 'break') {
            return this._unlink({filepath: path.join(pre, filename)});
          } else {
            return Promise.resolve({
              code: 200
            });
          }
        })
        .then(rsp => {
          resolve(rsp);
        })
        .catch(err => {
          resolve({
            code: 600,
            result: err.toString()
          });
        });
    });
  }


  /**
    * upload [完成上传]
    * @param  {[String]} uploadId [上传任务ID]
    */
  complete({ uploadId }) {
    return global.ipcUploadProcess.send('close', { uploadId }, uploadId);
  }
}

module.exports = Upload;