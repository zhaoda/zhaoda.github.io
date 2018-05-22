---
title: CentOS 7.5 + PHP 5.6.36 + Nginx 1.14.0 配置笔记
date: 2018-05-22 23:00:00 +0800
tags: [centos, php, nginx, linux]
---

## 创建用户、组和目录
```bash
# web 用户和组
groupadd www
useradd -g www www -s /sbin/nologin

# 网站目录
mkdir -p /data/htdocs

# 日志目录
mkdir -p /data/logs

# 创建软件包下载和编译目录，后续软件都下载到这里
mkdir -p /data/software

# 创建软件安装目录，PHP、Nginx 将安装到这里
mkdir -p /usr/local/webserver

# 可写目录进行如下设置
# chown -R www:www /path
```

## 服务器基础环境和依赖安装

```bash
# 如果系统自带 Apache、PHP、MySQL，先卸载
yum remove httpd
yum remove php
yum remove mysql

# 升级所有软件包
yum update -y

# 安装可能用到的软件包，大部分其实已经内置在系统中
# gcc：GNU 编译器套装
# gcc-c++：GCC 的 C++ 支持
# autoconf：在sh下制作供编译、安装和打包软件的配置脚本的工具
# libjpeg-turbo-static：处理 JPEG 图像数据格式的自由库
# libpng：处理 PNG 图像数据格式的自由库
# freetype: 字体光栅化库
# libxml2: 解析XML文档的函数库
# zlib: 提供数据压缩之用的库
# glibc：C函数库
# glib2：跨平台的、用C语言编写的五个底层库的集合
# bzip2：比传统的 gzip 或者 ZIP 的压缩效率更高的库
# ncurses：虚拟终端中的“类GUI”应用软件工具箱
# curl：利用URL语法在命令行下工作的文件传输工具
# e2fsprogs：用以维护ext2，ext3和ext4文件系统的工具程序集
# krb5-libs：网络身份验证系统
# libidn：通过IETF国际域名（IDN）实施字符串预处理、Punycode 和 IDNA规格定义的工具
# openssl：安全通信软件包
# openldap：轻型目录访问协议
# nss-pam-ldapd：使用目录服务器的 nsswitch 模块
# openldap-clients：LDAP 客户端实用工具
# openldap-servers：LDAP 服务
# bison：自动生成语法分析器程序
# lrzsz：远程上传和下载文件
# libmcrypt：mcrypt 算法库
# mhash：mhash 算法库
# ImageMagick：用于查看、编辑位图文件以及进行图像格式转换的开放源代码软件套装
# libmemcached: memcache 客户端
yum -y install gcc gcc-c++ autoconf libjpeg-turbo-static libjpeg-turbo-devel libpng libpng-devel freetype freetype-devel libxml2 libxml2-devel pcre pcre-devel zlib zlib-devel glibc glibc-devel glib2 glib2-devel bzip2 bzip2-devel ncurses ncurses-devel curl curl-devel e2fsprogs e2fsprogs-devel krb5-libs krb5-devel libidn libidn-devel openssl openssl-devel openldap openldap-devel nss-pam-ldapd openldap-clients openldap-servers bison lrzsz libmcrypt libmcrypt-devel mcrypt mhash ImageMagick ImageMagick-devel libmemcached libmemcached-devel
```

## 安装其他 PHP 依赖库

```bash
# libiconv：提供了一个iconv()的函数，以实现一个字符编码到另一个字符编码的转换
wget http://ftp.gnu.org/pub/gnu/libiconv/libiconv-1.15.tar.gz
tar zxvf libiconv-1.15.tar.gz
cd libiconv-1.15
./configure --prefix=/usr/local
make
make install

# 在 /etc/ld.so.conf 加一行 /usr/local/lib，再执行如下
/sbin/ldconfig

```

## 安装 PHP

```bash
# 下载并解压
wget http://cn2.php.net/get/php-5.6.36.tar.gz/from/this/mirror -O php-5.6.36.tar.gz
tar zxvf php-5.6.36.tar.gz
cd php-5.6.36

# 编译安装
# 内存如果小于1G，增加 --disable-fileinfo
./configure --prefix=/usr/local/webserver/php --with-config-file-path=/usr/local/webserver/php/etc --with-mysql --with-mysqli --with-curl --with-mcrypt --with-gd --with-openssl --with-mhash --with-xmlrpc --with-gettext --with-bz2 --with-zlib --with-iconv-dir=/usr/local --with-freetype-dir --with-jpeg-dir --with-png-dir --with-libxml-dir --enable-xml --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --enable-mbregex --enable-mbstring --enable-gd-native-ttf --enable-pcntl --enable-sockets --enable-zip --enable-soap --enable-ftp --enable-exif --enable-opcache --enable-fpm --with-fpm-user=www --with-fpm-group=www --without-pear

# 如果遇到 undefined reference to `libiconv_open' 错误
# make 后面增加 ZEND_EXTRA_LIBS='-liconv'
make ZEND_EXTRA_LIBS='-liconv'
make install

# 创建配置文件
cp php.ini-production /usr/local/webserver/php/etc/php.ini

# 复制启动脚本到 init.d 目录并修改权限
cp sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
chmod 700 /etc/init.d/php-fpm

# 设置开机启动
chkconfig php-fpm on

# 查看开机启动服务
chkconfig --list

# 启动服务
service php-fpm start

# 停止服务
service php-fpm stop

# 重启服务
service php-fpm reload

# 创建软连接，方便全局执行 php-fpm start | stop | reload
ln -s /usr/local/webserver/php/bin/php /usr/bin/php
ln -s /etc/init.d/php-fpm /usr/bin/php-fpm
```

## 安装 PHP 扩展

```bash
# memcache 扩展
# memcached 支持 Binary Protocol，而 memcache 不支持，意味着 memcached 会有更高的性能
# https://pecl.php.net/package/memcached
# 3.x.x 支持 php 7，2.x.x 支持 php 5.2-5.6
wget https://pecl.php.net/get/memcached-2.2.0.tgz
tar zxvf memcached-2.2.0.tgz
cd memcached-2.2.0
/usr/local/webserver/php/bin/phpize
./configure --with-php-config=/usr/local/webserver/php/bin/php-config
make
make install

# 如果需要再本地缓存业务侧数据，安装 apcu
# apc 包含 opcode 缓存和 KV 数据缓存
# PHP 5.5.0 及后续版本中已经绑定了 OPcache 扩展，所以不需要安装 apc
# apcu 只包含 KV 数据缓存
# https://pecl.php.net/package/APCu
wget https://pecl.php.net/get/apcu-4.0.11.tgz
tar zxvf apcu-4.0.11.tgz
cd apcu-4.0.11
/usr/local/webserver/php/bin/phpize
./configure --with-php-config=/usr/local/webserver/php/bin/php-config
make
make install

# 图片处理 ImageMagick 扩展
# https://pecl.php.net/package/imagick
wget https://pecl.php.net/get/imagick-3.4.3.tgz
tar zxvf imagick-3.4.3.tgz
cd imagick-3.4.3
/usr/local/webserver/php/bin/phpize
./configure --with-php-config=/usr/local/webserver/php/bin/php-config
make
make install
```

## 修改 php.ini 配置文件

```ini
; vi /usr/local/webserver/php/etc/php.init

; 该选项设置为 On 时，将在所有的脚本中使用输出控制
output_buffering = On

; 将 PHP 所能打开的文件限制在指定的目录树
open_basedir = /data/htdocs/:/tmp/

; 禁用函数
disable_functions = system,passthru,shell_exec,escapeshellarg,escapeshellcmd,proc_close,proc_open,proc_get_status,dl,chroot,show_source,syslog,readlink,symlink,popepassthru,stream_socket_server

; 禁止暴露 PHP 被安装在服务器上
expose_php = Off

; 禁止错误信息输出
display_errors = Off

; 错误信息记录到服务器错误日志
log_errors = On

; 设置脚本错误将被记录到的文件
; 该文件必须是web服务器用户可写的
; mkdir /data/logs
; touch /data/logs/php_error.log
; chown www:www /data/logs/php_error.log
error_log = /data/logs/php_error.log

; 传递给存储处理器的参数
session.save_path = "/tmp"

; 防止 Nginx 文件类型错误解析漏洞
cgi.fix_pathinfo = 0

; 文件上传临时目录
upload_tmp_dir = /tmp

; 时区
date.timezone = "Asia/Shanghai"

; 允许使用 PHP 代码开始标志的缩写形式
short_open_tag = On

; php 扩展目录
; php 5.2
; extension_dir = "/usr/local/webserver/php/lib/php/extensions/no-debug-non-zts-20060613/"
; php 5.4
; extension_dir = "/usr/local/webserver/php/lib/php/extensions/no-debug-non-zts-20100525/"
; php 5.5
; extension_dir = "/usr/local/webserver/php/lib/php/extensions/no-debug-non-zts-20121212/"
extension_dir = "/usr/local/webserver/php/lib/php/extensions/no-debug-non-zts-20131226/"

; 文件结尾添加扩展配置，按需添加
[apcu]
extension = "apcu.so"
apc.enabled = on
apc.shm_size = 256M
apc.enable_cli = on
[memcached]
extension = "memcached.so"
[imagick]
extension = "imagick.so"
[opcache]
zend_extension="opcache.so"
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
opcache.enable_cli=1
```

## 修改 php-fpm.conf 配置文件

```ini
; cp /usr/local/webserver/php/etc/php-fpm.conf.default /usr/local/webserver/php/etc/php-fpm.conf
; vi /usr/local/webserver/php/etc/php-fpm.conf
; 查找并修改如下配置，其他保持默认

; 错误日志的位置
error_log = /data/logs/php-fpm.log
; 错误级别
log_level = error
; 如果子进程在设定的时间内收到该参数设定次数的 SIGSEGV 或者 SIGBUS退出信息号，则FPM会重新启动
emergency_restart_threshold = 10
; 用于设定平滑重启的间隔时间
emergency_restart_interval = 1m
; 设置子进程接受主进程复用信号的超时时间
process_control_timeout = 5s
; 设置 FPM 在后台运行
daemonize = yes
; 设置允许连接到 FastCGI 的服务器 IPV4 地址
listen.allowed_clients = 127.0.0.1
; 子进程的数量是固定的
pm = static
; pm 设置为 static 时表示创建的子进程的数量
pm.max_children = 64
; 设置启动时创建的子进程数目。仅在 pm 设置为 dynamic 时使用
pm.start_servers = 10
; 设置空闲服务进程的最低数目。仅在 pm 设置为 dynamic 时使用
pm.min_spare_servers = 10
; 设置空闲服务进程的最大数目。仅在 pm 设置为 dynamic 时使用
pm.max_spare_servers = 30
; 设置每个子进程重生之前服务的请求数
pm.max_requests = 500
; FPM 状态页面的网址
pm.status_path = /phpfpm_status
; 设置单个请求的超时中止时间
request_terminate_timeout = 30
; 设置文件打开描述符的 rlimit 限制
rlimit_files = 65535
; 禁止输出错误信息
php_flag[display_errors] = off
```

## 启动 php

```bash
# 修改文件句柄数为 65535
ulimit -SHn 65535

# 启动 php-cgi 进程
# 监听 127.0.0.1 的 9000 端口
# 进程数为 64（如果服务器内存小于3GB，可以只开启64个进程）
# 用户为www
php-fpm start
```

## 安装 nginx

```bash
wget http://nginx.org/download/nginx-1.14.0.tar.gz
tar zxvf nginx-1.14.0.tar.gz
cd nginx-1.14.0/
# --prefix=PATH：指定nginx的安装目录
# --user=name：设置nginx工作进程的用户
# --group=name：设置nginx工作进程的组
# --with-pcre：设置PCRE库的源码路径，如果已通过 yum 方式安装，使用 --with-pcre 自动找到库文件
# --with-http_stub_status_module：用来监控 Nginx 的当前状态
# --with-http_ssl_module：使用https协议模块
# --with-http_realip_module：通过这个模块允许我们改变客户端请求头中客户端IP地址值
# 更多配置参考 https://tengine.taobao.org/nginx_docs/cn/docs/install.html

./configure --prefix=/usr/local/webserver/nginx --user=www --group=www --with-pcre --with-http_stub_status_module --with-http_ssl_module --with-http_realip_module
make
make install

ln -s /usr/local/webserver/nginx/sbin/nginx /usr/bin/
```

## 升级 nginx

```bash
# make 之后不要 make install
mv /usr/local/webserver/nginx/sbin/nginx /usr/local/webserver/nginx/sbin/nginx.old
cp objs/nginx /usr/local/webserver/nginx/sbin/
nginx -t
kill -USR2 `cat /usr/local/webserver/nginx/logs/nginx.pid`
kill -QUIT `cat /usr/local/webserver/nginx/logs/nginx.pid.oldbin`
nginx -v
```

## 修改 nginx.conf 配置文件

Nginx 配置文件主要分成四部分：main（全局设置）、server（主机设置）、upstream（上游服务器设置，主要为反向代理、负载均衡相关配置）和 location（URL匹配特定位置后的设置），每部分包含若干个指令。main 部分设置的指令将影响其它所有部分的设置；server 部分的指令主要用于指定虚拟主机域名、IP 和端口；upstream 的指令用于设置一系列的后端服务器，设置反向代理及后端服务器的负载均衡；location 部分用于匹配网页位置（比如，根目录“/”,“/images”,等等）。他们之间的关系式：server 继承 main，location 继承 server；upstream 既不会继承指令也不会被继承，它有自己的特殊指令，不需要在其他地方的应用。

```conf
# vi /usr/local/webserver/nginx/conf/nginx.conf
# 查找并修改如下配置，其他保持默认

# 运行的用户和用户组
user  www www;
# 全局错误日志和级别
error_log  /data/logs/nginx_error.log  error;
# 进程文件
pid  /usr/local/webserver/nginx/logs/nginx.pid;
# 单个进程打开的最多文件描述符数目
worker_rlimit_nofile 65535;

events 
{
    # 事件模型，epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型
    use epoll;
    # 单个进程可以处理的最大连接数
    worker_connections 65535;
}

http {
    # 日志名称和格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    # 允许客户端请求的最大单文件字节数
    client_max_body_size 8m;
    # 防止网络阻塞
    tcp_nopush on;
    # 开启gzip压缩
    gzip on;
    # 隐藏 nginx 的版本信息
    server_tokens off;
    # 包含其它自定义虚拟主机配置文件
    # mkdir /usr/local/webserver/nginx/conf/vhost
    include vhost/*.conf;

    # 注释掉 server { } 部分的默认配置
}
```

## nginx 开机启动

```bash
# vi /etc/rc.local
/usr/local/webserver/nginx/sbin/nginx

# 测试
# nginx -t
# 重启和停止
# nginx -s reload | stop
```

## Nginx 站点加密

+ 创建脚本 `vi /usr/local/sbin/htpasswd.pl`，输入
```perl
#!/usr/bin/perl
use strict;
my $pw=$ARGV[0] ;
print crypt($pw,$pw)."\n";
```
+ 生成密码
```bash
chmod +x /usr/local/sbin/htpasswd.pl
# passwd 是要生成的密码
/usr/local/sbin/htpasswd.pl passwd
# 创建完成后删除 htpasswd.pl
```
+ 创建存放用户名和密码的文件 `vi /usr/local/webserver/nginx/conf/.htpasswd`
+ 输入 `user:passwd`，user 是用户名，passwd 是刚才生成的密码
+ 在需要加密的 server 或者 location 中增加如下配置
```conf
auth_basic	"login...";
auth_basic_user_file	/usr/local/webserver/nginx/conf/.htpasswd
```

## https ssl 证书配置

+ 如果需要创建一个服务器监控和管理站点，用来查看 phpinfo 或 nginx 状态等信息，建议将该站点设置密码和 https 访问

```bash
# 替换下面的 example.com 为你的服务器运维域名
mkdir -p /usr/local/webserver/nginx/conf/ssl
cd /usr/local/webserver/nginx/conf/ssl
openssl genrsa -des3 -out example.com.key 1024 795dsl
## 输入密码、确认密码
openssl req -new -key example.com.key -out example.com.csr
## 分别输入之前设置的密码、CN、Beijing、Beijing、example.com、example.com、*.example.com、邮箱、回车、回车
cp example.com.key example.com.key.org
openssl rsa -in example.com.key.org -out example.com.key
## 输入之前设置的密码
openssl x509 -req -days 365 -in example.com.csr -signkey example.com.key -out example.com.crt
```
+ 在需要开启 https 的 server 或者 location 中增加如下配置
```conf
	ssl on;
	ssl_certificate ssl/example.com.crt;
	ssl_certificate_key ssl/example.com.key;
```

## 配置运维站点

+ 替换下面的 example.com 为你的服务器运维域名
+ 创建站点配置文件 `vi /usr/local/webserver/nginx/conf/vhost/example.com`

```conf
server
{
	listen 80 default;
	server_name	_;
	access_log  off;
	deny all;
}

server
{
	listen 8080 default;
	server_name	_;
	access_log  off;
	deny all;
}

server {
	listen 80;
	server_name example.com;
	index index.html index.htm index.php;
	root  /data/htdocs/example.com;

	location / {
		rewrite ^(.*) https://$server_name$1 permanent;
	}
	access_log  off;
}

server
{
	listen	443;
	server_name  example.com;
	if ($host != 'example.com') {
		rewrite	^/(.*)$	http://www.example.com/	permanent;
	}
	index index.html index.htm index.php;
	root  /data/htdocs/example.com;

	ssl on;
	ssl_certificate ssl/example.com.crt;
	ssl_certificate_key ssl/example.com.key;
	
	auth_basic	"login...";
	auth_basic_user_file  /usr/local/webserver/nginx/conf/.htpasswd;

	location /status {
		stub_status on;
	}

	location /phpfpm_status {
		fastcgi_pass  127.0.0.1:9000;
		fastcgi_index index.php;
		fastcgi_param  HTTPS on;
		include fastcgi.conf;	
	}

	location ~ \.(php|php5)?$
	{      
		fastcgi_pass  127.0.0.1:9000;
		fastcgi_index index.php;
		fastcgi_param  HTTPS on;
		include fastcgi.conf;
	}
	
	location ~ \.(gif|jpg|jpeg|png|bmp|swf|js|css)$
	{
		expires      30d;
	}

	access_log  off;
}
```

+ 创建站点目录 `mkdir /data/htdocs/example.com`，创建以下文件
+ index.html

```html
<html>
<head>
<title>example.com</title>
</head>
<body>
<ul>
<li><a href="/status" target="_blank">status</a></li>
<li><a href="/phpfpm_status" target="_blank">phpfpm_status</a></li>
<li><a href="/phpinfo.php" target="_blank">phpinfo</a></li>
<li><a href="/ocp.php" target="_blank">opcache</a></li>
<li><a href="/apc.php" target="_blank">apcu</a></li>
</ul>
<div><iframe src="/status" style="width: 400px; height: 100px;"></iframe></div>
<div><iframe src="/phpfpm_status" style="width: 400px; height: 240px;"></iframe></div>
</body>
</html>
```

+ phpinfo.php

```php
<?phpinfo();?>
```

+ ocp.php，[https://gist.github.com/ck-on/4959032](https://gist.github.com/ck-on/4959032)
+ apc.php，[https://github.com/krakjoe/apcu/blob/master/apc.php](https://github.com/krakjoe/apcu/blob/master/apc.php) ，修改文件中的用户名和密码

## 重启并测试

```bash
nginx -s reload
php-fpm reload
```

上面配置的运维域名如果没有解析，可以到 `/etc/hosts` 中配置，然后访问 `https://运维域名` 看个页面输出是否正确；如果一切顺利，继续到 `/usr/local/webserver/nginx/conf/vhost` 中添加站点配置吧
