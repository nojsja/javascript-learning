/**
* @description: 只在dev环境下打印的log信息
*/

const nodeEnv = process.env.NODE_ENV;

function consoleLog(item) {
  if (nodeEnv === 'development') {
    console.trace(item);
  }
}

module.exports = consoleLog;
