import axios from 'axios';
import openNotification from 'app/utils/openNotification';
import getContentType from 'app/utils/getContentType';
import { getFormData, getURLSearchParams } from 'app/utils/utils';

const { href } = window.location;
const store = {
  token: 'user_token',
};

const serviceUrl = 'http://10.0.6.204:3000';

const originHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const XHR = axios.create({
  baseURl: '',
  timeout: 30e3,
  headers: originHeaders,
  // withCredentials: true,
  validateStatus(status) {
    return status >= 200 && status < 300; // default
  },
});

XHR.interceptors.request.use((request) => {
  if (store.token === 'user') {
    request.headers['X-Token'] = store.token;
  }
  return request;
}, (error) => {
  console.log('error', error.code);
  Promise.reject(error);
});

/*
  params, api, solve, _data
 */
export function postDataPro(...argument) {
  let [params, api, solve, _data] = argument;

  if (argument.length === 3 && api.bodyType === 'form-data') {
    _data = solve;
  }
  const data = api.bodyType === 'form-data' ? getFormData(_data) : params;
  const url = api.paramType === 'query' ? `${`${serviceUrl}${api.url}`}${getURLSearchParams(params)}` : `${serviceUrl}${api.url}`;
  const headers = api.bodyType === 'form-data' ? getContentType('form') : {};
  const method = api.method || 'post';
  return new Promise((resolve, reject) => {
    XHR({
      url,
      method,
      data,
      headers: { ...originHeaders, ...headers },
    }).then((response) => {
      if (response.data.code === 200) {
        resolve(response.data);
      } else if (solve) {
        resolve(response.data);
      } else {
        if (response.data.message) {
          openNotification('error', null, response.data.message, api.desc);
        } else {
          openNotification('error', response.data.code, null, api.desc);
        }
        reject();
      }
    }).catch((error) => {
      openNotification('error', error.code, null, api.desc);
    });
  });
}

export default {};
