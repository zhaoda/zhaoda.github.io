---
title: Claude Fable 5.2 来了：便宜 20%、快 30%，但真正值得盯的是 Mythos 那条线
date: 2026-11-10 08:40:00 +0800
tags: [AI, Agent, Claude]
description: Anthropic 11 月 9 日发布 Claude Fable 5.2 与 Mythos 5.2：同一个模型、两条护栏线，降价 20% 的同时在 Agent 编程基准上把差距拉开。
---

11 月 9 日，Anthropic 一口气发了两个新模型：Claude Fable 5.2 和 Claude Mythos 5.2。这是我今年看过最有意思的一次发布——不是因为分数有多高，而是因为它把一件事摆到了台面上：**同一个模型，可以因为护栏不同，变成两个产品。**

<!--more-->

## 先说数字：更强、更快、还便宜了

Fable 5.2 是 Anthropic 目前最强的通用模型，定位是"最难、最开放的技术活"。先看 Anthropic 自己公布的账：

- **价格**：API 定价从每百万 token 输入 10 美元、输出 50 美元，降到 **8 美元 / 40 美元**，降幅 20%。缓存读取只要 0.20 美元。还有一个可选的 fast mode，价格翻倍（16 美元 / 80 美元），生成速度最快能到 2.5 倍。
- **速度**：输出速度比 5.1 代快最多 30%。
- **上下文**：100 万 token 上下文，单次最大输出 12.8 万 token，知识截止到 2026 年 6 月。

基准分先报出来，但要先打个预防针：**以下全是 Anthropic 自己跑、自己挑着公布的数字**，方法论在它的 system card 里，写稿时还没有独立复现。

- FrontierCode 2.0（Agent 编程，看补丁能不能合进真实开源仓库）：**49.1%**，上一代 Fable 5.1 是 32.4%，GPT-6 Astra 42.8%，Gemini 4 Carbon 41.1%，自家 Opus 5.5 是 45.5%。
- FrontierSWE v2（Agent 编程）：**69.9%**，Fable 5.1 是 56.3%，GPT-6 Astra 65.5%，Gemini 4 Carbon 61.2%。
- Terminal-Bench-Science 0.1（Agent 科研）：74.6%，上一代 52.6%。

有个数字比基准分更值得程序员记下来：按 Anthropic system card 的说法，Fable 5.2 在 FrontierCode 2.0 上跑一个任务的**平均成本是 6.72 美元**（High effort 档）。这个数能不能直接套到你的项目上，要看任务复杂度，但它至少给了算账的锚点——以前我们聊 Agent 成本都是拍脑袋，现在可以按"一个任务几美元"来估。

独立榜单那边也有个佐证：Artificial Analysis 的 Intelligence Index（九项评测综合）把 Fable 5.2 放在第一位，65 分，Gemini 4 Carbon 60 分，Opus 5.5 是 59 分，GPT-6 Astra 57 分。

## 同一个模型，两条护栏线

这次发布真正的新东西不在 Fable，在 Mythos。

Anthropic 明说了：**Fable 5.2 和 Mythos 5.2 是同一个底层模型**，区别只在护栏。Fable 自带分类器，会拦住绝大多数网络安全和生物类的请求，所以能面向所有人开放；Mythos 把这些拦阻拿掉，只给通过验证的组织用——网络安全验证项目（Cyber Verification Program）或生命科学验证项目（Life Sciences Verification Program），走的是 Anthropic 的 Project Glasswing 通道。

Mythos 的数字是另一套：CyScenarioBench 76.3%（上一代 61.7%），CVE Rediscovery 89.6%（上一代 78.3%）。Anthropic 的 system card 自己也承认，CyScenarioBench 上各家实验室用的任务并不完全一样，这个对比要打折看。

这条线有意思的地方在于它的取舍很直白：

1. **能力分层正在变成"身份分层"。** 以前模型分档靠参数量和价格，现在多了一个维度：你是谁、验没验过身。最强的通用能力人人可用，但某些方向的能力要先过审核。Anthropic 自己在 11 月 6 日那篇关于 Agent 记忆的文章里还在谈"负责任地扩展"，三天后就把"验证制"落到了产品上。
2. **误拦也是成本。** Anthropic 说 Fable 5.2 的"不必要拦截"比 5.1 少了约 55%。这句话程序员应该很有体感：安全分类器最大的问题从来不是它拦住了坏请求，而是它拦住了你的正常请求。误拦率降一半，对每天靠 Claude Code 干活的人来说，可能比基准分涨 10 个点更实在。
3. **定价在往"按活计价"走。** 标准价降 20%，同时给了个 2 倍价、2.5 倍速的 fast mode。这是在告诉你：模型不再只有一个价目表，速度本身成了可买的档位。赶时间的长任务开 fast mode，批量跑的常规任务走标准价，账要分开算。

## 给程序员的实战判断

Anthropic 自己的建议很克制：**日常编码和知识工作，先用 Opus 5.5；只有"最有野心、最开放的技术工作"才上 Fable 或 Mythos。** 这个建议值得听——不是因为 Opus 更便宜（它确实更便宜，Fable 的价格大约是 Opus 5.5 的两倍），而是因为大模型有个老毛病：能力越强，越容易在简单任务上"想太多"，反而慢、反而贵。

我的判断是这样的：

- **长链路 Agent 任务可以试 Fable 5.2 了。** FrontierCode 2.0 从 32.4% 到 49.1%，涨幅不小，而且这个基准测的是"补丁能不能合进真实仓库"，比刷选择题更接近干活。如果你手头有那种"改一处、牵全身"的重构，或者跨多个模块的 feature，值得拿一个真实任务跑一遍对比——但先别全量切，拿一个分支、一个任务做 A/B，盯着 6.72 美元这个成本锚点算你自己的账。
- **fast mode 先别急着开。** 2 倍价换 2.5 倍速，听着划算，但你的瓶颈大概率不在 token 生成速度，而在 Agent 的工具调用、测试运行和等你确认。先把标准模式跑顺，确认生成速度真的是瓶颈再开。
- **Mythos 跟大多数人没关系，但它的存在本身是个信号。** 安全研究、漏洞挖掘这类能力的"验证制"一旦跑通，其他厂商大概率会跟进。Google 的 Gemini 4 Carbon 走的也是类似路子——先给经过筛选的防守方用。以后"能不能用某个能力"可能不再只看你付多少钱，还要看你过没过审。
- **别被 13/15 的领先冲昏头。** Anthropic 的对比表里，新模型在 15 项里领先 13 项，但输掉的那两项也值得看：AutomationBench（业务流程自动化）是 Gemini 4 Carbon 更高，53.9% 对 51.4%；AA-Briefcase 知识工作的 Elo 评分，Opus 5.5 反而以 1800 对 1785 压了 Fable 一头。而且 FrontierCode 2.0 那次对比里，Fable 跑的是 Xhigh effort，Carbon 只跑了 Medium effort。厂商的表，永远要看脚注。

## 发布背后的另一条线：IPO 前夜的价格战

这次发布的时间点也很值得琢磨。Anthropic 正在筹备 IPO，按它提交的文件，2026 年第三季度收入约 170 亿美元，前九个月约 332.4 亿美元。与此同时，OpenAI 刚被曝出以 1.25 万亿美元估值融了 110 亿美元；Google、Meta 也在几周内连发新模型。

Fable 5.2 的定价（8 美元 / 40 美元）正好比 GPT-6 Astra（10 美元 / 50 美元）低 20%。这不是巧合，是正面抢单。Anthropic 还在同一天宣布，摩根大通要把 Claude 从工程团队推广到产品、基建、风控和资管等更多部门——大客户背书和降价同一天来，IPO 路演的味道很浓。

对我们写代码的人来说，这场仗打得越狠越好：模型越强、越便宜，Agent 替我们干的活就越多。但也要记住另一面——当最强的能力开始分"验证过的"和"没验证的"，当价格表开始按速度分档，选模型的功夫，以后一半在看基准分，一半在看准入和账单。

## 来源

- Reuters：Anthropic unveils new Fable, Mythos models as competition heats up ahead of IPO（2026-11-09）— https://www.reuters.com/technology/anthropic-unveils-new-fable-mythos-models-competition-heats-up-ahead-ipo-2026-11-09/
- VentureBeat：Anthropic releases Claude Fable 5.2 and Mythos 5.2, pairing new, record-high benchmarks with 20% API cost reduction（2026-11-09）— https://venturebeat.com/technology/anthropic-releases-claude-fable-5-2-and-mythos-5-2-pairing-new-record-high-benchmarks-with-20-api-cost-reduction
- LimitDigest：Claude Fable 5.2 and Mythos 5.2: price, limits, benchmarks（2026-11-09，基于 Anthropic 官方资料整理）— https://limitdigest.com/guides/claude-fable-5-2-mythos-5-2/
- Mer.vin：Claude Fable 5.2 and Mythos 5.2: What Developers Get（2026-11-09，基于 Anthropic 发布页整理）— https://mer.vin/news/claude-fable-5-2-and-mythos-5-2-what-developers-get/
- Sulat AI & Tech News：Claude Fable 5.2 in Claude and Devin: what early testers built（2026-11-10）— https://news.sulat.com/2026/11/10/claude-fable-5-2-mythos-devin-early-access-builds/
