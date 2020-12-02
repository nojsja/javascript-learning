const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

/**
  * readFileBlock [读取文件块]
  */
exports.readFileBlock = () => {

  const fdStore = {};
  const smallFileMap = {};

  return {
    /* 打开文件描述符 */
    open: (path, size, minSize=1024*2) => {
      return new Promise((resolve) => {
        try {
            if (size <= minSize) {
              smallFileMap[path] = true;
              return resolve({
                code: 200,
                result: {
                  fd: null,
                  size,
                }
              });
            }
            fs.open(path, 'r', (err, fd) => {
              if (err) {
                console.trace(err);
                resolve({
                  code: 601,
                  result: err.toString()
                });
              } else {
                fdStore[path] = fd;
                resolve({
                  code: 200,
                  result: {
                    fd: fdStore[path],
                    size: size,
                  }
                });
              }
            });
        } catch (err) {
          console.trace(err);
          resolve({
            code: 600,
            result: err.toString()
          });
        }
      })
    },

    /* 读取文件块 */
    read: (path, position, length) => {
      return new Promise((resolve, reject) => {
        const callback = (err, data) => {
          if (err) {
            resolve({
              code: 600,
              result: err.toString()
            });
          } else {
            resolve({
              code: 200,
              result: data
            });
          }
        };
        try {
          if (smallFileMap[path]) {
            fs.readFile(path, (err, buffer) => {
              callback(err, buffer);
            });
          } else {
            if (length === 0) return callback(null, '');
            fs.read(fdStore[path], Buffer.alloc(length), 0, length, position, function(err, readByte, readResult){
              callback(err, readResult);
            });
          }
        } catch (err) {
          console.trace(err);
          resolve({
            code: 600,
            result: err.toString()
          });
        }
      });
    },
    
    /* 关闭文件描述符 */
    close: (path) => {
      return new Promise((resolve) => {
        try {
          if (smallFileMap[path]) {
            delete smallFileMap[path];
            resolve({
              code: 200
            });
          } else {
            fs.close(fdStore[path], () => {
              resolve({code: 200});
              delete fdStore[path];
            });
          }
        } catch (err) {
          console.trace(err);
          resolve({
            code: 600,
            result: err.toString()
          });
        }
      });
    },

    fdStore

  }

};


/**
  * uploadRecordStore [上传记录内存管理]
  */
 exports.uploadRecordStore = () => {
   let records = {};

   return {
    /* 添加上传记录 */
     set: ({ username, host, sharename, ...attrs }) => {
      records[`${host}_${username}_${sharename}`]
        = records[`${host}_${username}_${sharename}`] ? records[`${host}_${username}_${sharename}`] : [];
  
      records[`${host}_${username}_${sharename}`].unshift({
        username, host, sharename, ...attrs
      });
     },
     /* 获取上传记录 */
     get: ({ uploadId }) => {
      let record, element, length;
      for (let key in records) {
        if (records[key]) {
          length = records[key].length;
          for (let i = 0; i < length; i += 1) {
            element = records[key][i];
            if (element.uploadId === uploadId) {
              record = JSON.parse(JSON.stringify(element));
              break;
            }
          }
        }
      }
      return record;
     },
     /* 获取上传记录 */
     getAll: () => {
      return JSON.parse(JSON.stringify(records));
     },
     /* 更新上传记录 */
     update: ({ record, uploadId }) => {
      let r, length;
      for (let key in records) {
        if (records[key]) {
          length = records[key].length;
          for (let i = 0; i < length; i += 1) {
            r = records[key][i];
            if (r.uploadId === uploadId) {
              Object.assign(r, record);
              break;
            }
          }
        }
      }
     },
     /* 移除一条上传记录 */
     remove: ({ uploadId }) => {
      for (let key in records) {
        records[key] && (records[key] = records[key].filter(r => r.uploadId !== uploadId));
      }
     },
     /* 重置部分/所有上传任务 */
     reset: ({region}) => {
      if (region) {
        delete records[region];
      } else {
        records = {};
      }
     }
   }
 }

 /**
    * mkdirs [同步递归创建文件夹]
    * @param  {[String]} host [主机名]
    * @param  {[String]} name [共享名]
    * @param  {[Array]} dirs [目录数组]
    */
  exports.mkdirs = (pre, dirs) => {
  if(!dirs || !dirs.length) {
    return Promise.resolve();
  }
  const promises = dirs.map((dir) => () => {
    return new Promise((reso) => {
      fsPromise.mkdir(path.join(pre, dir), {recursive: true}).then(reso).catch(reso);
    });
  })
  return Promise.all(promises.map(p => p()));
}

/**
    * getFileDirs [分析获取所有文件夹路径]
    * @param  {[Array]} dirs [绝对路径数组]
    */
  exports.getFileDirs = (dirs) => {
    const dirArray = [];
    const symbol = path.join('/');
    let pathParse;
    dirs && dirs.length && dirs.forEach((dir) => {
      pathParse = path.join(dir || '');
      pathParse = path.dirname(pathParse);
      if ((!!pathParse && pathParse !== '.') && !dirArray.includes(pathParse)) {
        dirArray.push(pathParse);
      }
    });
    return dirArray;
}

/**
* getTime [时间戳转换为yyyy-MM-dd]
* @param  {[String | Number]} inputTime [时间戳]
*/
exports.getTime = (inputTime) => {
  const target = Number(inputTime);
  const date = new Date();
  date.setTime(target);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? (`0${m}`) : m;
  let d = date.getDate();
  d = d < 10 ? (`0${d}`) : d;
  let h = date.getHours();
  h = h < 10 ? (`0${h}`) : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? (`0${minute}`) : minute;
  second = second < 10 ? (`0${second}`) : second;
  return (`${y}-${m}-${d} ${h}:${minute}:${second}`);
}


/**
  * checkPermission [检查是否有权限]
  * @param  {[String]} file [文件或目录]
  * @param  {[Number]} mask [权限-r(4)-w(2)-x(1)]
  * @param  {[Function]} cb [回调函数]
  */
 exports.checkPermission = function (file, mask='e', cb){
  const  handleErrorSimple = (e, callback) => {
    callback(null, e ? false : true);
  };
  const handleErrorMulti = (e, callback) => {
    if (e) {
      if (e.code === 'ENOENT') {
        callback(null, false, false);
      } else {
        callback(e, true, false);
      }
    } else {
      callback(null, true, true);
    }
  }
  const aclMap = {
    r: {
      acl: fs.constants.R_OK,
      handleError: handleErrorSimple
    },
    w: {
      acl: fs.constants.W_OK,
      handleError: handleErrorSimple
    },
    x: {
      acl: fs.constants.X_OK,
      handleError: handleErrorSimple
    },
    e: {
      acl: fs.constants.F_OK,
      handleError: handleErrorSimple
    },
    er: {
      acl: fs.constants.F_OK | fs.constants.R_OK,
      handleError: handleErrorMulti
    },
    ew: {
      acl: fs.constants.F_OK | fs.constants.W_OK,
      handleError: handleErrorMulti
    },
    ex: {
      acl: fs.constants.F_OK | fs.constants.X_OK,
      handleError: handleErrorMulti
    },
  }
  // 检查文件是否可写。
  fs.access(file, (aclMap[mask] || aclMap['e']).acl, (err) => {
    (aclMap[mask] || aclMap['e']).handleError(err, cb);
  });
  // fs.stat (file, function (error, stats){
  //     if (error){
  //         cb (error, false);
  //     }else{
  //         cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
  //     }
  // });
};

/**
  * unlink [删除文件或目录]
  * @param  {[String]} filepath [文件或目录绝对地址]
  */
exports.unlink = ({filepath}) => {
  return new Promise(resolve => {
    new Promise(reso => {
      fsPromise.stat(filepath)
      .then((stats) => {
        reso(stats);
      })
      .catch(err => {
        resolve({
          code: 200,
          result: { abspath: filepath }
        });
      });
    })
    .then(stats => {
      if (stats.isDirectory()) {
        return fsPromise.rmdir(filepath, { recursive: true });
      } else {
        return fsPromise.unlink(filepath);
      }
    })
    .then(() => {
      resolve({
        code: 200,
        result: { abspath: filepath }
      });
    })
    .catch(() => {
      resolve({
        code: 600,
        result: global.lang.upload.delete_file_failed + filepath
      });
    })
  })
}