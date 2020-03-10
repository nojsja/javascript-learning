![Hello World](https://upload-images.jianshu.io/upload_images/3019242-489c253a35a8c7ee.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### \> Contents
1. 前言
2. 开发环境搭建
3. 引入Webpack4.0前端打包工具
4. Electron代码结构和代码热更新
5. 前端界面React + Mobx 代码结构和热更新
6. Linux桌面客户端开发遇到的问题

### 前言
-----------
最近桌面系统从Ubuntu18.04切换到了Manjaro Linux 17，之前听说Manjaro的软件丰富，仓库更新及时，很多常用软件都能一键安装(比如QQ，微信)，同时也支持主流的Linux桌面环境：Gnome、KDE、Cinnamon、Mate、Deepin等等，安装了Gnome版本的Manjaro之后发现果然还不错。系统安装好后配置比较繁琐，就想给Manjaro写一个GUI客户端工具用于安装常用软件和作为简单的系统管理工具 - [electronux](https://github.com/NoJsJa/electronux.git)
作为一名正直的前端开发人员，理所应当地就准备使用Electron + Node.js + React + Mobx + Webpack + Shell 来进行开发啦 ~ 目前仍然在开发中，这篇文章用于记录自己的环境搭建过程、一些对Electron+React开发的理解以及谈谈自己遇到的一些Linux桌面软件开发时遇到的问题和解决办法。

![clean_detail.png](https://upload-images.jianshu.io/upload_images/3019242-2a593ca2c7e2ccc7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![clean_search.png](https://upload-images.jianshu.io/upload_images/3019242-3b766c21d41cea60.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![electron_pssword.png](https://upload-images.jianshu.io/upload_images/3019242-67ba2a353b08ef05.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![info_total.png](https://upload-images.jianshu.io/upload_images/3019242-6b8a3cb01bf27278.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![install_detail.png](https://upload-images.jianshu.io/upload_images/3019242-b2fab79ba7474683.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![install_list.png](https://upload-images.jianshu.io/upload_images/3019242-a50c48dddc74d1a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![install_permission.png](https://upload-images.jianshu.io/upload_images/3019242-18f1f708debf3e6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![startup_list.png](https://upload-images.jianshu.io/upload_images/3019242-bc4abfbfa0843df3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 开发环境搭建
------------------------
##### 代码目录结构
```sh
electronux  
|---- [dir ] app ( 主代码目录 )
|----------- [dir ] app/configure ( 应用配置更新 )
|----------- [dir ] app/runtime ( 运行数据文件 )
|
|----------- [dir ] app/services ( 后台服务存放目录 )
|------------------------ [dir ] app/services/middleware ( 一些中间处理件 )
|------------------------ [dir ] app/services/shell ( shell脚本存放目录 )
|------------------------ [dir ] app/services/main-serv ( 主进程服务 )
|------------------------ [dir ] app/services/render-serv ( 渲染进程服务 )
|
|----------- [dir ] app/stores ( 前端状态管理文件目录 )
|----------- [dir ] app/styles  ( 公用样式表文件 )
|----------- [dir ] app/utils  ( 公用工具函数 )
|
|----------- [dir ] app/views  ( UI界面代码 )
|------------------------ [dir ] app/views/module1  ( 界面模块1 )
|------------------------ [dir ] app/views/module2  ( 界面模块2)
|------------------------ [dir ] app/views/module3  ( 界面模块3 )
|
|----------- [file] app/App.js  ( 前端应用入口文件 )
|----------- [file] app/index.js ( 前端应用热加载文件 )
|
|---- [dir ] dist ( 前端代码编译打包文件存放目录 )
|---- [dir ] resources ( 前端静态资源存放目录 )
|
|---- [file] .babelrc ( babel配置文件 )
|---- [file] .editorconfig (编辑器编码规范文件)
|---- [file] .eslintrc ( 代码格式检查配置文件 )
|---- [file] .gitignore ( git忽略追踪配置文件 )
|---- [file] electron-builder.json ( electron-builder打包配置文件 )
|---- [file] index.html  ( 应用渲染入口页面 )
|---- [file] index.js ( 应用主进程入口文件 )
|---- [file] package.json (前端模块和框架配置文件)
|---- [file] webpack.config.js (webpack开发环境配置文件)
|---- [file] webpack.prod.config.js  ( webpack生产环境配置文件 )

```

##### 项目环境依赖配置文件
```json
{
  "name": "electronux",
  "description": "linux manager-software powered by electron & react & Mobx ",
  "version": "1.0.0",
  "author": {
    "name": "NoJsJa",
    "email": "yangwei020154@gmail.com"
  },
  "scripts": {
    "start": "concurrently \"npm run start-dev\" \"npm run start-electron\"",
    "start-dev": "cross-env NODE_ENV=development webpack-dev-server",
    "start-electron": "nodemon --exec 'cross-env NODE_ENV=development electron --inspect=5858 index'",
    "start-production": "cross-env NODE_ENV=production electron --inspect=5858 index",
    "build-all": "npm run dist && npm run build",
    "dist": "cross-env NODE_ENV=production webpack --config webpack.prod.config.js",
    "build": "electron-builder -l"
  },
  "keywords": [
    "electron",
    "react",
    "mobx",
    "react-router",
    "webpack4"
  ],
  "license": "",
  "nodemonConfig": {
    "ignore": [
      "resources/*",
      "node_modules/*",
      "dist/*",
      "build/*",
      "app/stores/*",
      "app/styles/*",
      "app/services/shell/*",
      "app/configure/view.conf",
      "app/views/*",
      "app/App.js",
      "app/main.js",
      "app/index.js",
      "electron-builder.yml"
    ],
    "delay": "1000"
  },
  "dependencies": {
    "semantic-ui-css": "^2.4.0",
    "semantic-ui-react": "^0.82.5",
    "mobx": "^4.4.1",
    "mobx-react": "^5.2.8",
    "prop-types": "^15.6.2",
    "react": "^16.5.1",
    "react-dom": "^16.5.1",
    "react-hot-loader": "^4.3.8",
    "react-router": "^4.3.1",
    "react-router-dom": "^4.3.1",
    "history": "^4.7.2"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-eslint": "^10.0.1",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-decorators-legacy": "^1.3.5",
    "babel-preset-env": "^1.7.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "clean-webpack-plugin": "^0.1.19",
    "concurrently": "^3.6.1",
    "cross-env": "^5.2.0",
    "css-loader": "^0.28.11",
    "electron": "^2.0.9",
    "electron-builder": "^20.28.4",
    "eslint": "^5.6.1",
    "eslint-config-airbnb": "^17.1.0",
    "eslint-plugin-import": "^2.14.0",
    "eslint-plugin-jsx-a11y": "^6.1.2",
    "eslint-plugin-react": "^7.11.1",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "file-loader": "^2.0.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "node-sass": "^4.9.4",
    "nodemon": "^1.18.4",
    "sass-loader": "^7.1.0",
    "source-map-support": "^0.5.9",
    "style-loader": "^0.21.0",
    "url-loader": "^1.1.2",
    "webpack": "^4.19.0",
    "webpack-cli": "^2.1.5",
    "webpack-dev-server": "^3.1.8"
  }
}

```

### 引入Webpack4.0前端打包工具
---------------------------------------------

##### webpack开发环境配置文件
```js
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 拆分样式文件
const extractSass = new ExtractTextPlugin({
  filename: 'style.scss.css',
});

const extractCss = new ExtractTextPlugin({
  filename: 'style.css',
});

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app/index',
  ],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      resources: path.resolve(__dirname, 'resources'),
      app: path.resolve(__dirname, 'app'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: '/',
        }),
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          fallback: 'style-loader', // 在开发环境使用 style-loader
          publicPath: '/',
        }),
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.(png|jpg|gif|svg|ico|woff|eot|ttf|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    extractSass,
    extractCss,
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  target: 'electron-renderer',
};

```

### Electron基本原理和代码热更新
----------------------------------------------
> Electron 运行 package.json 的 main 脚本的进程被称为主进程。 在主进程中运行的脚本通过创建web页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。
由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的渲染进程中。
在普通的浏览器中，web页面通常在一个沙盒环境中运行，不被允许去接触原生的资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。
进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。
主进程管理所有的web页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。
在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

##### 创建主进程
在index.js文件中我们引入electron和所有的自定义模块文件，并根据开发环境或是生产环境来进行主进程窗口加载，开发环境下使用`http协议`加载由webpack-dev-server启动的http服务，生产环境下使用`file协议`加载本地由webpack打包好的前端bundle.js文件，所以开发环境下`npm start`指令其实主要是执行了两步操作，一是启动webpack-dev-server，此时已经可以通过外部浏览器访问到localhost:3000的http服务，只不过我们实际是用electron之中的chromium浏览器来加载的，它与node.js主进程共享同一个chrome v8引擎，所以理论上，在页面加载后，你同样可以在渲染进程中使用node.js API，比如用使用fs模块访问文件系统。

##### 主进程代码热更新
我用了nodemon工具实现了主进程代码热更新，如果不用nodemon工具那么 `npm start-electron`命令实际是执行`cross-env NODE_ENV=development electron index`，就是简单的用electron启动主进程文件，使用nodemon之后`npm start-electron`实际上是执行`nodemon --exec 'cross-env NODE_ENV=development electron index'`，最后在package.json文件中增加一个nodemonConfig字段用于指定哪些文件需要纳入nodemon监听即可。

=> package.json中定义的启动脚本：
```json
  "scripts": {
    "start": "concurrently \"npm run start-dev\" \"npm run start-electron\"",
    "start-dev": "cross-env NODE_ENV=development webpack-dev-server",
    "start-electron": "nodemon --exec 'cross-env NODE_ENV=development electron index'",
    "build": "npm run dist && npm run build-all",
    "dist": "cross-env NODE_ENV=production webpack  --config webpack.production.config.js",
    "build-all": "build -lmw"
  },
```

=> package.json中nodemonConfig字段
```json
"nodemonConfig": {
    "ignore": [
      "resources/*",
      "node_modules/*",
      "dist/*",
      "app/stores/*",
      "app/styles/*",
      "app/services/shell/*",
      "app/configure/view.conf",
      "app/views/*",
      "app/App.js",
      "app/main.js",
      "app/index.js"
    ],
    "delay": "1000"
  },
```

=> 项目启动文件index.js：
```js
...
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
      pathname: path.join(path.resolve(__dirname, './dist'), 'index.html'),
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
    sourceMapSupport.install();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  viewConf.write().then(() => 0, (err) => {
    console.error(err);
    throw new Error('App quit: view-conf write error !');
  });
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
```

### 前端界面React + Mobx 代码结构和热更新
-------------------------------------------------------------

##### 代码结构
1. App.js前端入口文件
入口文件基本是整个前端应用的关键点，我们使用`mobx-react`包提供的Provider组件加载整个应用，并把各个应用模块(按功能划分)的mobx store示例作为props属性传入Provider，在各个组建中使用修饰器`@inject`就能直接使用store实例了，页面层次比较多的话最好使用React Router进行路由管理，值得注意的是React Router V4版本跟之前版本的理念和使用方式有很大区别，可以去官网查阅相关文档[react-router4](https://reacttraining.com/react-router/web/guides/quick-start)

```js
/* ------------------- export global history ------------------- */
export const history = createHistory();

const stores = {
  install: new InstallState(),
  startup: new StartupState(),
  info: new InfoState(),
  clean: new CleanState(),
  pub: new PublicState(),
};

function App() {
  return (
    <Provider {...stores}>
      <Router history={history}>
        <Route path="/" component={HomePage} />
      </Router>
    </Provider>
  );
}

/* ------------------- export provider ------------------- */
export default App;

```

2. mobx store 存储
这是项目其中一个系统清理模块的mobx store，在store中被mobx监听的属性最好结构层次简单、只有单一的功能划分，不要把一个属性对象的嵌套写得太深。开发时我们把UI界面的数据抽象成store中的数据时可能会下意识地根据页面显示状态而把单个属性对象写得过于复杂，但其实页面显示状态只是逻辑的数据结构，我们在store中存储的时候应该尽量将这种逻辑数据结构`翻译`成扁平化的数据结构，然后再在各个属性对象之间建立映射关系。
并且使用了mobx之后请尽量依赖mobx的数据引用监听自动更新特性，多写`computed`、`autorun`来自动生成数据，使用`action`修饰一些需要更改store属性的方法。

```js
class Clean {
  constructor() { }
  /* ------------------- observable ------------------- */

  // 所有检查项目 //
  @observable items = {
    appCache: false,
    appLog: false,
    trash: false,
    packageCache: false,
  };

  // 主界面加载 //
  @observable loadingMain = false;

  // 清理路径 //
  cleanPaths = {
    appCache: [`/home/${this.userinfo.username}/.cache`],
    appLog: ['/var/log/'],
    trash: [`/home/${this.userinfo.username}/.local/share/Trash/files`],
    packageCache: ['/var/cache/pacman/pkg'],
  }

  // 路径模块映射 //
  @observable cleanPathMap = {
    appCache: [], // '/var/log/pacman.log'
    appLog: [],
    trash: [],
    packageCache: [],
  }

  // 清理内容 //
  @observable cleanContents = observable.map({})

  // 清理大小 //
  cleanSizes = {
    // '/var/log//pacman.log': '10kb',
  }

  // ---- 清理选项细节-数据对象逻辑树结构 ---- //
  // @observable cleanDetails = {
  //   appCache: {
  //     url: [`/home/${this.userinfo.username}/.cache`], // 指定扫描路径多个
  //     contents: { // 绝对路径
  //       // '/var/cache/pacman/pkg/zsh-5.6.2-1-x86_64.pkg.tar.xz': false,
  //     },
  //     size: {
  //       // '/var/cache/pacman/pkg/zsh-5.6.2-1-x86_64.pkg.tar.xz': '10kb',
  //     },
  //   },
  //   appLog: {
  //     url: ['/var/log/'],
  //     contents: {
  //       // '/var/log//pacman.log': false,
  //     },
  //     size: {
  //       // '/var/log//pacman.log': '10kb',
  //     },
  //   }
  // }

  /* ------------------- static ------------------- */


  /* ------------------- computed ------------------- */

  // 获取所有被选中的detail item //
  @computed get allCheckedDetail() {
    const a = [];
    this.cleanContents.forEach((v, k) => {
      if (v) a.push(k);
    });
    return a;
  }

  // 清理路径详细信息 //
  @computed get cleanDetail() {
    const result = [];
    Object.keys(this.cleanPathMap).forEach((item) => {
      if (this.items[item]) {
        const oneResult = {
          label: item,
          contents: [],
        };
        this.cleanPathMap[item].forEach((it) => {
          oneResult.contents.push({
            content: it,
            size: this.cleanSizes[it] || 0,
          });
        });

        result.push(oneResult);
      }
    });

    return result;
  }
}

export default Clean;

```

3. 页面组件划分
在views目录下创建的各个目录都是一个单独的组件目录，组件目录下有一个组件入口文件和css样式表文件以及其它子组件，入口文件载入css文件和子组件，使用`@inject`修饰器后各个组件都可以独立访问mobx store实例，不必在父和子组件之间通过props进行逐级参数传递，但是如果一个子组件依赖父组件来加工原始数据的话也可以使用props传递参数。
使用了mobx之后，并不是说每个页面需要使用的数据都有必要纳入mobx store的管理，在我的代码中只是把`关键性数据`以及`关键性数据加工方法`存入了store中，每个组件拿到store传递下来的数据后一些页面状态可能需要依赖组件各自的数据处理函数进行数据二次加工，我觉得这样应该会减轻store实例的负载压力，非绝对中心化。比如在一个列表菜单组件中，这个组件的列表数据可以切换显示和隐藏，但是控制这个列表显示/隐藏的参数状态`visible`没有必要纳入store实例管理，相对的管理这个列表组件的store实例只是存储了列表数据的数组，以及一些必要的数据加工方法。

4. 渲染进程和主进程ipc通信的问题
页面的每个渲染进程(ipcRender)，虽然说可以直接使用node.js原生模块和api，但是不建议在渲染进程中过度使用原生模块，一是因为一些node.js原生模块并没有考虑到进程安全的问题，第二个原因是渲染进程应该专注处理页面交互和数据处理问题，划清代码的功能区域，把和系统交互的问题交由主进程(ipcMain)处理，把网络数据请求也交由各自的service服务，减少不必要的模块和数据耦合。渲染进程通过ipc通信向主进程发送处理请求，主进程和service负责原始数据的获取和网络数据的传输，最后主进程通过ipc通信向对应的渲染进程返回处理结果，service拿到的网络数据也通过回调事件发送给渲染进程。项目中我把mobx store作为和主进程通信的桥梁，mobx store向主进程发送信号，同时也在接收到主进程的ipc通信事件后再把主进程发回来的数据更新到各个observer。总之主进程和service服务负责系统交互、原始数据获取和传输，渲染进程mobx store负责响应信号和事件进行业务数据更新，各个view子组件只负责页面渲染和用户交互。


##### 前端代码热更新
1. webpack.config.js中启动webpack-dev-server的热更新功能

```js
devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
```
2. 使用`react-hot-loader`的AppContainer组件

```js
import { AppContainer } from 'react-hot-loader';

import 'semantic-ui-css/semantic.min.css';
import './styles/public.css';

import App from './App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);
```
### Linux桌面客户端开发遇到的问题
-------------------------------------------------------
##### 使用node.js子进程child_process执行shell脚本时无法取得系统root权限
项目中有的脚本需要使用root权限，比如安装和卸载软件、扫描系统关键路径，node.js里执行shell脚本可以使用child_process模块(node.js子进程)，child_process有几个方法，`spawn`、`exec`、`execFile`、`fork`，它们都能创建子进程以执行指定文件或命令，具体的使用方法见[Node API](http://nodejs.cn/api/child_process.html#child_process_asynchronous_process_creation)，如果我们的脚本或指令需要使用root权限那可就麻烦了，桌面应用又不是终端，不可能用着用着让用户去终端输入密码吧，况且只是在开发环境下能看到终端输出，应用打包安装运行起来后就是一个独立的应用程序了，根本没法输入终端密码，仔细查阅了Electron官网API发现electron官方并没有集成一个什么系统权限调用窗口之类的组件。没办法了，这种情况下手动写出了两种方法：
1. 调用获取系统权限的系统自带组件来执行自定义命令和脚本
2. 封装一个弹窗组件来获取用户首次输入的密码，然后手动把密码记录到文件中，应用启动的时候从文件中读出密码，在使用child_process创建子进程的时候再监听子进程的输出事件和错误事件，然后把读取到的保存在内存中的密码以输入流(input stream)的形式发送给child_process创建的子进程，子进程读取到输入流传入的密码后就能继续执行了。  

![electron_pssword.png](https://upload-images.jianshu.io/upload_images/3019242-d138cc8f3f395356.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![install_permission.png](https://upload-images.jianshu.io/upload_images/3019242-ab7ac0ed65c892be.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


__具体代码见__：[github/nojsja/electronux/app/utils/sudo-prompt.js](https://github.com/NoJsJa/electronux/blob/master/app/utils/sudo-prompt.js)  

_感谢阅读，文章中出现的错误之处还请多原谅~_  
##### 未完待续.....
