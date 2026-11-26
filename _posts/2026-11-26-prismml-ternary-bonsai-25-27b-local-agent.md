---
title: 27B 模型只剩 5.9GB：PrismML 三值量化把本地 Agent 的门槛打下来了
date: 2026-11-26 08:37:00 +0800
tags: [AI, Agent, 本地模型, 量化]
description: PrismML 11 月 24 日发布 Ternary Bonsai 2.5 27B：三值量化把 27B 模型压到 5.9GB，SWE-bench Verified 75.6，工具调用几乎追平满血版。本地跑 Agent，第一次有了体面的选择。
---

本地跑 Agent 模型，最大的拦路虎从来不是模型笨，是模型胖。

一个 27B 的模型，FP16 精度要 54GB 显存。MacBook Pro 顶配 36GB 统一内存都装不下，更别说我那台 NAS 上的 J4025——之前连 0.8B 的小模型在上面都跑不出 token。所以本地 Agent 这几年一直是个"听起来很美"的选项：要么用 7B 小模型凑合，能力不够；要么上云，代码和数据得出内网。

11 月 24 日，PrismML 发布了 Ternary Bonsai 2.5 27B，把这个局面撕开了一道口子：27B 的模型，整个文件只有 5.9GB。SWE-bench Verified 75.6，工具调用平均分 77.2，几乎追平了 54GB 的满血版。这篇把数字、原理和实战意义拆开讲。

<!--more-->

## 三值量化：每个权重只剩 -1、0、+1

Bonsai 2.5 的压缩方式叫三值量化（ternary quantization）。普通模型每个权重用 16 位浮点数存，Bonsai 把每个权重只存成三个值之一：-1、0、+1。平均下来每个权重 1.76 bit，整个模型 5.93GB，是 FP16 版 53.8GB 的九分之一。

这不是简单粗暴地把精度砍掉。PrismML 在 Bonsai 2 那代就定下来的做法是：先对权重矩阵做分块 Hadamard 旋转，变换到旋转基底上再做三值赋值，每 128 个权重共享一个 FP16 的缩放因子。旋转的作用是把权重分布"摊平"，让 -1/0/+1 这三个值能承载更多信息。2.5 这一代格式、体积、推理框架都没变，变的是训练配方——重点补的是长程任务上的稳定性。

顺带一提，Bonsai 2.5 的底座是阿里的 Qwen3.8 27B，混合注意力架构（约 75% 线性注意力、25% 全注意力），上下文 262K。权重按 Apache 2.0 开源，GGUF 和 MLX 两种格式都能下。

## 数字：最值得看的不是 75.6，是 DeepSWE 从 0 到 27

先摆 PrismML 自己公布的数字（注意：全部是厂商自报，目前还没有第三方独立复现，分数先当"待验证的宣称"看）：

| 基准 | 满血 Qwen3.8 27B | Bonsai 2 | **Bonsai 2.5** |
| --- | --- | --- | --- |
| SWE-bench Verified | 80.6 | 60.8 | **75.6** |
| DeepSWE v1.1 | 30.1 | 0 | **27.0** |
| Terminal-Bench 2.1 | 70.8 | 52.8 | **60.1** |
| 工具调用平均（5 项） | 77.7 | — | **77.2** |

三项 Agent 编程基准平均 54.2，上代只有 37.9，满血版是 60.5。也就是说，Bonsai 2.5 保留了满血版约 90% 的 Agent 编程能力。

但我最在意的是 DeepSWE 那一行：上代是 0，这代是 27.0。DeepSWE 测的是多步骤真实开发任务，模型要连续调用工具、改代码、跑测试、根据报错再改。0 分意味着上代模型在长任务上会直接崩掉——不是能力差一点，是跑不完。2.5 从 0 拉到 27，说明这一代补的正是压缩模型最致命的短板：**长程稳定性**。单题能力可以靠量化技巧保住，长任务里小误差一步步放大，最后整个任务垮掉，这才是压缩模型真正难的地方。

工具调用那组数字也值得单拎出来：五项工具调用基准（τ²-Bench、τ³-Bench、BFCL v3/v4、AppWorld）平均 77.2，满血版 77.7，基本打平。其中 AppWorld 一项从 51.2 跳到 90.5。工具调用是 Agent 的吃饭家伙——调不准工具，模型再聪明也干不了活。

当然也要说一句泼冷水的话：不是所有数字都涨了。LiveCodeBench v6 上，2.5 是 83.0，比上代的 83.8 还微跌了一点。厂商自己也把这行写进了白皮书，算坦诚。我的判断是：三值量化对"照着规范调工具、按步骤改代码"这类结构化任务友好，对纯拼推理上限的题帮助有限，甚至略有代价。

## 同一周，两条本地模型路线

有意思的是，Bonsai 2.5 发布前几天，Thinking Machines 刚发了 Inkling 2 Mini——26B 参数、循环 Transformer 架构，DeepSWE v1.1 拿了 48.2%，号称 100B 以下开源权重模型里最好，跑起来大约要 20GB 内存。同一周，两条路线撞在一起：

- **Inkling 2 Mini**：改架构（把层循环起来复用），模型本身还是常规精度，靠架构省显存；
- **Bonsai 2.5**：不改架构，改权重表示（三值量化），靠压缩省显存。

两条路线的分数不宜直接比——评测用的 harness 和提示词不完全一样。但定位上的差别很清楚：Inkling 要 20GB，Bonsai 只要 5.9GB。你的 MacBook 是 16GB 内存还是 32GB，直接决定了你能玩哪一个。而 Bonsai 的工具调用几乎追平满血版，这是 Inkling 那篇发布里没重点讲的维度。

我的看法是：这两条路线不是竞争关系，是互补。架构压缩和权重压缩迟早会合流——一个循环架构的模型再叠三值量化，体积还能再砍一刀。本地 Agent 的天花板，正在被这两边一起往上顶。

## 实战：这东西到底能在什么机器上跑

按 PrismML 的说法，Bonsai 2.5 通过 llama.cpp 跑在 NVIDIA 和 Intel GPU 上，通过 MLX 跑在 Mac、iPhone、iPad 上。MLX 版大约 8.9GB。H100 上单卡生成速度 291 tokens/s（开 MTP），2000 token 的提示词预处理 3200 tokens/s。262K 的上下文，意味着可以把整个中小型仓库塞进去再让它干活。

对我自己的设备，我是这么盘的：

- **MacBook**：能跑。MLX 版 8.9GB，16GB 统一内存的机器可以试，32GB 以上会舒服得多。私有仓库的代码分析、文档整理这类活，第一次可以真正不出内网。
- **NAS（J4025 这种双核小机器）**：别想了。我之前实测过，0.8B 的模型在上面 120 秒零输出。Bonsai 再小也是 27B，CPU 推理不在它的设计目标里。本地 Agent 的底线，至少是一台带独显的机器或一台内存够大的 Mac。
- **注意 KV Cache**：5.9GB 只是权重。262K 上下文跑起来，KV Cache 的开销才是大头。实际部署时别只盯着模型文件大小，上下文长度一拉长，内存占用会翻倍地涨。我的建议是先拿 32K~64K 上下文试，够用了再往上加。

还有一个容易被忽略的点：**三值格式需要专门的 runtime 支持**。GGUF 和 MLX 都已经有了，但如果你用的 Agent 框架只认标准 GGUF 量化格式，升级一下 llama.cpp 或相关依赖是少不了的。别指望下载即用，先确认你的工具链认不认这个格式。

## 先别急着把云端主力换掉

话说到这份上，结论要收一收。Bonsai 2.5 值得兴奋，但有三件事让我不会立刻把它当主力：

第一，**75.6 这个数字还没有第三方复现**。SWE-bench 的分数对 harness、提示词、尝试次数都很敏感。厂商的数字一向是"在自家最优配置下"跑出来的。等社区有人用同一套 harness 跑一遍，分数才算落袋。

第二，**Agent 编程平均 54.2，离满血版 60.5 还有一截**。90% 这个比例听着不错，但长任务里 10% 的差距会放大成任务成功率的差距。关键任务我还是会走云端大模型，本地模型先从"不怕错"的活开始：代码阅读、文档整理、测试生成——错了能看出来、代价小的活。

第三，**别被 5.9GB 这个数字骗了**。它解决的是"装不装得下"的问题，不是"跑得快不快"的问题。在 Mac 上跑 27B 模型，token 速度不会高，几十个 token 每秒就不错了。让它一次干两小时的活，耐心和散热都得跟上。

但方向是对的。本地 Agent 的瓶颈正在从"模型太胖"变成"工具链和评测跟不跟得上"。等哪天一个 5.9GB 的模型能在我 Mac 上稳定跑一整个下午的开发任务，云端 API 就从"必需品"变成"可选项"了。那一天，Bonsai 2.5 未必是主角，但它会是被写进时间线的一笔。

## 来源

- PrismML 官方发布：《Introducing Ternary Bonsai 2.5 27B: Powering Agentic Coding and Private Knowledge Work》（2026-11-24）— https://prismml.com/news/bonsai-2-5-27b
- Hugging Face 模型卡：prism-ml/Ternary-Bonsai-2.5-27B-GGUF — https://huggingface.co/prism-ml/Ternary-Bonsai-2.5-27B-GGUF
- PrismML 技术文档：Ternary Bonsai 2.5 27B — https://docs.prismml.com/models/bonsai-2-5-27b
- 9to5Mac：《PrismML's Bonsai 2.5 brings better coding and tool use to on-device AI》（2026-11-24）— https://9to5mac.com/2026/11/24/prismmls-bonsai-2-5-brings-better-coding-and-tool-use-to-on-device-ai/
- The Decoder：《PrismML shrinks a 54 GB language model to 5.9 GB by reducing every weight to just three possible values》— https://the-decoder.com/prismml-squeezes-an-agent-based-coding-model-with-27-billion-parameters-into-5-9-gb/
- FreshSynapse：《This 5.9 GB Coding Model Runs on Your Laptop — Ternary Bonsai 2.5 Cuts a 27B Model to a Ninth of Its Size》（2026-11-25）— https://freshsynapse.com/articles/ternary-bonsai-2-5-local-coding-model-2026-11-25/
