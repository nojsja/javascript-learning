// const Promise = require('./promise');

/* predefined lib func */

/* 并行构造Promise请求 -> 使用Promise.all */
const requestPromiseParallel = (infoArray, result) => {
  const array = infoArray instanceof Array ? infoArray : [infoArray];
  const promises = array.map((info) => {
    const { param, req, api, requestFunc } = info;
    return requestFunc(param, api, {...req, ...(req.headers || {})});
  });
  return Promise.all(promises);
};

/* 混合构造Promise请求 -> 使用Promise.all 和 Promise.then */
const requestPromiseOrder = (infoArray) => {
  const array = infoArray instanceof Array ? infoArray : [infoArray];
  let promise, resultArray = [];
  const localErrorFunc = (errorFunc) => {
    return (error) => {
      resultArray.push(error);
      errorFunc(error);
    }
  };
  const resultPushFunc = (res) => {
    if (res instanceof Array) return resultArray.push(...res);
    resultArray.push(res);
  };

  array.forEach((info) => {
    const { param, req, api, requestFunc, errorFunc } = info;
    if (info instanceof Array) {
      if (!promise) {
        promise = requestPromiseParallel(info).then(
          resultPushFunc,
          resultPushFunc);
        return;
      }
      promise = promise.then(
        () => requestPromiseParallel(info),
        localErrorFunc(errorFunc)
      ).then(
        resultPushFunc,
        resultPushFunc);
      return;
    }
    if (!promise) {
      promise = requestFunc(param, api, {...req, ...(req.headers || {})}).then(
        resultPushFunc,
        resultPushFunc);
      return;
    }
    promise = promise.then(
      () => requestFunc(param, api, {...req, ...(req.headers || {})}),
      localErrorFunc(errorFunc)
    ).then(
      resultPushFunc,
      resultPushFunc)
    });

  return promise.then(() => resultArray);
};

/* user define func */
let i = 0;
function request(param, api, req) {
  return new Promise((resolve, reject) => {
    i++;
    setTimeout(() => {
      console.log(param);
      if (i === 3) {
        reject('error>'+param)
      };
      resolve(param);
    }, 1e3);
  })
};

function error(error) {
  console.error('error => ', error);
}

/* test func */

// 参数跟平常使用commonRequest时一样，这边测试使用模拟参数
const testParams =
  [ 
    // 按顺序发送请求 //
    // 顺序1
    { param: '1', req: {headers: {k: 'h'}}, api: '3', requestFunc: request, errorFunc: error },
    // 顺序2
    { param: '1-1', req: {headers: {k: 'h'}}, api: '3-1', requestFunc: request, errorFunc: error },
    // 顺序3
    { param: '1-2', req: {headers: {k: 'h'}}, api: '3-2', requestFunc: request, errorFunc: error },
    // 顺序4
    { param: '1-3', req: {headers: {k: 'h'}}, api: '3-3', requestFunc: request, errorFunc: error },
    // 顺序5
    [
      // 并行发送请求 //
      { param: '1-4', req: {headers: {k: 'h'}}, api: '3-4', requestFunc: request, errorFunc: error },
      { param: '1-5', req: {headers: {k: 'h'}}, api: '3-5', requestFunc: request, errorFunc: error },
    ],
    // 顺序6
    { param: '1-6', req: {headers: {k: 'h'}}, api: '3-6', requestFunc: request, errorFunc: error },
  ];

requestPromiseOrder(testParams).then(res => {
  // 按顺序拿到结果
  console.log('result=> ', res);
});
