const { app } = require('electron');
const DataSet = require('./DataSet');
const settingSchema = require('./schema/setting.schema');
const api = require('../utils/api.js');
const { ipRequestEncoded, ipRequest } = require('../utils/request');

class Setting extends DataSet {
  constructor() {
    super('setting', settingSchema);
  }

  getSettingSync() {
    const settings = this.getState();
    settings.lang = settings.lang || app.getLocale();
    return settings;
  }

  getSetting() {
    return new Promise((resolve, reject) => {
      const settings = this.getState();
      settings.lang = settings.lang || app.getLocale();
      resolve({
        code: 200,
        result: settings
      });
    });
  }

  changeSetting(settings) {
    return new Promise((resolve, reject) => {
      const origin = this.getState();
      this.setState({ ...origin, ...settings }).then((result) => {
        resolve({
          code: 200,
          result
        });
      }, (err) => {
        resolve({
          code: 600,
          result: err.toString()
        });
      });
    })
  }
}

module.exports = Setting;