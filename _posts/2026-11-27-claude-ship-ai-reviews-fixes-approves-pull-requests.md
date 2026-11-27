---
title: 评审员下岗倒计时：Claude Ship 让 AI 审 PR、修 PR，还能自己批了
date: 2026-11-27 08:40:00 +0800
tags: [AI, Agent, Claude]
description: Anthropic 11 月 23 日发布 Claude Ship：Code Review、PR Steward、Claude Approvals 三个 Agent 接管 PR 的审、修、批。评审瓶颈的终局不是 AI 审得更好，而是评审从人的判断变成了人的策略。
---

六周前我写过一篇哈佛的研究：AI 编程 Agent 让代码量涨了 30%，交付却原地踏步，瓶颈卡在评审上——代码写得比人审得快，PR 排队等评审员。那篇文章的结论是，评审成了整条流水线最窄的那一段。

11 月 23 日，Anthropic 给出了它自己的答案：把评审本身也交给 Agent。Claude Ship 发布了，beta。三个 Agent 接管 PR 开出来之后的事：审、修、批，全包。

<!--more-->

## 三个 Agent，各管一段

Claude Ship 不是一个 Agent，而是一套分工。面向 Claude Team 和 Enterprise 计划的 GitHub 仓库（包括 GitHub Enterprise Cloud），由三个部分组成：

**Code Review：找问题。**这部分已经 GA 了。多个专用 Agent 对照整个代码库审 PR，按重要程度给逐行意见。评审深度分三档，Quick、Standard、Deep，Anthropic 说平均一次评审约 20 分钟，文档里给的典型费用是 15 到 25 美元一次。

**PR Steward：修问题。**新出的 beta。PR 收到反馈、CI 挂了、出现 merge 冲突，Steward 接手修。它每次 push 之后会留言，写清楚改了什么、怎么回滚。但它有一条硬边界：**永远不批、不合**。修的人不能批自己的活，这条线是写死的。

**Claude Approvals：批不批，它说了算——按你写的规矩。**这也是 beta，也是这次发布里最有争议的部分。团队把审批策略写成一个文件 `.claude/approvals.yml`，放在仓库默认分支上。策略里按路径写规则：哪些目录 Claude 可以自己批，哪些必须留几个人批，作者算不算数，还可以接 Code Review 的结果、挂自然语言写的自定义分类器。策略文件一上默认分支，Approvals 就开始工作。

三者之间还有一条配合线：个人开发者在 Claude Code 里敲 `/ship`，Claude 就从本地改动一路干下去——开 PR、审 PR、修反馈、盯着后续评论。管理员则可以按仓库逐个开通。

## 最值得看的不是"AI 能批"，而是"批的权力怎么管"

第一眼看，Claude Ship 的卖点是"AI 能批 PR 了"。但真正值得琢磨的设计，是 Anthropic 怎么给这份权力上锁：

**第一，职责分离。**修 PR 的 Steward 没有批的权力，批 PR 的 Approvals 不碰代码。两个 Agent 之间隔着一道墙，修的人批不了自己的活。这是整套系统里最像"工程"而不是"演示"的一点。

**第二，策略即代码。**批不批不是模型临场发挥，而是仓库里一个 YAML 文件说了算。策略可以写"所有改动默认要两个人批，Code Review 通过后 Claude 可以顶掉一个"，也可以写"改 `.claude/` 目录本身的，永远两个人"。支付、鉴权这类目录，你可以直接锁死：Claude 只能评论，不能批。评审员的活，从逐行判断变成了写规则、审规则。

**第三，observe-only 模式。**Anthropic 自己建议：先开观察模式跑一段时间。观察模式下 Claude 只报告"按策略我会怎么判"，不真批。等你把它和资深评审的决定对照过几轮、心里有数了，再切到强制执行。注意一点：观察模式不是免费的——分类器和评审照常按 token 计费。

这三点合起来，Claude Ship 的真实定位就清楚了：它不是"AI 评审员"，而是"评审策略的执行器"。人退后一步，管的是策略文件，不是每一行 diff。

## 先别急着开：四笔账要算清

**第一笔是钱。**token 计费，一次评审 15 到 25 美元。单次看比人工评审便宜，但 PR 量大的团队，一个月下来不是小数目。符合条件的 Enterprise 组织可以领至少 1 万美元额度，截止 2027 年 1 月 15 日——Anthropic 在用真金白银推你上车。

**第二笔是风险。**Anthropic 在文档里写得明白：Claude Ship 可能会漏掉 bug 和安全漏洞，只能当评审的一层，不能当唯一的评审。还有一个容易踩的坑：如果你开了 GitHub auto-merge 或 merge queue，策略里又没要求必须有人批，改动可能在没人看过的情况下就合进去了。Anthropic 专门提醒了这一点。

**第三笔是适用范围。**只支持 GitHub。Zero Data Retention、HIPAA 配置、自管加密密钥的组织目前用不了。个人开发者和小团队不在这次发布的覆盖里——Team 和 Enterprise 计划才有。

**第四笔是数据怎么读。**Anthropic 拿自家 Claude Code 团队的数据背书：6 月到 9 月，合并的 PR 数量翻了一倍还多，回滚占比降了 40% 以上。这是它自己团队的数据，不是独立研究，看看就好，别当成基准。

分析师的看法也偏冷静。Gartner 的分析师说这与其说是突破，不如说是现有 AI 代码评审能力的演进；IDC 则提醒，GitHub 和 GitLab 靠着跟自家平台的深度集成，在这条线上有天然优势。

## 我的判断：评审从"判断"变成了"策略"

把这事放回我今年写过的两篇文章里看，意思就完整了。

10 月 15 日那篇，哈佛的研究说评审是瓶颈。Claude Ship 的回答是：瓶颈不是靠"审得更快"解决的，而是靠"把批的权力规则化"解决的。Code Review 负责看，Steward 负责修，Approvals 负责按规则判——流水线终于从"人审 AI 写的代码"变成了"人写规则，AI 按规则跑"。

10 月 28 日那篇，我写过专家 86% 跟着 Agent 的判断走。Claude Ship 把那个担忧变成了明文：判断让渡一旦写进 `.claude/approvals.yml`，它就不再是某个评审员一时偷懒，而是一条对全团队生效的规则。规则写错了，错的不是一次评审，是之后所有走这条规则的 PR。所以这套东西真正的风险不在模型，而在策略文件本身——它值得一次像审核心代码一样认真的评审。

如果你的团队想试，我的建议是按 Anthropic 官方的顺序来，一次一个仓库：先开 Code Review，再开 Manual 模式的 Steward（只在有人 `@claude steward` 时动手），最后上 Approvals 的 observe 模式。跑两周，把它的决定和你们资深评审的决定逐条对照。先从文档、测试、依赖升级这类低风险 PR 开始放批；支付、鉴权、加密相关的目录，永远留人，Claude 只能评论。还有，别和 auto-merge 混用，除非策略里明确写了必须有人批。

评审员不会明天就下岗。但从 Claude Ship 开始，"审 PR"这份工作里属于"判断"的部分，正在一点点变成"写规则"。会写规则的人，还是值钱的。

## 来源

- TechCrunch：[Anthropic launches Claude Ship, letting AI agents review, fix, and approve code changes](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes/)
- The Register：[Claude Ship puts AI at the helm of pull request approvals](https://www.theregister.com/ai-and-ml/2026/11/24/claude-ship-puts-ai-at-the-helm-of-pull-request-approvals/5311883)
- TechRepublic：[Anthropic Claude Ship: GitHub AI Code Reviews, Fixes, and Approvals](https://www.techrepublic.com/article/news-anthropic-claude-ship-github-pull-requests/)
- FoneArena：[Anthropic rolls out Claude Ship to automate GitHub pull request reviews, fixes and approvals](https://www.fonearena.com/blog/497487/anthropic-claude-ship.html)
- DEV：[How to try Claude Ship today: /ship, a starter approvals.yml, and the settings that decide what merges](http://dev.to/kargatharaaakash/how-to-try-claude-ship-today-ship-a-starter-approvalsyml-and-the-settings-that-decide-what-5655)
- 本站旧文：[AI 编程 Agent 让代码量涨 30% 但交付原地踏步](https://zhaoda.net/2026/10/15/ai-coding-agent-review-bottleneck/)、[专家 86% 跟着 Agent 选：你的 Code Review 还剩多少是你自己的判断](https://zhaoda.net/2026/10/28/anthropic-agent-judgment-deferral-86-percent/)
