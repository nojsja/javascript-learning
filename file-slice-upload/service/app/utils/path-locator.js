/**
* @name: pathLocator
* @description: 在index.js引入生成全局变量pathLocator
*/

const path = require('path');

function pathLocator(module, name) {
  const paths = {
    stores: 'app/stores',
    services: 'app/services',
    configure: 'app/configure',
    runtime: 'app/runtime',
    shell: 'app/services/shell',
    styles: 'app/styles',
    utils: 'app/utils',
    views: 'app/views',
    resources: 'resources',
  };
  const abpath = paths[module] ? (`${paths[module]}/${name}`) : '';

  // 自动合并根目录路径
  return path.resolve(abpath);
}

module.exports = pathLocator;
