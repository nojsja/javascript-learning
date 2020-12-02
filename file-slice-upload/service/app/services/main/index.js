/**
* @name: ipcCleanListener
* @description: 主进程ipc信号监听器
*/
const path = require('path');
const fs = require('fs');

const { notifySend } = require('../../utils/utils');

const settingManage = require('./settingManage');
const SessionManage = require('../../controller/SessionManage');
const uploadManage = require('./uploadManage');

class IpcMainProcess {
  constructor(ipc) {
    this.ipc = ipc;
    this.sessionController = new SessionManage(this.ipc);
    this.settingModel = settingManage(this.ipc, this.sessionController);
    this.uploadModel = uploadManage(this.ipc);
    this.ipc.on('notify-send', function(event, args) {
      this.notifySend(args);
    });
  }

  // 桌面通知发送 //
  notifySend(args = {}) {
    const iconAddr = args.icon || 'resources/icon.png';
    notifySend({
      delay: args.delay || 0,
      title: args.title || 'electron',
      body: args.body || 'electron notification',
      icon: path.join(__dirname, '../../../', iconAddr),
    });
  }
}

// 未捕获的全局错误 //
process.on('uncaughtException', (err) => {
  console.error('<---------------');

  const errorInfo = err.stack.toString();
  console.log(errorInfo);
  const errorFile = path.join(__dirname, '../../', 'runtime/error.log');
  fs.writeFile(errorFile, errorInfo, { encoding: 'utf8', flag: 'w' }, (_err) => {
    if (_err) console.log(_err);
  });

  console.error('--------------->');
});

module.exports = IpcMainProcess;
