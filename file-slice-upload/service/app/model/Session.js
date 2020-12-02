const DataSet = require('./DataSet');
const sessionSchema = require('./schema/session.schema');
const requireLang = require('../lang');
const api = require('../utils/api.js');
const { ipRequestEncoded, ipRequest } = require('../utils/request');

class Session extends DataSet {
  constructor() {
    super('session', sessionSchema);
    this.session = {
      access_token: {
        // [user]: {
        //   [host]: ''
        // }
      },
      setting: {

      },
    };
  }

  getLang = () => {
    const { lang } = this.session.setting.lang
      ? this.session.setting
      : global.ipcMainProcess.settingModel.getSettingSync();

    if (!this.session.setting.lang) {
      this.session.setting.lang = lang;
    }
    return lang;
  }

  setLang = ({ lang }) => {
    this.session.setting.lang = lang;
    requireLang(lang);
    return global.ipcMainProcess.settingModel.changeSetting({ lang });
  }

  /**
    * getDefaultNode [获取当前默认节点]
    * @param  {[String]} key [获取某个key值]
    */
  getState(key) {
    return Promise.resolve({
      code: 200,
      data: key ? this.session[key] : this.session,
    });
  }

  setState(state = {}) {
    this.session = { ...this.session, ...state };
    return Promise.resolve({
      code: 200,
      data: state,
    });
  }

  getAccessToken({ host }) {
    const user = ipcMainProcess.userModel.get('last.username');
    return this.session.access_token[user] ? (this.session.access_token[user][host] || '') : '';
  }

  setAccessToken({ host, access_token }) {
    const user = ipcMainProcess.userModel.get('last.username');
    if (!this.session.access_token[user]) {
      this.session.access_token[user] = {
        [host]: access_token,
      };
    } else {
      this.session.access_token[user][host] = access_token;
    }
  }

  userLogout() {
    ipcMainProcess.ipc.send('session', {
      action: 'logout',
    });
  }
}

module.exports = Session;
