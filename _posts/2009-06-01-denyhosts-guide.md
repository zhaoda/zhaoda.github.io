---
title: 安装 DenyHosts 防止 ssh 暴力破解服务器
date: 2009-06-01 00:00:00 +0800
tags: [denyhosts, ssh]
description: DenyHosts是Python语言写的一个程序，它会分析sshd的日志文件（/var/log/secure），当发现重复的攻击时就会记录IP到/etc/hosts.deny文件，从而达到自动屏IP的功能。
---

DenyHosts是Python语言写的一个程序，它会分析sshd的日志文件（/var/log/secure），当发现重复的攻击时就会记录IP到/etc/hosts.deny文件，从而达到自动屏IP的功能。

```bash
# 安装
$ wget http://cdnetworks-kr-2.dl.sourceforge.net/project/denyhosts/denyhosts/2.6/DenyHosts-2.6.tar.gz
$ tar zxvf DenyHosts-2.6.tar.gz
$ cd DenyHosts-2.6
$ python setup.py install
$ cd /usr/share/denyhosts/
$ cp denyhosts.cfg-dist denyhosts.cfg

# 配置
$ vi denyhosts.cfg
# 根据需要修改如下配置
# DENY_THRESHOLD_INVALID = 5
# DENY_THRESHOLD_VALID = 5
# DENY_THRESHOLD_ROOT = 5
# HOSTNAME_LOOKUP=NO
# ADMIN_EMAIL = your email
# DAEMON_LOG = /data/logs/denyhosts

# 运行服务
$ cp daemon-control-dist daemon-control
$ chown root daemon-control
$ chmod 700 daemon-control
$ ln -s /usr/share/denyhosts/daemon-control /etc/init.d/denyhosts
$ chkconfig --add denyhosts
$ chkconfig --level 2345 denyhosts on
$ service denyhosts start

# 查看denyhosts运行情况
ps -ef | grep deny
tail /var/log/secure -f
tail /data/logs/denyhosts -f
tail /etc/hosts.deny -f
```