---
title: 沃尔玛给 AI 购物 Agent 发了"驾照"：MCP 官方网关 + 消费限额，跟亚马逊的封杀令对着干
date: 2026-10-23 08:37:00 +0800
tags: [AI, Agent, MCP, 电商]
description: 10 月 21 日沃尔玛上线 Agent Gateway 和 Agent Profiles：AI Agent 走 MCP 官方通道替人下单，每个 Agent 有独立档案和消费限额。而亚马逊 9 月起把 Muse 挡在门外。两条对立路线，背后是代理式电商到底谁说了算。
---

10 月 17 日我写过 OpenAI 的 Agent 没钱付 Gas、自己"借"了个钱包的事。那篇的结尾我留了个判断：Agent 要真正开始替人花钱，缺的不是模型能力，是一条官方的收银通道和一本"谁来负责"的账。现在答案来了——10 月 21 日，沃尔玛正式开门迎客，而亚马逊选择关门。

两家美国零售巨头，在同一个月做出了完全相反的决定。这事值得好好拆开看。

<!--more-->

## 沃尔玛端出了什么

10 月 21 日，沃尔玛 CEO John Furner 在旧金山的 Masters of Scale 峰会上宣布，随后官方新闻稿给出三件套：

**1. Walmart Agent Gateway（官方网关）**——一个基于 MCP（Model Context Protocol）的服务器。被批准接入的 AI Agent 不再需要模拟浏览器去爬页面、填表单，而是走一条官方的数据通道：查库存、下订单，全走 API 级别的结构化调用。目前先以 beta 面向公司和开发者开放。

做过 Agent 工具的人都懂这一步的分量。浏览器自动化是 Agent 做事的"灰色地带"：脆弱、容易被反爬误杀、出问题没人负责。MCP 网关等于零售商亲手给 Agent 修了一条专用车道——稳定、可观测、可被随时掐断。沃尔玛说得很直白：Agent 走网关，就拿不到它不需要的个人信息和购买历史。

**2. Agent Profiles（代理档案，11 月上线）**——这是最有意思的设计。每个 AI Agent 在你的沃尔玛账号里拥有一个独立档案：

- Agent 的订单和你本人的订单分开记录、各自可查；
- 默认**每笔订单都要你手动批准**，你也可以放宽到"给它一个消费额度"（官方示例：50 / 100 / 200 美元），额度内自主下单；
- 随时可以关掉某个 Agent 的权限；
- Agent 接触不到你的支付卡数据，也不能增删改支付方式；
- 违规的 Agent 直接被封禁。

沃尔玛把这套机制类比为"给信用卡加一张附属卡"。这个类比很准：附属卡的额度、账单独立、随时可停——都是现实世界里解决"委托花钱"问题的成熟答案，搬到了 Agent 身上。

**3. 一套 Agent 行为条款**：Agent 只能做用户明确授权的事，不能超出意图，不能拿任务不需要的数据。沃尔玛还专门写了一句："We price products, not people"——Agent 看到的价格和人看到的一样，优惠和费用在下单前全部展示。

另外两个值得注意的细节：Agent Profiles 面向所有沃尔玛账号开放，**不需要 Walmart+ 会员**；ChatGPT、Gemini 和 Meta 的 Muse 都在它的对话式购物集成名单里（Muse 本来就是沃尔玛的合作伙伴）。

## 亚马逊：关门的那一边

对比太鲜明了。9 月 21 日起，亚马逊开始把 Meta 的 Muse 挡在门外——用户看到的提示是"未经授权的 AI Agent 违反了亚马逊的使用条款"。据报道，Perplexity 的 Agent 也被限制。而亚马逊自己并非不用 Agent 购物：它的 Alexa for Shopping 和"Buy for Me"功能照常用，只不过那是它自己的 Agent，并且品牌方可以选择退出。

这不是技术分歧，是商业模式分歧。亚马逊在线上零售广告上赚的是大钱：用户在站内浏览时看到的赞助商品位是核心收入之一。一个从外部直接下单、连页面都不看的 Agent，既砍掉了广告展示，也切断了用户行为数据回路。把门关上，是在保护它的基本盘。

沃尔玛恰恰相反：它的线上份额本来就打不过亚马逊，与其把用户锁在自己 App 里，不如去用户已经在的地方——ChatGPT、Gemini、Muse 的对话里——把单截下来。开门迎客对它来说是进攻，不是防守。

## 我的判断：三条线

**第一，"官方通道"会成为代理式电商的标配。** 今天 Agent 替人办事的主流方式还是浏览器自动化——这是 2026 年 Agent 安全事故里最高频的翻车场景（还记得 10 月 17 日那个"借钱包"的 Agent 吗？它就是卡在了没有官方支付通道上）。沃尔玛的 MCP 网关给出了标准答案：零售商提供结构化接口 + 身份 + 额度 + 审计，Agent 才能从"灰色爬虫"变成"持证上岗"。我预计头部电商会在一年内跟进类似设计，分歧只在于是"沃尔玛式开放"还是"亚马逊式自营"。

**第二，真正的战场是"谁拥有结账时刻"。** 注意沃尔玛的设计：购买发生在沃尔玛控制的账号体系里，Agent 只是被授权的操作者。这和 ChatGPT 之前试水的 Instant Checkout 逻辑一致——流量入口可以让给对话 AI，但**交易、支付和用户关系必须留在自己手里**。以后每家零售商都会问自己同一个问题：Agent 带来的订单，到底算谁的客户？

**第三，对开发者是利好，对"全自动"叙事是降温。** 默认每笔都要人工批准、额度内才放行——这说明连最激进的零售商都不相信 Agent 可以无人值守地花钱。做 Agent 工具的人（比如我）要认清：未来两三年的 Agent 落地形态，不是"全自动"，而是"人在环路里的半自动"。权限、额度、审批流、审计日志，这些" boring but important" 的基础设施，才是 Agent 真正规模化的前提。银行已经对 AI 购物 Agent 的欺诈风险发出过警告，沃尔玛这套设计基本就是照着银行的担忧一条条打的补丁。

## 给普通人的实战建议

如果你已经在用 ChatGPT、Gemini 或 Muse 这类助手：11 月 Agent Profiles 上线后，可以先给 Agent 设一个小额度（比如 50 美元）专门买日用品，体验"列清单→Agent 下单→你审批"的流程。记住两条铁律：**额度从小开始，审批默认全开**。Agent 买错东西可以退货（沃尔玛承诺 Agent 订单正常退换），但买错一次的教训，远不如提前设好护栏便宜。

电商的下一个十年，可能不是"人逛 App"，而是"Agent 跑腿、人点头"。沃尔玛先把驾照发了，接下来就看谁敢上路、谁还拦路。

## 来源

- Walmart 官方新闻稿（2026-10-21）：Agent Profiles、Walmart Agent Gateway 与 AI Agent 行为条款 —— https://www.pymnts.com/news/retail/2026/walmart-opens-doors-for-ai-agents-that-obey-strict-rules/
- TechCrunch 经报道：沃尔玛 Agent Gateway（MCP 服务器）与 Agent Profiles 细节 —— https://k.sina.cn/article_5952915720_162d24908067051h4a.html?from=tech
- Reuters（2026-10-22）：沃尔玛 10 月 21 日宣布 AI Agent 购物工具 —— https://www.reuters.com/jp/economy/23BK7JXRCFIXHIG526ZV3IW4ZU-2026-10-22/
- dig.watch（2026-10-22）：Walmart announces AI agent and gateway shopping tools —— https://dig.watch/updates/walmart-announces-ai-agent-shopping-tools
- thekeyword.co：Walmart Opens Its Store to AI Shopping Agents, With Spending Limits —— https://www.thekeyword.co/news/walmart-ai-shopping-agents
