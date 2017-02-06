---
title: Browserify 使用指南
date: 2015-10-16 14:28:00 +0800
tags: [browserify, nodejs]
---

![browserify!](/assets/2015/browserify.png)

# 让浏览器加载Nodejs模块

目前[NPM](https://www.npmjs.com/)上有二十多万个[NodeJS](http://nodejs.org)模块，它们都是通过CMD的方式打包的，除了特定的可以使用CMD模块加载器加载的模块，大部分nodejs模块无法直接使用到浏览器环境中。

[Browserify](http://browserify.org/)是一个供浏览器环境使用的模块打包工具，像在node环境一样，也是通过`require('modules')`来组织模块之间的引用和依赖，既可以引用npm中的模块，也可以引用自己写的模块，然后打包成js文件，再在页面中通过`<script>`标签加载。

当然对于很多NodeJS模块，比如涉及到io操作的模块，就算通过browserify打包后肯定也无法运行在浏览器环境中，这种情况下就会用到为它们重写的支持浏览器端的分支模块，可以在[browserify search](http://browserifysearch.org/)搜索到这些模块。

# 用例

比如写一个入口`main.js`文件，使用`require()`来引用其它模块，包括相对目录中的`'./foo.js'`和`'../lib/bar.js'`，还有在`node_modules/`目录中的名为`'gamma'`的模块。

> browserify通过[node's module lookup algorithm](https://github.com/substack/node-resolve)来查找`node_modules/`中的模块）

``` js
// main.js
var foo = require('./foo.js');
var bar = require('../lib/bar.js');
var gamma = require('gamma');

var elem = document.getElementById('result');
var x = foo(100) + bar('baz');
elem.textContent = gamma(x);
```

众所周知，这些被引用的模块会用通过`module.exports`或`exports`输出它们的功能接口：

``` js
// foo.js
module.exports = function (n) { return n * 111 }
```

接下来就可以用`browserify`命令对它们进行打包了:

```bash
$ browserify main.js > bundle.js
```

`main.js`和它所引用的模块会按依赖序列整体打包到`bundle.js`。

> browserify使用[required](https://github.com/defunctzombie/node-required)来查找`require()`依赖队列。

接下来，就可以在html中加载这个文件`<script src="bundle.js"></script>`来运行了。

# 安装Browserify

```bash
$ npm install -g browserify
```

# 通过命令行使用

```
Usage: browserify [entry files] {OPTIONS}

常用选项:

    --outfile, -o  指定打包后的输出文件
                   如果不指定，将输到stdout，比如shell

    --require, -r  通过模块名或文件路径指定需要打包到bundle中的其他模块
                   Optionally use a colon separator to set the target

      --entry, -e  入口文件

     --ignore, -i  打包过程中忽略依赖的某个文件，当成空模块打包，引用它不会报错

    --exclude, -u  打包过程中排除依赖的某个文件，比忽略选项更严格，引用它会报错

   --external, -x  指定某个文件不要打包到bundle，它可能会打包在其他的bundle中，比如jquery会打包到公共的bundle中

  --transform, -t  指定打包过程中使用的转换模块

    --command, -c  指定打包过程中使用的命令行转换

  --standalone -s  生成UMD模式的bundle模块，可以在AMD、CMD中使用

       --debug -d  生成source maps，并被注释到bundle.js的尾部

       --help, -h  显示帮助

高级选项:

  --insert-globals, --ig, --fast    [default: false]

    如果设置为true，会跳过代码分析，强制在每个模块的闭包作用域中插入如下参数
    process, global, __filename, and __dirname

    优点: 打包速度快
    缺点: 生成多余的参数

  --insert-global-vars, --igv

    需要在代码分析中检测和定义的全局变量，需要和--insert-globals一起使用
    默认包括 __filename,__dirname,process,Buffer,global 用逗号分隔

  --detect-globals, --dg            [default: true]

    在代码分析过程中检测全局变量 process, global, __filename, and __dirname

    优点: 像npm模块那样工作
    缺点: 打包速度慢

  --ignore-missing, --im            [default: false]

    忽略 `require()` 引用

  --noparse=FILE

    对于默写确定不包含`require()`的文件，忽略他们的解析过程（比如jquery），加快打包速度

  --no-builtins

    如果打包后的文件要在node环境中使用，请使用这个选项，保证node内置模块不被打包到bundle中

  --no-commondir

    不是用相对路径，__filename,__dirname会被解析成绝对路径

  --no-bundle-external

    不打包扩展模块

  --bare

    --no-builtins --no-commondir --insert-global-vars "__filename,__dirname" 的别名
    如果bundle在node环境中运行，请使用--bare

  --no-browser-field, --no-bf

    忽略package.json中的browser属性
    如果bundle在node环境中运行

  --node

    --bare --no-browser-field 的别名

  --full-paths

    所有模块都是用绝对路径进行引用

  --deps

    输出模块的依赖序列（一个数组）

  --list

    输出所有模块的路径列表

  --extension=EXTENSION

    指定有效的模块文件扩展名

  --global-transform=MODULE, -g MODULE

    指定一个全局的转换模块

  --plugin=MODULE, -p MODULE

    注册一个插件模块

如何在转换模块和插件再插入参数项：

  使用subarg语法在中括号中插入子命令，比如：

    -t [ foo -x 3 --beep ]

  会这样执行

    foo(file, { x: 3, beep: true })

```

# nodejs内置模块的转换

理想情况下，大部分不涉及io操作的模块可以在浏览器中直接运行。

对于nodejs内置模块，在`require()`它们的时候，会被转换成如下模块来打包，以适配浏览器环境。

* [assert](https://www.npmjs.com/package/assert)
* [buffer](https://www.npmjs.com/package/buffer)
* [console](https://www.npmjs.com/package/console-browserify)
* [constants](https://www.npmjs.com/package/constants-browserify)
* [crypto](https://www.npmjs.com/package/crypto-browserify)
* [domain](https://www.npmjs.com/package/domain-browser)
* [events](https://www.npmjs.com/package/events)
* [http](https://www.npmjs.com/package/stream-http)
* [https](https://www.npmjs.com/package/https-browserify)
* [os](https://www.npmjs.com/package/os-browserify)
* [path](https://www.npmjs.com/package/path-browserify)
* [punycode](https://www.npmjs.com/package/punycode)
* [querystring](https://www.npmjs.com/package/querystring-es3)
* [stream](https://www.npmjs.com/package/stream-browserify)
* [string_decoder](https://www.npmjs.com/package/string_decoder)
* [timers](https://www.npmjs.com/package/timers-browserify)
* [tty](https://www.npmjs.com/package/tty-browserify)
* [url](https://www.npmjs.com/package/url)
* [util](https://www.npmjs.com/package/util)
* [vm](https://www.npmjs.com/package/vm-browserify)
* [zlib](https://www.npmjs.com/package/browserify-zlib)

另外, 如果是用到了如下5个全局变量，它们会在打包过程中被改写成可以适配浏览器环境的。

* [process](https://www.npmjs.com/package/process)
* [Buffer](https://www.npmjs.com/package/buffer)
* global 全局变量window
* __filename - 文件名
* __dirname - 文件路径

# 其他用例

## 在全局作用域中（模块外部）引用指定模块

```bash
$ browserify -r through -r duplexer -r ./my-file.js:my-module > bundle.js
```

在页面中直接引用这些外部模块

```html
<script src="bundle.js"></script>
<script>
  var through = require('through');
  var duplexer = require('duplexer');
  var myModule = require('my-module');
  /* ... */
</script>
```

## 导出source maps文件

使用[exorcist](https://github.com/thlorenz/exorcist)导出`.js.map`文件

```bash
$ browserify main.js --debug | exorcist bundle.js.map > bundle.js
```

## 导出多个包

如果多个页面的打包结果中包含公共的模块，可以将公共模块（common.js）单独打包出来，以节省请求流量并优化缓存策略

``` js
# beep.js
var robot = require('./robot.js');
console.log(robot('beep'));
```

``` js
# boop.js
var robot = require('./robot.js');
console.log(robot('boop'));
```

这两个文件都引用了`robot.js`

``` js
# robot.js
module.exports = function (s) { return s.toUpperCase() + '!' };
```

```
# 把公共的模块打包成common.js
$ browserify -r ./robot.js > static/common.js
$ browserify -x ./robot.js beep.js > static/beep.js
$ browserify -x ./robot.js boop.js > static/boop.js
```

如何引用？

``` html
<!--beep.html-->
<script src="common.js"></script>
<script src="beep.js"></script>
```

``` html
<!--boop.html-->
<script src="common.js"></script>
<script src="boop.js"></script>
```

> 上面这个用例，还可以用[插件](https://github.com/substack/browserify-handbook#partitioning)解决，会更方便

## api

Browserify本身也是一个nodejs模块，提供的方法大致和上面介绍的命令行选项相同，具体的api请参考[browserify methods](https://github.com/substack/node-browserify/blob/master/readme.markdown#methods)，这里不再敖述。

``` js
var browserify = require('browserify');
var b = browserify();
b.add('./browser/main.js');
b.bundle().pipe(process.stdout);
```

# events api

```js
//当文件被进行打包时出发，可以用来监听文件变化来重新进行打包
b.on('file', function (file, id, parent) {})
b.pipeline.on('file', function (file, id, parent) {})

// 当每个package.json被读取时触发
b.on('package', function (pkg) {})
b.pipeline.on('package', function (pkg) {})

// 当执行`.bundle()`时触发
b.on('bundle', function (bundle) {})

// 当执行`.reset()`时触发
b.on('reset', function () {})

// 当一个文件被转换时触
b.on('transform', function (tr, file) {})
b.pipeline.on('transform', function (tr, file) {})
```

# package.json

browserify会先通过`package.json`中的`"main"`属性来查找模块入口，如果没有`"main"`属性，就在目录中搜索`"index.js"`文件。当然，`package.json`中还定义了一些browserify特有的属性：

## browser属性

"[browser](https://gist.github.com/4339901)"属性用来优先指定browserify打包是的模块入口文件，这样可以和`"main"`属性区分开

``` json
"browser": "./browser.js"
```

还可以指定细分的打包替换文件

``` json
"browser": {
  "fs": "level-fs",
  "./lib/ops.js": "./browser/opts.js"
}
```

## browserify.transform

在`package.json`中指定转换模块，可以打包过程中自动执行

``` json
"browserify": { "transform": [ "brfs" ] }
```

# 使用插件

对于一些更先进的用例，转换模块并不能满足需求，插件是更适合的选择。插件是以包实例为其第一个参数，其他属性作为后面的参数。插件可以用来做一些转换模块做不到的花哨功能。比如[factor-bundle](https://www.npmjs.com/package/factor-bundle)插件可以用来自动生成多个入口文件共用的common.js模块。

```bash
$ browserify x.js y.js -p [ factor-bundle -o bundle/x.js -o bundle/y.js ] \
  > bundle/common.js
```

# 参考链接

* [Browserify插件列表](https://www.npmjs.com/browse/keyword/browserify-plugin)
* [Browserify转换列表](https://github.com/substack/node-browserify/wiki/list-of-transforms)
* [Browserify第三方工具](https://github.com/substack/node-browserify/wiki/browserify-tools)
* [Browserify参考手册](https://github.com/substack/browserify-handbook)
* [Browserify：浏览器加载Node.js模块](http://javascript.ruanyifeng.com/tool/browserify.html)
* [通过Browserify在浏览器中使用NodeJS模块](https://www.ibm.com/developerworks/cn/web/1501_chengfu_browserify)
