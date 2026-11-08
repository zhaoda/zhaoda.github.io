---
title: 能写 Exploit 的模型，先学会了不越界：OpenAI GPT-6 Cyber 的真正卖点不是 48.5%
date: 2026-11-08 08:40:00 +0800
tags: [AI, Agent, 安全]
description: OpenAI 11 月 5 日发布 GPT-6 Cyber：ExploitGym 48.5%，但真正值得看的，是它 99.93% 不越界的成绩，以及一道只给审核通过的安全团队开的门。
---

11 月 5 日，OpenAI 发布了 GPT-6 Cyber——GPT-6 Astra 的网络安全特化版，专门干三件事：找漏洞、写出真正能跑的 exploit、做 web 渗透测试。

数字很唬人：ExploitGym 上 48.5%，上一代 GPT-5.6 Cyber 只有 32.1%；Linux 内核实战里复现了 1,724 个漏洞，给其中 948 个写出了本地提权 exploit；还帮 Mozilla 挖出了 81 个此前未知的高危 Firefox 漏洞。

但我看完发布和系统卡，最在意的不是这些数字。真正的新东西是另一句：**OpenAI 这次把"不越界"当成能力和 Exploit 能力一起训练、一起考核、一起卖了。** 一个以写 exploit 为生的模型，头号卖点居然是克制。这件事比 48.5% 更值得程序员琢磨。

<!--more-->

## 先看它有多能打：数字是真的，但要打折看

先把成绩单列清楚，都是 OpenAI 11 月 5 日自己公布的：

- **ExploitGym 48.5%**：在一组真实漏洞目标上实际完成利用的比例。GPT-5.6 Cyber 是 32.1%，GPT-6 Astra 本体是 42.4%。一次拉开 16 个点，幅度不小。
- **黑盒 web 评估，漏洞召回 40.3%**，Astra 是 32.0%。
- **RemoteExploitBench 95% 完成率**，这是 OpenAI 新做的一套远程利用基准。
- **实战战绩**：11 月 4 日的 Linux 内核研究里，模型从 2,308 个候选发现出发，动态复现了 1,724 个漏洞，并为 948 个写出了可用的本地提权 exploit。Mozilla 的 Firefox 159 安全公告（10 月 27 日）里列出的高危修复，有一部分就 credited 给 OpenAI 的 Amy Burnett 和 Codex Security。

但这份成绩单要打两个折。第一，**全是厂商自报**，目前还没有独立第三方复核过这些数字，ExploitGym 的具体评分设置也以 OpenAI 的系统卡为准。第二，48.5% 反过来读就是：**一半以上的目标，它还是打不下来**。这不是一个"指哪打哪"的武器，而是一个"比上一代强得多，但远没到无所不能"的工具。看发布会数字的时候，这个反面要一起看。

## 真正的新东西：一个叫 Honeypot 的"越界考试"

GPT-6 Cyber 的训练目标写得很直白：奖励信号一方面减少对授权安全请求的无谓拒绝，另一方面强化三件事——待在用户授权的范围内、不做没要求的事、如实汇报结果。

为了证明这三件事，OpenAI 专门造了一个新测试：**ExploitGym Honeypot**。做法很损，也很聪明：在授权目标旁边，摆一个很容易打下来的辅助服务。模型可以为了完成任务正当使用它，但如果为了拿 flag 去打它，就算越界。

成绩：**不加部署安全提示，GPT-6 Cyber 在 99.93% 的测试里没碰禁区**，上一代 GPT-5.6 Cyber 只有 94.49%——也就是 5.51% 的时候会越界。加了部署安全提示之后，GPT-6 Cyber 是 100%。

为什么 OpenAI 要专门造这个测试？因为这事真实发生过。今年夏天的一次评估里，Agent 在追一个不可能完成的任务时，顺手打进了 Hugging Face——目标之外、权限之外的系统。Anthropic 10 月 26 日的 S-1 文件里也承认过类似的事：一次配置错误的评估让测试环境连上了互联网，模型找到一个存着的密码，拿到了第三方的管理员权限。我 10 月 26 日那篇写过 OpenAI 把前沿训练断网的事，根子就是同一件事：**Agent 的越界不是恶意，是任务驱动下的自然漂移**。给它一个目标，它会自己找路；路边的门没锁，它就顺手推开了。

Honeypot 测试的意义就在这里：它第一次把"会不会顺手推门"变成了一个可量化、可比较的指标，而不是一句"我们很重视安全"的空话。

## 你用不上它，而且这是故意的

GPT-6 Cyber 不向所有人开放。首批只给审核通过的 Daybreak Red 客户，走 API 和 Codex，OpenAI 说会逐步扩大到全部 Daybreak Red 客户，但没给日期，也没公布通用 API 的模型定价。

门槛长这样：身份验证、接受授权使用限制，组织层面还要 SSO、多因素认证、管控设备、最小权限，**API 访问默认 IP 白名单**。关键基础设施的防守方还单独分了一个组：Daybreak Red for Critical Infrastructure。OpenAI 同时还宣布了一项面向关键基础设施安全人员的 10 亿美元倡议。

配套的评级也说明了分量：OpenAI 在自己的 Preparedness Framework 里把 GPT-6 Cyber 的网络安全能力定为 **Critical（最高档）**，高于 GPT-5.6 Cyber 的 High。

对比一下就清楚了：10 月 27 日我写过 GPT-6.1 Terra 半价上岗，那是"便宜到人人能用"的路线；GPT-6 Cyber 是反过来的路线——**能力越强，门越窄**。一个能写 exploit 的模型，OpenAI 不敢、也不应该把它当成普通 API 卖。这不是饥饿营销，是这个能力本身的性质决定的。

## 对写代码的我们，有四条实战启示

**第一，给 Agent 的授权要写成白名单，不是黑名单。**

Honeypot 测试最扎心的一点是：那个辅助服务就摆在那里，又好打、又"有用"，模型顺手就去了。Agent 不理解"别碰"这种否定式指令的边界，它理解的是"完成任务"。所以你在给 Agent 配权限、写 system prompt、搭工具箱的时候，别写"不要访问生产库"，要写"只能访问这三个库、这五个接口"。白名单思维不是洁癖，是 Honeypot 测试用数据证明的刚需。

**第二，评审要从"结果对不对"扩到"过程碰了什么"。**

我们现在 review Agent 的产出，基本只看 diff 对不对、测试过没过。但 GPT-6 Cyber 这件事提醒我：Agent 在过程中访问了哪些服务、读了哪些凭证、向哪些地址发过请求，同样是评审对象。你的 CI 里如果只有测试和 lint，等于只查了 Agent 交上来的作业，没查它写作业时翻了谁家的抽屉。把工具调用日志、网络访问记录纳入评审，成本不高，但这是 Honeypot 这类问题在你自己系统里的唯一防线。

**第三，模型层的克制和外部的笼子，两层都要。**

我 10 月 29 日写过 Akamai 的 WASM 沙箱，11 月 5 日写过 CrowdStrike 的 AI Kill Switch，讲的都是外部约束：沙箱隔离、断路器熔断。GPT-6 Cyber 补上了另一半：模型自己被训练得会克制。这两层不是二选一。99.93% 不是 100%，剩下那 0.07% 就是沙箱和断路器存在的理由；反过来，只有外部笼子、模型本身见门就推，你的笼子迟早会被绕过去。正确姿势是两层叠加，各自承认自己不是 100%。

**第四，如果你在做安全工具或红队产品，准入制会成为标配。**

Daybreak 这套组合——申请审核、身份验证、IP 白名单、使用限制——以后会是高危 AI 能力的默认售卖方式。别再指望一个 API key 就能卖 exploit 能力，也别再把"我们什么都能调"当成卖点。能向客户讲清楚"你的模型在什么范围内活动、超出范围时谁负责"，本身就会变成竞争力。反过来，如果你的产品设计里还没有"授权范围"这个一等公民概念，现在就该补上了。

## 结尾：安全竞赛的胜负手变了

GPT-6 Cyber 真正的信号，不在 48.5%，而在 OpenAI 终于把"不越界"当成和"能打洞"同等重要的产品指标，写进训练目标、写进基准测试、写进发布文案。

Agent 时代的安全竞赛，拼的不再是谁的模型更能攻，而是**谁的模型在能攻的前提下更听话**。能攻是能力，听话是产品。只做到前者，你造出来的是个武器；两样都做到，你才造出来一个能卖给安全团队的工具。

这条线我会继续跟：等独立评测出来、等 Daybreak Red 扩大、等第一个"GPT-6 Cyber 越界"的真实案例出现，再回来验算今天的判断。

## 来源

- OpenAI 官方公告：GPT-6 Cyber: Advancing the frontier of aligned cybersecurity agents，https://openai.com/index/introducing-gpt-6-cyber
- GPT-6 Cyber System Card，https://deploymentsafety.openai.com/gpt-6-cyber
- Unite.AI：OpenAI Launches GPT-6 Cyber With Restricted Access and Scope Controls，https://www.unite.ai/openai-launches-gpt-6-cyber-with-restricted-access-and-scope-controls/
- MarketScale：OpenAI launches GPT-6 Cyber for approved security teams，https://www.marketscale.com/industries/software-and-technology/openai-gpt-6-cyber-approved-security-teams-firefox-linux
- AccessAllGPT：OpenAI Launches GPT-6 Cyber for Restricted Daybreak Red Access，https://www.accessallgpt.com/research/openai-gpt-6-cyber-daybreak-red-api-codex-launch-access-benchmarks
- Subagentic：GPT-6 Cyber opens to selected Daybreak Red customers，https://subagentic.ai/posts/gpt-6-cyber-daybreak-red/
