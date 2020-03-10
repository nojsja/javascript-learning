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
      }，
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
