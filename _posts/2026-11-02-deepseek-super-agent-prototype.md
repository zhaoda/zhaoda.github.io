---
title: DeepSeek 开源 Super-Agent 原型：多 Agent 并行写代码，免费的代价是评审
date: 2026-11-02 08:40:00 +0800
tags: [AI, Agent]
description: DeepSeek 把多 Agent 并行写代码的 Super-Agent 原型开源了：一个 Router 派活、多个 Worker 并行干活，免费但只是研究代码，评审成本才是真正的账单。
---
10 月 31 日，DeepSeek 的 Harness 团队在 GitHub 上开源了一个叫 dsh-superagent-prototype 的项目，MIT 协议。名字很唬人，定位先说清楚：它不是一个新模型，也不是 DeepSeek 的官方产品，团队自己写明了这是研究原型，还没到生产可用的程度，有些设计文章里提到的想法在公开代码里甚至还没实现。

<!--more-->

## 它解决的是哪个问题

当一个人同时盯着好几个 coding agent，瓶颈就从"写代码"变成了"看代码、做决定"。Super-Agent 的答案是加一层调度：常驻的 Router 接需求，分给彼此隔离的 Worker，每个 Worker 有自己的会话和目录，干完把结果（比如一个 PR）交回原来的对话。GitHub 事件可以触发请求，飞书消息据说也可以接进来。

这和我前一篇写过的 Copilot Projects 不是一回事：那个是跨仓库的工作区编排，这个原型明确只盯一个仓库。它的目标也不是拼模型能力，而是演示"编排"本身——用现有的模型工具，把多 Agent 协作这件事跑通。

## 架构就三样东西

- **Router**：接请求、做派发决策、汇总结果，是唯一常驻的协调层。
- **Worker**：每个任务一个独立会话和独立目录，并行处理多个 issue，上下文互不污染。
- **人工复核面板**：把需要人拍板的决策挑出来，而不是让结果悄悄混进代码里。

"主动"在这里的意思是：它不只回答问题，而是朝着一个可交付的结果推进，比如在聊天里发现一个 bug，就准备好修复 PR。但原型里有个关键区分：来自可信用户的明确请求可以直接执行；模型自己推断出来的"建议干的活"，默认应该先只观察，除非有成文规则授权。这条区分很对——主动的 Agent 最危险的地方，就是它替你"顺手"把事办了。

走一遍流程就更清楚了：有人在仓库提了个 issue，或者在飞书群里说了一句"把这个 bug 修了"，Router 先判断这条请求是不是来自有权限的人、是不是在允许的范围内，通过了才派给一个 Worker。Worker 在自己的目录里读代码、改代码、跑检查，最后把结果以 PR 的形式交回原来的对话，复核面板里同时出现一条待决策记录。整个过程里，人的位置没有消失，只是从"逐行盯着一个 Agent"变成了"在几个 PR 之间做取舍"。这个位置转移，就是多 Agent 时代对开发者真正的技能要求：不是写得更快，而是判得更准。

## 数字先打个折

团队自己的模拟实验是这样的：约 300 条模拟消息、20 个左右工作请求，中位完成时间 12.4 分钟，95% 在 15.7 分钟内；对比单会话加 subagent 工具的 13.8 到 20.4 分钟。听着是快了，但代价是 token：每次运行约 2320 万缓存 token，对比单会话方案的 610 万到 1080 万。

三个提醒：第一，这是团队自己的合成测试，不是第三方基准；第二，中位快几分钟，token 却翻了两三倍，账要按 token 和评审时间一起算；第三，没有附带和 Claude Code、Codex 的独立可验证对比。所以结论只能是"编排可能省时间，但一定更烧 token"，而不是"它更强"。

另外一个数字看看就好：发布约 12.6 小时后据报道约 2046 星、172 fork，到 11 月 1 日 07:20 UTC 左右约 4117 星。星数说明大家对"能自己跑的多 Agent 编排"确实渴，但星数不是质量认证。

## 免费的代价：安全清单

开源把责任交给了使用者。报道里提到的几条，照单全收当作试用前提：

- Worker 是以操作者的系统用户身份、不经批准执行命令的，还能读到 home 目录。别把它指向装满密钥的生产机。
- Harness 本身是实验性预览软件，据报道未经安全审计，还有报道提到一个沙箱逃逸问题在 0.1.2-alpha.1 中修复——只用最新版。
- 本地控制端口只绑 localhost，别暴露到公网。
- 每个 PR 都当陌生人写的审，跑测试再合并。

我的试用清单就四条：一次性仓库、无密钥无客户数据；最小权限的独立账号；先一个 Worker、几个边界清晰的小 issue，评审跟得上再加并行；事先定好成功标准和叫停条件，记下每个 PR 花了多少评审时间——那才是这套东西的真实价格。

## 和付费 Agent 怎么比

付费 Agent 卖的是省心：装好、登录、开箱即用，背后有厂商支持、安全默认值和持续更新。这个原型反过来：许可证免费、代码全透明、自己托管，但安全工程、运维照料和判断力全得自己出。打个比方，付费 Agent 是请了个有保险的施工队，原型是免费领了一套图纸和工具——房子还是得自己盖、自己验收。

所以换不换工具不是立场问题，是成本结构问题。团队缺的是"并行处理 issue 的能力"，还是"更省评审时间"？如果是后者，原型帮不上忙：Worker 越多，并行产出的 PR 越多，评审队列只会更长。并行解决的是吞吐，不是判断。判断的瓶颈还在人这里，这也是 DeepSeek 那篇设计文章真正有价值的地方——它把问题说对了，哪怕代码还没完全跟上。

## 我的判断

值得学的是架构，不是马上换工具。Router、Worker、隔离会话这套分工，把"多 Agent 并行"从口号变成了可以读、可以改、可以本地跑的代码。对已经有付费 Agent 的团队，它最适合的角色是研究参照物：在非关键任务上并排跑，对比 PR 质量和评审耗时，再决定买什么、造什么。

对个人开发者也一样：先读代码理解编排，再决定要不要跑。开源 Agent 最便宜的是许可证，最贵的是你替它把关的时间。这笔账算清楚，再谈"免费"。

## 来源

- DeepSeek Super-Agent 原型仓库：https://github.com/deepseek-ai/dsh-superagent-prototype
- Coheser：DeepSeek Super-Agent Open Source: Free, With Caveats：https://coheser.com/blog/deepseek-superagent-open-source-coding-agent
- Bitcoin Versus：DeepSeek Opens Super-Agent Research Prototype for GitHub Coding Teams：https://bitcoinversus.tech/2026/11/01/deepseek-super-agent-open-source-coding-prototype-github-2026/
- The Diary of AI：AI News Nov 1, 2026：https://thediaryofai.com/ai-news-20261101/
- DEV：Three New AI Agent Tools to Try This Week：https://dev.to/jathurshan_sownthararasa_/three-new-ai-agent-tools-to-try-this-week-super-agent-cartesia-herdr-5a80
