### Linux Mint18.3 日常软件安装配置
>实装机器是linux mint18.3，理论上也适用于ubuntu

![city](./resources/city.jpg)

#### contents
1. QQ 8.1 的 安装配置
2. 微信的安装配置
3. 印象笔记的安装配置
4. 安装 Mac-os 主题
5. 怎样自由上网(翻墙)
6. 安装办公软件wps
7. 实用工具推荐：tmux、stacer、oh-my-zsh、SmartGit、Docky
8. chrome实用插件整理

#### QQ 8.1 的 安装配置
---------------------

##### 方案一： Wine + deepingCrossover + deepinQQ 8.1
>日常使用基本没有bug，能够保存密码自动登录  

1. Wine安装  
Wine(Wine Is Not Emulator)，Wine是一个在x86、x86-64上容许类Unix操作系统在X Window System下运行Microsoft Windows程式的软件。  
跟着执行几个命令即可，安装可能有点慢，一个小时内能搞定吧。[-->阅读安装步骤](https://wiki.winehq.org/Ubuntu)  

2. deepinCrossover安装  
如果是64位系统，先添加对32位库的支持：  
~~~sh
sudo dpkg --add-architecture i386
sudo apt-get update
~~~
可能需要添加下列32位库：
~~~sh
sudo apt-get install lib32z1 lib32ncurses5  
~~~
[crossover下载地址](https://pan.baidu.com/disk/home?#/all?vmode=list&path=%2F%E5%B7%A5%E5%85%B7%E5%92%8C%E8%BD%AF%E4%BB%B6%2Fcrossover-%E4%BB%A5%E5%8F%8Aqq%E5%AE%89%E8%A3%85)，到我的网盘下载crossover-15_15.0.3-1_all.deb、crossover-15_15.0.3-1_all-free.deb、deepin-crossover-helper_1.0deepin0_all.deb三个文件，在第一步的Wine安装完毕后按照以上下载说明的顺序依次安装三个deb包。

3. deepinQQ 8.1安装  
deepinCrossover安装好后，到刚才下载三个deb包的地址那儿继续下载第四个deb包:apps.com.qq.im_8.1.17255deepin11_i386.deb，下载好后安装即可正常使用QQ。

##### 方案二： 绿色无需安装精简版QQ
> 缺点；不能保存密码，每次登录都要输入密码，优点：安装步骤忽略为零  

* 下载地址：[QQ.AppImage](https://pan.baidu.com/disk/home?#/all?vmode=list&path=%2F%E5%B7%A5%E5%85%B7%E5%92%8C%E8%BD%AF%E4%BB%B6%2FQQ_Linux)下载好后直接双击并允许可执行权限即可。

#### 微信的安装配置
----------------
>微信官方没有客户端，都是第三方封装的网页版微信，够用了，发送文件都行  

##### 方案一：electron-wechat
[下载地址](https://github.com/geeeeeeeeek/electronic-wechat/releases)，到github找自己要安装的版本的tar包，下载好后，使用tar -xf 命令解压，在把解压目录内的 electronic-wechat 可执行程序 赋予可执行权限，相关命令是 sudo chmod 755 ./electronic-wechat，最后再建立两个软链接到 /usr/local/bin 和 /home/你的用户名/Desktop/ 目录即可，相关命令是： sudo ln -s path/to/electronic-wechat path/to/目标地址，这样做的目的是：让你可以从终端启动微信，并且在桌面建立了一个微信的快捷方式，直接点击即可运行微信。  

##### 方案二：weweChat
[下载地址](https://github.com/trazyn/weweChat/releases)，到这个地址找wewechat的相关deb包下载安装即可，我用的就是这个版本，UI和上面那个有点差别，还不错的。  

#### 印象笔记的安装配置
--------------------
>印象笔记官方也没有开发Linux版本，说是维护成本太大，但是开放了API让第三方程序或是网页可以直接调用，所以有了我们下面这个使用Electron技术封装的网页版印象笔记Whatever，跟网页版看着一样，只不过有了一层桌面软件的壳，值得一提的是 我觉得网页版印象笔记更好用，界面也更现代化，这儿提供一个[Electron的应用中心](https://electronjs.org/apps)，里面很多第三方开发者的app，大部分可以Linux使用，自己找找，说不定有你喜欢的，最后附上Whatever的[下载地址](https://electronjs.org/apps/whatever)，选择适合你的版本下载安装即可。

#### 安装 Mac-os 主题
-------------------
* 安装到Linux Mint  
~~~sh
sudo add-apt-repository ppa:noobslab/macbuntu
sudo apt update
sudo apt install macbuntu-os-icons-lts-v7 macbuntu-os-ithemes-lts-v7
~~~

* 从Linux Mint卸载  
~~~sh
sudo add-apt-repository -r ppa:noobslab/macbuntu
sudo apt update
sudo apt remove macbuntu-os-icons-lts-v7 macbuntu-os-ithemes-lts
-v7
~~~

安装好了要自己去设置界面切换啊～

#### 怎样自由上网(翻墙)
--------------------
1. 从vultr买外国云主机，最低$2.5一个月，基本上是所有服务商里面最便宜的了，配置也是最低[官方地址](https://my.vultr.com/)  
2. 登录自己的服务器  
3. 服务器一键安装shadowsocks服务 [参考地址](https://xyzardq.github.io/2017/03/07/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%80%E9%94%AE%E6%90%AD%E5%BB%BAshadowsocks%E5%8F%8A%E4%BC%98%E5%8C%96/)  
4. 自己电脑安装Shadowsocks-Qt5，设置好服务器地址，端口和本地代理地址和端口  
~~~sh
sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5
~~~
5. chrome安装SwitchyOmega插件，很方便的代理插件，Firefox上也有相应的版本，安装好后设置ip和端口 映射到第四步Shadowsocks-Qt5里设置的本地ip和端口即可享受自由的上网生活，附上一篇[教程](http://www.cylong.com/blog/2017/04/09/chrome-SwitchyOmega/)

#### 安装办公软件wps
------------------
>Linux上最好用的办公软件，没有之一，无奈官方宣布暂时不更新了，linux mint自带的Liboffice不太好用，格式跟office不太兼容，[wps官网下载直达](http://linux.wps.cn/)

#### 实用工具推荐
---------------
1. tmux终端工具
>Tmux 简单来说就是终端里的『窗口管理器』，强烈推荐。附上
[使用教程](http://wdxtub.com/2016/03/30/tmux-guide/)

2. stacer系统管理工具
>系统进程可视化管理和垃圾清理工具，就是相当于Linux上的电脑管家，还能查看系统占用，卸载软件包，配置开机启动，管理apt软件源等等，非常强大好用，附上[下载地址](https://sourceforge.net/projects/stacer/)

3. oh-my-zsh终端模拟器
>支持插件、主题、自定义配置的强大的终端模拟器，用来替代自带的bash，附上[安装教程](http://yijiebuyi.com/blog/b9b5e1ebb719f22475c38c4819ab8151.html)

4. SmartGit仓库管理可视化工具
>大名鼎鼎的分布式版本控制软件git的可视化工具，免费又强大，只是界面是英文的，不过我想你应该不太会介意

5. Docky  
>漂亮的dock工具栏，方便酷炫实用  

6. Peek
>强大的屏幕录制工具，支持输出gif/webm/apng/webm格式的媒体文件  

7. Inkscape
>跨平台免费强大的svg图片绘制工具  

#### chrome实用插件整理
---------------------
1. infinity标签页  
>浏览器首页管理器，可以添加很多网站的快捷进入图标，方便美观
2. Octotree  
>让你在浏览github仓库时可以利用左侧的文件资源浏览树更方便地查看项目结构和页面跳转
3. Postman  
>api测试神器，很强大，甚至能发送带cookie的请求，各种请求、响应编辑功能也非常实用
4. SwitchyOmega  
>大家都用的代理软件，不说了
5. 印象笔记剪藏  
>随时随地把网络资源保存到你的笔记本里
6. SimpRead - 简阅  
>让浏览器支持纯净的阅读模式
7. Full Page Screen Capture  
>全屏截图，真的是全屏，你的浏览器标签页有多长，它就能截多长
8. 高效网页截图编辑插件
>另一个好用的截图插件

##### 感谢阅读
有时间还会继续更新本文
