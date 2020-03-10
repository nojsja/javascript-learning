在linux系统中，一般配置好shadowsocks之后，浏览器设置好代理，浏览器就可以翻墙。但是由于ss使用的是`socks5`协议，而大部分终端都只支持`http`和`https`等协议，终端是无法直接通过ss来翻墙。通过polipo这个轻量级的缓存web代理程序来转换，可实现终端翻墙。

#### 安装shadowsocks[](http://keliu.me/2018/12/08/ss/#%E5%AE%89%E8%A3%85shadowsocks)

通过pip可以非常简单地安装。需要安装ss需要的依赖。

```
sudo apt-get update
sudo apt-get install python-pip
sudo apt-get install python-setuptools m2crypto

pip install shadowsocks
```

#### 启动shadowsocks[](http://keliu.me/2018/12/08/ss/#%E5%90%AF%E5%8A%A8shadowsocks)

使用`sslocal`命令来启动shadowsocks。

一般在`/etc`目录下创建一个`shadowsocks.json`文件：

```
vi /etc/shadowsocks.json
```

保存如下形式的ss服务端信息：

```
{
    "server":"11.22.33.44",
    "server_port":6666,
    "local_port":1080,
    "password":"123456",
    "timeout":300,
    "method":"aes-256-cfb"
}
```

启动ss。

```
sslocal -c /etc/shadowsocks.json
```

可以设置开机自动启动服务，还有浏览器代理的配置，此处也都暂时不讲。

#### 安装配置polipo[](http://keliu.me/2018/12/08/ss/#%E5%AE%89%E8%A3%85%E9%85%8D%E7%BD%AEpolipo)

安装：

```
sudo apt-get install polipo
```

polio的配置文件在`/etc/polipo/config`目录。打开，编辑保存如下信息：

```
# This file only needs to list configuration variables that deviate
# from the default values.  See /usr/share/doc/polipo/examples/config.sample
# and "polipo -v" for variables you can tweak and further information.

logSyslog = true
logFile = /var/log/polipo/polipo.log

proxyAddress = "0.0.0.0"

socksParentProxy = "127.0.0.1:1080"
socksProxyType = socks5
proxyPort = 8123

chunkHighMark = 50331648
objectHighMark = 16384

serverMaxSlots = 64
serverSlots = 16
serverSlots1 = 32
```

重新启动polipo服务：

```
/etc/init.d/polipo restart
```

#### 使用代理[](http://keliu.me/2018/12/08/ss/#%E4%BD%BF%E7%94%A8%E4%BB%A3%E7%90%86)

polipo的默认端口号是 8123，**每次使用**代理前，**必须**进行如下操作：

```
export http_proxy=http://127.0.0.1:8123
```

然后可以验证是否成功：

```
curl www.google.com
```

**取消代理**：

```
unset http_proxy
```

如果想**持久化**运行，可以将` export http_proxy=http://127.0.0.1:8123`这个语句添加到` ~/.bashrc`文件内，并用`source ~/.bashrc`命令使之生效。
