### server开发说明
--------------

#### 命令
* 【npm start】 -- run electron-dev.
* 【npm run start-electron】 -- start electron main process(GUI) and load localhost:8080 (http).
* 【npm run start-production】 -- start electron main process(GUI) and load dist resources (local).
* 【npm run build-win】 -- build application for windows using dist resources.
* 【npm run build-linux】 -- build application for linux using dist resources.
* 【npm run build-mac】 -- build application for mac using dist resources.
* 【npm run build-all】 -- build application for all platforms using dist resources.

### 说明
1. 环境安装  
>切换镜像源让Electron安装更快
```sh
$: npm config set electron_mirror http://npm.taobao.org/mirrors/electron/
$: npm config set electron_custom_dir "9.3.5"
$: npm install
$: npm install electron@9.3.5 -g
$: npm install cross-env -g
```

2. electron-dev环境
* 手动重启说明
>开启后可以在控制台手动输入`rs`然后敲击Enter重启开发环境
* 自动重启说明
>`package.json`文件的`nodemonConfig.ignore`字段过滤了用于监听代码变化自动加载的文件，`app/*`表示app目录下的所有文件被取消监听，开发者可以根据个人习惯更改监听的文件列表
* 自动重启报错解决  
>如果遇到控制台报错`Nodemon Error: System limit for number of file watchers reached`，请在终端输入以下命令取消系统文件监听限制
```sh
$: echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

3. electron-builder打包说明

* [参考链接](https://zhuanlan.zhihu.com/p/110448415)
* 首次运行打包需要下载环境相关的文件，win环境下会遇到下载卡住的问题，请将命令行下载卡住的文件复制链接手动下载，然后进入目录
`C:\Users\\[username]\AppData\Local\electron-builder\Cache\winCodeSign`（注意：username是你自己的用户名，如果Cache目录里没有winCodeSign目录请自己新建此目录），并根据winCodeSign版本新建文件夹比如`winCodeSign-2.6.0`，将下载的文件解压到此目录即可，最后重新运行build命令进行打包。