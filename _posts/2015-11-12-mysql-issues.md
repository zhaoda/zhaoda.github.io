---
title: MySQL 常见问题汇总
date: 2015-11-12 20:00
tags: [mysql, issue]
---

## MySQL 5.6数据导入报 GTID 相关错误

从阿里云备份数据后还原到本地，用命令行 `mysql -uroot -p --default-character-set=<character> -f <dbname> < <backup.sql>` 方式会报如下错误：

```bash
ERROR 1839 (HY000) at line 24: @@GLOBAL.GTID_PURGED can only be set when @@GLOBAL.GTID_MODE = ON.
```

可以通过 `source` 方式导入解决。

```bash
$ mysql -uroot -p
$ use <dbname>;
$ source <backup.sql>;
```

## OS X 通过 brew 安装 MySQL

```bash
# 安装
$ brew install mysql # 5.6
$ brew install mysql55 # 5.5
# 然后查看 brew info mysql 进行后续操作
```

修改 `my.cnf` 中的 `datadir` 切换数据库的存储位置。

https://gist.github.com/mralexho/6cd3cf8b2ebbd4f33165

## 查找本地 my.cnf 位置

```bash
$ sudo /usr/libexec/locate.updatedb
# 可能要等待几分钟，然后继续
$ locate my.cnf
```