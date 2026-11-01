---
title: 两行 robots.txt，让四家大厂同时认账：AI 训练退出终于有了通用开关
date: 2026-11-01 08:50:00 +0800
tags: [AI, robots.txt]
description: 2026 年 10 月 30 日，OpenAI、Google、微软、Anthropic 同时认了一个 robots.txt 新写法：两行就能一次性退出四家的 AI 训练。但它不管抓取、不追溯旧数据，Google 还会顺手连引用一起关掉——加之前先搞清这三处。
---

2026 年 10 月 30 日，AI 圈发生了一件平时不会上头条、但每个站长都该知道的事：OpenAI、Google、微软、Anthropic 在同一天宣布，将支持同一个 robots.txt 信号，让网站一次性退出四家的 AI 训练。这是我做个人博客这些年，第一次看到四家平时互相较劲的大厂在"怎么尊重站长"这件事上用同一套写法。

<!--more-->

## 以前退出训练有多麻烦

先说旧账。过去你想说"别拿我的内容去训练模型"，得一家一家写规则：Google 有 Google-Extended，OpenAI 有 GPTBot，Anthropic 有 ClaudeBot，每家名字不一样、语义也不完全一样。站越做越大，这张清单就越长，还得时不时回来核对哪家又改了名字。

新方案把这张清单压成了一个"政策令牌"（policy token）：不再写爬虫的名字，而是写用途本身。Anthropic 的标准负责人 Kevin Kelley 在同一天向 IETF 的 AI Preferences 工作组提交了草案 draft-kelley-aipref-training-preference-signal-00，标题就叫《Machine-Readable Training Preference Signal》。写法只有两行：

```
User-Agent: __usage_ai-training
Disallow: /
```

想留一部分例外也很直接，沿用 robots.txt 本来的 Allow 语法就行，比如只放行新闻资料包：

```
User-Agent: __usage_ai-training
Disallow: /
Allow: /press-kit/
```

设计上它故意没发明新语法：路径匹配、最长匹配优先这些规则全部沿用 2022 年发布的 RFC 9309。双下划线开头也不是装饰，草案的说法是，这样可以避免被现有的解析器误匹配。思路很务实：不改协议，只统一一句话。

## 四家的时间表，根本不在一条线上

别被"同一天宣布"骗了——四家真正动手的时间完全不同，这也是这篇最值得先说清的地方：

- **Anthropic：已经开始做了。** Kelley 在邮件里说公司"已经开始实施对该草案的支持"，但没给上线日期，还提醒"需要一些时间把支持铺到各个服务、处理不可避免的边界情况"。
- **OpenAI：未来几个月。** 它的公告只有短短几段，措辞是"在未来几个月内实施"，并说实施时会再公布细节；现有控制不变，新信号不会取代已有的 robots.txt 规则。
- **微软：2027 年 2 月 1 日。** 这是四家里唯一给了硬日期的，从那天起按抓取顺序开始执行新的训练和引用偏好。
- **Google：2027 年，文档里写的是 2027 年初。** 它的 Search Central 博客由 John Mueller 署名，措辞是"目标是在 2027 年与其他 AI 提供商一起支持这一新控制"。

还有一个时间点要单独记：这份草案本身只是个人提交的 Internet-Draft，没有 IETF 的正式背书，2027 年 5 月 3 日到期，除非被修订或采纳。所以它现在更像"四家大厂先认账、标准随后跟上"，而不是已经板上钉钉的互联网标准。

## 三个坑，加之前必须先知道

### 坑一：它只管"训练"，不管"抓取"

这是最容易误读的一句。草案原文写得很直白："这个政策令牌不是抓取行为的指令。"也就是说，爬虫照样可以来拉你的页面，只是在"能不能拿去改模型参数"这件事上，你表达了反对。

连带的一个反直觉结论：你现在 robots.txt 里那句 `User-Agent: *` 加 `Disallow: /`，在这个新机制下等于什么都没说。草案明确规定，通配符组不得被解释为匹配该令牌；如果文件里根本没出现 `__usage_ai-training`，就视为没有表达任何偏好。想让爬虫压根别来，还得按老办法，针对爬虫自己的名字写规则。训练偏好和抓取控制是两条正交的线，别混成一条。

### 坑二：它不追溯已经抓走的数据

草案按"资产被抓取时生效的那份 robots.txt"来判断偏好。翻译成人话：今天加上这两行，管的是以后被抓的内容；已经进数据集、已经训进模型的东西，它拿不回来。OpenAI 在公告里也把自己的参与定性为"自愿努力"，不是安全控制——不遵守的抓取者本来就可以无视 robots.txt，这一点新令牌没有改变。

所以这东西的正确定位是"向前看的声明"，不是"删库跑路"的按钮。指望靠它清理历史数据，会失望。

### 坑三：Google 和微软对同一行字的理解不一样

这是四家公告里最有实战意义的分歧，关于"训练"和"引用"（grounding，即回答时引用你的页面并附上链接）要不要分开算：

- **微软分开了。** 它除了共享的训练令牌，还单独给了页面级的引用偏好：默认允许，可以设为不允许，或者设为 DisallowExtended——只允许微软自家的 AI Mode、AI Overview、Copilot、Microsoft 365 引用，不许微软把引用能力卖给第三方（比如 Web IQ 和 Foundry 的 API 引用）。而且微软明说：这些偏好不影响 Bing 传统搜索结果的收录。
- **Google 合并了。** Google 的计划是：如果你用了共享令牌退出训练、又没有单独写 Google-Extended，Google 就会把它当成你也禁掉了 Google-Extended。而 Google-Extended 本来就同时管训练和 Gemini 的引用。结果就是，在 Google 这边，一行训练退出可能顺手把你在 Gemini 回答里的引用资格也关了。想"训练退出、引用保留"的话，得再单独写一个允许 Google-Extended 的组——Google 自己也承认可以这样"逐家微调"，但这就把"一句话搞定"的简洁性又打了个折。

还有一个不在场的人值得提醒：Meta 只表示支持"通用信号是个重要一步"，但没有承诺执行；苹果也不在 10 月 30 日的承诺名单里。所以旧的各家规则先别急着删——新令牌目前只覆盖这四家，删了旧规则等于把另外几家也放行了。

## 如果是我，我会怎么选

先问自己一个问题：你到底在防什么？答案不同，写法完全不同：

**1. 只想一句话退出训练，不在乎引用流量。** 直接加上面那两行，等 2027 年各家陆续生效。这是最省事的路线，适合内容本身就是资产、不靠 AI 回答带流量的站点。

**2. 想退出训练、但还想被 AI 回答引用。** 别只加两行就完事。微软那边要另外配页面级的引用偏好；Google 这边要补一个明确允许 Google-Extended 的组。两家规则都要对一遍，否则你以为只是退了训练，实际是连引用带训练一起退了。

**3. 还没想清楚，或者站点主要靠搜索和 AI 引用吃饭。** 先不加，等 2027 年初各家实现细节落地再说。反正今天加了也不会立刻生效，草案又可能在 2027 年 5 月到期前被修订——观望两个月，成本几乎为零，冲动加错的代价反而更大。

无论选哪条，有两件基础工作别省：第一，先备份现有的 robots.txt，改动要能回滚；第二，千万别动 Googlebot、Bingbot 这些管搜索收录的组——训练退出和搜索收录是两回事，动错了组，损失的是搜索流量，不是训练授权。

## 结论：这是进展，但不是终点

我对这件事的判断是偏乐观的，但乐观要打折。乐观的部分是：四家大厂第一次在"站长怎么说不"这件事上达成一致，而且方案复用了 robots.txt 的老语法，落地成本低到只有两行。打折的部分是：它还是自愿的、还是草案、还不追溯、时间表还拖到 2027 年，Google 和微软对"引用"的处理还不一致。

对我们这些写博客、做小站的人来说，真正的新东西不是这两行字，而是它背后的信号：过去几年站长和 AI 公司关于"我的内容你能不能用"的拉锯，终于从"各家各说各话"走到了"先统一一句话"。这句话今天还不够有力，但总算有了统一的写法——而统一的写法，是所有后续谈判的前提。

## 来源

- PPC Land：Google, Microsoft, OpenAI and Anthropic back one AI training opt-out（2026-10-30）：https://ppc.land/google-microsoft-openai-and-anthropic-back-one-ai-training-opt-out/
- AI Weekly：OpenAI, Google, Microsoft, Anthropic Back One AI Opt-Out Token（原始报道为 The Verge）：https://aiweekly.co/alerts/openai-google-microsoft-anthropic-back-one-ai-opt-out-token
- SaveDelete：AI Training Opt-Out in robots.txt: What the Token Changes：https://savedelete.com/article/ai-training-robots-txt-token/
- TechProlonged：OpenAI, Google, Microsoft and Anthropic back one AI-training opt-out：https://techprolonged.com/2026/10/openai-google-microsoft-and-anthropic-back-one-ai-training-opt-out/
