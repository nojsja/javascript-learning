// 使用单行注释时加空格
// 多行注释时使用多个单行注释
// 多行注释时使用多个单行注释

/**
 * [fn 这里写描述]
 * @method fn
 * @param {string} p1 [参数描述]
 * @param {string} p2 [参数描述]
 * @param {string} p3 [参数描述]
 * @return {object} [返回值描述]
 */
function fn(p1, p2, p3) {
  p1 = p2 + p3;

  return {
    a: p1,
    b: p2,
    c: p3
  };
}

// 私有变量、方法、属性命名用下划线开头
var _privateProperty = '00',
  _privateMethod = function () {}；
// 常量大写，单词间下划线分割
var HTML_TODO = '14';
//  都使用驼峰命名法
// 类名使用名词
function Engine() {}
// 函数使用动宾短语
function getStyle() {}
// boolean变量使用is或has开头
var isAvaliable = false;

// 移动端设备检测
var WIN = window;
var LOC = WIN["location"];
var NA = WIN.navigator;
var UA = NA.userAgent.toLowerCase();

function test(needle) {
  return needle.test(UA);
}

// 可触摸的
var IsTouch = "ontouchend" in WIN;
// 判断安卓设备
var IsAndroid = test(/android|htc/) || /linux/i.test(NA.platform + "");
// 判断ipad
var IsIPad = !IsAndroid && test(/iphone/);
// 判断iphone
var IsIPhone  = !IsAndroid && test(/ipad|iphone/);
// 判断IOS系统
var IsIOS = IsIPhone || IsIPhone;
// 判断wp设备
var IsWinPhone = test(/windows phone/);
// 判断webapp
var IsWebapp = !!NA["standalone"];
// 判断小米手机
var IsXiaoMi = IsAndroid && test(/mi\s+/);
// 判断UC浏览器
var IsUC = test(/ucbrowser/);
// 判断微信浏览器
var IsWeixin = test(/micromessenger/);
// 判断百度浏览器
var IsBaiduBrowser = test(/baidubrowser/);
// 判断谷歌浏览器
var IsChrome = !!WIN["chrome"];
// 判断baidu box
var IsBaiduBox = test(/baiduboxapp/);
// 判断桌面浏览器
var IsPC = !IsAndroid && !IsIOS && !IsWinPhone;
// 判断HTC手机
var IsHTC = IsAndroid && test(/htm\s+/);
// 判断百度钱包
var IsBaiduWallet = test(/baiduwallet/);
