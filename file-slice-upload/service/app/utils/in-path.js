/**
* @name: inPath
* @description: 查询指定或系统目录下的目标文件
*/

const path = require('path');
const fs = require('fs');

function inpathSync(_target, _dirs) {
  let target;
  let dirs = _dirs;

  if (!dirs) dirs = process.env.PATH.split(':');

  for (let i = 0, l = dirs.length; i < l; i += 1) {
    target = path.join(dirs[i], _target);
    if (fs.existsSync(target)) {
      return target;
    }
  }

  return null;
}

module.exports = inpathSync;
