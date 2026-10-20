---
title: 「I think ChatGPT is better now」：Replit 把默认模型从 Anthropic 换成了 OpenAI
date: 2026-10-20 08:37:00 +0800
tags: [AI, Agent, 编程工具, OpenAI]
description: Replit CEO 在 TechCrunch Disrupt 上一句话，把默认模型从 Claude 换成了 ChatGPT：成本、性能、合作关系三票全投给 OpenAI。曾是 Anthropic 前五大客户的 Replit，为什么说换就换？这对开发者选模型有三个实战启示。
---

10 月 16 日的 TechCrunch Disrupt 舞台上，Replit 的 CEO Amjad Masad 被问到和 Anthropic 的关系，直接来了句："I think ChatGPT is better now。"（我觉得现在的 ChatGPT 更好了。）

台下可能没反应过来——Replit 一直是 Anthropic 的亲儿子阵营，8 月宣布和 OpenAI 合作的时候，谁都没想到是"换默认"这种操作。Masad 亲口说：Replit 在 Anthropic 那里曾经是前五大客户，现在默认模型改成 OpenAI 的 ChatGPT，Anthropic 的模型用户还能选，但不再是默认。

更扎心的是，就在 9 月底，Replit 自己的博客还在写 Claude Fable 5 和 Fable 5.1 跑在 Replit Agent 的生产环境里，产品同学还在 X 上给 Opus 5.5 打 call。两周之后，默认就换了人。TechCrunch 那篇报道下面，知情人还出来反驳说"合作明明还在"，场面一度很尴尬——但这不影响结论：钱流向了 OpenAI。

<!--more-->

## Masad 给出的三个理由

原话是这么说的："We publish a public benchmark as well, and consistently, Sol and Astra perform better on building vibe-coded applications from scratch. It was a decision based on both cost, partnership, and performance."（我们有一个公开的 benchmark，Sol 和 Astra 在"从零 vibe coding 建应用"这个任务上一直表现更好。这个决定基于成本、合作关系和性能。）

拆开看就是三票：

**1. 性能**：Replit 有内部 benchmark，也发公开版。测的不是通用榜单，而是"从零开始搭一个能用的应用"——这正是 vibe coding 用户每天干的事。OpenAI 的 Sol 和 Astra 在这个任务上赢了。

**2. 成本**：Masad 明说了，成本是原因之一。Agent 产品的账很好算：用户每句话都要走几轮模型调用，token 账单直接吃毛利。

**3. 合作**：8 月刚官宣的合作，"现在是更好的合作伙伴"。

## 默认值的力量：说 model agnostic，钱包投票

这件事最值得琢磨的一句话是 Masad 事后补的那句："Replit remains model agnostic."（我们依然保持模型无关。）Anthropic 的模型还在列表里，用户爱选哪个选哪个。

但 TechCrunch 补了个刀：大多数用户根本不会去换默认模型。这个默认值一换，Replit 在 Anthropic 那边的支出会"显著下降"——前五大客户的单子，说没就没。

做 Agent 工具的都懂这个账：你说支持十个模型，90% 的流量走默认的那一个。"Model agnostic"是讲给用户听的，"default"是讲给供应商听的。前者决定口碑，后者决定成本。

## 三个实战启示

**第一，看 benchmark 一定要问：这是谁家的 benchmark，测的是谁的强项。**

Replit 的 benchmark 测的是"从零建应用"，这是 OpenAI 系模型的甜点区（指令跟随强、前端代码写得顺）。如果测的是长上下文重构一个 20 万行仓库，或者多轮工具调用的稳定性，结果可能完全反过来。选模型做 Agent 底座时，别看榜单总分，看和你任务最像的那一行。榜单是供应商的广告位。

**第二，coding 工具的"模型忠诚度"是按月结算的。**

去年这个时候，Claude 赢走了几乎所有开发者的心智——Replit 全靠 Claude 起量，收入跟着涨。但 Masad 这句"I think ChatGPT is better now"说明了一件事：模型能力差在缩小，切换成本也在缩小。去年你说"Anthropic 不可替代"，今年 OpenAI 一个大版本就追回来。这种市场里，对任何一家供应商都别谈感情，谈季度账单。Replit 这种前五大客户都能 48 小时转向，你的 Agent 产品更没必要押宝。

**第三，企业客户正在改写 Agent 公司的收入结构。**

Masad 在台上还顺手报了个数：去年企业收入只占 2%，今年 15%，B2B 总收入超过 50%，预计 2027 年企业加政府客户贡献过半。Replit 从"vibe coding 玩具"变成"企业 Agent 平台"，换模型的决策逻辑也跟着变：企业要的是稳定、可预算、可谈折扣——这三样，OpenAI 的商务团队给得起。

顺带一提 Masad 在台上讲的另一个金句，很对我胃口："Agents need a habitat."（Agent 需要一个栖息地。）他的清单是：好的编排、好的错误恢复、好的安全和沙箱、好的网络、好的身份和鉴权。"一旦把这些搞定，你才能安全地部署 AI。"——做 Agent 工具的人都该把这句话打印出来贴墙上。模型只是栖息地里的一只动物，换了也就换了。

## 来源

- TechCrunch, "Replit makes OpenAI its default over Anthropic, CEO says", 2026-10-17（10-16 发布，10-19 更新）：https://techcrunch.com/2026/10/17/replit-is-no-longer-working-with-anthropic-ceo-says/
