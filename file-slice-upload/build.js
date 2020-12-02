const path = require('path');
const fs = require('fs');
const { copyDirSync, exec, execRealtime, console_log, removeDirSync } = require('./service/build.utils');

/*
   * 函数调用list
   * @param web-dist 使用webpack打包前端web代码
   * @param build-win 执行win平台打包
   * @param build-mac 执行linux平台打包
   * @param build-linux 执行mac平台打包
   * @param build-all 执行所有平台打包
   * @param --help | -h 查看帮助信息
   */
const func = {
  'test': () => {
    copyDirSync('./view/dist', './service/dist');
  },
  /* web build */
  'web-dist': async () => {
    console_log('>>>>>> web-dist ...');
    await execRealtime('git pull', { cwd: './view' })
    .then(() => execRealtime('npm run build', { cwd: './view' }))
    .then(() => {
      if (fs.existsSync('./service/dist')) {
        removeDirSync('./service/dist');
      }
      fs.mkdirSync('./service/dist');
      copyDirSync('./view/dist', './service/dist');
    });
  },
  /* build for win platform */
  'build-win': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-win ${env}`, { cwd: './service' });
  },
  /* build for linux platform */
  'build-linux': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-linux ${env}`, { cwd: './service' });
  },
  /* build for mac platform */
  'build-mac': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-mac ${env}`, { cwd: './service' });
  },
  /* build for all platform */
  'build-all': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-all ${env}`, { cwd: './service' });
  },
  'clean-build': async (env) => {
    await execRealtime('node ./build.js clean-build', { cwd: './service' });
    if (fs.existsSync('./view/dist')) {
      removeDirSync('./view/dist');
    }
    await execRealtime('git checkout -- dist', { cwd: './view' });
    console_log(`\nclean finishied!`);
  },
  /* build command usage */
  '--help': () => {
    console_log('\
    \n\
    description: build command for RhinoDisk.\n\
    command: node build.js [action] [config]\n\
    |\n\
    |\n\
    |______ param: [--help | -h ] => show usage info.\n\
    |______ param: [build-win   ] [--edit | --office] => build package for windows, the default conf file is ./service/config.json.\n\
    |______ param: [build-linux ] [--edit | --office] => build package for linux, the default conf file is ./service/config.json\n\
    |______ param: [build-mac   ] [--edit | --office] => build package for mac, the default conf file is ./service/config.json\n\
    |______ param: [build-all   ] [--edit | --office] => build package for all platform, the default conf file is ./service/config.json\n\
    |______ param: [clean-build ] => clean build directory after build\n\
    |\n\
    |______ example1: node build.js build-win\n\
    |______ example2: node build.js build-linux\n\
    |______ example3: node build.js build-mac\n\
    |______ example4: node build.js build-all\n\
    |______ example5: node build.js build-win --edit\n\
    |______ example6: node build.js build-win --office\n\
    |______ example7: node build.js --help\n\
    |______ example8: node build.js clean-build\n\
    \n\
    ')
  },
  '-h': () => {
    func['--help']();
  }
};

/* Main */
function Main() {
  const params = process.argv.splice(2);
  const indexArray = [];
  let tmp;

  params.forEach((key, i) => {
    if (func[key] && (typeof func[key] === 'function')) indexArray.push(i);
  });
  
  indexArray.forEach((index, i) => {
    tmp = indexArray.slice(index + 1, indexArray[i + 1]).map(i => params[i]);
    if (tmp.length)
      func[params[index]](...tmp);
    else
      func[params[index]]('');
  });
}

Main();