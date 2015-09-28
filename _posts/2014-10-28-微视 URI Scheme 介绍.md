---
title: 微视 URI Scheme 介绍
date: 2014-10-28 17:25
---

[微视](http://www.weishi.com)APP统一资源标识符。

# 格式

```
<scheme name> : <path> [ ? <query> ]
```

`<scheme name>`：微视scheme协议名称，ios中是`weishiiosscheme`，android中是`weishiandroidscheme`；

`<path>`：页面路径；

`<query>`：可选项目，查询参数，用&隔开的键值对`<key>`=`<value>`。


# 功能

序号 | 资源 | URI Scheme | 支持版本
--------- | --------- | --------- | ---------
1 | 详情页 | `<scheme name>`://detail?tweetid=微视id | 2.7+
2 | 客人页 | `<scheme name>`://userprofile?uid=uid | 2.7+
3 | 频道页 | `<scheme name>`://channel?name=频道名称&tweetid=定位到指定微视的微视id | 2.7+
4 | 标签页 | `<scheme name>`://tag?name=标签名称&tweetid=定位到指定微视的微视id | 2.7+
5 | 我的二维码 | `<scheme name>`://myqrcard | 2.7+
6 | 邀请好友 | `<scheme name>`://invitefriends | 2.7+
7 | 推荐关注名人 | `<scheme name>`://suggestedpeople?type=star | 2.7+
8 | 推荐关注达人 | `<scheme name>`://suggestedpeople?type=popular | 2.7+
9 | 推荐关注朋友 | `<scheme name>`://suggestedpeople?type=friends | 2.7+
10 | 扫一扫   | `<scheme name>`://qrscan | 2.7+
11 | 拍摄 | `<scheme name>`://opencamera | 2.7+
12 | 发现页   | `<scheme name>`://discovery | 2.7+
13 | 新的朋友 | `<scheme name>`://newfriends | 2.7+
14 | 发现-热门 | `<scheme name>`://popularweishi | 2.7+
15 | 发现-频道 | `<scheme name>`://channelhomepage | 2.7+
16 | 勋章墙 | `<scheme name>`://medalwall | 2.7+
17 | 打开webview | `<scheme name>`://webview?url=打开的链接 | 2.7+
18 | 微视星语 | `<scheme name>`://pickstar | 2.8+

# 调试工具
http://z.weishi.qq.com/app/scheme.html

![512e7ff1578297f2052f8062bf7b9bc4](https://cloud.githubusercontent.com/assets/546659/4805999/1c65c374-5e84-11e4-9cbd-47b7cb478df6.png)

# 更新日志

日期 | 日志
--------- | ---------
2014-09-16 | 微视2.7版本最新支持
2014-10-28 | 微视2.8版本最新支持