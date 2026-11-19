---
title: Devin 也有了自己的经理：AI 管 AI 写代码，44 天交出一个 Android 应用
date: 2026-11-19 08:40:00 +0800
tags: [AI, Agent]
description: Cognition 11 月 17 日发布 Devin Bots：一个 AI 经理带一队 Devin 写代码，44 天从零做出 Android 应用。数字很亮眼，但真正值得看的是评审、安全和定价这三道坎。
---
2026 年 11 月 17 日，Cognition 发布了 Devin Bots。Devin 这个"AI 软件工程师"现在有了自己的经理——经理也是 AI。一个 Bot 带一队 Devin，并行干一个持续几周的大项目，人只负责拍板。

<!--more-->

## 从"给任务"到"给目标"

以前用 Devin 的方式是派活：给一个任务，它写完代码交回来，协调的事还是人干——发现下一个问题、选方案、写任务、验结果、决定下一步。Bot 把这层接过去了。

按 Cognition 官方博客的说法，Bot 是一个有自己记忆和工具的持久 Agent，能同时带多个 Devin 并行工作。你给它一个大项目或一个持续目标，它自己调查、拆活、派活、评估结果，再决定下一步，只把需要人判断的决策推给你。需要你拍板的事会集中进一个"Needs You"收件箱，Bot 还会在 Slack 和 iMessage 里像个同事一样跟你同步。

官方博客把这个转变总结成一句话：给你的 Devin Bot 一个目标，而不是一份待办清单。任务描述的是你想要的改动，责任描述的是你要的结果，怎么做由 Bot 自己定。举个例子："把这个功能移植到 Android"是任务，"让 Android 和 iOS 保持同步"是责任。

## 三个案例，数字是官方自己报的

Cognition 在发布前几周先在自己公司内部用了 Bots，博客里给了三个案例。先说明：这些数字都来自 Cognition 自己，没有第三方验证。

**第一个是 Android 应用。** Devin 本来只有 iOS 应用和 iOS 团队，没有 Android 工程师，也没计划做 Android。2026 年 9 月 28 日，Bots 团队的工程师 Samyok 创建了一个"Android Bot"，给它的指令大意是：你的工作是负责 Android 应用的产品管理，从零自主做出整个应用，但先搞清楚你做这件事的障碍是什么。

44 天后，Devin 有了 Android 应用。Bot 的成绩单：合并了 1,134 个 PR，写了 344,651 行 Kotlin，跑了 2,841 个截图测试，关了 1,217 个 ticket。Samyok 在这 44 天里一共只给它发了 183 条消息，平均每 6 个 PR 才说一句话，其中 22 天一条消息都没发。大多数消息是在处理需要人决策的事，比如某个 PR 需要安全评审；也有只是给 Bot 打气的，比如"再大胆一点"。应用现在已经在 Google Play 公开测试，iOS 一上新功能，Android Bot 就跟进。

**第二个是 Layout Bot，负责让 Devin 的网页不再"跳"。** 网页不同部分通过不同请求加载，内容来晚了会把页面元素顶下去，这种布局偏移在代码评审里很难抓，因为它取决于请求时序、网速和访问历史。Layout Bot 每 3 小时构建一次 main 分支的生产版，在自己的机器上跑完整服务，模拟首次访问、重复访问和个别请求被故意延迟的加载情况，发现偏移就追溯到引入它的 PR，开一个带修复前后录像的 PR。

有天晚上，它把一次新的布局偏移追溯到两小时前刚合并的一个 PR，等有人问起时，它已经在修了。还有人问它是谁让它修另一个问题的，它的回答是："没人让我干，是我的定时检查发现 main 分支首次访问时有个很高的灰色块，跟替换它的内容对不上。"三周里，Layout Bot 合并了 159 个 PR，把页面延迟降了 70%。

**第三个最夸张：一家游戏工作室只剩一个人类员工。** Cognition 的同事 Jenny Xu 经营一家手游工作室，现在她是工作室唯一的员工，手下大约 20 个 Bot，各自负责开发、Unity、发版、UI、iOS、Android、真机测试等一摊事。Bot 上面还有一个"Super Jenny Bot"，每天四次把其他 Bot 需要她决策的事汇总到一个 Slack 帖子里，她用表情符号回复。工作室的 PR 从每周约 50 个涨到 1,900 个，每周发一个版本。Jenny 现在已经全职加入了 Cognition。

Cognition 还说，公司内部每周合并的 PR 超过 2,000 个。

## 数字要拆开看：量不是质

这些数字很能打，但有三处要冷静。

第一，1,900 个 PR、4.5 倍这些是"量"。Cognition 在 X 上的发布说，测试者平均每个消息合并的 PR 数是直接用 Devin 会话的 4.5 倍。但它没有公布合并率、缺陷率、回滚率，也没说这 1,900 个 PR 里有多少经过了扎实的人工评审。PR 数量衡量的是产出，不是好软件。评审负担不会消失，只会转移。

第二，基数很小。Bots 目前只开放给几十家早期客户，包括 Decagon、Fireworks AI 和 Reducto，两周使用量涨了 10 倍——从几十家客户起步涨 10 倍，值得鼓励，但不是规模化验证。

第三，整件事里最硬的数字其实不是 Bots 的，而是老 Devin 的。花旗 CEO Jane Fraser 在 10 月 13 日的财报电话会上说，花旗有 14,000 名工程师在用 Devin，技术供应商支出因此同比下降了 30%。这是具名高管、具体人数、具体省钱数字，是发布会上少见的实锤。但注意，这是老 Devin 的成绩，Bots 能不能把这个成绩从个人复制到整个项目，还没有答案。

## 安全这道坎：规则说了算，不是模型说了算

Bot 能自动合并 PR，这件事最容易让人紧张。Cognition 在 Fortune 的独家报道里把安全设计讲得很具体：Bot 跑在独立的云机器上，不碰工程师笔记本里的密码和密钥；管理员设定每个 Bot 能访问哪些仓库和工具；网络控制用来防止未授权的数据传输，包括模型被藏在内容里的恶意指令带偏的情况。

团队自己决定哪些改动需要人工评审，低风险改动（比如改个按钮颜色）可以自动批准合并。CEO Scott Wu 对 Fortune 说，防护靠的是公司设定并监控的规则，"而不是靠模型自己聪明到能识别出有风险或恶意的提示"。

他还有一句值得记住的话："自动驾驶软件，我认为是发展的方向。但当然，往哪开，永远由人说了算。"

## 三家同一天赌了同一件事

Devin Bots 不是孤立事件。OpenAI 在 9 月底左右推出了 Dots，一个常驻在 Codex 里的主动 Agent，负责带队做开发任务；Anthropic 在 10 月 21 日左右跟进了 Duet，类似的产品，接在 Claude Code 上。就在 Devin Bots 发布的同一天，11 月 17 日，Replit 也推出了 Missions，让一群 Agent 按目标、预算和边界去做项目。

三家赌的是同一件事：AI 写代码的下一阶段，拼的不是补全，是管理。问题不再是"Agent 能不能写这个函数"，而是"一队 Agent 能不能把一个项目跑下来，同时让人去干别的事"。

Cognition 的赌注是专注：Dots 和 Duet 是通用 Agent，顺带做代码；Devin Bots 从一开始就是为代码而生的，只协调 Devin。如果相信模型越强、产品层越重要，专注就是优势；如果相信大厂迟早会把这层能力直接吸收进 Codex 和 Claude Code，专注就是软肋。两种说法现在都还活着，明年见分晓。

## 对我们一线程序员意味着什么

先泼一盆冷水：价格和全面开放时间都没公布。Cognition 只说了 Bots 已上线，早期客户是几十家，定价页把它列在 Max、Teams 和 Enterprise 套餐里，但没有单独的 Bot 定价。今天大概率还用不上。

但方向已经很清楚了，提前想三件事：

**第一，写清楚"成功标准"，比写任务更重要。** 官方博客自己也强调了这一点：一个负责让 CI 变快的 Bot，得先知道哪些检查必须保留、多花算力行不行；一个负责新用户引导的 Bot，得知道什么叫"顺利通过"。验收指标、测试、生产反馈，这些反馈机制得人来建。选什么指标、在什么条件下测、结果到底说明什么，仍然是重要的工程工作。

**第二，评审规则是新的核心资产。** 哪些改动能自动合、哪些必须人看，这条线划在哪，直接决定了你是在省时间还是在攒雷。规则划松了，问题不会当天爆，会在几周后、跨一个 Bot 悄悄维护的项目里，在生产环境冒出来。以前我们写代码规范，现在我们要写"什么能让 Bot 自己合"的规范。

**第三，别拿 PR 数量当 KPI。** 一个人带一个 Bot，相当于多了一个不用招的技术负责人，这对小团队是真利好；但对大团队，第一个问题不是"能写多少"，而是"评审流程能不能扛住 30 倍的代码量"。先想清楚评审怎么扩，再谈产量怎么扩。

从 Copilot 提示代码、到 Devin 接任务、再到 Devin Bots 认领目标，接口一直在往上走：从"接受这个建议"，到"管理这个同事"。变的是活法，不变的是那句老话——往哪开，永远由人说了算。

## 来源

- Cognition 官方博客：[Introducing Devin Bots: from tasks to outcomes](https://devin.ai/blog/introducing-devin-bots)（2026-11-17）
- Fortune 独家报道（经转载）：[Exclusive: Cognition bets on 'Devin Bots' coding agents in challenge to Anthropic's Duet and OpenAI's Dots](https://dnyuz.com/2026/11/17/exclusive-cognition-bets-on-devin-bots-coding-agents-in-challenge-to-anthropics-duet-and-openais-dots/)（2026-11-17）
- 深度复盘：[Cognition Just Gave Devin a Manager: Devin Bots Run Teams of AI Coders for Weeks](https://dev.to/paullovelace/cognition-just-gave-devin-a-manager-devin-bots-run-teams-of-ai-coders-for-weeks-21ch)
- AlphaSignal：[Cognition's Devin Bots Now Run Parallel Coding Sessions, Hitting 2,000 Pull Requests Weekly](https://alphasignal.ai/news/cognition-s-devin-bots-now-run-parallel-coding-sessions-hitting-2-000-pull)
- AI Weekly：[Cognition Launches Devin Bots to Oversee Teams of Devin Agents](https://aiweekly.co/alerts/cognition-launches-devin-bots-to-oversee-teams-of-devin-agents)
- 对比分析：[Devin Bots vs Replit Missions: Agents That Own a Goal](https://botspot.dev/topics/devin-bots-vs-replit-missions-2026/)
