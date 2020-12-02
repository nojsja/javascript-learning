const electron = require('electron');
const { app, BrowserWindow, Menu, Tray, dialog } = require('electron');
const path = require('path');
const url = require('url');
const os = require('os');
const viewConf = require('../../configure/view-conf');

class WindowManagement {
  constructor() {
    this.window = null;
    this.envConf = require(path.join(app.getAppPath(), './config.json'));
  }

  sendToWeb(action, params) {
    this.window.webContents.send(action, params);
  }

  writeAppConf() {
    return viewConf.write();
  }

  // 读取应用设置 //
  getAppConf() {
    let { width, height } = electron.screen.getPrimaryDisplay().workAreaSize; // 硬件参数
    const viewInfo = viewConf.read(); // 用户配置文件

    if (!viewInfo.error && viewInfo.result.width && viewInfo.result.height) {
      width = viewInfo.result.width;
      height = viewInfo.result.height;
      // 存到内存中
      viewConf.set({
        width,
        height,
      });
    } else {
      width *= (3 / 6);
      height *= (4 / 6);
    }

    viewConf.set({
      width, height,
    });

    return {
      width,
      height,
    };
  }

  writeAppConf() {
    return viewConf.write();
  }

  // 根据运行环境加载窗口 //
  loadWindow(env) {
    if (env === 'development') {
    // wait for webpack-dev-server start
      setTimeout(() => {
        this.window.loadURL(url.format({
          pathname: '127.0.0.1:3000',
          protocol: 'http:',
          slashes: true,
        }));
      }, 1e3);
    } else if (env === 'electron-dev') {
      // electron develop tmp
      this.window.loadURL(url.format({
        pathname: path.resolve(app.getAppPath(), 'app', 'index.html'),
        protocol: 'file:',
        slashes: true,
      }));
      this.window.webContents.openDevTools();
    } else {
      // prod
      this.window.loadURL(url.format({
        pathname: path.resolve(app.getAppPath(), 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
      }));
    }
  }

  contextMenu() {
    global.appTray = new Tray(path.join(app.getAppPath(), os.type() === 'Windows_NT' ? `resources/icon_${this.envConf.work_env}.ico` : 'resources/mac_tray.png'));
    const menu = Menu.buildFromTemplate( [
      {
          label: global.lang.public.quit,
          type: 'normal',
          click: () => {
            const quitApp = () => {
              global.ipcMainWindow.sendToWeb('shell', { action: 'upload-clear' });
              ipcMainWindow.writeAppConf()
              .then(() => {
                global.appTray.destroy();
                app.quit();
              }).catch(() => {
                global.ipcMainProcess.notifySend({
                  body: global.lang.public['data_write_failed_before_quit']
                });
              });
            };
            
            const buttonId = dialog.showMessageBoxSync(this.windowoptions, {
              defaultId: 0,
              buttons: ['No', 'Yes'],
              type: 'info',
              title: global.lang.public.tips,
              message: global.lang.upload.app_quit_tips
            });
            if (buttonId === 1) quitApp();
          }
        }
    ]);

    global.appTray.on('click', ()=>{    
      this.window.show();
    });
    global.appTray.setToolTip('electron-react-template');
    global.appTray.setContextMenu(menu);
  }

  // main window //
  createWindow() {
    const { width, height } = this.getAppConf();
    this.window = new BrowserWindow({
      width,
      height,
      show: false,
      center: true,
      minWidth: 800,
      minHeight: 600,
      title: 'RhinoDisk',
      autoHideMenuBar: true,
      icon: path.join(app.getAppPath(), 'resources/icon.png'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    const splash = new BrowserWindow({
      width, height,
      transparent: false,
      frame: false,
      // alwaysOnTop: true,
      icon: path.join(app.getAppPath(), 'resources/icon.png'),
    });
    splash.loadURL(`file://${path.join(app.getAppPath(), '/resources/loading.splash.html')}`);
    
    this.window.once('ready-to-show', () => {
      splash.destroy();
      this.window.show();
    });

    this.window.on('resize', () => {
      const [_width, _height] = this.window.getContentSize();
      viewConf.set({
        width: _width,
        height: _height,
      });
    });

    this.window.on('close', (e)=>{
      console.log('window close');
      if(!this.window.isFocused()){
        global.appTray.destroy();
        global.appTray = null;
        this.window = null;
      }else{
        this.window.hide(); /*隐藏当前窗口*/
        e.preventDefault();  /*阻止应用退出*/
      }
    });

    this.window.on('closed', (e) => {
      console.log('closed');
      this.window = null;
    });
    if(os.type() !== 'Darwin') {
      this.contextMenu();
    }

    if(os.type() !== 'Darwin') {
      this.contextMenu();
    }

    this.loadWindow(global.nodeEnv);
  }
}

module.exports = WindowManagement;
