const SettingModel = require('../../model/Setting');

function settingManage(ipc, session) {
  const settingModel = new SettingModel();
  ipc.handle('setting', async function(event = {}, args = {}) {
    const { action, params } = args;
    const result = await settingModel[action](params).catch((error) => {
      console.error(error);
    });
    return session._isRequestNotExpired(result);
  }); 
  return settingModel;
}

module.exports = settingManage;