const SessionModel = require('../../model/Session');

function session(ipc, session) {
  const sessionModel = new SessionModel();
  ipc.handle('session', async function(event = {}, args = {}) {
    const { action, params } = args;
    const result = await sessionModel[action](params).catch((error) => {
      console.error(error);
    });
    return session._isRequestNotExpired(result);
  }); 
  return sessionModel;
}

module.exports = session;