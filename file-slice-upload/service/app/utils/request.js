const axios = require('axios');
const qs = require('qs');
const { templateStrTransform } = require('./utils');

const XHR = axios.create({
  // baseURl: '',
  timeout: 180e3,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  validateStatus(status) {
    return status >= 200 && status < 300; // default
  },
});

XHR.interceptors.request.use(request => request, error => error);

const ipRequest = (data, api, reqHeaders) => {
  const url = `http://${data._ip}:${api.port}${templateStrTransform(data, api.url)}`;
  const lang = ipcMainProcess.sessionController.session.getLang();
  const accessToken = api.access_token || ipcMainProcess.sessionController.session.getAccessToken({ host: data._ip });

  delete data._ip;

  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: {
          ...{ cookie: '' },
          ...({ 'access-token': accessToken }),
          lang,
          LANG: lang,
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        };
        resolve(obj);
      });
    });
  }
  return new Promise((resolve, reject) => {
    XHR({
      url,
      method: api.method,
      data,
      headers: {
        ...{ cookie: '' },
        ...{ 'access-token': accessToken },
        lang,
        LANG: lang,
      },
    }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      const obj = {
        code: error.code,
        config: error.config,
      };
      resolve(obj);
    });
  });
};


const ipRequestEncoded = (data, api) => {
  const url = `http://${data._ip}:${api.port}${templateStrTransform(data, api.url)}`;
  const lang = ipcMainProcess.sessionController.session.getLang();
  const accessToken = api.access_token || ipcMainProcess.sessionController.session.getAccessToken({ host: data._ip });

  delete data._ip;

  if (api.method === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: data,
        headers: {
          ...{ cookie: '' },
          ...({ 'access-token': accessToken }),
          lang,
          LANG: lang,
        },
      }).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        const obj = {
          code: error.code,
          config: error.config,
        };
        resolve(obj);
      });
    });
  }
  return new Promise((resolve, reject) => {
    XHR({
      url,
      method: api.method,
      data: qs.stringify(data),
      headers: {
        ...{
          cookie: '',
          'content-type': 'application/x-www-form-urlencoded',
        },
        ...{ 'access-token': accessToken },
        lang,
        LANG: lang,
      },
    }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      const obj = {
        code: error.code,
        config: error.config,
      };
      resolve(obj);
    });
  });
};

exports.ipRequest = ipRequest;
exports.ipRequestEncoded = ipRequestEncoded;
