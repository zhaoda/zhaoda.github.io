---
title: Agent 在你电脑上裸奔的时代该结束了：Eclipse Enclave 1.0 给编程 Agent 造了个中立沙箱
date: 2026-11-24 10:18:00 +0800
tags: [AI, Agent, 开源, 安全]
description: Eclipse 基金会 11 月 19 日发布 Enclave 1.0：开源、中立厂商的编程 Agent 沙箱，每个会话一个容器，密钥不出沙箱，六款主流 Agent 开箱即用。
---

上周我写过一把泄露的供应商密钥是怎么把带后门的 Claude Code 插件塞进 5000 台电脑的。那件事之后我一直在想一个问题：我们让 Agent 在本机上跑命令、装依赖、改文件、连数据库，凭什么觉得它不会出事？凭它"一般不会"吗？

11 月 19 日，Eclipse 基金会发布了 Eclipse Enclave 1.0，给了这个问题一个像样的答案：一个开源的、不绑任何厂商的运行时沙箱，专门让 AI 编程 Agent 在里面干活。Agent 在容器里可以放开手脚，容器外面，你的机器碰不得。

<!--more-->

## 先说清楚它解决的是什么问题

现在的编程 Agent 早就不只是"补全代码"了。它会自己跑 shell 命令、装依赖、改文件、跑测试。能力越大，需要的自主权就越大——你不可能每条命令都点一次确认，那样 Agent 就没意义了。

但自主权一旦给出去，风险也跟着给出去。同一台机器上，你的 SSH 密钥、云厂商凭证、`.aws` 目录、别的项目代码，全都在 Agent 伸手可及的地方。它读错一个文件、装错一个包、执行一段被污染的指令，后果直接落在你的本机上。

以前的解法是各家自己做自己的沙箱：OpenAI 给 Codex 做了一套，Google 11 月 22 日刚公布 Agent Compute Engine，用微 VM 加外部网关把密钥挡在沙箱外面。这些方案都不差，但都有一个共同点：绑在自家栈上。你换一个 Agent，沙箱就得换一套。

Enclave 的切入点就在这里：**沙箱这一层应该像 IDE 一样中立**，而不是每个厂商的私家后院。

## Enclave 是怎么把 Agent 关起来的

Enclave 的模型很简单，一个会话对应四个部分：

- **工作区**：Agent 能看到的只有你挂进去的 git worktree 和额外挂载的目录，别的碰不到。
- **短命容器**：Agent 跑在 Docker 或 Podman 的容器里，会话结束容器就消失。
- **网关**：一个 sidecar 负责过滤 DNS、代理出站连接。只有白名单里的域名能出去，而且允许和被拒绝的尝试都会写进日志，`enclave network log` 就能查。
- **持久状态**：登录信息、历史记录、配置、自定义 skill 和 MCP 服务器存在宿主机上的一个文件夹里，重启不丢。

最值得说的是密钥的处理。需要给外部服务用的凭证，网关只在请求里注入，容器里 Agent 拿到的只是一个占位符——真实 token 从头到尾不出现在 Agent 能读到的地方，它想打印、想上传都无从下手。

另外两条硬规则也很对我胃口：Enclave 拒绝以 root 身份启动，也直接禁掉挂载 home 目录这类敏感位置。安全这东西，靠自觉不如靠拦。

## 开箱即用的 Agent，比我想象的多

1.0 内置支持六款工具：Claude Code、Codex、GitHub Copilot CLI、OpenCode、Pi，还有能直接 attach 到运行中会话的 Theia IDE。Amp 和 Antigravity 这类则放在单独的扩展仓库里。

平台覆盖 Linux、macOS 和 Windows（走 WSL2）。后端要 Docker 的 rootful 模式加 buildx，或者 Podman（也支持 rootless）。另外还有一个实验性的 QEMU 微 VM 后端——方向很明显，容器隔离不够用的场景，迟早要上虚拟机。

第一次启动时选一次 Agent，之后 `enclave --tool` 换工具、`enclave continue` 恢复上一个会话、`enclave ps` 看正在跑的会话。还有一个叫 HomeShell 的图形伴侣处在预览阶段，可以把会话按项目分组、在网页或桌面窗口里盯着等你确认的 Agent。

上手成本很低：GitHub Releases 页有 Ubuntu 24.04 和 Fedora 的 .deb/.rpm 包，Linux 和 macOS 的单文件版还能 `enclave self-update` 自我更新。唯一要注意的前置条件是 Git 要 2.26 以上，而且得配好 author 和 committer 身份，否则 Enclave 在启动容器前就直接停下来。

## 为什么"中立"这件事值得单独拿出来说

Eclipse 基金会不是小作坊，它托管着 Eclipse IDE、Jakarta EE、Adoptium、Open VSX，400 多个高影响力开源项目。Enclave 本身来自 EclipseSource 内部团队，他们先在自己公司里用这套沙箱技术跑 Agent，觉得靠谱才捐给基金会。

S&P Global 旗下的 451 Research 还专门为此出了一份报告，标题就叫《Eclipse Foundation raises the governance and security stakes for AI agents》，点名 Enclave 跨 Agent 的一致隔离和策略控制对企业的直接价值。报告还提到，项目方计划把网关日志往欧盟《网络弹性法案》和《人工智能法案》的合规证据方向发展——这已经不是给个人开发者图方便了，是在给企业采购铺路。

基金会同时还在推一个处在预览阶段的 AI Registry，帮开发者发现 MCP 服务器、Agent skill 和沙箱扩展，带来源和背书信息。Enclave、Theia IDE、PanEval、LMOS、Sovereign AI Foundation，拼在一起就是一套"AI 开发基础设施中立化"的组合拳。

## 对我自己的三条实战启示

**第一，只挂仓库目录，别图方便挂整个 home。** Enclave 默认就禁了敏感挂载，别自己绕过去。Agent 要的只是代码和依赖，不是你的全部家当。

**第二，白名单收紧到"刚好够用"。** 允许的域名一开始只放包管理器、模型 API 和你明确要用的服务。网关日志要定期看一眼——Agent 半夜想连一个你没听过的域名，你应该第一时间知道，而不是等出事才去翻。

**第三，沙箱防的是破坏，不是烂代码。** Enclave 能保证 Agent 删不掉你的 `~/.ssh`，但保证不了它写的 SQL 是对的。给它数据库凭证之前，先确认连的是开发库；合并之前，分支 review 一步都不能省。10 月 29 日我写 Akamai 的 WASM 沙箱时说过同样的话：隔离是底线，不是终点。

## 结论

Agent 编程的瓶颈早就不是模型够不够聪明，而是我们敢不敢放手让它干活。Enclave 1.0 的意义不在于技术多新——容器加 allowlist 加密钥占位符，都是老办法——而在于它第一次把这套办法做成了一个开源、中立、跨 Agent 的标准件。

如果你已经在让 Agent 在本机上裸奔，值得花一个下午试试。装上，挂一个仓库，白名单收紧，跑一个你本来要盯着它干完的任务。放手的前提是关得住，这次终于有人把笼子开源了。

## 来源

- Eclipse Foundation 新闻稿：[Eclipse Foundation launches Eclipse Enclave 1.0](https://www.globenewswire.com/news-release/2026/11/19/3406378/0/en/eclipse-foundation-launches-eclipse-enclave-1-0-bringing-security-and-choice-to-autonomous-ai-coding.html)
- Vinish.Dev 实测解析：[Eclipse Enclave 1.0 Released as an Open Source Sandbox for Autonomous AI Coding Agents](https://vinish.dev/eclipse-enclave-1-0-ai-coding-agent-sandbox)
- Enclave 官方网站：[enclave.eclipse.dev](https://enclave.eclipse.dev)
- Google Agent Compute Engine 相关简报：[Dosa AI Tools, 2026-11-22](https://ai.dosa.dev/blog/today-in-ai-2026-11-22)
