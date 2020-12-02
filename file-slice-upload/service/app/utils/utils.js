const { Notification } = require('electron');
const fs = require('fs');

const fsPromises = fs.promises;
const path = require('path');
const { app } = require('electron');
const os = require('os');
const crypto = require('crypto');

/**
* @name: jsonstr2Object
* @description: 去除shell返回的json字符串内容的最后一个','符号，并转化成对象
*/
exports.jsonstr2Object = function (_str) {
  let str = _str;

  try {
    str = str.substr(0, (str.length - 1));
    str = `{${str}}`;
    str = JSON.parse(str);
  } catch (e) {
    str = '{}';
    console.error(e);
  }

  return str;
};

/**
* @name: notifySend
* @description: 桌面通知发送
*/
exports.notifySend = function ({
  title, body, icon, delay,
}) {
  const notify = new Notification({
    title,
    body,
    icon,
  });

  if (delay) {
    setTimeout(() => {
      notify.show();
    }, delay);
  } else {
    notify.show();
  }
};

/**
  * checkEnvFiles [检查环境文件是否存在]
  * @author nojsja
  * @return {[type]} param [desc]
  */
exports.checkEnvFiles = function () {
  const appDataPath = path.join(app.getPath('appData'), 'FileSliceUpload');
  const pathRuntime = path.join(appDataPath, 'runtime/');
  const check = function (_path, isDir) {
    if (!fs.existsSync(_path)) {
      if (isDir) {
        fs.mkdirSync(_path);
      } else {
        fs.closeSync(fs.openSync(_path, 'w'));
      }
    }
  };
  [
    { _path: appDataPath, isDir: true },
    { _path: pathRuntime, isDir: true },
    { _path: path.join(pathRuntime, 'view.conf'), isDir: false },
    { _path: path.join(pathRuntime, 'upload'), isDir: true },
    { _path: path.join(pathRuntime, 'database/'), isDir: true },
    { _path: path.join(pathRuntime, 'database/uploads.json'), isDir: false },
    { _path: path.join(pathRuntime, 'database/setting.json'), isDir: false },
  ].forEach(({ _path, isDir }) => {
    check(_path, isDir);
  });

  return {
    pathRuntime,
  };
};


/**
  * templateStrTranform [模板字符串转换]
  * params1: {bucket: testBucket, uid: testUid, bucketId: testID}
  * params2: /admin/bucket?format=json&bucket={bucket}&uid={uid}&bucket-id={bucketId}
  * return: /admin/bucket?format=json&bucket=testBucket&uid=testUid&bucket-id=testID
  *
  * @author nojsja
  * @param  {[Object]} varObj [替换变量对象]
  * @param {[String]} templateStr [模板字符串]
  * @return {[String]} result [模板字符串]
  */
exports.templateStrTransform = (varObj, templateStr) => {
  if (typeof varObj !== 'object' || !templateStr) return templateStr;
  for (const attr in varObj) {
    if (varObj.hasOwnProperty(attr)) {
      templateStr = templateStr.replace(new RegExp(`{${attr}}`, 'g'), varObj[attr]);
    }
  }
  return templateStr;
};

/**
  * isRequestNotExpired [check if the request is not expired.]
  * @author nojsja
  * @param  {[type]} param [server response]
  * @return {[Boolean]} [is it not expired.]
  */
exports.isRequestNotExpired = (res) => {
  if (res && res.code === 300) return false;
  return true;
};

exports.handleHostMountPointString = (str) => {
  const symbolReg = /^(-){10,}$/;
  const mountInfo = [];
  const mountStrArray = str.split(os.EOL).filter(s => s !== os.EOL && !!s);
  let startIndex = 0;
  let strLength = 0;
  for (let i = 0; i < mountStrArray.length; i++) {
    if (symbolReg.test(mountStrArray[i])) {
      startIndex = i + 1;
      strLength = mountStrArray[startIndex].length;
    }
    if (i >= startIndex && strLength === mountStrArray[i].length) {
      mountInfo[mountInfo.length] = {
        name: mountStrArray[i].split(' ').filter(s => s)[0],
        type: mountStrArray[i].split(' ').filter(s => s)[1],
        point: mountStrArray[i].split(' ').filter(s => s)[2] || '',
      };
    }
  }
  return mountInfo;
};

/* ------------------- 函数节流-throttle ------------------- */
/**
   * @param  {Function} fn         [回调函数]
   * @param  {[Time]}   delayTime  [延迟时间(ms)]
   * @param  {Boolean}  isImediate [是否需要立即调用]
   * @param  {[type]}   args       [回调函数传入参数]
  */
exports.fnThrottle = () => {
  const fnObject = {};

  return (fn, delayTime, IsImediate, args) => {
    // 立即调用
    if (!delayTime || IsImediate) {
      return fn(args);
    }
    // 判断函数是否已经在调用中
    if (!fnObject[fn]) {
      // 定时器
      const timer = setTimeout(() => {
        fn(args);
        // 清除定时器
        clearTimeout(timer);
        delete (fnObject[fn]);
      }, delayTime);

      fnObject[fn] = {
        status: 'waitToRun',
        delayTime,
        timer,
      };
    }
  };
};


/* ------------------- 函数去抖-debounce ------------------- */
/**
   * @param  {Function} fn         [回调函数]
   * @param  {[Time]}   delayTime  [延迟时间(ms)]
   * @param  {Boolean}  cancle [取消传入的函数监听]
   * @param  {[type]}   args       [回调函数传入参数]
  */
exports.fnDebounce = () => {
  const fnObject = {};
  let timer;

  return (fn, delayTime, cancel, args) => {
    // 设置定时器方法
    const setTimer = () => {
      timer = setTimeout(() => {
        fn(args);
        // 清除定时器
        clearTimeout(timer);
        delete (fnObject[fn]);
      }, delayTime);

      fnObject[fn] = {
        delayTime,
        timer,
      };
    };

    // 立即调用
    if (cancel && fnObject[fn]) {
      clearTimeout(fnObject[fn].timer);
      delete fnObject[fn];
      return;
    }

    // 判断函数是否已经在调用中
    if (fnObject[fn]) {
      clearTimeout(timer);
      // 定时器
      setTimer(fn, delayTime, args);
    } else {
      // 定时器
      setTimer(fn, delayTime, args);
    }
  };
};

/**
    * mkdir [同步递归创建文件夹]
    * @param  {[String]} host [主机名]
    * @param  {[String]} name [共享名]
    * @param  {[Array]} dirs [目录数组]
    */
exports.mkdirs = (pre, dirs) => {
  if (!dirs || !dirs.length) {
    return Promise.resolve();
  }
  const promises = dirs.map(dir => () => new Promise((reso) => {
    fsPromises.mkdir(path.join(pre, dir), { recursive: true }).then(reso).catch(reso);
  }));
  return Promise.all(promises.map(p => p()));
};

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
};

/**
  * getFilesInDir [根据文件路径读取文件，返回文件列表]
  * @author nojsja
  * @param  {[String]} filePath [路径]
  */
exports.getFilesInDir = (filePath) => {
  let paths = [];
  const files = fs.readdirSync(filePath);
  try {
    // 遍历读取到的文件列表
    files.forEach((filename) => {
      // 获取当前文件的绝对路径
      const filedir = path.join(filePath, filename);
      // 根据文件路径获取文件信息，返回一个fs.Stats对象
      const stats = fs.statSync(filedir);
      if (stats.isFile()) {
        paths.push(filedir);
      }
      if (stats.isDirectory()) {
        paths = paths.concat(exports.getFilesInDir(filedir));// 递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    });
  } catch (err) {
    console.error(err);
  }

  return paths;
};

/**
  * getStringMd5 [获取字符串md5值]
  * @author nojsja
  * @param  {[String]} str [字符]
  * @return {[String]}
  */
exports.getStringMd5 = (str) => {
  const h = crypto.createHash('md5');
  h.update(str);
  return h.digest('hex');
};

/**
  * readFileBlock [读取文件块]
  */
exports.readFileBlock = () => {
  const fdStore = {};
  const smallFileMap = {};

  return {
    /* 打开文件描述符 */
    open: (path, minSize = 1024 * 2) => new Promise((resolve) => {
      try {
        fs.stat(path, (err, { size }) => {
          if (err) throw new Error(err.toString());
          if (size <= minSize) {
            smallFileMap[path] = true;
            console.log('min', size);
            return resolve({
              code: 200,
              result: {
                fd: null,
                size,
              },
            });
          }
          fs.open(path, 'r', (err, fd) => {
            if (err) {
              console.trace(err);
              resolve({
                code: 601,
                result: err.toString(),
              });
            } else {
              fdStore[path] = fd;
              resolve({
                code: 200,
                result: {
                  fd: fdStore[path],
                  size,
                },
              });
            }
          });
        });
      } catch (err) {
        console.trace(err);
        resolve({
          code: 600,
          result: err.toString(),
        });
      }
    }),

    /* 读取文件块 */
    read: (path, position, length) => new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err) {
          resolve({
            code: 600,
            result: err.toString(),
          });
        } else {
          resolve({
            code: 200,
            result: data,
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
          fs.read(fdStore[path], Buffer.alloc(length), 0, length, position, (err, readByte, readResult) => {
            callback(err, readResult);
          });
        }
      } catch (err) {
        console.trace(err);
        resolve({
          code: 600,
          result: err.toString(),
        });
      }
    }),

    /* 关闭文件描述符 */
    close: path => new Promise((resolve) => {
      try {
        if (smallFileMap[path]) {
          delete smallFileMap[path];
          resolve({
            code: 200,
          });
        } else {
          fs.close(fdStore[path], () => {
            resolve({ code: 200 });
            delete fdStore[path];
          });
        }
      } catch (err) {
        console.trace(err);
        resolve({
          code: 600,
          result: err.toString(),
        });
      }
    }),

    fdStore,

  };
};


/**
  * asynchronousLock [promise异步执行锁]
  * @param  {[String]} id [该promise异步引用对象的唯一ID]
  * @param  {[Function => Promise]} promiseFunc [返回promise异步引用对象的函数]
  * @param  {[Any]} params [promise函数的传入参数]
  * @param {[Function]} callback [该异步对象的回调函数]
  * @param {[Function]} check [校验结果是否正确的方法，用于判定当前Promsie函数返回值是否有效]
  */
exports.asynchronousLock = function () {
  const promiseMap = new Map();
  const valueMap = new Map();

  return [function (id, promiseFunc, params, callback, check = () => true) {
    if (valueMap.has(id)) return callback(null, valueMap.get(id));
    if (!promiseMap.has(id)) {
      promiseMap.set(id, [callback]);
      promiseFunc(params).then((rsp) => {
        if (check(rsp)) {
          valueMap.set(id, rsp);
          promiseMap.get(id).forEach((call) => {
            call(null, rsp);
          });
          promiseMap.delete(id);
        } else {
          promiseMap.get(id).forEach((call) => {
            call('error');
          });
          promiseMap.delete(id);
          valueMap.delete(id);
        }
      }).catch((err) => {
        console.error('asynchronousLock => ', err);
        promiseMap.delete(id);
        valueMap.delete(id);
      });
    } else {
      promiseMap.set(id, [...promiseMap.get(id), callback]);
    }
  }, function (symbol) {
    promiseMap.delete(symbol);
    valueMap.delete(symbol);
  }];
};


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
};

/**
  * localUsernameWrapper [本地用户添加用户名前缀]
  * @param  {[String]} username [用户名]
  * @param  {[Boolean]} isLocalUser [是否是本地用户]
  */
exports.localUsernameWrapper = (username, isLocalUser = false) => (isLocalUser ? `local\\${username}` : username);

/**
  * checkPermission [检查是否有权限]
  * @param  {[String]} file [文件或目录]
  * @param  {[Number]} mask [权限-r(4)-w(2)-x(1)]
  * @param  {[Function]} cb [回调函数]
  */
exports.checkPermission = function (file, mask = 'e', cb) {
  const handleErrorSimple = (e, callback) => {
    callback(null, !e);
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
  };
  const aclMap = {
    r: {
      acl: fs.constants.R_OK,
      handleError: handleErrorSimple,
    },
    w: {
      acl: fs.constants.W_OK,
      handleError: handleErrorSimple,
    },
    x: {
      acl: fs.constants.X_OK,
      handleError: handleErrorSimple,
    },
    e: {
      acl: fs.constants.F_OK,
      handleError: handleErrorSimple,
    },
    er: {
      acl: fs.constants.F_OK | fs.constants.R_OK,
      handleError: handleErrorMulti,
    },
    ew: {
      acl: fs.constants.F_OK | fs.constants.W_OK,
      handleError: handleErrorMulti,
    },
    ex: {
      acl: fs.constants.F_OK | fs.constants.X_OK,
      handleError: handleErrorMulti,
    },
  };
  // 检查文件是否可写。
  fs.access(file, (aclMap[mask] || aclMap.e).acl, (err) => {
    (aclMap[mask] || aclMap.e).handleError(err, cb);
  });
  // fs.stat (file, function (error, stats){
  //     if (error){
  //         cb (error, false);
  //     }else{
  //         cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
  //     }
  // });
};
