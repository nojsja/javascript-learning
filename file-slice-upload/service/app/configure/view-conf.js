const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const confPath = path.resolve(app.getAppPath(), 'app/runtime/view.conf');

let viewConf = {
  width: null,
  height: null,
};

/**
 * [set 在内存中设置窗口属性]
 * @param {[Object]} props [属性描述]
 */
const set = (props) => {
  const isObject = (typeof (props) === 'object');
  if (isObject) {
    viewConf = Object.assign(viewConf, props);
  }
};

/**
 * [write 从内存中读取数值并写入.conf文件]
 * @return {[type]} [description]
 */
function write() {
  const data = JSON.stringify(viewConf);
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(confPath, data, 'utf8', (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve('');
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * [write 从内存中读取数值并同步写入.conf文件]
 * @return {[type]} [description]
 */
function writeSync() {
  const data = JSON.stringify(viewConf);
  console.log('write sync');
  fs.writeFileSync(confPath, data, 'utf8');
}

/**
 * [write 从.conf文件中读取数值并存到内存中]
 * @return {[type]} [description]
 */
function read() {
  let result;
  let error;
  try {
    result = fs.readFileSync(confPath, {
      encoding: 'utf8',
    });
    result = JSON.parse(result);
    error = null;
  } catch (e) {
    error = e;
    result = null;
  }

  return {
    result,
    error,
  };
}

module.exports = Object.assign(viewConf, {
  set,
  write,
  writeSync,
  read,
});
