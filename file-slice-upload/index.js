const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');

/* ------------------- self module ------------------- */
global.pathLocator = require('./app/utils/path-locator.js');
global.consoleLog = require('./app/utils/console-log.js');
const fsChmodShell = require('./app/services/middleware/fs-chmod-shell.js');
const ipcMainListener = require('./app/services/main-serv/ipcMainListener');
const ipcInstallListener = require('./app/services/main-serv/ipcInstallListener');
const ipcCleanListener = require('./app/services/main-serv/ipcCleanListener');
const ipcStartupListener = require('./app/services/main-serv/ipcStartupListener');
const viewConf = require('./app/configure/view-conf');

/* ------------------- var ------------------- */
const nodeEnv = process.env.NODE_ENV;
let win;

/* ------------------- middleware ------------------- */
fsChmodShell();

/* ------------------- ipcMain ------------------- */
ipcInstallListener(ipcMain);
ipcCleanListener(ipcMain);
ipcMainListener(ipcMain);
ipcStartupListener(ipcMain);

/* ------------------- func  ------------------- */

// 读取应用设置 //
function getAppConf() {
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

// 根据运行环境加载窗口 //
function loadWindow(window, env) {
  if (env === 'development') {
    // wait for webpack-dev-server start
    setTimeout(() => {
      window.loadURL(url.format({
        pathname: 'localhost:3000',
        protocol: 'http:',
        slashes: true,
      }));
      // window.webContents.openDevTools();
    }, 1e3);
  } else {
    window.loadURL(url.format({
      pathname: path.resolve(__dirname, 'dist', 'index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  }
}

/* ------------------- main window ------------------- */

function createWindow() {
  const { width, height } = getAppConf();
  win = new BrowserWindow({
    width,
    height,
    title: 'electronux',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'resources/icon.png'),
  });

  win.on('resize', () => {
    const [_width, _height] = win.getContentSize();
    viewConf.set({
      width: _width,
      height: _height,
    });
  });

  loadWindow(win, nodeEnv);
}

/* ------------------- electron event ------------------- */

app.on('ready', () => {
  if (nodeEnv === 'development') {
    require('source-map-support').install();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  viewConf.write().then(() => 0, (err) => {
    console.error(err);
    throw new Error('App quit: view-conf write error !');
  });
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  console.log('will-quit');
});

app.on('before-quit', () => {
  console.log('before-quit');
});

app.on('quit', () => {
  console.log('quit');
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
