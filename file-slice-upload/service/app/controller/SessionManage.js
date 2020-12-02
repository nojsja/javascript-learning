const { app } = require('electron');
const path = require('path');
const { isRequestNotExpired } = require(path.join(app.getAppPath(), 'app/utils/utils'));
const session = require('../services/main/session');

class SessionManage {
  constructor(ipc) {
    this.ipc = ipc;
    this.session = session(this.ipc, this);
  }

  /**
    * func [desc]
    * @param  {[Object]} res [server response]
    */
  _isRequestNotExpired(res, action, params) {
    if (isRequestNotExpired(res)) {
      return res;
    } else {
      console.log(res, action, params);
      global.ipcMainWindow.sendToWeb('shell', { action: 'logout' });
      return res;
      // return {
      //   code: 300,
      //   result: global.lang.public.access_deny,
      // };
    }
  }
}

module.exports = SessionManage;