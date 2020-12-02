const fs = require('fs');
const path = require('path');

/**
 * [write 从内存中读取数值并写入.conf文件]
 * @return {[type]} [description]
 */
function writeFile(confPath, data, isJson) {
  data = isJson ? JSON.stringify(data) : data;
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
function writeFileSync(confPath, data, isJson) {
  data = isJson ? JSON.stringify(data) : data;
  console.log('write sync');
  fs.writeFileSync(confPath, data, 'utf8');
}

/**
 * [write 从.conf文件中读取数值并存到内存中]
 * @return {[type]} [description]
 */
function readFileSync(confPath, isJson) {
  let result;
  let error;
  try {
    result = fs.readFileSync(confPath, {
      encoding: 'utf8',
    });
    result = isJson ? JSON.parse(result) : result;
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

module.exports = {
  writeFile,
  writeFileSync,
  readFileSync,
};
