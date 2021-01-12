/* -------------------------------------------------------
  description:
  实现一个批量请求函数 multiAjaxRequest(urls, maxNum)，要求如下：
• 要求最大并发数 maxNum
• 每当有一个请求返回，就留下一个空位，可以增加新的请求
• 所有请求完成后，结果按照 urls 里面的顺序依次打出
------------------------------------------------------- */

/**
  * multiAjaxRequest [批量并发异步请求]
  * @author nojsja
  * @param  {[Array]} urls [所有待请求接口地址]
  * @param  {[Array]} maxNum [最大并发数量]
  */
function multiAjaxRequest(urls=[], maxNum=0) {
  const length = urls.length;
  const result = new Array(length).fill(false);
  let index = 0;

  function sendRequest(url) {
    console.log('send');
    const ajax = new XMLHttpRequest();
    ajax.open('POST', url, true);
    ajax.send();
    return new Promise((resolve, reject) => {
      ajax.onreadystatechange((ev) => {
        if (ajax.readyState === 4) {
          if (ajax.status === 200) {
            resolve({
              code: 200,
              result: ajax.responseText
            });
          } else {
            resolve({
              code: ajax.status,
              result: ajax.responseText
            });
          }
        }
      });
    })
  }

  return new Promise((resolve, reject) => {

    function next() {
      const current = index++;
      const url = urls[current];
      console.log(current);
      
      sendRequest(url)
      .then(res => {
        result[current] = res.code === 200 ? res.result : false;
        if (current >= length - 1) {
          if (urls.includes(false)) return reject(result);
          resolve(result);
        } else {
          next();
        }
      })
    }
  
    while(index < maxNum) {
      next();
    }
  });

}

multiAjaxRequest(new Array(10).fill(Math.random().toString(10).slice(5)), 2).then(rsp => {
  console.log('resolve', rsp);
}).catch(rsp => {
  console.log('reject', rsp);
});