---
title: VS Code 1.142：Agent 协作从聊天框搬上 Canvas，微软顺手收紧了缰绳
date: 2026-10-16 09:18:00 +0800
tags: [AI, Agent, VS Code, 编程工具, Copilot]
description: VS Code 1.142 带来 AI Canvas 协作画布、Copilot Agent Host 默认化和更严的企业管控：人和 Agent 第一次有了"同一块画布"的工作方式，而管住 Agent 的缰绳，也第一次真正握在了平台手里。
---

昨天（10 月 14 日），VS Code 1.142 稳定版发布。更新日志里最抓人的一句不是某个模型升级，而是一个定义：**画布（Canvas）是用来和 Agent 协作的交互界面**。

我看完 release notes 的第一判断：这次更新干了两件事，一件是给人和 Agent 换了个协作界面（Canvas），一件是把 Agent 的缰绳交到了平台手里（Agent Host + 企业策略）。前者决定 Agent 好不好用，后者决定 Agent 让不让用。微软这次，两手一起抓了。<!--more-->

## 一、Canvas：人和 Agent 终于看的是同一块画布

先说事实。Canvas 目前是 Preview，只在桌面版、且会话跑在 Copilot harness 上时可用，开关是 `chat.canvases.enabled`。它在聊天旁边打开一块画布，**你和 Agent 检查、更新的是同一份工件，而不是只靠 prompt 来回传话**。官方给的例子是 Kanban 看板：你直接拖卡片，Agent 把功能拆成任务、更新状态、把新发现的工作加进来。

画布本身由扩展提供，上手两条路：在聊天框里输入 `/create-canvas` 描述你想要的界面，它会用一个 skill 在你工作区里生成一个 canvas 扩展并打开；或者去 GitHub Copilot 应用里装一个带 canvas 扩展的 chat plugin，然后让 Agent 列出可用画布并打开。社区已经有 Awesome Copilot 上的示例扩展可以抄，Agents 窗口里也能从 Add Tab（+）> Canvas 打开画布。

为什么我说这是"换交互范式"而不是"加了个功能"？因为过去一年所有编码 Agent 有个共同的交互瓶颈：**聊天是线性、低带宽的通道**。你描述需求、Agent 改代码、你再描述、它再改——上下文全靠对话承载，稍微复杂点的协作（比如一起排一个迭代计划、一起过一遍架构图）就变得极其笨拙。Canvas 把协作对象从"对话"变成了"工件"：双方操作同一块画布，状态是空间化的、可视的、持久的。

这和我昨天说的"Agent = 模型 + 脚手架"是一个硬币的两面：Ruflo 那种 harness 是 Agent 那一侧的脚手架，Canvas 是人这一侧的界面。脚手架决定 Agent 能不能干工程活，界面决定人能不能跟得上、管得住。两边都得有，协作才算闭环。

冷静一句：Canvas 现在是 Preview，生态决定成败。画布本身只是个容器，值钱的是上面跑的扩展——看板、架构图、测试报告面板，这些得有人写。短期内它更像给重度 Copilot 用户的玩具；长期看，如果"共享工件"成为 Agent 协作的标准姿势，今天的聊天框就会像当年的命令行一样退到后台。

## 二、Agent Host：会话从"一轮对话"变成"一个活的进程"

第二个大变化是 Copilot harness 正在变成新会话的默认项。它背后是 Copilot SDK + Agent Host：会话可以在后台继续运行，同时在编辑器窗口和独立的 Agents 窗口里访问。用大白话说，**Agent 会话从"我问一句你答一句"变成了一个活着的后台进程**，你切个窗口它还在那儿干活。

几个配套细节值得注意：

- **Ask 回归了**：作为 Copilot harness 的内置 Agent，定位是只读体验。这是用户用脚投票的结果——不是所有时候都需要一个会改代码的 Agent，有时候只想问问。
- **聊天标题直接标 harness**（Copilot / Codex），不用再点开看。
- **能单独杀掉后台 shell 了**：Agent 跑起来的后台命令会显示在聊天框上方的 Background Shells 胶囊里，某个测试跑飞了，点 Stop Shell 只停它一个，不影响别的。但注意，只能停 attached 的（Agent 当前请求里起的），detached 的管不着。
- **Codex 用户有个实用功能**：在 Agents 窗口里让 Agent 把当前会话搬到另一个文件夹或新的 Git worktree，对话历史完整保留。官方示例 prompt 是 "Continue this task in a new Git worktree of the current repository before implementing it." 调研和实现终于可以分家了——原 checkout 纹丝不动。

我的解读：微软在把"会话"做成平台级原语。harness 统一、会话可后台运行、可跨窗口访问、可整体迁移——这些都是在为"Agent 长时间、跨上下文干活"铺路。这也是 Agent 从玩具变生产力的必经之路：**不能后台跑、不能带着上下文搬家的 Agent，永远只是个聊天机器人**。

## 三、缰绳：企业策略这次是动真格的

如果说 Canvas 和 Agent Host 是给自由，那企业管控部分就是收缰绳，而且收得很具体：

- 管理员一旦配置了非空的 `permissions` 对象或打开 `sandbox.enabled`，VS Code 会**强制**完整聊天会话走 Copilot harness + Agent Host，因为只有这条路能执行策略。
- 已有的 Local 会话会被自动迁移过去，聊天记录、附件、没发出去的草稿都保留，迁移过程不会自动发送任何东西，原会话在新会话成功打开后才归档。
- 策略生效期间，**Claude、Codex、终端聊天全部不可用**，只剩编辑器内联聊天做有限的读写改。管理员可以临时选择不自动迁移，但微软把话说得很白：Local harness 执行不了 Agent Host 那套运行时安全规则。
- Windows 上 Local 会话的终端命令沙箱直接废弃了，要沙箱请走 Agent Host。

这意味着什么？意味着**"能执行策略的一方，正在成为必经之路"**。微软的打法很清晰：不跟你争哪个模型更强，而是把"可审计、可限权、可沙箱"做成平台能力，然后让企业的安全合规需求把流量导向自家 harness。昨天我说行业进入了"管住 Agent"的工程阶段，VS Code 1.142 就是这句话在编辑器里的落地版本。

对一线开发者的实际影响：你的 Agent 环境正在从"个人选择"变成"组织决策"。还在用 Claude/Codex harness 的企业用户，先去看一眼组织的策略配置，别等到某天早上发现切不过去了才懵。

## 四、模型选择器：是时候管理你的"模型组合"了

模型选择器这次重做：分页展示，把 GitHub Copilot 的模型和 BYOK（自带 key）的模型分开；悬停在某个模型上可以直接调它的 thinking level 和 context window 大小。

这事看着小，信号很大。就在同一周，GitHub Copilot 把 Gemini 4 Argon 加进了可选模型，OpenAI 则推出了价格只有 Astra 五分之一左右的 GPT-6.1 Sol（据 tech-insider 盘点）。模型越来越多、越来越便宜、越来越专——**选模型正在从"信仰"变成"配置"**。

实战建议：别再一个模型用到死了。分类、摘要、路由这类活切低 thinking level；需要长上下文的重构再开大窗口。Claude Haiku 5.5（10 月 7 日发布）那种百万 token 一毛钱、可调 effort 的小模型，就是给 Agent 当"干杂活的子代理"准备的。编辑器现在把调参界面摆到你面前了，不用就是浪费。

## 给一线同学的实战清单

1. **更新到 1.142，打开 `chat.canvases.enabled`**，新开一个 Copilot harness 会话，输入 `/create-canvas`，给当前项目造一块任务看板，亲自感受一下"和 Agent 看同一块画布"和"跟它聊天"的区别。
2. **看一眼聊天标题的 harness 标识**，确认你的主力会话跑在哪条 harness 上。新会话默认切 Copilot harness 是渐进推送的，别稀里糊涂。
3. **Codex 用户试试 worktree 搬家**：调研完直接让 Agent 把会话搬进新 worktree 再动手实现，原分支保持干净。
4. **后台命令卡住别再傻等**：Background Shells 胶囊 → 点进详情 → Stop Shell，精准杀。
5. **企业用户先查策略**：问下管理员有没有配 `permissions` 或 `sandbox.enabled`，有的话提前适应 Copilot harness，别等自动迁移那天。
6. **Windows 用户注意**：Local 会话的终端沙箱没了，需要沙箱执行就走 Agent Host。

## 结论

VS Code 1.142 回答了两个问题：**人和 Agent 怎么一起干活**（Canvas：共享工件，而不是只靠聊天），以及**Agent 怎么被管住**（Agent Host + 企业策略：能执行规则的平台成为必经之路）。前者是体验问题，后者是权力问题，微软这次一次全答了。

昨天我说 Agent 的竞争在脚手架，今天补一句：**脚手架的人类侧界面，和脚手架的治理能力，同样是竞争的一部分**。模型会越来越强，但人和 Agent 协作的姿势、以及谁有资格给 Agent 立规矩，这两件事才刚刚开场。

---

## 来源

- VS Code 1.142 官方 Release Notes（2026-10-14）：<https://code.visualstudio.com/updates/v1_142>
- Visual Studio Magazine 报道：VS Code 1.142 Brings AI Canvases, Tighter Agent Controls and a New Model Picker：<https://visualstudiomagazine.com/articles/2026/10/15/vs-code-1,-d-,142-brings-ai-canvases-tighter-agent-controls-and-a-new-model-picker.aspx>
- tech-insider：Pi 1.0 Coding Agent: Open-Source Release Cuts Tokens 40%（含 10 月两周 5 个 Agent 工具发布盘点）：<https://tech-insider.org/pi-1-0-coding-agent-tokens-cut-2026/>
- AI 星球：Claude Haiku 5.5 评测（百万 token 一毛钱、可调 effort）：<https://www.aixq.cc/75524.html>
