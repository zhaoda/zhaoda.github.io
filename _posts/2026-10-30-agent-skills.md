---
title: SKILL.md 终于有了中立娘家：Agent Skills 捐给基金会之后，写技能的规矩变了
date: 2026-10-30 08:45:00 +0800
tags: [AI, Agent]
description: 10 月 22 日 Anthropic 把 Agent Skills 捐给了 Agentic AI Foundation：格式没变，归属变了。对一线开发者来说，真正的变化是——技能终于可以当成跨工具的标准来写，而不是某个产品的私有配置。
---

10 月 22 日，在圣何塞的 AGNTCon + MCPCon 大会上，Agentic AI Foundation（AAIF）宣布接纳四个新项目：Anthropic 捐出的 Agent Skills、OpenAI 捐出的 Open Responses、Hugging Face 捐出的 OpenEnv，以及阿里巴巴捐出的 OpenSandbox。基金会托管的项目由此从 3 个变成 10 个。

<!--more-->

这条新闻第一眼看像治理八卦：换个东家、换批维护者，跟我每天敲的代码有什么关系？关系其实很直接——它回答了一个我一直悬着的问题：**SKILL.md 到底是某个厂商的功能，还是一套可以长期下注的格式？** 现在答案变了：它是有中立归属的格式。

## 先说清楚：Agent Skills 到底是什么

一句话：**技能就是一个文件夹，里面一个 SKILL.md，加上可选的脚本、参考资料和素材。**

SKILL.md 顶部是一小段 YAML，必填的只有两个字段：`name`（干什么的技能）和 `description`（什么时候用它）。下面是给 Agent 的 Markdown 指令。规范一共只有六个字段：`name`、`description`、`license`、`compatibility`、`metadata`、`allowed-tools`。

它便宜的秘诀叫渐进披露：Agent 启动时只读每个技能的名字和描述，按规范大约各 100 个 token；任务匹配上了才读全文；只有指令指到时，才打开附带的脚本和参考文件。所以技能多不等于上下文贵——**写得烂的技能才贵**，一上来就把几千字手册塞进描述的那种。

Anthropic 说，这套标准 2025 年 12 月发布以来，已有 70 多个 Agent 平台接入，包括 ChatGPT、Cursor、GitHub Copilot 和 VS Code；累计发布了 100 万个技能，安装近 2.8 亿次。注意定语：这是 Anthropic 自己的数字，而且安装量来自技能注册表的统计，并不等于独立用户数。数字可以听，决策别全押在数字上。

## 10 月 22 日，到底变了什么、没变什么

变了的三件事：

- **归属**：技能的名字、Logo、GitHub 组织和 agentskills.io 域名，从 Anthropic 转到了 AAIF 这个 Linux 基金会旗下的中立基金会。
- **维护者**：由 Anthropic、Google、OpenAI 等公司工程师以个人身份共同维护，David Soria Parra 和 Mahesh Murag 担任首席维护者。
- **路线图**：Anthropic 提议，接下来做版本化发布、正式的提案流程，以及给技能作者和安装者的安全指南。注意，都是“提议”，还没落地。

没变的三件事，恰恰是直接影响你仓库的：

- **格式没变**：10 月 21 日的 SKILL.md，10 月 22 日之后照样能用，不用迁移。
- **存放位置规范不管**：规范只定义文件夹里装什么，不规定各产品去哪里找技能。每个产品还是按自己的目录扫描。
- **产品扩展还是扩展**：某个 Agent 认的私有字段，换个 Agent 照样可能不认。

我的判断是：**这是一次“可以放心标准化”的信号，而不是“马上要重构”的信号。** 公司倾向于把格式捐给基金会，往往是因为它想让所有人放心地在上面建东西，而不是因为它想放弃这个东西。MCP 走过同样的路，Agent Skills 现在是第二个。

## 实战：写一次，到处用，具体怎么做

如果你只用一个 Agent、一个人写代码，别折腾：把技能放在那个 Agent 自己的目录里就行，跨工具可移植性等第二个 Agent 出现再说。但只要出现“两个人”或“两个 Agent”中的任何一个，就值得按共享格式写一份。

我的做法是四条：

**1. 一份真身，放在 `.agents/skills`。** 这是规范的客户端实现指南推荐扫描的跨客户端约定目录。Claude Code 认的是 `.claude/skills`，那就给它一个符号链接指过去，而不是复制两份。两份拷贝的结局永远是改了一处忘了另一处，最后不知道哪份是真的。

**2. 共享版 front matter 只用六个规范字段。** 比如 Claude Code 的 `context: fork` 这类扩展，写进共享版就是给下一个 Agent 埋雷。产品特有的配置，放到产品自己的文件里——Codex 就从技能文件夹内的 `agents/openai.yaml` 读它自己的 UI 和调用设置，其他 Agent 直接忽略。

**3. `allowed-tools` 只当提示，不当枷锁。** 规范把它标为实验性，各家支持程度不一。真正要限制技能能干什么，靠 Agent 自己的权限配置和沙箱，而不是指望一个前置字段。

**4. 描述写“触发条件”，不要写“自我介绍”。** 描述是 Agent 决定要不要加载你的唯一依据。好的描述长这样：“评审数据库迁移，检查可回滚性、大表加锁和数据回填；当 diff 新增或修改 migrations/ 下的文件时用。” 坏的描述长这样：“这是一个非常强大的数据库专家技能。” 前者省 token，后者浪费 token 还招不来正确的任务。

顺带说一句：别一上来就写十个技能。先写一两个你每周真正会触发三次以上的：比如“提 PR 前的自查清单”或“迁移评审”。技能的价值不在数量，在触发频率乘以每次省下的返工。

## 基金会没解决的问题：技能安不安全

这是整件事里最容易被“中立”两个字掩盖的一点：**格式有了中立的娘家，不等于任何一个技能都是安全的。**

技能不只是文档，它可以带脚本。Agent 读到技能，就会按指令去跑那些脚本。项目级技能来自你正在工作的仓库——而那个仓库可能是刚 clone 下来的、你并不完全了解的代码。规范的客户端指南已经提醒：对这类技能要做信任检查。Anthropic 提议中的安全指南，恰恰说明这份指南目前还没有成品。

所以在那份指南落地之前，我的规矩很简单，拿技能当依赖审：

- 装之前读一遍 SKILL.md 和它带的每一个脚本，别只看名字和星标。
- 命令给最小权限，别让一个“整理文档”的技能拿到能删库的 shell。
- 密钥不进技能文件，这是红线，不是建议。

100 万个技能这个数字，换个角度看就是 100 万个需要被审的东西。供给从来不是瓶颈，审查才是。

## 结论：什么时候标准化，什么时候别折腾

- 一个人、一个 Agent：别为可移植性付 ceremony 的税，写在它自己的目录里。
- 多人协作，或 Claude Code、Codex、Cursor 混用：现在就可以按六个规范字段写共享版，一份真身加符号链接，别等版本化发布落地——格式本身已经稳定，缺的只是版本号那张纸。
- 装别人的技能：先审后装，把技能当依赖，而不是当提示词。

Agent Skills 交给基金会，最大的意义不是多了一个组织，而是少了一个借口：以后再有人说“这是 Anthropic 私有的东西，换工具就作废”，这个借口不成立了。剩下的工作，还是老样子——把高频流程写成技能，把低频的留在脑子里，把别人的技能审清楚了再装。

## 来源

- Agentic AI Foundation 公告：四家公司捐出 Agent 技能等项目：https://aaif.io/news/agentic-ai-foundation-announces-four-new-projects
- Sharkly：Agent Skills 转入基金会对运行编码 Agent 的团队意味着什么：https://sharkly.ai/blog/agent-skills-agentic-ai-foundation/
- Times of AI：Anthropic 把 Agent Skills 捐给 Agentic AI Foundation：https://timesof.ai/2026/10/anthropic-donates-agent-skills-to-agentic-ai-foundation-aaif
- Stackness：Agent Skills 加入基金会后，开放标准变了什么、技能本身还留下什么：https://stackness.dev/blog/agent-skills-open-standard-agentic-ai-foundation-what-changes
