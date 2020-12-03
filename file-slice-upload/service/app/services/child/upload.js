  const { remote } = require('electron');
const fs = require('fs');
  const fsPromise = fs.promises;
  const path = require('path');

  const utils = require('./child.utils');
  const { readFileBlock, uploadRecordStore, unlink } = utils;
  const ProcessHost = require('./process.libs');

  const fileBlock = readFileBlock();
  const uploadStore = uploadRecordStore();

  global.lang = process.env.lang;

  ProcessHost
    .registry('init-works', (params) => {
      return initWorks(params);
    })
    .registry('upload-works', (params) => {
      return uploadWorks(params);
    })
    .registry('close', (params) => {
      return close(params);
    })
    .registry('record-set', (params) => {
      uploadStore.set(params);
      return { result: null };
    })
    .registry('record-get', (params) => {
      return uploadStore.get(params);
    })
    .registry('record-get-all', (params) => {
      return (uploadStore.getAll(params));
    })
    .registry('record-update', (params) => {
      uploadStore.update(params);
      return ({result: null});
    })
    .registry('record-remove', (params) => {
      uploadStore.remove(params);
      return { result: null };
    })
    .registry('record-reset', (params) => {
      uploadStore.reset(params);
      return { result: null };
    })
    .registry('unlink', (params) => {
      return unlink(params);
    });


  /* *************** file logic *************** */

  /* 上传初始化工作 */
  function initWorks({username, host, sharename, pre, prefix, name, abspath, size, fragsize, record }) {
    const remotePath = path.join(pre, prefix, name);
    return new Promise((resolve, reject) => {
      new Promise((reso) => fsPromise.unlink(remotePath).then(reso).catch(reso))
      .then(() => {
        const dirs = utils.getFileDirs([path.join(prefix, name)]);
        return utils.mkdirs(pre, dirs);
      })
      .then(() => fileBlock.open(abspath, size))
      .then((rsp) => {
        if (rsp.code === 200) {
          const newRecord = {
            ...record,
            size, // 文件大小
            remotePath,
            username,
            host,
            sharename,
            startime: utils.getTime(new Date().getTime()), // 上传日期
            total: Math.ceil(size / fragsize),
          };
          uploadStore.set(newRecord);
          return newRecord;
        } else {
          throw new Error(rsp.result);
        }
     })
     .then(resolve)
     .catch(error => {
      reject(error.toString());
     });
    })
  }

  /* 上传文件 */
  function uploadWorks({abspath, position, data, slicesize, filePath, uploadId, index}, id) {
    return new Promise((resolve, reject) => {
      fileBlock.read(abspath, position, slicesize)
      .then(rsp => new Promise(reso => {
        if (rsp.code === 200) {
          try {
            fs.appendFile(filePath, rsp.result, { encoding: 'binary' }, (err) => {
              if (err) throw reso(err);
              reso(null);
            });
          } catch (error) {
            reso(error);
          }
        } else {
          reso(new Error(global.lang.upload.readLocalDataFailed));
        }
      }))
      .then( async (err) => {
        const record2 = uploadStore.get({uploadId});
        // 外部原因使上传中断
        if (!record2 || record2.status === 'error') {
          try {
            console.log('--uploading-unlink', filePath);
            fs.unlinkSync(filePath);
          } catch (error) {
            console.log(error);
          }
        }
  
        if (err) {
          utils.checkPermission(path.join(filePath, '..'), 'ew', (err2, isExit, canWrite) => {
            if (err2) {
              reject(global.lang.upload.writeDataFailed);
            } else if (isExit && !canWrite) {
              reject(global.lang.upload.insufficientPermissionUpload);
            } else {
              reject(global.lang.upload.writeDataFailed);
            }
          });
        } else {
          uploadStore.update({ record: { index: (index + 1) }, uploadId })
          resolve({ uploadId, index, abspath });
        }
      })
      .catch(err => {
        reject(err.toString());
      })
    })
  }

  /* 关闭文件上传任务 */
  function close({ uploadId }, id) {
    const recordInMemory = uploadStore.get({ uploadId });
    if (!recordInMemory) return Promise.resolve({ code: 600, result: lang.upload.readDataFailed });
    const { abspath } = recordInMemory;
    const recordWillUpdate = { status: 'break', endtime: utils.getTime(new Date().getTime()) };

    return new Promise(resolve => {
      uploadStore.update({
        record: recordWillUpdate,
        uploadId
      });
      // 关闭文件描述符
      fileBlock.close(abspath).then((rsp) => {
        if (rsp.code === 200) {
          resolve();
        } else {
          reject(rsp.result);
        }
      });
    })
  }