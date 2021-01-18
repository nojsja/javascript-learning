### __Learn to shape a thinking of the design-patterns__  
#### The Strategy Pattern(策略模式)
>策略模式 -- 定义一系列算法封装，讲算法的使用和算法的实现分离出来，并切使它们可以相互替换  

一个基于策略模式的程序至少由两部分组成。第一部分是策略类(Strategy)，它负责具体的算法，负责具体的计算过程；第二部分是环境类(Context)，环境类接受客户的一个请求，并把请求委托给一个策略类。所有Context类中会维持某个对象的引用。

```js
/**
 * 策略模式 -- 表单提交验证
 */


/**
 * 策略对象 strategies
 * isNonEmpty 验证是否为空
 * minLength 验证是否超过长度
 * isMobile 验证是否是手机号
 * isEmail 验证是否是邮箱
 */
var Strategies = {
        isNonEmpty: function(value, errorMsg) {
            return value === '' ?
                errorMsg : false;
        },
        minLength: function(value, length, errorMsg) {
            return value.length < length ?
                errorMsg : false;
        },
        isMobile: function(value, errorMsg) {
            return !/^1(3|5|7|8|9)[0-9]{9}$/.test(value) ?
                errorMsg : false;
        },
        isEmail: function(value, errorMsg) {
            return !/^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ?
                errorMsg : false;
        }
};

/**
 * Validator类
 */
function Validator(){
    this.cache = [];
}

// 对象方法 添加一条验证
Validator.prototype.add = function(dom, rules) {
    var that = this;
    for (var i = 0; i < rules.length; i++) {
            (function(i){
                var strategyAry = rule[i].strategy.split(':'); //例如['minLength',6]
                var errorMsg = rule[i].errorMsg; //'用户名不能为空'

                // 把所有方法缓存起来统一调用
                that.cache.push(function(){
                    var strategy = strategyAry.shift() //用户挑选的strategy
                    strategyAry.unshift(dom.value) //把input的value添加进参数列表
                    strategyAry.push(errorMsg) //把errorMsg添加进参数列表，[dom.value,6,errorMsg]
                    return strategies[strategy].apply(dom, strategyAry)
                });
            })(i);
    }
};

// 对象方法 开始所有验证
Validator.prototype.start = function(){
    for (var i = 0; i < this.cache.length; i++) {
        var validatorFunc = this.cache[i];
        var errorMsg = validatorFunc()  //开始校验，并取得校验后的返回信息
        if (errorMsg) {  //如果有确切返回值，说明校验没有通过
            return errorMsg;
        }

    }
};

/**
 * 客户端调用代码
 */
/*客户端调用代码*/
var registerForm = document.querySelector('#registerForm');
var validatorFunc = function () {
    var validator = new Validator();

    validator.add(registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空！'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于6位！'
    }]);

    validator.add(registerForm.passWord, [{
        strategy: 'isNonEmpty',
        errorMsg: '密码不能为空！'
    }, {
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于6位！'
    }]);

    validator.add(registerForm.phoneNumber, [{
        strategy: 'isNonEmpty',
        errorMsg: '手机号码不能为空！'
    }, {
        strategy: 'isMoblie',
        errorMsg: '手机号码格式不正确！'
    }]);

    validator.add(registerForm.emailAddress, [{
        strategy: 'isNonEmpty',
        errorMsg: '邮箱地址不能为空！'
    }, {
        strategy: 'isEmail',
        errorMsg: '邮箱地址格式不正确！'
    }]);
    let errorMsg = validator.start();
    return errorMsg;
};

// 检查触发代码
registerForm.addEventListener('submit', function() {
    let errorMsg = validatorFunc();
    if (errorMsg) {
        alert(errorMsg)
        return false;
    }
}, false);

```

#### The Observer Pattern(观察者模式)
>观察者模式 -- 定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知  

在JavaScript中观察者模式是用事件模型来实现的，观察者模式广泛应用于异步编程中，这是一种替代传统回调函数的解决方案，比如我们可以订阅ajax请求的error，success事件。使用观察者模式，我们就无需关注对象在异步运行期间的状态，而只需要订阅感兴趣的事件发生点。  
使用观察者模式可以取代对象之间硬编码的通知机制，一个对象不再显式调用另一个对象的接口，对象之间松散耦合，只要维持之间约定的事件名，发布者和订阅者的内部改变就完全是独立、互不影响的。  

```js
/* -----------------------------------------------------------------------------
  观察者模式：
  1. 全局的观察者模式对象，所有事件的订阅、触发、移除都由这个全局对象处理，适用于需要创建大量
  观察者对象。
  2. 构建观察者模式类，使用时可以实例化一个观察者对象，适用于需要创建少量的观察者对象。
----------------------------------------------------------------------------- */

function EventEmitter() {
  this.maxListeners = 100;
  this.listeners = {};
  this.onceMap = {};
}

EventEmitter.prototype.setMaxListeners = function(num) {
  if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0)
    throw new Error('setMaxListeners #### param num must be a positive integer!');
  this.maxListeners = num;
}

EventEmitter.prototype.on = function(type, func) {
  if (!type || !func instanceof Function) return;
  if (this.listeners[type]) {
    if (this.listeners[type].length > this.maxListeners) 
      return console.error('The max listeners limitation: ', this.maxListeners);
    this.listeners[type].push(func);
  } else {
    this.listeners[type] = [func];
  }
  this.onceMap[type] = false;
}

EventEmitter.prototype.once = function(type, func) {
  if (!type || !func instanceof Function) return;
  this.on(type, func);
  this.onceMap[type] = true;
}

EventEmitter.prototype.off = function(type, func) {
  if (!type || !func) return;
  if (this.listeners[type]) {
    this.listeners[type] =
      this.listeners[type].filter(function(fn) { return fn !== func; });
  }
}

EventEmitter.prototype.emit = function(type) {
  (this.listeners[type] || []).forEach(function(fn) {
    fn();
  });
  if (this.onceMap[type]) delete this.listeners[type];
  delete this.onceMap[type];
}

```

#### The Flyweight Pattern(享元模式)
>享元模式 -- 运用共享技术来有效支持大量细粒度的对象  

一种用于性能优化的模式，_fly_ 是 _苍蝇_ 的意思，意为蝇量级,如果系统中因为很常见了大量类似的对象而导致内存占用过高，享元模式就非常有用了。  
假如有一个内衣工厂，生产了50种男款内衣和50女款内衣，每种内衣需要模特人穿上照相，一般的处理就会需要50+50个模特，如果提炼出相似点的话就只需要2个模特，男模特和女模特。  
享元模式要求将对象的属性划分为内部状态和外部状态，目的是为了尽量减少共享对象的数量。内部状态存储于对象内部，可以被一些对象共享，它独立与具体的场景，通常不会改变；外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。最终内部状态相同的对象都指定为同一个共享对象，而外部对象可以从对象身上剥离开来存储在外部。  

未使用享元模式前需要创建很多对象：
```js
  var Upload = function (uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom = null;
  };

  Upload.prototype.init = function (id) {
    var that = this;
    this.id = id;
    this.dom = document.createElement('div');
    this.dom.innerHTML =
      '<span>文件名称：' + this.fileName + ', 文件大小：' + this.fileSize + '</span>' +
      '<button class="delFile">删除</button>';
    this.dom.querySelector('.delFile').onclick = function () {
      that.delFile();
    };
    document.appendChild( this.dom );
  };

  Upload.prototype.delFile = function () {
    if(this.fileSize < 3000){
      return this.dom.parentNode.removeChild(this.dom);
    }

    if (window.confirm('确定删除这个文件吗？'+this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  }

  // 创建文件上传对象
  var id = 0;
  window.startUpload = function ( uploadType, files) {
    for (var i = 0, file; i < files.length, file = files[i]; i++) {
      var uploadObj = new Upload( uploadType, file.fileName, file.fileSize );
      uploadObj.init(id++);
    }
  };
```

使用享元模式后：
```js
  // 构造函数
  var Upload = function (uploadType) {
    this.uploadType = uploadType;
  }

  // init方法不再需要
  Upload.prototype.delFile = function (id) {
    // 结合外部状态
    uploadManager.setExternalState( id, this );

    if(this.fileSize < 3000){
      return this.dom.parentNode.removeChild(this.dom);
    }

    if (window.confirm('确定删除这个文件吗？'+this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  };

  // 工厂进行对象实例化
  var UploadFactory = (function () {
    var createdFlyweightObjs = {};

    return {
      create: function ( uploadType ) {
        if( createdFlyweightObjs[ uploadType ] ){
          return createdFlyweightObjs[ uploadType ];
        }

        return createdFlyweightObjs[ uploadType ] = new Upload( uploadType );
      }
    };
  })();

  // 管理器封装外部状态
  var uploadManager = (function () {
    var uploadDatabase = {};

    return {
      // 添加一个共享对象
      add: function ( id, uploadType, fileName, fileSize ) {
        var flyweightObj = UploadFactory.create( uploadType );

        var dom = document.createElement('div');
        dom.innerHTML =
          '<span>文件名称：' + fileName + ', 文件大小：' + fileSize + '</span>' +
          '<button class="delFile">删除</button>';
        dom.querySelector('.delFile').onclick = function () {
          flyweightObj.delFile(id);
        };

        document.body.appendChild(dom);
        uploadDatabase[id] = {
          fileName: fileName,
          fileSize: fileSize,
          dom: dom
        };

        return flyweightObj;
      },
      // 共享对象需要用到外部主状态的时候执行组装
      setExternalState: function (id, flyweightObj) {
        var uploadData = uploadDatabase[id];
        for(var attr in uploadData){
          flyweightObj[attr] = uploadData[attr];
        }
      }
    }
  })();

  // 文件上传操作
  var id = 0;
  window.startUpload = function ( uploadType, files ) {
    for (var i = 0, file; i < files.length, file = files[i]; i++) {
      var uploadObj = uploadManager.add(id++, uploadType, file.fileName, file.fileSize);
    }
  }
```

#### The Decorator pattern(装饰者模式)
>装饰者模式 -- 动态地为某个对象添加一些额外的职责  

1. 在程序开发中我们许多时候都不希望某个类天生就非常庞大，一次性地包含许多职责，那个我们就可以使用装饰者模式，动态地为某个对象添加一些额外的职责，而不会影响从这个类派生的其它对象。  
传统面向对象语言中需要将要包装的操作封装成类，每个类的构造函数都接受一个被包装对象，被包装对象以一条链的方式进行引用，形成一个聚合对象。这些对象都拥有相同的接口，当请求达到链中的某个对象时，这个对象会执行自身的操作，随后把请求转发给链中的下一个对象。  

2. 代理模式和装饰者模式区别：
装饰者模式和代理模式有一定的相似性，最重要的区别在于他们的意图和设计目的。代理模式的目的是当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者，本体定义了关键的功能代理模式体现一种代理和本体之间的关系，这种关系是静态的，已经被预先确定，而装饰者模式使用于一开始不确定对象的全部功能，以黑盒似的将对象的功能表达做层层包裹，所以如果层次太多，会对性能造成影响。

面向对象语言的装饰者：
```js
  var Plane = function () {};
  Plane.prototype.fire = function () {
    console.log('发射普通子弹');
  };

  // 发射导弹装饰类
  var MissileDecorator = function (plane) {
    this.plane = plane;
  };
  MissileDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射导弹');
  };

  // 发射原子弹装饰类
  var AtomDecorator = function (plane) {
    this.plane = plane;
  };
  AtomDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射原子弹');
  };
```

基于原型模式的装饰者侵入式改造：
```js
  // 函数执行前
  Function.prototype.before = function (beforeFn) {
    // 保存对原始函数的引用
    var _self = this;

    return function () {
      // 里层this是调用function时的执行环境
      beforeFn.apply(this, arguments);
      _self.apply(this, arguments);
    };
  };

  // 函数执行后
  Function.prototype.after = function (afterFn) {
    // 保存对原始函数的引用
    var _self = this;

    return function () {
      // 里层this是调用function时的执行环境
      afterFn.apply(this, arguments);
      _self.apply(this, arguments);
    };
  };

  // 使用方式
  document.getElementById = document.getElementById.before(function () {
    console.log('正在执行getElementById');
  });
  var button = document.getElementById('buttonId');
```

#### The Proxy pattern(代理模式)
>代理模式 -- 代理模式是为一个对象提供一个待用品或占位符，使用替身对象预处理移交给主对象的请求，以控制对对象的访问  

1. 代理模式是一种非常有意义的模式，生活中有很多使用代理模式的场景：比如明星都是用经纪人作为代理，如果想请明星开演唱会就得联系其经纪人来进行相关安排。  
2. 代理模式的关键时当客户不方便直接访问一个对象或是不满足需要的时候，提供一个替身对象来控制对对象的访问，客户实际上访问的是替身对象，替身对象对请求做出一些处理后再把请求转交给本体对象。  
3. 保护代理和虚拟代理：  
1）保护代理：用户控制不同权限的对象对目标对象的访问，但在JavaScript中不容易实现保护代理，因为无法判断谁访问了某个对象。  
2）虚拟代理：如果在目标对象中有一些很消耗时间和性能的操作，那么可以把这些操作委托给代理来控制执行，当代理对象中满足某个一特定情况后才执行这些操作。

保护代理示例：小明送花 
```js
// 对象花
var Flower = function () {};

// 追求mm的小明
var XiaoMing = {
  isRich: false,
  sendFlower: function (target) {
    var flower = new Flower();
    target.recieveFlower(flower);
  }
};

// mm的闺蜜
var GuiMi = {
  recieveFlower: function (flower) {
    // 如果小明有钱的花就送
    // 闺蜜会了解MM心情好不好
    if (XiaoMing.isRich) {
      MM.listenGoodMood(function () {
        MM.recieveFlower(flower);
      });
    }
  }
};

// mm
var MM = {
  recieveFlower: function (flower) {
    console.log('recieved flower!');
  },
  listenGoodMood: function (fn) {
    setTimeout(fn, 1000);
  }
};

XiaoMing.sendFlower(Guimi);
```

虚拟代理示例：图片懒加载 
```js
// 本体对象
var myImage = (function () {
  var image = document.createElement('img');
  document.body.appendChild(image);

  return {
    setSrc: function (address) {
      image.src = address;
    }
  };

})();

// 代理对象
var proxyImage = (function () {
  var img = document.createElement('img');
  img.onload = function () {
    myImage.setSrc(this.src);
  };

  return {
    setSrc: function (address) {
      myImage.setSrc('/path/to/loading.png');
      img.src = address;
    }
  };
})();
```
#### The State Pattern(状态模式)
>状态模式 -- 当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。  
>状态模式主要解决的是当控制一个对象状态的条件表达式过于复杂时的情况，把状态的判断逻辑转移到不同状态的一系列类中，可以把复杂的判断逻辑简化。主要是为了解决允许一个对象在其内部状态改变时改变它的行为。  
>适用场景:一个对象的行为取决于它的状态，并且必须在运行时根据 状态改变它的行为；一个操作中含有庞大的分支结构，并且这些分支决定于对象的状态。  

```js
/*
 * 状态模式
 */

/* -----------------------------------------------------------------------------
  实例：超级玛丽游戏，玛丽要吃蘑菇，那么它就会跳起，顶出砖头里的蘑菇；玛丽想飞到另一边也要跳起；
  玛丽想要避免被乌龟咬到，它就要开枪射击。
  玛丽的跳跃开枪奔跑等都是触发的一个个状态，如果用if和switch来写条件判断的话，会考虑很多种组合
  的情况，很难维护代码，修改起来十分麻烦。
  解决方案是使用状态模式，将运动的各个状态与调用操作分离开来。
----------------------------------------------------------------------------- */

/* ************************* 创建超级玛丽状态类 ************************* */
var MarrayState = function () {
  // 内部状态私有变量
  var _currentState = {},

    /* ------------------- 动作方法的映射 ------------------- */
    states = {
      jump: function () {
        console.log('jump');
      },
      move: function () {
        console.log('move');
      },
      shoot: function () {
        console.log('shoot');
      },
      squat: function () {
        console.log('squat');
      }
    },

    /* ------------------- 创建动作控制类 ------------------- */
    Action = {
      // 改变状态方法
      changeState: function () {
          // 动作组合通过传入多个参数
          var args = arguments;
          // 重置内部状态
          _currentState = {};
          if (args.length) {
            for(var i = 0, len = args.length; i < len; i++){
              // 向内部状态添加动作
              _currentState[args[i]] = true;
            }
          }
          // 返回动作控制类
          return this;
      },
      goes: function () {
        for(var item in _currentState){
          states[item] && states[item]();
        }

        return this;
      }

    };

  /* ************************* 返回调用 ************************* */
  return {
    change: Action.changeState,
    goes: Action.gose
  }
};

```

#### The Responsibility Chain Pattern(责任链模式)
>责任链模式 -- 使多个对象有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递请求，直到有一个对象处理请求为止。  
>责任链模式最大的优点: 请求发送者只需要直到链中的第一个节点，从而弱化了发送者和一组接受者之间的联系。  

```js
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

```

#### The Template Pattern(模板方法模式)
> 模板方法模式 -- 一种基于继承的设计模式，模板方法模式由两部分组成，第一部分时抽象父类，第二部分时具体的实现子类，通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及凤爪国内子类中i所有方法的执行顺序，子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。  

在模板方法模式中，子类实现中相同部分被上移到父类中，而将不同的部分等待子类来实现，体现了泛化的思想。  

```js
// ------- 父类冲泡饮料 -------- //
var Beverage = function () {
  this.shouldAddCondiments = true;
};

Beverage.prototype.boilWater = function () {
  console.log('boil the water');
};

Beverage.prototype.brew = function () {
  throw new Error('should overwrite brew func!');
};

Beverage.prototype.pourInCup = function () {
  throw new Error('should overwrite pourInCup func!');
};

Beverage.prototype.addCondiments = function () {
  throw new Error('should overwrite addCondiments func!');
};

Beverage.prototype.hook = function (shouldAddCondiments) {
  this.shouldAddCondiments = shouldAddCondiments;
};

Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  if (this.shouldAddCondiments) {
    this.addCondiments();
  }
};

// ------- 子类泡咖啡和泡茶 -------- //
var Tea = function () {};

Tea.prototype = new Beverage();

Tea.brew = function () {
  console.log('brew for tea');
};

Tea.pourInCup = function () {
  console.log('pourInCup for tea');
};

Tea.addCondiments = function () {
  console.log('addCondiments for tea');
};

var tea = new Tea();
tea.init();


var Coffe = function () {};

Coffe.prototype = new Beverage();

Coffe.brew = function () {
  console.log('brew for coffe');
};

Coffe.pourInCup = function () {
  console.log('pourInCup for coffe');
};

Coffe.addCondiments = function () {
  console.log('addCondiments for coffe');
};

var coffe = new Coffe();
coffe.hook(false);
coffe.init();

```
