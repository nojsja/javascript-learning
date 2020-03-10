
## Docker 运行容器化的Tim和wechat

### Contents
* 安装docker
* 安装容器
* 容器管理

### 安装docker

> 
> Docker Engine-Community 支持以下的 Ubuntu 版本：
> 
> -   Xenial 16.04 (LTS)
> -   Bionic 18.04 (LTS)
> -   Cosmic 18.10
> -   Disco 19.04
> -   其他更新的版本……
> 
> Docker Engine - Community 支持上 x86_64（或 amd64）armhf，arm64，s390x （IBM Z），和 ppc64le（IBM的Power）架构。
> 
> * * *
> 
> #### 卸载旧版本
> 
> Docker 的旧版本被称为 docker，docker.io 或 docker-engine 。如果已安装，请卸载它们：
> 
`$ sudo apt-get remove docker docker-engine docker.io containerd runc`
> 
> 当前称为 Docker Engine-Community 软件包 docker-ce 。
> 
> 安装 Docker Engine-Community，以下介绍两种方式。
> 
> * * *
> 
> #### 使用 Docker 仓库进行安装
> 
> 在新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。之后，您可以从仓库安装和更新 Docker 。
> 
> #### 设置仓库
> 
> 更新 apt 包索引。
> 
`$ sudo apt-get update`
> 
> 安装 apt 依赖包，用于通过HTTPS来获取仓库:
> 
`$ sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common`
> 
> 添加 Docker 的官方 GPG 密钥：
> 
`$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
> 
> 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88 通过搜索指纹的后8个字符，验证您现在是否拥有带有指纹的密钥。
> 
`$ sudo apt-key fingerprint 0EBFCD88`
>      
> pub   rsa4096 2017-02-22 \[SCEA\]  
>       9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88  
> uid           \[ unknown\] Docker Release (CE deb) <docker@docker.com>  
> sub   rsa4096 2017-02-22 \[S\]  
> 
> 使用以下指令设置稳定版仓库
> 
`$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ ubuntu $(lsb_release -cs) stable"`
> 
> #### 安装 Docker Engine-Community
> 
> 更新 apt 包索引。
> 
`$ sudo apt-get update`
> 
> 安装最新版本的 Docker Engine-Community 和 containerd ，或者转到下一步安装特定版本：
> 
`$ sudo apt-get install docker-ce docker-ce-cli containerd.io`
> 
> 要安装特定版本的 Docker Engine-Community，请在仓库中列出可用版本，然后选择一种安装。列出您的仓库中可用的版本：
> 
`$ apt-cache madison docker-ce `
>   
>   docker-ce | 5:18.09.1~3-0~ubuntu-xenial | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages  
>   docker-ce | 5:18.09.0~3-0~ubuntu-xenial | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages  
>   docker-ce | 18.06.1~ce~3-0~ubuntu       | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages  
>   docker-ce | 18.06.0~ce~3-0~ubuntu       | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages  
>   ...  
> 
> 使用第二列中的版本字符串安装特定版本，例如 5:18.09.1~3-0~ubuntu-xenial。
> 
`$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io`
> 
> 测试 Docker 是否安装成功，输入以下指令，打印出以下信息则安装成功:
> 
`$ sudo docker run hello-world`
> #### 安装 docker-compose
`$ sudo apt install docker-compose`
> #### 切换docker源为国内的源
`$ sudo gedit /etc/docker/daemon.json`
>
> 写入配置
> ```
>  {
>    "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
>  }
> ```
>

### 安装容器
* Tim => `sudo docker pull bestwu/qq`
* wechat => `sudo docker pull bestwu/wechat`

### 容器管理
1. 获取audio的组ID  
`getent group audio | cut -d: -f3`
2. 容器启动文件  
接下来创建一个yml文件，比如说这里创建 docker-tim.yml，添加如下内容：
```yml
version: '2'
services:
 qq:
   image: bestwu/qq:office    # 后面这个 office 改成 latest ， 登录的就是QQ，否则是Tim
   container_name: qq
   devices:
     - /dev/snd #声音
   volumes:
     - /tmp/.X11-unix:/tmp/.X11-unix
     - $HOME/TencentFiles:/TencentFiles
   environment:
     - DISPLAY=unix$DISPLAY
     - XMODIFIERS=@im=ibus #中文输入
     - QT_IM_MODULE=ibus
     - GTK_IM_MODULE=ibus
     - AUDIO_GID=29 # 可选 (29 parrotsec) 主机audio gid 解决声音设备访问权限问题
     - GID=1000 # 可选 默认1000 主机当前用户 gid 解决挂载目录访问权限问题
     - UID=1000 # 可选 默认1000 主机当前用户 uid 解决挂载目录访问权限问题
```

3. 容器启动命令  
编写start-tim.sh：
```yml
#!/bin/sh
# 密码更改为自己的
# -d 指定为后台启动
echo "yw020154" | sudo docker-compose -f docker-tim.yml up -d
```

4. 容器的常用操作
```sh
# 启动/停止/重启
sudo docker start/stop/restart qq
# 终止容器进程
sudo docker kill qq
# 查看运行容器
sudo docker ps
```