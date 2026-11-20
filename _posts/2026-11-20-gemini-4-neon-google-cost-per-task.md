---
title: Gemini 4 Neon 来了：Google 不拼最强模型，拼的是每任务多少钱
date: 2026-11-20 08:40:00 +0800
tags: [AI, Agent, Gemini]
description: Google 发布 Gemini 4 Neon，补上 Gemini 4 家族中间那一级：编程 Agent 榜单登顶，每任务成本比 Carbon 低 32%，模型竞争正式从拼智商转向拼账本。
---

11 月 18 日，Google 发布了 Gemini 4 Neon。六天前才刚发了 Hydrogen，这次又补了一块。Gemini 4 家族现在是四级梯子：Hydrogen 跑日常快活，Carbon 啃最难的长任务，Argon 压阵，Neon 卡在中间——前沿级能力，干活速度和价格都收敛到能天天用的水平。

我注意到的不是 Neon 有多强，而是 Google 讲故事的方式变了。整篇发布博文的标题是"前沿级智能，快速完成端到端任务"，基准数字后面跟的全是成本：默认 high 档下，每任务成本比 Carbon 低 32%。两天前 OpenAI 发 GPT-6.2 讲的也是同一件事：不比榜首，比每任务花多少钱。两家大厂在同一周里把同一个指标推到台前，这不是巧合，是模型竞争换了赛道。

<!--more-->

## 先看账本：Neon 的数字

价格是 $3 / 百万输入 token、$15 / 百万输出 token，缓存输入 $0.15 / 百万，打了 95 折，上下文 100 万 token。四档思考级别可调：low、medium、high（默认）、xhigh，团队自己在智能和花销之间拨档位。

基准成绩（均为 Google 官方公布，第三方榜单以 Artificial Analysis 为主）：

- Artificial Analysis Intelligence Index 61 分（xhigh 档），总榜第三，排在 GPT-6.2 Astra 和 Claude Fable 5.2 之后，比自家 Carbon 的 high 档还高 1 分。
- Artificial Analysis Coding Agent Index 58.6 分，总榜第一。Terminal-Bench 4.1 拿 65.2%，FrontierCode 2.0 拿 46.2%（默认 high 档）。
- Vals Index 第二（70.9%），Agent Arena Index 的可控性（steerability，中途纠正后模型跟不跟得上）第二。

这些数字要打个折看：都是厂商自己报的，榜单口径各不相同。但有一点值得认真对待——Neon 在编程 Agent 这个榜上登顶，而且 Google 敢把 Neon 跟 Claude Opus 5.5、GPT-6.2 Sol 直接放进同一张对比表。放在一年前，Google 不会这么比；放在今天，它敢比，说明 Coding Agent 已经是各家必须正面交锋的主战场，而不是谁家模型的附赠功能。

## 梯子搭完之后，选模型变成路由问题

Neon 最有意思的定位不是"又一个强模型"，而是它让 Gemini 4 的梯子完整了。Hydrogen 负责快，Carbon 负责难，Neon 负责"难但天天都要干的活"。

Google 随 Hydrogen 一起推的 Orchestrator 更值得注意：在 Antigravity 里，Neon 可以当总指挥，把活拆开派给并行的 Hydrogen 子 Agent 去干。这和昨天 Devin Bots 那套"AI 管 AI"的思路是同一个方向，只是落在了模型厂商手里——编排不再是第三方工具的专利，模型自己开始管模型。

Neon 的另一个细节是它对长会话的处理：多文件调试和跨仓库重构时减少重复读文件，边干活边汇报进度，长会话里主动做上下文压缩。这些都是 Agent 干长活时最容易翻车的地方——不是模型不够聪明，是上下文被重复读取和碎片信息撑爆了。Google 把这些做进模型行为里，说明它对"Agent 干活"的理解已经从单次回答进化到长程任务管理。

对我们写代码的人来说，这意味着选模型的动作正在消失。以前是人盯着价格表挑模型，现在是 Orchestrator 按任务难度自动路由：简单的扔给 Hydrogen，复杂的交给 Neon，真正难啃的才上 Carbon。你要做的不是选模型，而是把任务拆清楚、把验收标准写清楚。路由做得好不好，取决于你的任务描述清不清楚，而不是你对模型有多了解。

## 专门给安全团队留了一个版本

这次发布里还有一条容易被忽略的线：Gemini 4 Neon for Cyber，一个面向安全团队的变体，通过 Fairwind Programme 向可信防御方开放。

Google 报的数字：AutoBaxBench 困难档 76%，SEC-bench Pro 漏洞发现 90.5%，CWE-bench v2 漏洞修复 70.7%，WebExploitBench v1.2 51.26%。Neon 写出的代码在 AutoBaxBench 上比 Carbon 更安全。安全相关的另一组数字：Agent 安全评估里错位动作率 0.09%，诚实度评估通过率 99.2%，Gray Swan 的间接提示注入基准上，最高思考档加实时防护挡住了全部攻击。

这些数字同样是厂商自报，要谨慎。但方向是对的：模型开始分化出安全专长，而不是一个通用模型包打天下。写代码的模型和找漏洞的模型，正在变成两条线。对普通开发者更实际的启示是：让模型写代码的时候，顺手让另一个模型（或者同一个模型换个角色）审一遍，正在从"好习惯"变成"默认配置"。

## 给程序员的实战启示

第一，**按任务成本选模型，而不是按榜首选模型**。Neon 的总榜第三不重要，重要的是它在默认档下每任务成本比 Carbon 低 32%，同时编程 Agent 榜第一。日常重构、多文件调试、跨仓库改动这类"难但高频"的活，Neon 这个档位就是为它准备的。还在所有任务上默认用最强模型的人，正在为不需要的智能付费。

第二，**把思考档位当成成本旋钮**。四档可调不是摆设：low 跑批量小活，high 跑日常开发，xhigh 只留给真正难啃的问题。写进团队规范里，比口头说"注意成本"管用。

第三，**编排能力正在变成模型的一部分**。Neon 当指挥、Hydrogen 当执行，这种分工一旦进了官方工具链，第三方编排工具就要重新找自己的位置。如果你正在搭多 Agent 系统，先看官方的 Orchestrator 能覆盖多少，别急着自己造轮子。

第四，**别只看一家榜单**。Neon 的成绩单里，Artificial Analysis、Vals、Agent Arena、Zapier AutomationBench、Andon Labs Vending-Bench 2 各有侧重。只看一家，很容易被厂商挑着报的数字带偏。我的做法是：拿自己的真实任务跑一小批，跑通了再上量。

## 结语

一周之内，OpenAI 讲每任务成本，Google 补齐四级梯子还讲每任务成本。模型竞赛的上半场比谁更聪明，下半场比谁更会算账。Neon 本身不是革命，它是 Google 把"梯子 + 路由 + 账本"这套打法摆上台面的标志。对我们来说，真正的变化不在模型参数表里，在工作方式里：选模型的手动活正在消失，留给人的只剩两件事——把任务拆清楚，把验收标准写清楚。这两件事，模型暂时还替不了你。

## 来源

- Google, "Introducing Gemini 4 Neon", 2026-11-18: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/
- Google Antigravity, "Gemini 4 Neon in Google Antigravity", 2026-11-18: https://antigravity.google/blog/gemini-4-neon-in-google-antigravity/
- Financial Express, "Google Gemini 4 Neon Launched", 2026-11-19: https://www.financialexpress.com/life/technology-google-gemini-4-neon-google-launches-new-ai-model-for-coding-research-cyber-defence-4388529/
- AI Compass, "Google ships Gemini 4 Neon as DeepMind rolls out Genie 4", 2026-11-18: https://ashutoshai.com/ai-compass/2026/11/18/
