  const fs = require('fs');
  const fsPromise = fs.promises;
  const path = require('path');
  const utils = require('./child.utils');
  const requireLang = require('../../lang');
  const { readFileBlock, uploadRecordStore, unlink } = utils;
  const fileBlock = readFileBlock();
  const uploadStore = uploadRecordStore();
  requireLang(process.env.LANG);

  process.on('message', ({action, params, id }) => {
    switch (action) {
      case 'init-works':
        initWorks(params).then((rsp) => {
          process.send({result: rsp, id});
        });
        break;
      case 'upload-works':
        uploadWorks(params, id).then(rsp => {
          process.send({result: rsp, id});
        });
        break;
      case 'close':
        close(params, id).then(rsp => {
          process.send({result: rsp, id});
        });
        break;
      case 'record-set':
        uploadStore.set(params);
        process.send({result: null, id});
        break;
      case 'record-get':
        process.send({result: uploadStore.get(params), id});
        break;
      case 'record-get-all':
        process.send({result: uploadStore.getAll(params), id});
        break;
      case 'record-update':
        uploadStore.update(params);
        process.send({result: null, id});
        break;
      case 'record-remove':
        uploadStore.remove(params);
        process.send({result: null, id});
        break;
      case 'record-reset': 
        uploadStore.reset(params);
        process.send({result: null, id});
      break;
      case 'unlink': 
        unlink(params).then(rsp => {
          process.send({result: rsp, id});
        })
      break;
      default:
        break;
    }
  });

  /* *************** file logic *************** */

  /* 上传初始化工作 */
  function initWorks({ pre, prefix, name, abspath, size, fragsize, record }) {
    const remotePath = path.join(pre, prefix, name);

    return new Promise(resolve => {
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
            startime: utils.getTime(new Date().getTime()), // 上传日期
            total: Math.ceil(size / fragsize),
          };
          uploadStore.set(newRecord);
          return {
            code: 200,
            result: newRecord
          };
        } else {
          return rsp;
        }
     })
     .then(resolve)
     .catch(error => {
      resolve({
        code: 600,
        result: error.toString()
      });
     })
    })
  }

  /* 上传文件 */
  function uploadWorks({abspath, position, data, slicesize, filePath, uploadId, index}, id) {
    return new Promise((resolve) => {
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
              resolve({
                code: 600,
                result: global.lang.upload.writeDataFailed
              });
            } else if (isExit && !canWrite) {
              resolve({
                code: 600,
                result: global.lang.upload.insufficientPermissionUpload
              });
            } else {
              resolve({
                code: 600,
                result: global.lang.upload.writeDataFailed
              });
            }
          });
        } else {
          uploadStore.update({ record: { index: (index + 1) }, uploadId })
          resolve({
            code: 200,
            result: { uploadId, index, abspath }
          });
        }
      })
      .catch(err => {
        resolve({
          code: 600,
          result: err.toString()
        });
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
          resolve({
            code: 200
          });
        } else {
          resolve(rsp);
        }
      });
    })
  }