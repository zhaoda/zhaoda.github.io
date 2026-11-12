---
title: Databricks 把 Genie 变成了常驻同事：Agent 的下一关不是更强，是更懂你的公司
date: 2026-11-12 08:45:00 +0800
tags: [AI, Agent]
description: Databricks 11 月 11 日把 Genie 升级为常驻自主 Agent：不用等你提问，自己盯着目标干活。真正的变化不是模型更强，而是它第一次有了公司的上下文——以及一套管得住它的缰绳。
---

11 月 11 日，Databricks 把 Genie 升级成了第二代：一个常驻的、自主的企业 AI 同事。

以前的 Genie 是你问它答——查个指标、跑个 SQL、解释一张仪表盘。现在的说法变了：你给它一个目标，它自己接手这份工作。定时跑、事件触发、缺了信息自己去追问、需要人拍板时再来找你，中间还能把活分给几个子 Agent 并行干。Databricks 的原话是"always-on"，常驻。

这件事值得写，不是因为又多了一个 Agent，而是因为它把过去半年 Agent 圈子里吵得最凶的两个问题，同时摆上了台面：**自主之后谁来兜底，以及 Agent 到底凭什么懂你的公司。**

<!--more-->

## 从"随叫随到"到"不用你问"

先说清楚这次到底发布了什么。11 月 11 日的发布是一整套组合拳，不是单个功能：

**常驻模式。** Genie 现在可以在后台用自己的算力持续工作，接受一个目标后长期跟进，而不是一次问答就结束。Databricks 举的例子很具体：理赔单偏离承保规则时自动分流，营销预算要调整时先拟好方案等你批。注意这两个例子里的分工——Agent 干活，人拍板。

**Genie Ontology 正式可用。** 这是整件事的地基，一个"本体层"：自动从仪表盘、SQL 查询、Notebook 里提炼出可复用的业务知识片段，同时用 Unity Catalog 的 Pages 和 Metric Views 守住人工治理过的指标定义。Databricks 还搞了个叫 OntoRank 的排序机制，按来源权威性、认证状态、相关性、热度和时效来决定采信哪份上下文、出现定义冲突时听谁的。

**Genie Search 正式可用。** 在 Google Drive、Jira、Confluence、Workday 里建索引（SharePoint 还在测试），查的时候先 enforce 各系统的权限，再把结果和 SQL、MCP 连接器拼在一起。也就是说，Agent 的答案来源不再只是数据库里的表，还有工单、文档和组织架构。

**Genie Agents 能读文档了。** PDF、幻灯片现在可以和治理过的表一起分析，公开预览中，引用精确到页。原生 MCP 连接器正式可用，Agent 可以直接去外部工具里建工单、改记录、发消息。

**Genie One 免费到 2027 年 1 月 31 日。** 这个入口负责把答案变成成品：幻灯片、仪表盘、交互页面，定时刷新，工作流还能做成共享技能给团队复用。

还有一件事容易被忽略：同一天，Databricks 给 ChatGPT、Claude、Microsoft Copilot Cowork 和 Grok Bot 都上了原生 Genie 插件。你的 Agent 不必非得待在 Databricks 的界面里，在哪干活都能调到同一份受治理的业务上下文。旧的测试版 MCP 端点 2026 年 11 月 30 日退役。

## 91% 那个数字，先别急着信

Databricks 这次还发布了一个和 Turing 合作做的基准测试：Genie 的任务通过率是 91%，而两个匿名前沿 Agent 里较强的那一个只有 58%。每次任务平均花 431,829 个 token、100.3 秒。测试场景是一个虚构的英国能源供应商工作区，里面有表、Notebook、仪表盘、保存的查询和文档，包括过时的、重复的资产，每个 Agent 每个任务跑五遍。

数字很漂亮，但 Databricks 自己先打了预防针：这个测试反映的是一个已经沉淀了业务知识的部署环境，在新部署里、或者光靠表结构就够用的场景里，差距会小得多。

我同意这个提醒，而且要再往前推一步：**这恰恰是这次发布最诚实的地方。** 91% 不是模型的胜利，是上下文的胜利。把同一个前沿模型扔进一个没有本体层、没有治理指标、没有权限体系的工作区，它一样会在过时定义和重复资产里迷路。反过来，一个有干净上下文的普通模型，往往比裸奔的前沿模型更靠谱。

这也是我今年反复写的一个判断的延续：11 月 4 日那篇我说最强模型在 GDPx 上也只拿 12 分，Agent"能干活"的神话被打回原形——问题从来不在模型够不够强，而在它有没有拿到干活所需的上下文，以及干错了谁负责。Databricks 这次等于正面回答了这两个问题：上下文靠 Ontology，责任靠下面这套缰绳。

## 自主的另一面：缰绳必须先于马

常驻 Agent 最让人不放心的不是它干不好，而是它在你没看着的时候干了什么。Databricks 这次把治理做进了同一套发布里，用的是 Unity Gateway：

- 每一次行动都有 trace：问了什么、答了什么、引用了哪些对象、耗时多久、做了什么操作，管理员可以查询；
- 管理员可以限制 MCP 工具、要求审批、设预算和支出上限；
- Genie 以每个用户的身份行动，可以替你准备一份权限申请，但批不批还是管理员和数据 owner 说了算。

这个设计思路我很认同，而且和 11 月 5 日我写 CrowdStrike AI Kill Switch 时的结论是一致的：**Agent 失控先别谈伦理，先给它装个断路器。** 只不过 CrowdStrike 那个是事后能杀掉，Databricks 这套是事前划好边界、事中留痕、事后可查。两条路都得有，缺一不可。

还有一个细节值得程序员同行注意：通用汽车已经部署了 1,000 多个 Genie Agent，横跨销售、工程、供应链和 HR。这不是试点规模了，是"一个部门一套 Agent"的打法。Databricks CEO Ali Ghodsi 自己也在用，还拿它准备面试、复盘自己的工作表现——TechCrunch 的标题说它"告诉 CEO 不加修饰的真相"，比如员工满意度数据、拟议的管理动作、销售对产品功能的反馈。

## 对我们写代码的人，真正的启示是什么

Databricks 是做数据平台的，Genie 首先服务的是业务分析场景。但这件事对所有做 Agent 的人都有三点启示：

**第一，上下文正在变成 Agent 的核心资产，而不是模型的附属品。** 过去我们争论哪个模型写代码更强，现在 Databricks 用 91% 对 58% 告诉你：在一个有沉淀的工作区里，上下文带来的差距比模型本身更大。做 Agent 产品的人，接下来拼的不是接了哪个模型，而是你的 Ontology——你对业务的理解沉淀在哪里、怎么保持新鲜、冲突时听谁的。

**第二，"常驻"是 Agent 从工具变同事的分水岭，但分水岭的另一边是成本。** 每次任务 43 万个 token、100 秒，这不是一次问答的账，是一个常驻同事的工资单。Genie One 免费到明年 1 月 31 日，之后呢？Databricks 说更细的成本控制会在那之前上线。我的判断是：常驻 Agent 的账以后要按"人均 Agent 开销"来算，就像以前算人均云成本一样。免费期是让你上瘾的，不是让你省钱的。

**第三，治理不是 Agent 落地的刹车片，是油门。** 没有 trace、没有审批、没有身份边界的自主 Agent，企业根本不敢让它常驻。Databricks 把 Ontology、Search、MCP、网关控制打包在同一天发布，这个打包本身就是信号：自主能力每往前走一步，治理就要同步跟上一步。做 Agent 的团队如果只卷自主、不卷治理，最后会在客户的安全评审会上被一票否决。

## 别急着抄作业

最后泼一盆冷水。常驻 Genie 目前还在"即将进入预览和测试计划"的阶段，不是所有客户今天就能用上。Ontology 的 GA 日期在发布说明里是 11 月 9 日，但 Ontology Manager（人工审核和打理本体层的工具）还在"即将进入测试"。也就是说，自动提炼知识的机器先来了，人工打理的工具还没到。

这意味着什么？意味着如果你公司的仪表盘、指标定义本身就是一团乱麻，Genie 学到的本体层也会是一团乱麻，只不过现在这团乱麻有了自动化的外衣。Databricks 9 月 1 日的实施指南自己也承认：第一天就能用，但准确率取决于干净的数据、一致的实体记录、有用的元数据、受治理的指标定义、认证过的资产和持续的评估。

所以我的结论很直接：**Genie 这次真正的产品不是一个更自主的 Agent，而是一面镜子。** 它照出来的是：你的公司到底有没有一份机器能读懂的、关于自己的说明书。没有这份说明书，再强的模型也只能在你的数据里瞎猜；有了它，Agent 才第一次有可能从"回答问题"变成"接手工作"。

这面镜子，值得每个做 Agent、管数据、带团队的人照一照。

## 参考来源

- Unite.AI：Databricks Turns Genie Into an Autonomous Enterprise AI Coworker — https://www.unite.ai/databricks-turns-genie-into-an-autonomous-enterprise-ai-coworker/
- TechCrunch：Databricks' new AI agent tells CEO Ali Ghodsi the unvarnished truth — https://techcrunch.com/2026/11/11/databricks-new-ai-agent-tells-ceo-ali-ghodsi-the-unvarnished-truth/
- TechTarget：Databricks turns Genie into always-on agent for complex work — https://www.techtarget.com/news/databricks-turns-genie-into-always-on-agent-for-complex-work/874354/
- SD Times：Databricks Launches New Always-on Genie: Autonomous AI for Complex Enterprise Work — https://sdtimes.com/data/databricks-launches-new-always-on-genie-autonomous-ai-for-complex-enterprise-work/
- Unite.AI：Databricks Launches Native Genie Plugins for Four AI Agents — https://www.unite.ai/databricks-launches-native-genie-plugins-for-four-ai-agents/
