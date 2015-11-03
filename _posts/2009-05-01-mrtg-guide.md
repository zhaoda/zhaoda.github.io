---
title: 安装配置 MRTG 监控服务
date: 2009-05-01 00:00
tags: [mrtg]
---

Multi Router Traffic Grapher - MRTG是一个监控网络链路流量负载的工具软件，通过snmp协议得到设备的流量信息，并将流量负载以包含PNG格式的图形的HTML文档方式显示给用户，以非常直观的形式显示流量负载。

```bash
# 如果没有安装snmp，先安装snmp
$ wget http://jaist.dl.sourceforge.net/project/net-snmp/net-snmp/5.7.2/net-snmp-5.7.2.tar.gz
$ tar zxvf net-snmp-5.7.2.tar.gz
$ cd net-snmp-5.7.2
$ ./configure --prefix=/usr/local/snmp --with-openssl=/usr/ --with-mib-modules=ucd-snmp/diskio
# 根据提示输入
# 回车
# 3
# 你的邮箱
# 服务器的hostname
# 回车
$ make
$ make install
$ /usr/local/snmp/sbin/snmpd
$ vi /etc/rc.local
# 加入
# /usr/local/snmp/sbin/snmpd

# 如果没有安装GD，还要安装GD
$ wget http://www.libgd.org/releases/gd-2.0.35.tar.gz
$ tar zxvf gd-2.0.35.tar.gz
$ cd gd-2.0.35/
$ ./configure --prefix=/usr/local/gd2 --with-png --with-freetype --with-jpeg --with-zlib  --with-fontconfig
$ make
$ make install
$ cd..

# 安装MRTG
$ wget http://oss.oetiker.ch/mrtg/pub/mrtg.tar.gz
$ tar zxvf mrtg.tar.gz
$ cd mrtg-2.17.0/
$ ./configure --prefix=/usr/local/mrtg-2 --with-gd-lib=/usr/local/gd2/lib --with-png-inc=/usr/local/gd2/include
$ make
$ make install
$ mkdir -p /etc/mrtg
$ /usr/local/mrtg-2/bin/cfgmaker --global 'WorkDir: /data/htdocs/www/mrtg'  \
  --global 'Options[_]: bits,growright' \
  --output /etc/mrtg/mrtg.cfg    \
  public@localhost

$ env LANG=C /usr/local/mrtg-2/bin/mrtg /etc/mrtg/mrtg.cfg

$ /usr/local/mrtg-2/bin/indexmaker --output=/data/htdocs/www/mrtg/index.html /etc/mrtg/mrtg.cfg

# 添加自动执行脚本
$ crontab -e
# */5 * * * *  /usr/local/mrtg-2/bin/mrtg /etc/mrtg/mrtg.cfg --logging /data/logs/mrtg.log
```