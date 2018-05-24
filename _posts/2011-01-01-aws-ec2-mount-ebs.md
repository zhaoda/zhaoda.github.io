---
title: AWS EC2 挂载 EBS
date: 2011-01-01 00:00:00 +0800
tags: [ec2, ebs]
description: 如何在 AWS EC2 挂载 EBS
---

当EC2的EBS（增量式备份和持久性存储，动态磁盘）进行扩容或新增的时候，需要重新挂载。

```bash
# 格式化
$ mkfs.ext3 /dev/sdf
# 挂载
$ mkdir /data
$ mount -t ext3 /dev/sdf /data
# 重启后自动挂载
$ vi /etc/fstab
# 添加
# /dev/sdf /data ext3 defaults 0 0
```