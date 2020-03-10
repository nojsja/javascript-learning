const fs = require('fs');
const path = require('path');

function chmod(target, opstr) {
  if (fs.statSync(target).isDirectory()) {
    const files = fs.readdirSync(target);
    if (files.length) {
      files.forEach((file) => {
        chmod(path.join(target, file), opstr);
      });
    }
  } else {
    fs.chmodSync(target, opstr);
  }
}

/**
 * [fsChmod 对文件和文件夹递归授予权限]
 * @param  {[String]} dir   [文件夹]
 * @param  {[int]} opstr [八进制数字，例如0o711]
 */
function fsChmod(dir, opstr) {
  chmod(dir, opstr);
}

module.exports = fsChmod;
