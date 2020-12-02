const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * global.lang -- 内存里保存的所有语言数据
 * global.LANG -- 语言数据标识(en_us, zh_cn, zh_tw)
 * session.lang -- 在session里保存一份语言数据标识，防止用户cookie丢失时语言设置失效(session 持久化)
 * cookie.lang -- 保存在客户端的语言数据标识，session.lang和cookie.lang保持同步
 */
const lang =  (function() {

  const defaultLang = 'zh_CN';

  /* ------------------- 获取统一的语言环境标识 ------------------- */
  const getLANG = (acceptLang) => {
    // 英语
    if (['en-US', 'en', 'en-us', 'en_us', 'en_US'].indexOf(acceptLang) !== -1) {
      return 'en_us';
    }
    // 中文简体
    if (['zh-CN', 'zh', 'zh-cn', 'zh_cn', 'zh_CN'].indexOf(acceptLang) !== -1) {
      return 'zh_cn';
    }else
    // 中文繁体
    if (['zh-TW', 'zh-tw', 'zh_tw', 'zh_TW'].indexOf(acceptLang) !== -1) {
      return 'zh_tw';
    // 默认中文简体
    }else {
      return 'zh_cn';
    }
  }

  /* ------------------- 加载语言文件 ------------------- */
  const setLang = (langEnv) => {
    global.lang = global.lang ? global.lang : {};
    global.LANG = langEnv;

    // 读取文件夹的语言配置文件写入全局配置
    const files = fs.readdirSync(path.join(app.getAppPath(), 'app/lang', langEnv));

    if (files && files instanceof Array) {
      files.forEach((file) => {
        global.lang[file.replace('.js', '')] = require(path.join(app.getAppPath(), 'app/lang', langEnv, file));
      });
    }
  }

  return function (acceptLang) {
    const _lang = getLANG(acceptLang || defaultLang);
    if (global['LANG'] && global['LANG'] == _lang) {
      return;
    }
    // 设置目前的语言环境
    setLang(_lang);
  }

})();

module.exports = lang;
