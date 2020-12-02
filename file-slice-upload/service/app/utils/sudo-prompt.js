/**
* @name: sudo-prompt
* @description: 调用系统弹窗组件申请权限执行脚本或命令
*/

const child = require('child_process');
const fs = require('fs');
const path = require('path');
const iconvLite = require('iconv-lite');
const { ipcMain } = require('electron');
const inPath = require('./in-path');

class SudoPrompt {
  constructor() {
    this.bins = [
      '/usr/bin/pkexec',
      '/usr/bin/gksu',
      'C:/Windows/System32/cmd.exe',
    ];
    this.bin = null;
    this.password = null;
    this.passwordFile = path.join(pathRuntime, 'password.conf');
  }

  // 识别系统权限弹窗获取程序 //
  getBin() {
    if (this.bin) return this.bin;

    for (let i = 0; i < this.bins.length; i += 1) {
      if (fs.existsSync(this.bins[i])) {
        this.bin = this.bins[i];
        break;
      }
    }
    return this.bin;
  }

  // 设置密码 //
  setPassword(passwd) {
    if (passwd) {
      this.password = passwd;
      fs.writeFileSync(this.passwordFile, passwd, {
        encoding: 'utf8',
        flag: 'w',
      });
    }
  }

  // 从文件中读取用户密码 //
  readPassword() {
    let password;
    if (!this.password) {
      password = fs.readFileSync(this.passwordFile);
      password = password.toString().trim();
      this.password = password;
    }
    return password;
  }

  // 检查用户用户密码是否已经设置 //
  checkPassword() {
    let password = fs.readFileSync(this.passwordFile);
    password = password.trim();
    if (password) return true;
    return false;
  }

  /**
   * [exec 执行一个命令]
   * @param  { [String] }  command    [命令]
   * @param  { [Array | String] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async exec(_command, _params = [], _options = {}) {
    const self = this;
    const params = Array.isArray(_params) ? _params.join(' ') : _params;
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = `${_command} ${params}`;

    console.log(params, options, command);

    return new Promise(async (resolve, reject) => {
      child.exec(command, { ...options, encoding: 'buffer' }, (_err, _stdout, _stderr) => {
        if (_err) {
          reject(_err);
        } else if (_stderr && _stderr.toString()) {
          reject(iconvLite.decode(_stderr, 'cp936'));
        } else {
          resolve(iconvLite.decode(_stdout, 'cp936'));
        }
      });
    });
  }

  /**
   * [execFile 执行一个脚本文件]
   * @param  { [String] }  path    [脚本路径]
   * @param  { [Array | String] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async execFile(_path, _params, _options) {
    const self = this;
    self.getBin();
    const params = Array.isArray(_params) ? _params.join(' ') : _params;
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = `${self.bin} ${_path} ${params}`;

    return new Promise(async (resolve, reject) => {
      child.exec(command, options, (_err, _stdout, _stderr) => {
        if (_err || _stderr) {
          const err = !_err ? _stderr : _err;
          reject(err);
        } else {
          resolve(_stdout);
        }
      });
    });
  }

  /**
   * [exec 执行一个命令]
   * @param  { [String] }  command    [命令]
   * @param  { [Array] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async spawn({
    _command, _params, _options, _stdout, _stderr, _close,
  }) {
    const self = this;
    self.getBin();
    const params = Array.isArray(_params) ? _params : [_params];
    params.unshift(_command);
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = self.bin;

    const childSpawn = child.spawn(command, params, options);

    // data output
    childSpawn.stdout.on('data', (d) => {
      _stdout(d.toString());
    });

    // err output
    childSpawn.stderr.on('data', (d) => {
      console.log('sudo stderr: ', d.toString());
      _stderr(d.toString());
    });

    // process exit
    childSpawn.on('close', (code) => {
      console.log('sudo close: ', code);
      _close(code);
    });
  }


  /**
   * [spawnWithPasswd 使用保存的密码直接执行命令]
   * @param  { [String] }  command    [命令]
   * @param  { [Array] }   params  [参数数组]
   * @param  { [Object] }  options [exec可定制的参数]
   * @return { Promise }           [返回Promise对象]
   */
  async spawnWithPasswd({
    _command, _params, _options, _stdout, _stderr, _close,
  }) {
    const self = this;
    const prompt = '<::sudo-password::>';
    self.readPassword();
    if (!self.password) {
      _close && (_close(1));
      return;
    }

    const params = Array.isArray(_params) ? _params : [_params];
    // params.unshift(_command);
    const options = (typeof (_options) === 'object') ? _options : {};
    const command = ['-S', '-k', '-p', prompt].concat(_command).concat(params);
    const sudo = inPath('sudo');
    const childSpawn = child.spawn(sudo, command, options);

    // data output
    childSpawn.stdout.on('data', (d) => {
      (_stdout) && (_stdout(d.toString()));
    });

    // err output
    childSpawn.stderr.on('data', (d) => {
      console.log('spawn stderr-> ', d.toString());
      const message = d.toString().trim();

      if (message === prompt) {
        childSpawn.stdin.write(`${self.password}\n`);
      } else {
        childSpawn.stdin.write('Y\n');
      }
    });

    // process close
    childSpawn.on('close', (code) => {
      console.log('spawn close-> ', code);
      (_close) && (_close(code));
    });
  }
}

module.exports = SudoPrompt;
