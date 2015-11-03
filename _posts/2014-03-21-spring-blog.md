---
title: 使用 Spring 快速搭建博客
date: 2014-03-21 01:14
tags: [spring blog]
---

## 关于Spring

[Spring](https://github.com/zhaoda/spring "Spring")是一个通过GitHub Issues撰写内容的博客引擎，或者说是一个简单、静态化的建站系统。不需要服务器和数据库支持，你可以把它作为一个GitHub代码仓库，并托管在免费的GitHub Pages上运行，然后在这个仓库的Issues系统里撰写日志。

你可以在这个仓库的Issues系统里添加labels标签，这些标签会成为博客的分类，然后新建Issues，并用Markdown语法写日志。

Spring拥有响应式的页面设计，可以在手机、平板和桌面端完美展现；支持IE10+和所有现代浏览器，底端设备做了跳转的降级处理。

你可以快速的安装并运行这个系统。

## 快速安装

### 首先

*   对[Spring](https://github.com/zhaoda/spring "Spring") 这个仓库进行Fork。
*   然后到你Fork的新仓库的设置页面里修改仓库名称（`Repository Name`）。
*   把这个仓库托管到 [GitHub Pages](http://pages.github.com "GitHub Pages") 里作为网站运行，它可以是一个个人/组织网站，也可以是一个项目网站（需要创建gh-pages分支）；关于如果使用GitHub Pages，查看 http://pages.github.com 。
*   当然，你还可以设置独立的域名来访问这个网站，查看 https://help.github.com/articles/setting-up-a-custom-domain-with-pages 。

### 然后

*  打开文件 `index.html` 修改如下配置参数。

```javascript
$.extend(spring.config, {
  // my blog title
  title: 'Spring',
  // my blog description
  desc: "A blog engine written by github issues [Fork me on GitHub](https://github.com/zhaoda/spring)",
  // my github username
  owner: 'zhaoda',
  // creator's username
  creator: 'zhaoda',
  // the repository name on github for writting issues
  repo: 'spring',
  // custom page
  pages: [
  ]
})
```

*    如果你设置了自定义域名，请打开 `CNAME `文件，改成已设置的域名地址。
*    将你的代码修改提交并推送到仓库`master`或`gh-pages`中。

### 接下来

*   到仓库的设置页面打开 `Issues` 功能。
*   进入仓库的issues页面 `https://github.com/your-username/your-repo-name/issues?state=open` 。
*   点击 `New Issue` 创建一个新的，并在里面写一篇日志。

### 最后

*   浏览这个仓库的GitHub Pages链接 `http://your-username.github.io/your-repo-name` ，你可以看到你的博客，测试一下是否可用。
*   至此，你已经搭建好了你的Spring博客。

## 定制开发

### 安装部署

*    首先你需要在本地有一个服务器环境，比如Nginx、Apache等。
*    然后将代码库目录配置到服务器的网站目录中。
*    运行并浏览这个本地网站，类似 `http://localhost/spring/dev.html` 。
*    `dev.html` 是开发模式, `index.html` 是线上模式。

### 目录结构

```bash
spring/
├── css/
|    ├── boot.less  #import other less files
|    ├── github.less  #github highlight style
|    ├── home.less  #home page style
|    ├── issuelist.less #issue list widget style
|    ├── issues.less #issues page style
|    ├── labels.less #labels page style
|    ├── main.less #commo style
|    ├── markdown.less #markdown format style
|    ├── menu.less #menu panel style
|    ├── normalize.less #normalize style
|    ├── pull2refresh.less #pull2refresh widget style
|    └── side.html  #side panel style
├── dist/
|    ├── main.min.css  #css for runtime
|    └── main.min.js  #js for runtime
├── img/  #some icon, startup images
├── js/
|    ├── lib/  #some js librarys need to use
|    ├── boot.js  #boot
|    ├── home.js  #home page
|    ├── issuelist.js #issue list widget
|    ├── issues.js #issues page
|    ├── labels.js #labels page
|    ├── menu.js #menu panel
|    ├── pull2refresh.less #pull2refresh widget
|    └── side.html  #side panel
├── css/
|    ├── boot.less  #import other less files
|    ├── github.less  #github highlight style
|    ├── home.less  #home page style
|    ├── issuelist.less #issue list widget style
|    ├── issues.less #issues page style
|    ├── labels.less #labels page style
|    ├── main.less #commo style
|    ├── markdown.less #markdown format style
|    ├── menu.less #menu panel style
|    ├── normalize.less #normalize style
|    ├── pull2refresh.less #pull2refresh widget style
|    └── side.html  #side panel style
├── dev.html #used to develop
├── favicon.ico #website icon
├── Gruntfile.js #Grunt task config
├── index.html #used to runtime
└── package.json  #nodejs install config
```

### 自定义

*   浏览 `http://localhost/spring/dev.html`，进入开发模式。
*   对源代码进行修改，比如css和js目录中的文件，改成你想要的样子或功能。
*   刷新 `dev.html` 查看变化。

### 构建

*   首先你需要安装 [Node.js](http://nodejs.org/ "Node.js") 。
*   然后安装所需要的依赖包。

    ```bash
$ npm install
```
*   运行Grunt任务进行构建。

    ```bash
$ grunt
```

*   浏览 `http://localhost/spring/index.html`，进入线上模式。
*   如果没有问题，提交并推送你修改的代码。
*   如果你有`gh-pages`分支，别忘了从`master`分支合并修改后的代码。
*   重复以上的步骤，愉快的进行二次开发吧，祝你好运！

## 有问题可以提交Bug

*   查看 [主干](https://github.com/zhaoda/spring/commits/master) 提交中是否已经修复了Bug。
*   查看 [已经提过的问题](https://github.com/zhaoda/spring/issues)。
*   [提交一个新问题](https://github.com/zhaoda/spring/issues/new)，请注明存在问题的浏览器版本和设备平台。

## 谁在用

*   [https://github.com/zhaoda/spring/issues/6](https://github.com/zhaoda/spring/issues/6)

如果你也在使用Spring， [请告诉我](https://github.com/zhaoda/spring/issues/6) 。

## 协议

Spring遵循 [MIT 协议](https://raw.githubusercontent.com/zhaoda/spring/master/LICENSE "MIT License")，欢迎使用。
