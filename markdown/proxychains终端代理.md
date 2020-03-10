1. proxychains安装  
`sudo apt install proxychains`

2. 编辑proxychains配置  
`vim /etc/proxychains.conf`

3. 将socks4 127.0.0.1 9095改为  
`socks5 127.0.0.1 1080`

ps: 默认的socks4 127.0.0.1 9095是tor代理，而socks5 127.0.0.1 1080是shadowsocks的代理，proxychains.conf文件说明了代理配置格式,如下,这里根据自己使用的代理来配置就行了。  

```bash
ProxyList format
 94 #       type  ip  port  [user pass]
 95 #       (values separated by 'tab' or 'blank')
 96 #
 97 #       only numeric ipv4 addresses are valid
 98 #
 99 #
100 #        Examples:
101 #
102 #       socks5  192.168.67.78   1080    lamer   secret
103 #       http    192.168.89.3    8080    justu   hidden
104 #       socks4  192.168.1.49    1080
105 #       http    192.168.39.93   8080
```

4.使用方法  
在需要代理的命令前加上 proxychains ，如：
```bash
proxychains wget http://xxx.com/xxx.zip
proxychains git clone https://xxxxxxxxx.git
```