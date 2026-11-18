---
title: GPT-6.2 发布：OpenAI 不跟你比榜首，比的是每任务花多少钱
date: 2026-11-18 08:40:00 +0800
tags: [AI, Agent, OpenAI]
description: OpenAI 11 月 17 日发布 GPT-6.2 Astra 和 Sol：旗舰降价 20%、定价贴上 Claude Fable 5.2，自报榜单处处赢在"每任务成本"。对写代码的人来说，选模型的方式该变了。
---

一周之内，三家前沿实验室轮流出牌：11 月 9 日 Anthropic 发了 Claude Fable 5.2，11 月 12 日 Google 发了 Gemini 4 Hydrogen，11 月 17 日 OpenAI 跟上了 GPT-6.2 Astra 和 Sol。

我盯着这场发布看了一圈，结论先说在前面：这次 OpenAI 真正的动作不是"更强"，而是"更便宜地更强"。它把旗舰模型的定价贴到了 Claude Fable 5.2 的同一行上，然后用一整页榜单告诉你——同样的活，我花的钱更少。

<!--more-->

## 两个模型，分工很清楚

GPT-6.2 是两个模型一起发：

- **GPT-6.2 Astra**：旗舰，干最难的专业活。OpenAI 的原话是"为复杂专业工作设立新的质量标杆"，幻灯片、电子表格、文档更贴你给的模板和行业惯例，代码写得更干净，前端（网站、游戏、3D）做得更好看也更好用。
- **GPT-6.2 Sol**：日常主力，"更聪明、更高效，在同一个付费套餐里能完成更多任务"。定位就是每天默认用的那一个。

发布节奏也值得记一笔：GPT-6 Astra 是 9 月 3 日发的，GPT-6.1 Sol 是 9 月 29 日发的，中间 OpenAI 还取消了原定 10 月发布的 GPT-6.1 Astra。两个半月一代旗舰，这个速度本身就是信号——前沿模型的迭代周期已经压到以月计了。

即日起，两个模型向 Plus、Pro、Enterprise 和 Edu 用户开放，在 ChatGPT Work 和 Codex 里都能用；企业和教育版需要工作区管理员先开启。

## 价格：降价 20%，但真正的动作是贴身

API 定价（每百万 token）：

| 模型 | 输入 | 缓存输入 | 输出 |
| --- | --- | --- | --- |
| GPT-6.2 Astra | $8 | $0.40 | $40 |
| GPT-6.2 Sol | $2 | $0.10 | $10 |

Astra 比上一代 GPT-6 Astra 输入和输出都便宜 20%，缓存输入便宜 60%。Sol 保持 GPT-6.1 Sol 的价格不变。

数字本身不算惊人，真正值得注意的是对位：Astra 的 $8/$40 和 Claude Fable 5.2 的定价**完全相同**。OpenAI 没有选择比对手便宜，而是选择了和对手一个价，然后把赌注押在另一件事上——同样一个任务，我用的 token 更少。

这就是整场发布的逻辑起点：价格战打到贴身之后，战场从"每百万 token 多少钱"挪到了"每完成一个任务多少钱"。

## 榜单：OpenAI 挑过的战场

先把丑话说在前面：下面这些数字全部来自 OpenAI 自己的公告，是它挑出来的战场，不是独立第三方复核的结果。读的时候要带着这个前提。

- **Agents' Last Exam**（多步骤专业工作）：Astra 比 GPT-6 Astra 高 5.2 分，成本不到三分之一；比 Claude Fable 5.2 高 5.5 分，成本只有 5%。
- **Harvey LAB-AA**（法律任务，全部要求达标才算通过）：Astra 的通过率是 Fable 5.2 的两倍多，成本约六分之一。
- **GDPval v2**（OpenAI 内部的咨询、金融、设计任务）：Astra 比上一代高 6.2 个百分点，同时少用 22% 的输出 token。
- **Terminal-Bench-Science**（终端里的科研工作流）：Astra 比 GPT-6 Astra 高 9 个百分点，成本不到三分之一。OpenAI 顺手称它为"全世界科学家的最佳模型"。
- **FrontierCode 2.0**（代码改动能不能达到真实项目合并标准）：Sol 只比 Astra 低 0.5 分，成本约五分之一。
- **AA-3D**（人类评委盲评 3D 交互体验）：Astra 以 1,318 Elo 排第一，Fable 5.2 是 1,271，Sol 是 1,259。
- **网络安全**：Astra 在 ExploitBench 上比 GPT-6 Astra 高 22 分，OpenAI 称它是"有史以来网络能力最强的模型"。
- **LifeVal**（日常任务）：Sol 以约七分之一的成本跑赢了老款 GPT-6 Astra。

有意思的是另一份榜单：Artificial Analysis 的综合 Intelligence Index 里，Astra 62 分排第二，Fable 5.2 以 65 分排第一。OpenAI 没在自己的公告里提这一项，但这才是更接近真实世界排名的数字——Astra 很强，但还没到榜首。

## 别急着换默认模型：三点提醒

第一，**榜单是挑过的**。OpenAI 选的都是 Astra 占优的测试，Fable 5.2 占优的维度不会出现在这份公告里。独立评测还要等几周，真正可信的对比要等 Artificial Analysis、Epoch AI 这些第三方跑完再说。

第二，**长上下文有溢价**。两个模型的上下文都是 105 万 token，但输入超过 27.2 万 token 的请求要进更高档位：输入和缓存价翻倍，输出涨 50%。Astra 会变成 $16 输入、$60 输出。长任务、长对话、把整个仓库塞进去的用法，账要按这个档位算。

第三，**早期反馈并不全是好评**。已经有试用者反映指令遗漏、解释被压缩、Agent 中途停下等问题。这些零散反馈成不了结论，但提醒一件事：新模型发布头几天的体验，和稳定下来之后的体验，往往是两回事。

还有一条值得多看一眼：这是 OpenAI 第一个在"AI 自我改进"上评为 High 风险等级的模型。发布公告里这句话很低调，但对写 Agent 的人来说，它意味着能力和风险是同一枚硬币的两面——模型越能自己改进自己，护栏就越不能只靠自觉。

## 对我写代码意味着什么

回到最实际的问题：明天打开 Codex，我该怎么选？

我的判断是：**默认用 Sol，硬仗换 Astra**。FrontierCode 2.0 那个 0.5 分的差距配上五分之一的成本，意思很明白——日常改代码、修 bug、写测试，Sol 够用了；真正难啃的多步骤任务、法律和科研场景，再上 Astra。把旗舰当默认，等于拿着跑车的油耗去买菜。

更重要的是算账方式要变。以前选模型看单价，现在要看**每任务成本**：一个任务跑下来，模型调了多少次工具、走了多少轮、返工几次，这些才是账的大头。Astra 的卖点恰恰是"少用 22% 输出 token"、"成本不到三分之一"这类每任务数字——这也是 Fable 5.2 发布之后，OpenAI 必须回答的问题。

所以我的建议很具体：如果你在 Codex 或者自己的 Agent 里固定了模型，这周花半小时做两件事。第一，把日常任务切到 Sol 跑一周，对比一下任务成功率和账单，别凭感觉；第二，把你最常跑的那类长任务单独记一笔 token 用量，看看长上下文溢价会不会吃掉降价的好处。模型发布会上的数字是广告，自己跑出来的数字才是预算。

另外可以留意一个风向标：Codex 会不会把默认模型切到 Sol。OpenAI 这次把 Sol 放在"同一个套餐完成更多任务"的位置上，如果默认模型跟着换，等于官方替你做了选择——到时候再看一次账单，就知道这个选择划不划算。

## 结语

GPT-6.2 这场发布，标志着前沿模型竞争换了个打法：峰值性能的差距越来越小，价格已经贴身，下一轮比的是谁能把"每任务成本"压得更低。对我们这些每天用 Agent 干活的人来说，这是好事——模型越来越便宜，账却越来越要会算。

至于 Astra 到底是不是真比 Fable 5.2 强，等独立评测出来再说。我不替榜单下结论，只替自己的账本下结论。

## 来源

- 9to5Google：OpenAI releases GPT-6.2 Astra and Sol — https://9to5google.com/2026/11/17/openai-releases-gpt-6-2-astra-and-sol-for-complex-projects-a-week-after-claude-5-2/
- The Decoder：OpenAI launches GPT-6.2 Astra and Sol with lower API prices and some benchmark gains — https://the-decoder.com/openai-launches-gpt-6-2-astra-and-sol-with-lower-api-prices-and-some-benchmark-gains/
- SiliconANGLE：OpenAI rolls out GPT-6.2 Astra for professional work and GPT-6.2 Sol for everyday work — https://siliconangle.com/2026/11/17/openai-rolls-out-gpt-6-2-astra-for-professional-work-and-gpt-6-2-sol-for-everyday-work/
- The Parameter：OpenAI releases GPT-6.2 Astra and Sol, cuts Astra's API price by 20% — https://theparameter.ai/a/gpt-6-2-astra-sol/
- Kingy AI：GPT-6.2 Astra and Sol benchmarks, pricing and reviews — https://kingy.ai/blog/gpt-6-2-astra-sol-benchmarks-pricing-reviews/
- OpenAI 社区公告：GPT-6.2 Astra and Sol are now available — https://community.openai.com/t/gpt-6-2-astra-and-sol-are-now-available/1417531?ref=testingcatalog.com
