---
title: Discuz 论坛附件、头像等资源迁移到阿里云 OSS 并开启 CDN 的解决方案
date: 2018-05-23 22:30:00 +0800
tags: [discuz, oss, ossfs, 附件]
---

Discuz 论坛的附件、头像等资源不断增长，如果和主程序一起存储在云服务器上，就会导致云盘要定期进行扩容操作；附件如果需要进行 CDN 加速也只能使用回源策略进行 CDN 配置。为了一劳永逸的解决附件存储和加速问题，将附件等资源迁移到对象存储服务上是一个好的选择，本文以阿里云 ECS、OSS 服务为背景，其他云计算平台也可以参考。

## 创建 OSS Bucket

+ 在 [OSS](https://oss.console.aliyun.com/) 管理页面分别给论坛附件、头像创建 Bucket，名称为 `img-bucket` 和 `avatar-bucket`（如果自定为其他名字，后文提到的 Bucket 名称请自行替换），`区域`选择和论坛所在云服务器 ESC 一致的区域，记录下该区域的 `Endpoint`，`存储类型`选择标准存储，`读取权限`选择私有
+ 到 [访问控制](https://ram.console.aliyun.com/#/user/list) 创建网站用户，生成 `AccessKey`和`AccessKeySecret`，给该用户授权 `AliyunOSSFullAccess`

## 开启 CDN

+ 到刚创建好的 Bucket 的域名管理中绑定用户域名，比如`img.example.com`和`avatar.example.com`
+ 勾选`阿里云 CDN 加速`，如果域名 dns 解析在阿里云，可以勾选`自动添加 CNAME 记录`，如果不在请自行添加域名的`cname`为`阿里云 CDN 加速域名`
+ 勾选`CDN 缓存自动刷新`
+ 建议单独为 CDN 申请单独的根域名，这样 CDN 请求不会带上网站的 cookie 等信息
+ 到 [CDN](https://cdn.console.aliyun.com/) 域名管理中对新创建的域名进行配置
    + 开启`私有Bucket回源`
    + `缓存过期时间`添加规则，内容目录`/`过期时间为3年，权重99
    + `设置HTTP头`添加规则，Cache-Control 设置为 `max-age=315360000`
    + 开启`智能压缩`
    + 其他设置请根据实际需求自行修改

## 迁移附件和头像

+ 安装 ossfs，该工具能让您在 Linux 系统中把 OSS Bucket 挂载到本地文件系统中

> ossfs 基于s3fs 构建，具有s3fs 的全部功能。主要功能包括
> + 支持POSIX 文件系统的大部分功能，包括文件读写，目录，链接操作，权限，uid/gid，以及扩展属性（extended attributes）
> + 通过OSS 的multipart 功能上传大文件
> + MD5 校验保证数据完整性

```bash
# 下载并安装
wget http://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/assets/attach/32196/cn_zh/1524809958556/ossfs_1.80.4_centos7.0_x86_64.rpm?spm=a2c4g.11186623.2.6.XJB3Dd&file=ossfs_1.80.4_centos7.0_x86_64.rpm
mv ossfs_1.80.4_centos7.0_x86_64.rpm?spm=a2c4g.11186623.2.6.QwMtDE ossfs_1.80.4_centos7.0_x86_64.rpm
yum localinstall ossfs_1.80.4_centos7.0_x86_64.rpm
```

+ 将每个 `bucket name`、`AccessKey`和`AccessKeySecret`用`:`连接后填写到 `/etc/passwd-ossfs`，每行一个，并设置文件权限为 640

```conf
img-bucket:AccessKey:AccessKeySecret
my-bucket:AccessKey:AccessKeySecret
```

```bash
chmod 640 /etc/passwd-ossfs
```

+ 安装 mailcap，解决 bucket 中的文件 `Content-Type` 全是 `application/octet-stream` 的问题

```bash
yum install mailcap
```

+ 将论坛附件和头像剪切到其他临时目录

```bash
# 假设论坛根目录为 /data/htdocs/www ，后续脚本将以此为准，请根据实际情况修改
mv /data/htdocs/www/data/attachment /data/
mv /data/htdocs/www/uc_server/data/avatar /data/
```

+ 挂载 OSS Bucket

```bash
# 重新创建被剪的目录
mkdir /data/htdocs/www/data/attachment
mkdir /data/htdocs/www/uc_server/data/avatar

# 获取运行 php-fpm 和 nginx 的系统用户 uid 和 gid，比如 www 用户
# uid=1000(www) gid=1000(www) 组=1000(www)
id www

# 挂载 bucket
# Endpoint：请使用内网地址，速度快且流量免费
# -o noxattr：如果你没有使用eCryptFs等需要XATTR的文件系统，可以提升性能
# -o kernel_cache：使用文件系统的 page cache
# -o allow_other：允许其他用户访问挂载文件夹
# -ouid -ogid：制定挂载目录的用户和组权限
ossfs img-bucket /data/htdocs/www/data/attachment -ourl=Endpoint -o noxattr -o kernel_cache -o allow_other -ouid=1000 -ogid=1000
ossfs avatar-bucket /data/htdocs/www/uc_server/data/avatar -ourl=Endpoint -o noxattr -o kernel_cache -o allow_other -ouid=1000 -ogid=1000
```

+ 复制附件、头像到 bucket

```bash
cp -rf /data/attachment/* /data/htdocs/www/data/attachment
cp  -rf /data/avatar/* /data/htdocs/www/uc_server/data/avatar
# 到 oss bucket 文件管理验证数据没有问题后可以删除临时拷贝
rm -rf /data/attachment/
rm -rf /data/avatar/
```

+ 如何卸载 bucket

```bash
# root用户
umount /data/htdocs/www/data/attachment
umount /data/htdocs/www/uc_server/data/avatar
# 非root用户
fusermount -u /data/htdocs/www/data/attachment
fusermount -u /data/htdocs/www/uc_server/data/avatar
```

+ 开机启动，以 CentOS 7.0 为例，其他系统参考 [FAQ](https://github.com/aliyun/ossfs/wiki/FAQ#14)

```bash
# 根据下面的模板创建启动脚本
vi /etc/init.d/ossfs
# 添加执行权限
chmod a+x /etc/init.d/ossfs
# 设置开机启动
chkconfig ossfs on
```

```bash
#! /bin/bash
#
# ossfs      Automount Aliyun OSS Bucket in the specified direcotry.
#
# chkconfig: 2345 90 10
# description: Activates/Deactivates ossfs configured to start at boot time.

ossfs img-bucket /data/htdocs/www/data/attachment -ourl=Endpoint -o noxattr -o kernel_cache -o allow_other -ouid=1000 -ogid=1000
ossfs avatar-bucket /data/htdocs/www/uc_server/data/avatar -ourl=Endpoint -o noxattr -o kernel_cache -o allow_other -ouid=1000 -ogid=1000
```

## 修改论坛附件和头像地址

+ 到论坛后台 -> 全局 -> 上传设置 -> 基本设置 中修改 `本地附件 URL 地址`

![论坛附件url地址](/assets/2018/discuz-attachment-url.jpg)

+ 到论坛后台 -> 站长 -> UCenter 设置 中修改头像调用方式为`使用静态地址调用头像`

![论坛头像调用方式](/assets/2018/discuz-avatar-url.jpg)

+ 由于有用户没有上传头像而使用默认头像，到 `avatar` bucket 的根目录添加3个默认头像文件 noavatar_big.gif、noavatar_middle.gif 和 noavatar_small.gif
+ 修改`source/function/function_core.php`中头像地址

```php
// 查找下面的代码并修改
// $file = $ucenterurl.'/data/avatar/'.$dir1.'/'.$dir2.'/'.$dir3.'/'.substr($uid, -2).($real ? '_real' : '').'_avatar_'.$size.'.jpg';
// return $returnsrc ? $file : '<img src="'.$file.'" onerror="this.onerror=null;this.src=\''.$ucenterurl.'/images/noavatar_'.$size.'.gif\'" />';
// 使用头像cdn地址
$cdnurl = 'http://avatar.example.com/';
$file = $cdnurl.$dir1.'/'.$dir2.'/'.$dir3.'/'.substr($uid, -2).($real ? '_real' : '').'_avatar_'.$size.'.jpg';
return $returnsrc ? $file : '<img src="'.$file.'" onerror="this.onerror=null;this.src=\''.$cdnurl.'noavatar_'.$size.'.gif\'" />';
```

+ 修改`uc_server/avatar.php`中头像重定向地址

```php
$avatar = './data/avatar/'.get_avatar($uid, $size, $type);
if(file_exists(dirname(__FILE__).'/'.$avatar)) {
	if($check) {
		echo 1;
		exit;
	}
	$random = !empty($random) ? rand(1000, 9999) : '';
  // rewrite avatar url
  $avatar = 'http://avatar.example.com/'.substr($avatar, 14);
  $avatar_url = empty($random) ? $avatar : $avatar.'?random='.$random;
} else {
	if($check) {
		echo 0;
		exit;
	}
	$size = in_array($size, array('big', 'middle', 'small')) ? $size : 'middle';
  // $avatar_url = 'images/noavatar_'.$size.'.gif';
  // rewrite avatar url
  $avatar_url = 'http://avatar.example.com/noavatar_'.$size.'.gif';
}

if(empty($random)) {
	header("HTTP/1.1 301 Moved Permanently");
	header("Last-Modified:".date('r'));
	header("Expires: ".date('r', time() + 86400));
}

// header('Location: '.UC_API.'/'.$avatar_url);
header('Location: '.$avatar_url);
```

## 论坛 JS、CSS、样式图片等资源接入 CDN

+ 到 [CDN](https://cdn.console.aliyun.com/) 域名管理中添加域名 `static.example.com`
+ 回源设置中源站信息类型选择`IP`，并填写`源站地址IP`为论坛外网 ip，端口 80
+ 其他缓存和 HTTP 头设置参考上面 OSS Bucket 的 CDN 设置
+ 添加论坛 Nginx 的 vhost 配置，如果是其他 web server 请参考添加

```conf
server
{
	listen	80;
	server_name static.example.com;

	index index.html index.htm;
	root  /data/htdocs/www;
	# error_page  404 = /topic-1.html;
	expires max;

	location ~ /\.git
	{
		return 404;
	}

	location ~ ^/.*\.(php|php5)$
	{
		deny all;
	}
	
	access_log  off;
}
```

+ + 到论坛后台 -> 全局 -> 性能优化 -> 服务器优化 中修改 `JS 文件 URL` 和 `CSS 文件 URL` 为 `自定义 URL` 并填写 CDN 地址 `http://static.example.com/data/cache/`

![论坛 JS、CSS、样式图片等资源接入 CDN](/assets/2018/discuz-static-url.jpg)

## 小云 APP 缩略图接入 CDN

+ 如果论坛使用小云 APP 开发了客户端程序，且开启了`生成缩略图`功能，同样可以参照上面附件、头像的方式接入 OSS 和 CDN
+ 创建 `thumb` bucket 并开启 CDN 加速域名 `thumb.example.com`
+ 用 ossfs 将 `/data/htdocs/www/data/appbyme/thumb` 目录挂载到 `thumb` bucket，并将已有缩略图拷贝进去
+ 复制一份 `/data/htdocs/www/mobcent/app/config/mobcent.php` 为 `/data/htdocs/www/mobcent/app/config/my_mobcent.php`
+ 修改 `my_mobcent.php` 中 `cdndomain` 的值为 `thumb.example.com`
+ 修改 `/data/htdocs/www/mobcent/app/components/web/ImageUtils.php` 中缩略图地址

```php
private static function _getThumbUrlFile($image, $thumb) {
    //支持自定义CDN域名
    $cacheurl = Yii::app()->params['mobcent']['cache']['cdndomain'];
    if(empty($cacheurl)){
        $cacheurl = Yii::app()->getController()->dzRootUrl;
    }
    // return sprintf('%s/%s/%s/%s_%s', 
    //     $cacheurl,
    //     MOBCENT_THUMB_URL_PATH,
    //     self::_getThumbTempPath($image),
    //     (isset($_GET['sdkVersion']) && $_GET['sdkVersion'] > '1.0.0') ? 'xgsize' : 'mobcentSmallPreview',
    //     $thumb
    // );
    // 修改缩略图地址
    return sprintf('%s/%s/%s_%s', 
        $cacheurl,
        self::_getThumbTempPath($image),
        (isset($_GET['sdkVersion']) && $_GET['sdkVersion'] > '1.0.0') ? 'xgsize' : 'mobcentSmallPreview',
        $thumb
    );
}
```

## 后记

+ 至此，Discuz 论坛全站资源、附件、头像都接入了 OSS 和 CDN，将降低论坛主服务器 http 请求量压力并提高页面打开速度
+ 除了本文使用的 ossfs 方案将附件接入 OSS，还有一些其他方案将附件接入 OSS 或 CDN；比如最简单的 CDN 回源方式将附件接入 CDN；还可以通过 [ossftp](https://help.aliyun.com/document_detail/32190.html?spm=a2c4g.11186623.6.1061.3oclSk
) 工具绑定 OSS，然后[开启论坛远程附件方式](https://help.aliyun.com/document_detail/32191.html?spm=a2c4g.11186623.6.1067.nBMco5)来将附件接入 OSS 和 CDN；但是这些方案都没有本文的方案更具有通用性和易用性

## 参考

+ [ossfs 安装和使用](https://help.aliyun.com/document_detail/32196.html?spm=a2c4g.11186623.6.1073.za6nvQ)
+ [ossfs 中文文档](https://github.com/aliyun/ossfs/blob/master/README-CN.md)
+ [ossfs 常见问题](https://github.com/aliyun/ossfs/wiki/FAQ)
+ [Discuz如何存储远程附件到OSS](https://help.aliyun.com/document_detail/32191.html?spm=a2c4g.11186623.6.1067.nBMco5)
+ [discuz附件图片迁移阿里云OSS](https://lvtao.net/tool/discuz-file-move-aliyun-oss.html)
+ [ossftp 安装和使用](https://help.aliyun.com/document_detail/32190.html?spm=a2c4g.11186623.6.1061.3oclSk)
