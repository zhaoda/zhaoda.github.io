---
title: 微软开源 Scope：别再看排行榜，用你自己的任务给 AI 编程 Agent 跑分
date: 2026-10-25 08:38:00 +0800
tags: [AI, Agent, 编程工具, 评测, 微软]
description: 微软 10 月 19 日开源了 Agent 评测平台 Scope：同一任务跑遍 Copilot、Claude Code 等 Agent，用依赖图标准和 LLM Judge 打分。排行榜只能告诉你别人家的 Agent 行不行，自己的任务跑一遍才算数。
---

排行榜这东西，我现在基本不看了。

不是榜单不准，是它回答错了问题。Terminal-Bench、SWE-bench 告诉你某个 Agent 在别人的任务上得了多少分，可你真正关心的是另一件事：它在**你的仓库、你的 SDK、你的文档**上能不能干活。这两个问题之间，隔着一道鸿沟——而微软 10 月 19 日开源的 Scope，就是冲着这道鸿沟来的。

<!--more-->

## Scope 是什么

Scope 是微软 Developer Relations 团队开源的一个 Agent 评测平台，MIT 协议，GitHub 仓库在 microsoft/scope，目前标注为 research preview。它不是又一个编程 Agent，而是一个**考 Agent 的考场**。

用法很直白：你给它一个代表性任务（比如"用我们的 SDK 起一个带 /health 接口的 Node 服务"），再给一个起始代码库（可选），它驱动现有的 Agent 去完成这个任务。目前能驱动的 Agent 包括 GitHub Copilot、Claude Code，以及 VS Code + Copilot 的组合。值得注意的一点是：微软没有把 Scope 做成 Copilot 的专属秀场，而是让自家产品和直接竞争对手 Claude Code 站在同一条起跑线上比——这份底气本身就说明，Scope 想卖的不是某个 Agent，而是"评测"这件事。

微软给这套东西起了个名字，叫 DevAx（Developer Agent Experience，开发者 Agent 体验）。逻辑是这样的：以前我们做 DevEx，靠用户访谈、可用性测试来改进产品；现在 Agent 也成了你产品的用户——它读你的文档、选你的 SDK、调你的 API。一个对人类开发者很友好的文档，完全可能让 Agent 选错 API、漏掉关键说明、卡在半路上一声不吭。DevEx 的老办法测不出这些，因为被测对象变了。

Scope 也不是凭空冒出来的。微软在 10 月 6 日先定义了 Agent Experience（AX）这个概念，提出了两个衡量维度：倾向性（propensity，Agent 会不会在没点名的任务里主动选你的技术）和有效性（efficacy，选了之后用得对不对、会不会调用已废弃的接口）；10 月 9 日又发布了 AX Practitioner Playbook，把评测方法写成手册；Scope 就是把这套手册落地的工具。方法论先行、工具跟上，这个顺序本身就值得学：没有衡量标准就上工具，跑出来的分数也不知道该往哪儿改。

## 它怎么打分：不是一个 pass/fail

Scope 的打分方式是我觉得最值得借鉴的部分。

**第一，标准写成依赖图，而不是单个断言。** 比如"起一个 Node 服务"这个任务，标准不是一句"代码能跑"，而是一串有先后关系 的检查：服务要先真正启动起来，才有资格检查 /health 接口是不是返回 JSON。前一个检查不过，后面的免谈。这种写法的好处是：它能抓住那种"代码能编译、服务没起来"的半吊子完成——而这恰恰是 Agent 最常见的失败模式：看起来干完了，其实差一步。

**第二，用 LLM Judge 打分，但微软自己先泼了冷水。** 官方明确说了：Judge 也会判错，重要结论仍然需要人工复核。这话我很认同。LLM 评 LLM，天生就有"自己人放水"的风险；Scope 的价值不在于 Judge 多准，而在于它把**每一次运行的日志、生成的文件、工作区快照、工具调用轨迹**全留下来了。某个标准没过，你能一路追溯到 Agent 当时到底干了什么——这比一个分数重要得多。

**第三，配置全部版本化。** Agent、模型、技能、MCP 服务器、扩展，打包成一个 profile 存下来。换一个变量，同一任务重跑一遍，对比结果。Agent 的行为本来就有随机性，单次结果说明不了什么；同一任务跑多次，才能分清" recurring 的毛病"和"偶发的手滑"。

## 为什么是现在：模型换得比衣服还快

Scope 选在这个时间点开源，不是偶然。就在它发布的同一周，GitHub 一口气从 Copilot 的大多数界面上下线了六个模型（包括 GPT-5.5、GPT-5.4 系列和 Grok 4.5），同时 Gemini 4 Argon、Claude Haiku 5.5、GPT-6.1 Sol 这些新模型陆续接进来。还有消息说，Claude Opus 4.8、Claude Opus 5、GPT-5.6 Terra 也排在 11 月 16 日下线。

翻译一下：你今天调通的工作流，下个月底模型一换，可能悄悄就坏了。而你没有任何系统性的办法知道它坏了——除非你有一套固定的任务和标准，每次模型变化都重跑一遍。Scope 就是干这个的：**它不是排行榜，是回归测试**。排行榜回答"谁最强"，回归测试回答"我的东西还 work 不 work"。对工程团队来说，后一个问题值钱得多。

## 两盆冷水，先泼为敬

第一盆：**部署不轻量。** 本地跑要 Docker + Compose v2、Node 22、pnpm、mkcert、GitHub CLI，默认 worker 还需要一个有效的 Copilot 授权，Judge 服务要接你自己选的模型厂商凭证；想给整个组织用，就得上 Kubernetes，worker 靠 KEDA 按队列深度扩缩容，部署走 Flux 的 GitOps。微软没把它做成一个轻脚本，而是按"持续跑、越跑越多"的 CI 式基础设施来设计的。小团队尝鲜可以，大规模用要先算好账：光是 Copilot 信用点和 Judge 的 token 消耗，就是一笔持续开销。

第二盆：**官网演示别当真。** 微软文档里自己写清楚了：公开演示站用的是预先写好的示意结果，不跑真实 Agent、不产出实测分数。真想看到分数，只能自己部署。这一点微软算坦诚，但也意味着：你在网上看到的任何 Scope"跑分截图"，在自部署之前都只是样子货。

## 如果你想用，我的建议是三条

**第一，别贪多，先写 5 到 10 个任务。** 任务要来自真实用户场景：新人第一次用你的 SDK 会走的路、文档里最容易被误解的那一段、历史上出过支持工单的坑。任务写得越像真实世界，跑分才越有意义。

**第二，把它接进变化点，而不是天天空转。** 模型换了、提示词改了、SDK 发了新版、文档重写了——这些时候重跑一遍。Scope 的正确用法是"变化检测器"，不是"每日打卡器"。

**第三，分数只看趋势，不看绝对值。** Judge 会错、Agent 会抖，单次分数没意义。看同一任务在多次运行里的通过率变化，看换模型前后的相对升降。趋势稳了，再谈优化。

## 结语

Agent 时代有个很吊诡的转变：以前我们给人写文档、做 SDK，现在还得给 Agent 写文档、做 SDK——而 Agent 这个"用户"不会给你提工单，它只会默默选错、默默卡住、默默产出半成品。Scope 的出现，标志着这件事终于从"感觉"变成了"可测量的工程问题"。

我的判断是：评测 Agent 的工具，未来会像 CI 一样成为标配——不是因为它多时髦，而是因为模型层变化的速度，已经超过了人肉验证的速度。你可以不用 Scope，但你迟早需要一个 Scope 这样的东西：同一任务、固定标准、反复跑。否则下一次模型下线，你都不知道自己的工作流是什么时候坏的。

## 来源

- 微软官方公告：[Scope: Open-source evaluation for AI coding agents](https://opensource.microsoft.com/blog/2026/10/19/introducing-scope-open-source-evaluation-for-ai-coding-agents/)
- Scope 文档：[What is Scope?](https://microsoft.github.io/scope/introduction/what-is-scope/)
- 微软 DevRel 团队负责人博客：[Measuring Agent Experience: open sourcing the platform we use, Project Scope, and an AX practitioner handbook](https://blog.chanezon.com/2026/10/19/ax-handbook-and-project-scope.html)
- It's FOSS 报道：[Microsoft's AI Coding Agent Testing Tool is Open Source](https://itsfoss.com/news/microsoft-scope-self-hosted-agent-testing/)
- TrendinTech 深度解析：[Microsoft Scope: Open Source AI Coding Agent Testing](https://trendintech.com/microsoft-scope-open-source-ai-coding-agent-testing-2026/)
