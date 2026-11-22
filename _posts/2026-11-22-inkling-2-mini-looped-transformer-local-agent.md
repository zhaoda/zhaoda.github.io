---
title: 循环三次的 24 层：Inkling 2 Mini 把 Agent 模型搬回了笔记本
date: 2026-11-22 08:40:00 +0800
tags: [AI, Agent, 开源模型, 本地部署]
description: Thinking Machines Lab 11 月 20 日发布 Inkling 2 Mini：26.4B 开源权重，中间 12 层循环跑三遍，32GB 内存的笔记本就能跑，SWE-bench Verified 79.2%。本地 Agent 的门槛，第一次降到了普通开发者的桌子上。
---

11 月 20 日，Mira Murati 的 Thinking Machines Lab 发布了 Inkling 2 Mini。一个 26.4B 参数的开源权重模型，SWE-bench Verified 79.2%，DeepSWE 48.2%，而官方给出的本地运行门槛是：32GB 内存的 Mac，或者一台 DGX Spark。

我先说结论：这篇不聊榜单，聊的是这个模型背后的一个转向——Agent 模型第一次认真地往"能在你桌子上跑"这个方向走了，而且走得有模有样。

<!--more-->

## 循环 Transformer：不加参数，加遍数

Inkling 2 Mini 的核心卖点不是参数量，是结构。它是一个 24 层的稀疏 MoE 模型，每层把 token 路由给 128 个专家里的 8 个，单次前向激活 3.4B 参数。

关键在执行方式上：头 6 层和尾 6 层各跑一遍，中间 12 层用同一套权重跑三遍。24 层权重，48 次层访问。每次多跑一遍，大约多出 1.0B 的等效激活参数，算下来每 token 是 5.4B 等效激活参数。

为什么要这么干？Thinking Machines 自己的实验数据是：循环中间层带来的算力等效收益是 1.51 到 1.91 倍，而循环最后几层只有 1.24 到 1.36 倍。也就是说，同样一份权重，多跑几遍中间层，比把模型做大更划算。

这个思路其实不新鲜，循环、权重共享这些想法在论文里出现过很多次。新鲜的是有人把它做成了一个能打的产品级模型，并且在 agentic coding 这类长程任务上真的打出了成绩。这就从"一个有趣的想法"变成了"一条可行的路线"。

## 成绩单：强在干活，弱在记事

先看官方自报的成绩（注意，是官方自报，稍后说为什么要打这个补丁）：

- SWE-bench Verified（bash only）：79.2%，同量级开源权重第一
- SWE-bench Pro v2 Hard：77.9%
- DeepSWE v1.1：48.2%，100B 以下开源权重第一
- SWE-bench Multilingual：73.7%
- Vals Index v2.2：46.5%
- Artificial Analysis Intelligence Index v5.0：20.1，和 Qwen3.8-27B 打平

横向对比最有意思的一组是 Qwen3.8-27B：同样是 27B 上下的开源模型，Qwen 是 27B 全激活的稠密模型，Inkling 是 3.4B 激活的 MoE。结果在 agentic coding 的几项上，Inkling 全面领先，只在部分其他任务上落后于 Qwen。

斯坦福那个"每焦耳智能"（intelligence-per-joule）基准也值得看一眼：在 DGX Spark 上，Inkling 2 Mini 是 0.703，Qwen3.6-35B-A3B 是 0.430，Gemma-4-26B-A4B 是 0.159。本地部署这件事，功耗和发热本来就是硬约束，这个数字比榜单名次更实在。

但短板也很清楚，而且官方没有藏着：知识记忆弱。AA-Omniscience 上 Inkling 是 -8.6、非幻觉率 63.4%，Qwen3.8-27B 是 -6.4、71.4%。循环买的是推理深度，不是知识量。参数总量摆在那，记不住的东西，循环三遍也记不住。

所以这个模型的定位很清晰：它不是一个"什么都懂"的通用模型，它是一个"干活很行"的 Agent 模型。写代码、调工具、跑长流程，是它的主场；考它冷知识、要它背书，就是在为难它。

## 本地 Agent 的三道坎，它过了两道半

为什么我觉得这事值得单独写一篇？因为本地跑 Agent 模型，一直有三道坎：

**第一道是隐私。** 代码、文档、公司内部资料，很多人是不愿意、也不应该往云端 API 送的。本地模型跑在自己机器上，这道坎天然就过了。

**第二道是成本。** 云端 Agent 按 token 计费，长程任务跑下来账单很吓人。本地跑，边际成本就是电费。

**第三道是离线。** 飞机上、弱网环境、内网机器，云端模型直接不可用。

Inkling 2 Mini 的发布姿态，就是冲着这三道坎来的：官方演示里，研究人员在一台 48GB 的 M5 Pro MacBook Pro 上开着飞行模式，几分钟内用它搭出了一个能玩的飞行模拟器；同一个模型还同时驱动了 20 个持久自主村民的本地小镇模拟。20GB 左右的权重文件，Apache 2.0 协议，Ollama、llama.cpp、MLX、SGLang、vLLM 上线当天就有支持。

这事我是有体感的：我在自己 NAS 上跑过本地模型，J4025 那颗 CPU 跑小模型只有 2 token/s 上下，基本属于"能跑，但没法用"的状态。所以我很清楚，本地 Agent 的瓶颈从来不是"有没有开源模型"，而是"有没有一个在普通硬件上跑得动、干活还靠谱的模型"。Inkling 2 Mini 第一次把这两个条件同时满足了——32GB 内存这个门槛，M 系列 Mac 的中配、很多开发机都够得着。

当然，"两道半"里的那半道要说清楚：官方标的 1M token 上下文是上限，本地部署要打折扣。20GB 权重之外还要留 KV 缓存、运行时和系统的内存，8K token 提示词下 MLX 实测峰值内存已经接近 28GB。真要把 1M 上下文塞满，32GB 是不够的。把上下文预期放实在一点：日常几万 token 的代码库、长文档，这个量级才是它的舒适区。

## 循环带来的一个暗面：思考变深了，监控变难了

这篇最值得程序员多想一分钟的，其实不是性能，是 Thinking Machines 自己在发布里提到的一个研究点：循环让模型"不用把推理写出来，也能想得更久"。

传统的推理模型，思考过程体现在输出的 chain-of-thought 里，我们能读到它、能监控它、能在它跑偏时打断它。但循环 Transformer 把一部分"思考"搬进了前向传播内部：同一层权重多跑几遍，中间结果不落到 token 上。这意味着模型做了更多的隐式推理，而我们能直接读到的推理痕迹反而少了。

Thinking Machines 为此还专门发布了一个研究变体，来研究循环对可监控性的影响。他们的问题意识很对：Agent 越自主，监控就越重要；如果 Agent 的思考越来越多地发生在我们看不见的地方，现有的 CoT 监控、行为审计那套方法都要跟着升级。

这不是 Inkling 2 Mini 一家的事，是整个 Agent 安全方向的新变量。模型能力在往本地、往自主走，监控手段也得跟着走，否则就是只给了油门，没给刹车。

## 怎么上手：三条路

- **最快的一条：** GGUF 量化版，`llama serve -hf ggml-org/Inkling-2-Mini-GGUF:IQ4_NL`，一行命令起一个本地 OpenAI 兼容服务。
- **Mac 用户：** Ollama 官方支持，32GB 以上内存的 Apple Silicon 设备直接跑；MLX 也有 4/8-bit 构建。
- **不想折腾本地：** 官方 Tinker 平台提供托管推理和微调，首方 API 定价是输入 $0.15 / 输出 $0.50 每百万 token，OpenRouter 上更低。

三点提醒，都是发布材料里写明的：

1. 循环模型在本地运行时的支持还很新，速度因运行时和硬件而异，先在小任务上测，别直接上生产。
2. 1M 上下文是上限不是默认值，本地先按几万 token 规划。
3. 所有基准分数都是 Thinking Machines 自报的，第三方独立复测还没出来，拿它做选型决策之前，等一轮独立评测更稳妥。

## 我的判断

Inkling 2 Mini 真正的意义不在某一个分数，而在它证明了一件事：Agent 模型不一定要越做越大。24 层权重循环跑三遍，32GB 内存的笔记本就能跑出 SWE-bench Verified 79.2%，这条路如果走得通，"本地 Agent"就从一个口号变成了一个普通开发者桌子上的选项。

接下来值得盯的三件事：第三方独立评测会不会复现官方分数；循环结构在更多任务类型上是不是都有效；以及最关键的——当 Agent 的思考越来越多发生在 token 之外，监控和安全那套方法什么时候跟上。

模型已经开源了，权重就在 Hugging Face 上。这个周末，值得花一个小时把它拉下来跑一跑。

## 来源

- Thinking Machines Lab 官方发布：https://thinkingmachines.ai/news/inkling-2-mini/
- Hugging Face 模型卡：https://huggingface.co/thinkingmachines/Inkling-2-Mini
- VentureBeat 报道：https://venturebeat.com/technology/thinking-machines-wows-with-inkling-2-mini-looped-transformer-model-that-runs-locally-on-laptops
- MarkTechPost 技术解析：https://www.marktechpost.com/2026/11/21/thinking-machines-inkling-2-mini-looped-transformer/
- Medium 深度解读（循环机制与短板分析）：https://medium.com/@sajjadpakdamansavoji/thinking-machines-inkling-2-mini-loops-its-middle-layers-for-reasoning-not-knowledge-3c7b33a72f81
