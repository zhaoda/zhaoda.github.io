---
title: 「一天 13 美元」只是起点：AI 编程 Agent 的账该怎么算
date: 2026-10-24 08:37:00 +0800
tags: [AI, Agent, 编程工具]
description: Anthropic 官方文档：Claude Code 平均 13 美元/人/活跃天。不是涨价，是用量翻了一倍。自动化是乘数，账本才是新战场。
---

Anthropic 自己的文档里写着一串数字：Claude Code 平均成本约 **13 美元/开发者/活跃天**，月均 150–250 美元/开发者，90% 的用户每天花不到 30 美元。

重点是括号里的背景：就在几个月前，同一个文档页面上写的是 **6 美元**。数字翻了一倍，不是因为涨价——Anthropic 发言人明确说"没有任何价格或产品变动"，这只是真实用量数据更新后的样子。也就是说，大家之前算账用的基准，一直低估了实际情况。

我是做 Agent 工具的，天天跟 token 和账单打交道。这事不算新闻（页面是 4 月更新的），但值得单独写一写，因为多数团队到现在还是按"订阅制=固定成本"的心智在给 AI 编程工具做预算——而这个心智已经错了。

<!--more-->

## 不是涨价，是你用得比想象中狠

Claude Code 的计费逻辑其实很直白：按 token 计量，按标准 API 价格结算。模型每一次读写，都是在烧钱。问题是烧钱的速度不取决于工具，取决于你怎么用。

session 越长、自动化越深，token 消耗涨得越快。因为 Agent 每轮对话都要重新读一遍整个文件和历史上下文——上下文窗口不是只用一次，是每轮都在全量消费。这就是为什么用量数据能翻倍：不是大家多用了多少小时，是大家把 Agent 用得比以前自动化得多。

这是一个微妙的陷阱：订阅制让你觉得成本是封顶的，实际计费逻辑是按量走的。$20 的 seat 费只是入场券，真正的大头在后面。

## 乘数：自动化的 7 倍

文档里藏着一个更狠的数字：**Agent teams 在 plan mode 下的 token 消耗，约是普通 session 的 7 倍**。原因是每个 teammate 都维护自己的 context window、跑一个独立的 Claude 实例。你开一队 Agent，就像雇了七个人同时给你念代码，每个人都要从头看一遍仓库。

这就是为什么 GCN 那篇报道里特别强调：**$13 只是起点估算，不是封顶**。一个只是偶尔问问题的开发者，和一个开着并行 Agent 跑自动化流水线的工程师，烧掉的 token 能差出一个数量级。平均数对前者有意义，对后者几乎没有。

## seat 费是个幻觉

企业版的账更要细算：**flat $20 的 seat 费和用量是分开结算的**——用量按全价另算。也就是说，签合同的人看到的 seat 总价，和财务最终付的账单之间，隔着一整片按量计费的海。

这对工程管理者的直接启示：给 100 个开发者做预算，不能简单地把"人均 $13"乘以 100。成本分布是长尾的，一小撮跑自动化的重度用户能吃掉不成比例的大头。你得知道你团队里这几个人是谁。

## 实战：账要怎么算

结合公开资料，给几条能直接用的：

**1. 按用量分层买单，不是一刀切。** frugal.co 的分析把这事说得很清楚：轻度用户，Pro（$20/月）基本够用，让限额先告诉你够不够；日常重度用，企业版按量结算未必是便宜方案，被 cap 住的订阅反而可控；用量真正低频的场景，按 token 走 API 才划算。

**2. 盯住"活跃天"和长尾用户，而不是人均数。** 官方数字本身就是按活跃天统计的。团队内部也要这么看：多少人每天都开 Agent？其中几个人在跑多 Agent 自动化？把 spend limit 和用量监控配上，这是管理成本的最小闭环。

**3. 省钱从工程习惯开始，不是等降价。** Cloudflare 的例子很说明问题：他们把 AI code review 的单次成本从 $2.43 降到 $0.77，关键手段之一是 prompt caching——检查你的 Agent 是不是在重复发送同样的上下文。上下文复用、短 session、按需拉取而不是全量预读，都是直接折成钱的习惯。

**4. 模型分层是成本结构，不是营销话术。** frugal.co 列出的当前 API 价格（2026 年 10 月 8 日口径）：Opus 5.5 输入 $4/百万 token、Sonnet 5.5 $2、Haiku 5.5 只要 $0.10。高频低延迟的活让便宜模型干，旗舰模型只上难啃的问题——这个分层策略省的不是小钱。

## 我的判断

一句话：**AI 编程工具已经从"买个订阅"变成了"管一本账"。**

过去一年，这类工具从新奇玩意儿变成了团队日常基础设施，但定价体系还在追赶人们的真实用法。厂商开始把用量数字摆上台面（Anthropic 这次就是主动公布的），接下来轮到买方把账算明白：谁在用、用在哪、多少钱。Salesforce 那边已经把客服 Agent 按"每解决一个工单 2 美元"收费了——按结果计费正在替代按人头计费。

对开发者个人：学会看 token 账单是新必修课，选模型、设上下文、控 session 长度，都是直接换算成钱的技能。
对工程管理者：预算模型要从"人头 × 订阅价"换成"活跃天 × 用量分布"，把重度用户拎出来单独看。

$13/天这个数字本身不吓人，吓人的是你一直不知道自己花了多少。

## 来源

- [A coding assistant now bills $13 a day per programmer at large companies](https://gcn.com/13-a-day-coding-assistant-now/22701/) —— GCN, 2026-10-23
- [Anthropic Doubles Claude Code Cost Estimate To $13 Per Developer](https://www.briefs.co/news/anthropic-just-doubled-its-claude-code-cost-estimate-to-13-a-day/) —— Briefs
- [What Claude Code Costs Per Engineer, and What Drives the Bill](https://frugal.co/blog/claude-code-cost-per-engineer) —— Frugal
- [The Tokenizer #37: Cloudflare's 68% Cheaper AI Code Reviews](https://newsletter.artofsaience.com/p/monzos-coding-agent-cloudflares-68) —— Newsletter
