/* -----------------------------------------------------------------------------
  责任链模式:
  使多个对象有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，
  并沿着这条链传递请求，直到有一个对象处理请求为止。责任链模式最大的优点: 请求发送者只需要直到
  链中的第一个节点，从而弱化了发送者和一组接受者之间的联系。
----------------------------------------------------------------------------- */


/* ************************* 基于JavaScript函数式特性改造原型 ************************* */
{
  console.log('-------- 基于JavaScript函数式特性改造原型 --------');
  Function.prototype.after = function (fn) {
    var that = this;

    return function () {
      var rs = that.apply(this, arguments);
      if (rs === 'nextProcessor') {
        return fn.apply(this, arguments)
      }
      return rs;
    };
  };


  let test1 = function () {
    console.log('t1');
    return 'nextProcessor';
  }

  let test2 = function () {
    console.log('t2');
    return 'nextProcessor';
  }

  test3 = function () {
    console.log('t3');
  }

  // 运行时绑定
  var test = test1.after(test2).after(test3);
  test();

}


/* ************************* 异步的责任链类 ************************* */
{
  console.log('-------- 异步责任链 --------');
  var Chain = function (fn) {
    this.processor = fn;
    this.successor = null;
    this.callback = null;
  };

  Chain.prototype.next = function (data) {
    this.callback && this.callback(data);
    return this.successor && this.successor.passRequest(data);
  };

  Chain.prototype.setSuccessor = function (chainObject) {
    return this.successor = chainObject;
  };

  Chain.prototype.passRequest = function () {
    if (!this.processor) return;

    var args = [this.next.bind(this)];

    this.processor.apply(this, args);
  };

  /**
   * [all 模仿Promise.all]
   * @param  { Array }   chainArray [所有异步请求]
   * @param  { Function } callback   [回调函数]
   */
  Chain.all = function (chainArray, callback) {
    var length = 0;
    var _sort = [];

    var checkFlag = function () {
      length++;
      if (length === chainArray.length) {
        callback.apply(null, _sort);
      }
    };

    chainArray.map(function (chain, index) {
      chain.callback = function (data) {
        _sort[index] = data;
        checkFlag();
      };
      chain.passRequest();
    });
  };

  /**
   * [race 模仿Promise.race]
   * @param  { Array }   chainArray [所有异步请求]
   * @param  { Function } callback   [回调函数]
   */
  Chain.race = function (chainArray, callback) {
    var isDone = false;
    chainArray.map(function (chain, index) {
      chain.callback = function (data) {
        if (!isDone) {
          isDone = !isDone;
          callback(data);
        }
      };
      chain.passRequest();
    });
  }

  /* ------------------- test ------------------- */

  let test1 = function (next) {
    console.log('test1');
    next && next('test1');
  };

  let test2 = function (next) {
    console.log('test2');
    setTimeout(function (){
      next && next('test2');
    }, 1000);
  };

  let test3 = function (next) {
    console.log('test3');
    next && next('test3');
  };

  let test = new Chain(test1);
  test.setSuccessor(new Chain(test2)).setSuccessor(new Chain(test3));
  test.passRequest();

  Chain.all([new Chain(test1), new Chain(test2), new Chain(test3)], function (t1, t2, t3) {
    console.log(arguments);
  });

}
