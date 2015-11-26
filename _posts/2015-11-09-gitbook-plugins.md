---
title: Gitbook 的使用和常用插件
date: 2015-11-09 17:30
tags: [gitbook, plugin]
---

[Gitbook](https://github.com/GitbookIO/gitbook) 是基于 Node.js 的命令行工具，用来创建漂亮的电子书，它使用 Markdown 或 AsciiDoc 语法来撰写内容，用 Git 进行版本控制，且可以托管在 Github 上。Gitbook 可以将作品编译成网站、 PDF、 ePub 和 MOBI 等多重格式。

如果你不擅长自己搭建 gitbook 环境，还可以使用 [gitbook.com](https://www.gitbook.com) 在线服务来创建和托管你的作品，他们还提供了基于桌面的[编辑器](https://www.gitbook.com/editor)。

## 如何使用

首先在全局安装 gitbook 客户端工具：

```bash
$ npm install gitbook-cli -g
```

然后在你的作品目录中创建两个必需的文件 README.md 和 SUMMARY.md，README.md 是作品的介绍，SUMMARY.md 是作品的目录结构，里面要包含一个章节标题和文件索引的列表：

``` js
# Summary

This is the summary of my book.

* [section 1](section1/README.md)
    * [example 1](section1/example1.md)
    * [example 2](section1/example2.md)
* [section 2](section2/README.md)
    * [example 1](section2/example1.md)
```

根据 SUMMARY.md 的目录结构初始化各个章节文件：

```bash
$ gitbook init
```

运行服务，在编辑内容后实时预览：

```bash
$ gitbook serve
```

服务器启动后，浏览器打开 http://localhost:4000 查看，撰写完后可以生成静态网站用来发布：

```bash
$ gitbook build
```

## 使用插件

Gitbook 本身功能丰富，但同时可以使用插件来进行个性化定制。[Gitbook 插件](http://localhost:4000/start/plugin.html) 里已经有100多个插件，可以在 `book.json` 文件的 `plugins` 和 `pluginsConfig` 字段添加插件及相关配置，添加后别忘了进行安装。

```js
// book.json
{
  "title": "Webpack 中文指南",
  "description": "Webpack 是当下最热门的前端资源模块化管理和打包工具，本书大部分内容翻译自 Webpack 官网。",
  "language": "zh",
  "plugins": [
    "disqus",
    "github",
    "editlink",
    "prism",
    "-highlight",
    "baidu",
    "splitter",
    "sitemap"
  ],
  "pluginsConfig": {
    "disqus": {
      "shortName": "webpack-handbook"
    },
    "github": {
      "url": "https://github.com/zhaoda/webpack-handbook"
    },
    "editlink": {
      "base": "https://github.com/zhaoda/webpack-handbook/blob/master/content",
      "label": "编辑本页"
    },
    "baidu": {
        "token": "a9787f0ab45d5e237bab522431d0a7ec"
    },
    "sitemap": {
        "hostname": "http://zhaoda.net/"
    }
  }
}
```

```bash
# 安装插件
$ gitbook install ./
```

## 常用插件

##### [editlink](https://plugins.gitbook.com/plugin/editlink)

内容顶部显示 `编辑本页` 链接。

##### [ad](https://plugins.gitbook.com/plugin/ad)

在每个页面顶部和底部添加广告或任何自定义内容。

##### [splitter](https://plugins.gitbook.com/plugin/splitter)

在左侧目录和右侧内容之间添加一个可以拖拽的栏，用来调整两边的宽度。

##### [image-captions](https://plugins.gitbook.com/plugin/image-captions)

抓取内容中图片的 `alt` 或 `title` 属性，在图片下面显示标题。

##### [github](https://plugins.gitbook.com/plugin/github)

在右上角显示 github 仓库的图标链接。

##### [anchors](https://plugins.gitbook.com/plugin/anchors)

标题带有 github 样式的锚点。

##### [chart](https://plugins.gitbook.com/plugin/chart)

使用 C3.js 图表。

##### [styles-sass](https://plugins.gitbook.com/plugin/styles-sass)

使用 SASS 替换 CSS。

##### [styles-less](https://plugins.gitbook.com/plugin/styles-less)

使用 LESS 替换 CSS。

##### [ga](https://plugins.gitbook.com/plugin/ga)

添加 Google 统计代码。

##### [disqus](https://plugins.gitbook.com/plugin/disqus)

添加 disqus 评论插件。

##### [sitemap](https://plugins.gitbook.com/plugin/sitemap)

生成站点地图。

##### [latex-codecogs](https://plugins.gitbook.com/plugin/latex-codecogs)

使用数学方程式。

##### [mermaid](https://plugins.gitbook.com/plugin/mermaid)

使用流程图。

##### [book-summary-scroll-position-saver](https://plugins.gitbook.com/plugin/book-summary-scroll-position-saver)

自动保存左侧目录区域导航条的位置。

##### [sharing](https://plugins.gitbook.com/plugin/sharing)

默认的分享插件。

##### [fontsettings](https://plugins.gitbook.com/plugin/fontsettings)

默认的字体、字号、颜色设置插件。

##### [search](https://plugins.gitbook.com/plugin/search)

默认搜索插件。

##### [tbfed-pagefooter](https://plugins.gitbook.com/plugin/tbfed-pagefooter)

自定义页脚，显示版权和最后修订时间。

##### [prism](https://plugins.gitbook.com/plugin/prism)

基于 [Prism](http://prismjs.com/) 的代码高亮。

##### [atoc](https://plugins.gitbook.com/plugin/atoc)

插入 TOC 目录。

##### [ace](https://plugins.gitbook.com/plugin/ace)

插入代码高亮编辑器。

##### [highlight](https://plugins.gitbook.com/plugin/highlight)

默认的代码高亮插件，通常会使用 prism 来替换。

##### [github-buttons](https://plugins.gitbook.com/plugin/github-buttons)

显示 github 仓库的 star 和 fork 按钮。

##### [sectionx](https://plugins.gitbook.com/plugin/sectionx)

分离各个段落，并提供一个展开收起的按钮。

##### [mcqx](https://plugins.gitbook.com/plugin/mcqx)

使用选择题。

##### [include-codeblock](https://plugins.gitbook.com/plugin/include-codeblock)

通过引用文件插入代码。

##### [fbqx](https://plugins.gitbook.com/plugin/fbqx)

使用填空题。

##### [spoiler](https://plugins.gitbook.com/plugin/spoiler)

隐藏答案，当鼠标划过时才显示。

##### [anchor-navigation](https://plugins.gitbook.com/plugin/anchor-navigation)

锚点导航。

##### [youtubex](https://plugins.gitbook.com/plugin/youtubex)

插入 YouTube 视频。

##### [redirect](https://plugins.gitbook.com/plugin/redirect)

页面跳转。

##### [expandable-chapters](https://plugins.gitbook.com/plugin/expandable-chapters)

收起或展开章节目录中的父节点。

##### [baidu](https://plugins.gitbook.com/plugin/baidu)

使用百度统计。

##### [duoshuo](https://plugins.gitbook.com/plugin/duoshuo)

使用多说评论。

##### [jsfiddle](https://plugins.gitbook.com/plugin/jsfiddle)

插入 JSFiddle 组件。

##### [jsbin](https://plugins.gitbook.com/plugin/jsbin)

插入 JSBin 组件。

##### [](https://plugins.gitbook.com/plugin/)

## 开发插件

最好先查看别人的插件是怎么做的，然后再看[官方文档](https://developer.gitbook.com/plugins/index.html)。



