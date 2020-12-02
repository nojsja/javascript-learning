const { exec } = require('child_process');

/**
 * [_exec 执行命令]
 * @param       {[String]}   path     [执行文件路径]
 * @param       {[Array]}    params   [执行携带参数]
 * @param       {Function}   callback [执行结果会回调函数]
 * @return      {[Object]}            [返回结果对象]
 */
function Exec(command, options, callback) {
  try {
    let error = '';
    let result = '';
    exec(command, options, (err, stdout, stderr) => {
      if (err || stderr) {
        error = !err ? stderr : err;
        console.error(error);
      }
      result = stdout;
      callback({
        error,
        result,
      });
    });
  } catch (e) {
    console.error(e);
    throw new Error(`exec command -> ${command} error !`);
  }
}


module.exports = Exec;
