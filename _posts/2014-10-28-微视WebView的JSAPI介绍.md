---
title: 微视WebView的JSAPI介绍
date: 2014-10-28 17:35
---

# 简介

和[微信的JSAPI](http://qydev.weixin.qq.com/wiki/index.php?title=WeixinJS%E6%8E%A5%E5%8F%A3)一样，[微视](http://www.weishi.com)的webview中也内置了一套jsapi，当webview打开后，会初始化jsapi，初始化完成后会派发给document一个WeishiJSBridgeReady事件并构建好window.WeishiJSBridge对象，然后就可以使用window.WeishiJSBridge.invoke方法来调用jsapi的具体功能。

# 初始化

```javascript
// 定义微视JSAPI
var WSBridge = function() {
  if(typeof arguments[0] === 'function') {
    var callback = arguments[0]
    if(window.WeishiJSBridge && window.WeishiJSBridge.invoke) {
      WSBridge.build.call(window.WeishiJSBridge, callback)
    } else {
      $doc.on('WeishiJSBridgeReady', function() {
        WSBridge.build.call(window.WeishiJSBridge, callback)
      })
    }

    return
  }

  var params = Array.prototype.slice.call(arguments)

  if(WSBridge.wait) {
    WSBridge.wait.push(params)
  } else {
    setTimeout(function() {
      WSBridge.apply(this, params)
    }, 1000)
  }
}

WSBridge.wait = []

WSBridge.build = function(callback) {
  var wait = WSBridge.wait

  this.init(function(message, responseCallback) {})

  WSBridge = this.invoke

  $.each(wait, function(i, params) {
    WSBridge.apply(window, params)
  })

  callback.call(this)
}

WSBridge(function() {
  // 微视jsapi加载成功
})
```

# 使用

```javascript
// apiname：jsapi接口名称
// params：接口参数
// callback：回调函数
WeishiJSBridge.invoke(apiname, params, callback)
```

# 返回值

返回值通过回调函数的参数进行返回，类型是json对象，旧版微视android客户端返回的是json字符串，需要用JSON.parse兼容。

```javascript
// 返回值实例
{
  "code": 0, // 0为成功
  "response": { // 接入层返回的数据
    "ret": 0,
    "errcode": 0,
    "msg": "成功",
    "data": {
      // 接入层返回的数据
    }
  }
}
```

# 权限

目前微视jsapi只对内部qq.com、weishi.com 域开放，暂不支持外域接入申请。


# 数据请求类API

```javascript
// 请求转发
// 将通常web侧的ajax请求，通过客户端的jsapi进行代理转发，
// 这个请求会带上登录态和加密的token，
// 来解决web侧无法获取登录态和加密的问题，更加安全可靠。
WeishiJSBridge.invoke('request.forward', {
  path: 'info/clientInfo.php', // 接入层的请求地址
  method: 'get', // get or post
  params: {} // 参数
})
```

# 页面跳转类型API

```javascript
// 详情页
WeishiJSBridge.invoke('view.detail', {
  tweetid: '2002018099834136' // 微视id
})

// 客人页
WeishiJSBridge.invoke('view.profile', {
  uid: '1000047' // uid
})

// 频道页
WeishiJSBridge.invoke('view.channel', {
  name: '美女', // 频道名
  tweetid: '' // 定位到指定微视的微视id
})

// 标签页
WeishiJSBridge.invoke('view.tag', {
  name: '中国好声音', // 标签名
  tweetid: '' // 定位到指定微视的微视id
})

// 我的二维码名片
WeishiJSBridge.invoke('view.weblogin')

// 邀请好友
WeishiJSBridge.invoke('view.inviteFriends')

// 推荐关注默认
WeishiJSBridge.invoke('view.suggestedPeopleDefault')

// 推荐关注名人
WeishiJSBridge.invoke('view.suggestedPeopleStar')

// 推荐关注达人
WeishiJSBridge.invoke('view.suggestedPeoplePopular')

// 推荐关注朋友
WeishiJSBridge.invoke('view.suggestedPeopleFriends')

// 扫一扫
WeishiJSBridge.invoke('view.qrscan')

// 打开摄像头
WeishiJSBridge.invoke('view.camera')

// 打开长视频
WeishiJSBridge.invoke('view.camera.longvideo')

// 打开动态影集
WeishiJSBridge.invoke('view.camera.photo')

// 打开本地视频
WeishiJSBridge.invoke('view.camera.localvideo')

// 发现页
WeishiJSBridge.invoke('view.discovery')

// 新的朋友
WeishiJSBridge.invoke('view.newFriends')

// 独立的热门页面
WeishiJSBridge.invoke('view.popularweishi')

// 独立的频道页面
WeishiJSBridge.invoke('view.channelhomepage')
```

# 视图操作类API

```javascript
// 关闭当前webview
WeishiJSBridge.invoke('action.closeWindow')

// 隐藏toolbar
WeishiJSBridge.invoke('action.hideToolbar')

// 显示toolbar
WeishiJSBridge.invoke('action.showToolbar')

// 设置页面标题
WeishiJSBridge.invoke('action.setTitle', {
  title: '新标题' // 标题
})

// 打开新页面
WeishiJSBridge.invoke('action.openURLInWindow', {
  url: 'http://weishi.com', // 页面地址
  hideToolbar: '1' // 是否隐藏toolbar
})

// 分享
WeishiJSBridge.invoke('action.share', {
  url: 'http://weishi.com', // 页面地址
  imgurl: 'http://mat1.gtimg.com/www/mb/webapp/weishi/image/medal/1002_detail.png', // 图片地址
  title: '一赞成名', // 标题
  content: '徽章分享' // 摘要
})
```

# 调试工具

http://z.weishi.qq.com/app/api.html

![24f9e0b5e71533d66f2e1cfa45d8859d](https://cloud.githubusercontent.com/assets/546659/4806086/70ae1994-5e85-11e4-9290-597e12205206.png)

# 更新日志

日期 | 日志
-------- | --------
2014-09-16 | 文档初始化
2014-09-19 | 增加分享功能api