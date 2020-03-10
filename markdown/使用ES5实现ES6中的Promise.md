![life is strange](./resources/lifeIsStrange.jpg)

### 使用ES5手动实现ES6中的Promise API
>Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。
它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像
同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象。  

>pending 状态的 Promise 对象可能触发fulfilled 状态并传递一个值给相应的状态处理方法，
也可能触发失败状态（rejected）并传递失败信息。当其中任一种情况出现时，Promise 对象的
then 方法绑定的处理方法（handlers ）就会被调用（then方法包含两个参数：onfulfilled
和 onrejected，它们都是 Function 类型。当Promise状态为fulfilled时，调用 then 的
onfulfilled 方法，当Promise状态为rejected时，调用 then 的 onrejected 方法，
所以在异步操作的完成和绑定处理方法之间不存在竞争）。  

[源代码 => github / nojsja / promise-self](https://github.com/NoJsJa/promise-nojsja)

#### 谈谈Promise
---------------

##### 一个 Promise有以下几种状态
 * pending: 初始状态，不是成功或失败状态。  
 * fulfilled: 意味着操作成功完成。  
 * rejected: 意味着操作失败。  

##### Javascript事件循环
关于js线程和事件循环可以看[这篇文章](https://zhuanlan.zhihu.com/p/33058983)
 * 创建Promise时传入的函数的执行应该延迟到下一次事件循环中，而不应该在主线程执行栈中被调用。
 * Promise.then传入的onResolve, onReject函数的执行也应该延迟到下一次事件循环。  

具体表现可以看下一段代码，即使是promise对象中没有异步操作，控制台也会先打印b再打印a：
```js
var p1 = new Promise(function (resolve, reject) {
  resolve('a');
}).then(function (value) {
  console.log(value);
});

console.log('b');

// result => b a

```

##### Promise.all(iterable)
这个方法返回一个新的promise对象，该promise对象当iterable参数对象里所有的promise对象
都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise
对象的失败。这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值
的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败
状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。Promise.all方法常被用于处理多个promise对象的状态集合。

#### Promise.race(iterable)
当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回
值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。  

#### Promise.reject(value) / Promise.resolve(value)
返回一个状态为失败(成功)的Promise对象，并将给定的失败(成功)信息传递给对应的处理方法。
如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；
否则的话(该value为空，基本类型或者不带then方法的对象)，返回的Promise对象状态为fulfilled，
并且将该value传递给对应的then方法。通常而言，如果你不知道一个值是否是Promise对象，
使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用。

#### Promise分析和实现
--------------------

##### 实现难点分析
在思考实现原理的时候，Promise.then这个方法花了我最长的时间，一个Promise对象可以使用then方法接收一个成功的回调函数和一个错误的回调函数，哪个回调函数的最终被执行取决于当前Promise对象的最终状态，可以使用promise.then(fn1, fn2).then(fn3, fn4).then(fn5, fn6)这种链式回调连接无数个异步方法。如果前一个then方法中的 success callback 或 fail callback 也返回了一个Promise对象的话，那么当前Promise对象的状态最终还是要取决于返回的这个Promise对象，就像发生了状态之间的传递一样。并且在这样的条件下，各个then方法链接的函数仍然能保持顺序依次执行。

##### 难点分析和解决
通过以上对then方法的分析，我们可以看出，promise.then方法的状态都是独立的，promise.then的回调方法中可以再次返回一个Promise对象，我们姑且把这一过程称为父Promise和子Promise的状态传递和继承，所以在设计then方法时应当考虑then方法返回的其实应该是一个具有独立状态的Promise对象，只不过该Promise对象的状态还需要看then方法传入的两个回调函数是不是返回了另一个Promise对象，如果返回了，那么就要发生状态传递。我们可以用设计模式中观察者模式的思想来定义一个Promise对象，Promise对象可以有三种状态，成功和失败状态的变化会触发各自对应的观察者函数事件，所以每一个Promise.then方法其实就是在对一个Promise对象做状态事件注册，事件注册和状态改变这两个操作是相互独立的。那么如何把当前父Promise的对象状态和then函数中返回的Promise对象的状态联系起来呢？这个逻辑就是下面代码中的`analysisPromise`方法，它的作用就是分析一个回调的返回值，将当前Promise对象状态改变的方法`reject`和`resolve`递归传递下去，各个不同的调用栈对应各个不同的执行上下文，但是目的只有一个就是改变最初传入的那个Promise对象的状态。

* promise.then的设计
```js
/**
 * [then 应该返回一个全新的Promise对象，不应该与当前Promise存在功能耦合]
 * @param  {[type]} successFn [description]
 * @param  {[type]} errorFn   [description]
 */
Promise.prototype.then = function (successCallback, errorCallback) {

  var promise, x;
  var self = this;

  if (self.status === 'fulfilled') {
    promise = new Promise(function (resolve, reject) {
      // delay to next event loop
      setTimeout(function () {
        try {
          x = successCallback(self.value);
          analysisPromise(x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }else if (self.status === 'rejected') {
    promise = new Promise(function (resolve, reject) {
      // delay to next event loop
      setTimeout(function () {
        try {
          x = errorCallback(self.reason);
          analysisPromise(x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });

    });
  }else if (self.status === 'pending') {
    promise = new Promise(function (resolve, reject) {

      // 延迟到下一个事件循环
      setTimeout(function () {
        self.onFulfilledCallbacks.push(function () {
          try {
            x = successCallback(self.value);
            // 分析返回值 然后更改 当前promise状态
            analysisPromise(x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });

        self.onRejectedCallbacks.push(function () {
          try {
            x = errorCallback ? errorCallback(self.reason) : undefined;
            // 分析返回值 然后更改 当前promise状态
            analysisPromise(x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      })
    });

  }

  return promise;
};
```
* analysisPromise方法的设计
```js
/**
 * [analysisPromise 使用递归将状态控制权转移]
 * @param  {[Any]} x        [value]
 * @param  {[Func]} resolve [get into success state]
 * @param  {[Func]} reject  [get into fail state]
 */
var analysisPromise = function (x, resolve, reject) {

  var then, y;
  if (x !== undefined && (typeof x === 'object' || typeof x === 'function')) {
    then = x.then;
    // obj Promise
    if (then && typeof then === 'function') {
      then.call(x, function (value) {
        // callback return a promise
        analysisPromise(value, resolve, reject);
      }, function (error) {
        reject(error);
      });
    // normal
    }else {
      resolve(x);
    }
  // normal
  }else {
    resolve(x);
  }
};
```

##### 其它部分的实现
* catch方法  
这边只是简单的捕获了一下错误然后调用回调函数即可。
```js
Promise.prototype.catch = function (handleError) {
  if (this.status === 'pending') {
    this.onRejectedCallbacks.push(handleError);
  }else {
    this.reason && handleError(this.reason);
  }
};
```

* all方法  
all方法首先判断可以通过promise.all([promise]).then这种形式调用，那么all也应该返回一个Promise对象，这个对象的成功状态取决于传入的各个promise的成功状态，失败状态只取决于其中一个传入的最先失败的的promise，所以应该遍历和分析所有传入的promise的状态情况，和设计then方法的时候一样需要考虑状态传递的问题，将各个promise产生的计算值存入一个数组，一旦有promise失败，马上返回失败信息，结束整个promise对象的状态监听。
```js
Promise.all = function (pArray) {
  var rArray = [];
  var promise = new Promise(function (resolve, reject) {

    pArray.forEach(function (pr, i) {

        if (pr instanceof Promise) {
          pr.then(function (value1) {
            analysisPromise(value1, function (value2) {
              rArray[i] = value2;
              if (rArray.length === pArray.length) {
                resolve(rArray);
              }
            }, reject);

          }, function (error) {
            reject(error);
          });

        }else {
          rArray[i] = pr;
          if (rArray.length === pArray.length) {
            resolve(rArray);
          }
        }

    });

  });

  return promise;
};
```

* race方法  
race方法就更简单了，考虑状态的传递之后，传入的任意一个promise的状态改变都会直接表现为整个promise对象的状态最终值。all方法和race方法，前者是状态协同，后者状态竞争。
```js
Promise.race = function (pArray) {
  var rArray = [];
  var promise = new Promise(function (resolve, reject) {
    pArray.forEach(function (pr, i) {
        if (pr instanceof Promise) {
          pr.then(function (value) {
            analysisPromise(value, resolve, reject);
          }, function (error) {
            reject(error);
          });
        }else {
          rArray[i] = pr;
        }
    });
  });

  return promise;
};
```

* 静态方法 Promise.resolve 和 Promise.reject
直接返回一个最终态为成功或失败的promise对象即可。
```js
Promise.resolve = function (value) {
  return new Promise(function (resolve, reject) {
      resolve(value);
  });
};
Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
      reject(reason);
  });
};
```

#### 总结
--------
Promise实现的难点其实是怎样考虑那个状态传递的过程(`analysisPromise`方法的实现)，各种回调的设计容易让人混乱，需要考虑各个promise对象的`原子性`同时又要保持各个可能出现相互嵌套的promise对象之间的依赖和联系。如果结构设计地比较合理的话，`Promise.all`、`Promise.race`这两个方法是很容易被实现出来的，因为它们只是对多个promise对象的状态管理而已。
