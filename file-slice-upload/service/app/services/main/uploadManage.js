const UploadModel = require('../../model/Upload');

function uploadManage(ipc) {
  const uploadModel = new UploadModel();
  ipc.handle('upload', async function(event = {}, args = {}) {
    const { action, params } = args;
    const result = await uploadModel[action](params).catch((error) => {
      console.error(error);
    });
    return (result);
  }); 
  return uploadModel;
}

module.exports = uploadManage;