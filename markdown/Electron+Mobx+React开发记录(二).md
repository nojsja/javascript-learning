### Electron+Mobx+React开发记录(二)

![Hello World](https://upload-images.jianshu.io/upload_images/3019242-489c253a35a8c7ee.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### \> Contents
1. 前言
2. webpack4图片打包的问题
3. webpack4样式表打包分离
4. 应用构建工具electron-builder配置
5. 应用构建工具electron-builder的问题

#### 前言
-------------
[前一篇文章](www.jianshu.com/p/53d74df07e4c)主要记录了开发环境的搭建和一些开发时遇到的问题，这篇文章主要说说自己在coding work之后进行应用打包时遇到的问题(webpack打包和electron打包)，[项目地址](https://github.com/NoJsJa/electronux)。

#### webpack4图片打包的问题
------------------------------------------
##### 1. jsx中声明的img:src不能被webpack识别和打包
在jsx中使用图片时，如下：
```html
<div className="install-item-image" onClick={() => {showTerminalInfo(item.label)}}>
  <Dimmer active={loading} inverted>
    <Loader size="tiny">{ loadingLable }</Loader>
  </Dimmer>
  <img alt="error" src={item.url} />
</div>
```
这里img:src使用了一个变量，但无论是变量还是字符串，webpack在打包的时候都不能根据我们引用的资源路径在dist目录下生成正确的资源引用路径结构，所以只能在我们需要引用图片的地方，手动require引入，如下：
```html
...
const imgSrc = require('path/to/img');
...
<img src={imgSrc}>
```
那如果img:src真的是变量而且需要一次引入多个那怎么办，如果你说想用for循环引入可以不，这其实是不行的，因为webpack打包的时候是识别不了你for循环内定义的变量的。引入办法如下，可以用正则表达式对一个文件夹内的所有文件进行匹配引入，并且可以在项目任意位置引入：
```
// 匹配1：只匹配图片
const requireContext = require.context('resources/install', true, /^\.\/.*\.(jpg|png)$/);
// 匹配2：匹配所有文件
const requireContext = require.context('resources/install', true, /.*/);
requireContext.keys().map(requireContext);
```

##### 2. 生产环境和开发环境的publicPath配置
关于publicPath这里有一篇说得比较清楚的[文章](https://www.jianshu.com/p/cbe81be10d78)
> output.path ： 硬盘上的路径，也就是你打算把文件打包到你的哪个目录，与发布时的路径完全无关。  

> output.publicPath： 主要用来转换url中的相对路径的。如果你引用到包含url的资源，一定要配置output.publicPath，配置了此项，webpack在打包时才能根据配置动态修改uri中的相对值。比如果你将所有打包生成好的文件托管在服务器上，访问格式是`www.yourhost.com/dist/index.html`的话，那publicPath就需要指定为`/dist/`。

* webpack-dev-server的publicPath默认是`/`，也就是在开发环境下webpack-dev-server在内存中生成的bundle.js文件路径是`/`，我们在浏览器中访问`localhost:3000/bundle.js`就能看见了，如果你在生产环境下的访问路径是`localhost:3000/dist/bundle.js`，就需要指定webpack-dev-server的publicPath为`/dist/`，这只是一个内存中虚拟的路径映射，目的是为了统一开发环境和生产环境的路径问题。

* 开发环境下：
```
webpack.config.js
...
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
...
```
* 生产环境下：
```
webpack.prod.config.js
...
entry: [
    './app/index',
  ],
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
...
```

##### 3. 统一生产环境和开发环境的资源引用路径
可以在webpack.config文件中指定`resolve.alias`来将一个绝对路径重命名，然后在项目任意位置直接使用重命名路径就行了，不用在import的时候搞很多相对路径声明`../../../`，如下：
* 声明：  
```
webpack.config.js
...
resolve: {
    alias: {
      resources: path.resolve(__dirname, 'resources'),
      app: path.resolve(__dirname, 'app'),
    },
  },
...
```
* 使用：
```html
<img src="resources/install/albert.png"}>
```

#### webpack4样式表打包分离
------------------------------------------
##### 1. css属性`backgroup-image: url(...)`的路径统一
我们在webpack.config中指定`resolve.alias`之后，如果你要在css属性中引用那个绝对路径的别名的话，需要在img:url字符前多加一个`~`路径转换符号，来让webpack为你自动替换路径，如下：
```css
.router-left-background {
  background-image: url(~resources/public/gohome.jpg); /* The image used */
  background-color: #f6f6f6; /* Used if the image is unavailable */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* cover size */
}
```
##### 2. 将样式表从bundle.js文件中分离
如果项目比较大的话，直接将样式表压缩进bundle.js文件中会导致页面首页加载时间比较长，这里我们使用`extract-text-webpack-plugin`webpack插件分离样式表，然后在index.html引入样式表，这样页面加载的时候浏览器就会发送异步请求来同时加载bundle.js文件和css文件，极大地提高加载速度。
* index.html

```html
<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>electronux</title>
  <link rel="stylesheet" href="style.scss.css">
  <link rel="stylesheet" href="style.css">
  <base href="./">
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
```
* 开发环境下webpack插件`extract-text-webpack-plugin`配置
这里的插件`publicPath`需要根据webpack-dev-server的`publicPath`配置(默认是`/`)，如果我们的样式表会加载外部文件(例如图片和字体文件)的话，那个实际资源请求路径就会根据这里的`publicPath`来计算得出。

```js
webpack.config.js
...
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 拆分样式文件
const extractSass = new ExtractTextPlugin({
  filename: 'style.scss.css',
});
const extractCss = new ExtractTextPlugin({
  filename: 'style.css',
});
...
module.exports = {
  ...
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
      ...
    ],
    ...
  },

  plugins: [
    extractSass,
    extractCss,
    ...
  ],
...
```

* 生产环境下webpack插件`extract-text-webpack-plugin`配置
生产环境下需要将`publicPath`设置为我们打包后生成的dist目录，不然css中引用的外部资源如图片等是不能生成到dist目录中的。

```js
webpack.prod.config.js
...
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: path.join(__dirname, 'dist/'),
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
          publicPath: path.join(__dirname, 'dist/'),
        }),
      },
    ...
```

#### 应用构建工具electron-builder配置
----------------------------------------------------
```json
{
  "appId": "com.nojsja.electronux",
  "copyright": "nojsja",
  "productName": "electronux",
  "asar": false,
  "directories": {
    "buildResources": "build-assets/",
    "output": "build/"
  },
  "files": ["package.json", "index.js", "dist/", "app/", "node_modules/"],
  "linux": {
    "icon": "resources",
    "category": "System",
    "description": "A System Management Tool Build For Manjaro Linux 17",
    "synopsis": "electronux",
    "target": ["zip"]
  }
}
```
electron-builder打包主要解决两个问题，一是怎么打包前端界面代码目录`dist`下的资源(渲染进程代码)，二是怎么打包由根目录下的index.js文件引入的资源(主进程代码)。配置文件中`files`参数项配置的就是所有需要最终打包进我们应用的所有文件了。
* package.json -- 整个应用程序的依赖配置文件
* index.js -- 主进程入口文件
* dist -- 渲染进程资源文件
* app -- 运行时引用的源代码和资源目录
* node_modules -- 运行时引用的第三方模块和资源目录

配置说明详细见[官方文档](https://www.electron.build/configuration/configuration)

#### 应用构建工具electron-builder的问题
-------------------------------------------------
##### 1. 国内墙导致打包工具依赖下载失败
运行electron-builder的时候会首先下载各个打包依赖，但是如果直接下载是会失败的(下载源文件存在github)。但我这边终端是用polipo配置了http-proxy的，下载的时候还是很慢，最后仍会导致下载失败，这个真的比较头痛，我索性将git仓库clone到自己搭建的vps虚拟机上(日本节点)，然后在服务器上运行一次打包命令，再把`~/.cache/electron-builder`、`~/.cache/electron`这两个打包工具生成的目录直接下载到本地对应的目录下，最后在本地运行打包命令的时候就不会再去下载依赖了。

##### 2. 打包成AppImage后在运行时不能使用chmod更改文件权限的问题
先来看一段Linux上常见的AppImage打包应用的定义：  
> AppImage不把Linux应用程序安装在文件系统相应的目录中，相反，它没有进行实际的安装，AppImage文件只是个压缩文件，在它运行时候`挂载`，用AppImage打包的程序，一个程序就是一个文件。  

在我的应用中需要执行一些shell脚本获取系统信息，但是这些脚本在第一次运行的时候是需要使用node.js中fs模块的`fs.chmod`方法对shell脚本进行赋予可执行权限的(chmod 755)，但是AppImage运行时是不允许动态更改文件属性的，所有挂载的Applmage文件都是只读的，无奈，我放弃了将应用打包成AppImage这种格式。
为了便于测试可以直接打包成zip文件，解压后就能运行，如果要安装到不同的发行版的话还能打包成`pacman`、`deb`、`rpm`、`tar.gz`等文件。

##### 3. arar加密打包时造成绝对路径查找失败
electron-builder的打包参数中有一个参数是`asar: true/false`，如果指定了为true的话打包后的压缩包内的源代码是会被arar加密的，这个对一些不开源的代码来说还是很有必要，但在我这个应用中应用在运行的时候会动态加载一些自定义的模块文件，如果你加载的路径用的是绝对路径的话，这个加载过程就会失败，因为如果启用了arar的话，我们资源目录下所有的源代码都只是一个加密的压缩包，此时你是不能通过系统的绝对路径来找到我们要引入的那个模块代码路径的，当然如果你手动解压arar压缩包的话就能看到所有源代码的目录结构了。

##### 4. 外部引用资源(img:src / css:url)的相对路径和绝对路径
html demo:
```html
<div className="install-item-image" onClick={() => {showTerminalInfo(item.label)}}>
  <Dimmer active={loading} inverted>
    <Loader size="tiny">{ loadingLable }</Loader>
  </Dimmer>
  <img alt="error" src={item.url} />
</div>
```
css demo:
```css
.router-left-background {
  background-image: url(~resources/public/gohome.jpg); /* The image used */
  background-color: #f6f6f6; /* Used if the image is unavailable */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* cover size */
}
```
如果我们正确地通过webpack打包了前端界面的代码，在dist目录下生成了正确的资源目录结构，然后尝试使用`electron index.js`命令来模拟生产环境下应用的运行(使用file协议加载dist目录下的资源)，发现代码中所有的引用资源请求都会失败。这是因为electron在生产环境下是使用`file`协议来加载文件的，首先我们在在执行了`electron index.js`命令后，electron窗口会按照我们定义的路径结构去查找index.html文件，然后加载主窗口，这个过程没有问题，如下：  
```js
window.loadURL(url.format({
  pathname: path.resolve(__dirname, 'dist', 'index.html'),
  protocol: 'file:',
  slashes: true,
}));
```
然后在这个index.html中的css图片请求和react组件的图片请求就是问题之处了，因为我们没有指定当前工作目录，file协议加载文件时就会直接从系统根目录开始根据资源目录结构查找了，实际上，我们的所有资源都是在`dist`文件夹下的，而不是系统根目录`/`，解决办法是在我们的index.html文件里面指定一个base标签，指明当前工作目录就行了，如下：
```html
<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>electronux</title>
  <link rel="stylesheet" href="style.scss.css">
  <link rel="stylesheet" href="style.css">
  <base href="./">
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

##### 5. 使用node.js对shell脚本赋予可执行权限
node.js的fs模块可以为文件赋予可执行权限，并且`fs.chmod`命令不用额外申请权限，估计是如果当前用户可以以root权限运行文件的话，node会自动为你获取权限。  
* 定义fsChmod模块递归为一个目录内的所有文件授予权限：

```js
const fs = require('fs');
const path = require('path');

function chmod(target, opstr) {
  if (fs.statSync(target).isDirectory()) {
    const files = fs.readdirSync(target);
    if (files.length) {
      files.forEach((file) => {
        chmod(path.join(target, file), opstr);
      });
    }
  } else {
    fs.chmodSync(target, opstr);
  }
}
function fsChmod(dir, opstr) {
  chmod(dir, opstr);
}

module.exports = fsChmod;

```

* 在fsChmod同级目录下定义shell授权模块
这样子的话会避开绝对路径查找的问题

```js
const path = require('path');
const fsChmod = require('./fs-chmod');
function fsChmodShell() {
  fsChmod(path.join(__dirname, '../shell'), 0o711);
}
module.exports = fsChmodShell;
```

* 项目index.js中引入执行
__注意：__请尽量不要在项目的index.js文件中进行运行时绝对路径查询(使用`path.resolve`)，因为在开发环境下我们的代码目录结构和electron-builder打包后生产环境下的的应用代码结构是不一样的，比如开发环境下，index.js文件位于项目根目录`/`下，shell文件夹(存放shell scripts)的路径是`/app/service/shell`，经过electron-builder打包后，index.js(实际上被编译成了一个可执行文件 )仍然位于根目录`/`下，但是shell文件夹位置却变成了`/resources/app/app/shell`，这样子如果在index.js文件中对shell文件夹进行绝对路径查询的话就会发生严重错误。electron-builder打包后的源代码会被放到资源目录`/resources/app`下，位于资源目录下的代码是可以进行运行时绝对路径查询(前提是没有开启`arar`源代码加密)和相对路径查询的。

```js
const fsChmodShell = require('./app/services/middleware/fs-chmod-shell.js');
fsChmodShell();
```

##### 感谢阅读，如有错误，还请指正：- )
