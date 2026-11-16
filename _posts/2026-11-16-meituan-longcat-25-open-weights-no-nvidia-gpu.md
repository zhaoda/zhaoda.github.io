---
title: 1.6 万亿参数、零块英伟达 GPU：美团 LongCat-2.5 开源，Agent 模型的算力叙事变了
date: 2026-11-16 08:40:00 +0800
tags: [AI, Agent, 开源模型, 大模型]
description: 美团开源 1.6 万亿参数 Agent 模型 LongCat-2.5：MIT 协议、训练全程没用一块英伟达 GPU，Terminal-Bench 逼近 Claude Opus 5。分数先别急着信，先看清三件事。
---

美团，一个在你我手机里主要负责送外卖的公司，开源了一个 1.6 万亿参数的 Agent 模型。

LongCat-2.5 在 11 月 2 日发布，11 月 10 日权重以 MIT 协议开源，11 月 15 日 The Decoder 做了详细报道。模型本身是为长程、多步骤的自主 Agent 任务设计的，尤其是写代码。参数 1.6 万亿，MoE 架构，每个 token 只激活约 480 亿参数；原生多模态，文本、图片、视频都吃；输入上下文 100 万 token，输出最长 12.8 万 token，还能开关逐步推理。

数字看着唬人，但这篇的重点不在数字。真正的新闻是：**这模型训练全程没用一块英伟达 GPU。**

<!--more-->

## 先把数字摆出来，再谈怎么看

美团自报的成绩单是这样的（注意定语：美团自报，尚未有独立复现）：

- Terminal-Bench v2.1：88.4 分，对照组 Claude Opus 5 是 89.1、GPT-5.6 Sol 是 88.8、DeepSeek-V4.1-Flash 是 90.6。只差一个身位。
- 更难的 Terminal-Bench v4.0：38.5 分，高于 GPT-5.6 Sol 的 37.3，但远低于 Claude Opus 5 的 53.9。
- DeepSWE（真实仓库修 bug）：64.6 分。
- BrowseComp（联网搜索）：91.9 分，是美团那张对比表里的最高分——但测试环境也是美团自己的。

API 走 OpenAI 和 Anthropic 兼容格式，能直接接 Claude Code、Codex、Hermes 这类 Agent 工具；推广价约每百万 token 输入 0.27 欧元、输出 1.07 欧元；聊天入口在 longcat.ai。

单看这张表，LongCat-2.5 已经摸到了几个月前美国前沿模型的水平。我的判断是：**先把它当成一个有分量的信号，而不是一个定论。** 权重 11 月 10 日才放出来，到现在还没人有足够时间独立跑分。等第三方复现出来，再决定信几成。

## 真正的新闻不是模型，是训练路线

参数规模每年都在涨，1.6 万亿本身不稀奇。稀奇的是这条路怎么走通的：

**第一，训练硬件。** LongCat-2.5 全程在国产芯片上训练，美团没有公布训练集群的具体厂商和规模，但前代 LongCat-2.0 明确说过：训练用的是 5 万多张国产 AI 芯片。2.0 当年还悄悄在 OpenRouter 上以 "Owl Alpha" 的名字跑过一段时间，算是先拿真实流量验了一波，再正式亮相。

**第二，推理部署。** 模型卡给出的自托管方案是 194 块华为昇腾 Atlas A2：2 块处理图像、64 块吃 prompt、128 块生成回答。关键在精度上——专家权重和激活都量化到 4-bit（W4A4），而这种格式是国产芯片原生支持的。主权重文件约 3.56TB，压缩后的 4-bit 版本约 1.34TB。

**第三，文档里没有英伟达。** 模型卡只写"可部署在 NPU 平台"，自托管指南里没有任何跑在英伟达 GPU 上的说明。这不是漏写，是路线声明：从训练到推理，整条链路按国产加速器设计。

这三点合起来，讲的其实是一件事：**不依赖英伟达，也能把一个前沿级 Agent 模型从训练做到可部署。** 放在两年前，这话没人敢这么说。美团的办法不是硬拼算力密度，而是把模型结构（MoE 稀疏激活）、数值精度（4-bit 量化）和硬件特性绑在一起设计，让便宜的算力跑出够用的效果。

## 三个冷静点，别被标题带跑

**一，分数是自报的。** 所有基准分都来自美团自己的测试，The Decoder 在报道里明确说了，没有独立复现。Terminal-Bench v2.1 的 88.4 很亮眼，但 v4.0 的 38.5 说明它离最顶尖还有一段。两个版本一起看，比只看一个诚实。

**二，对比表缺了最新对手。** 美团的对比表里没有 Claude Opus 5.5，也没有 GPT-6.1 Sol。公平的读法是：LongCat-2.5 追平的是几个月前的美国前沿，不是今天的。这个差距正在缩小，而且现在是开源权重——但"正在缩小"和"已经追上"是两回事。

**三，自托管基本与个人无关。** 194 块昇腾、3.56TB 权重，这不是给个人开发者准备的。MIT 协议的真正价值不在"你自己跑"，而在"任何人都能拿去用、改、商用"。对大多数人来说，API 和 longcat.ai 才是实际入口。

还有一个小细节值得记一笔：Hugging Face 上仓库的张量总数约 1.78 万亿，和美团说的 1.6 万亿对不上。这个口径差 2.0 时代就存在，美团一直没解释。不影响大局，但说明读模型卡的时候，数字要留一点余量。

## 对写代码的人，这事意味着什么

先说能直接用的：API 兼容 OpenAI 和 Anthropic 格式，意味着你现有的 Agent 工具链——Claude Code、Codex 这些——理论上换个 endpoint 就能接上去试。推广价 0.27/1.07 欧元每百万 token，比 Claude Opus 5 这类旗舰便宜一个数量级，100 万上下文配 12.8 万输出，适合扔给它做长任务：扫一遍仓库、修一类 bug、写一份带引用的调研。

再说更长远的：**开源 Agent 模型的"执行层"正在变便宜。** 过去半年，Agent 能力的差距主要在闭源旗舰手里；现在 DeepSeek、美团这些开源权重一个接一个把执行层的价格打下来。规划、评审这些高价值环节可能还得靠旗舰模型，但大量"照着计划干活"的执行步骤，完全可以交给便宜的开源模型。这直接改变 Agent 系统的成本结构——我之前写过 Agent 的账该怎么算，执行层降价是那笔账里最值得重算的一行。

最后说一句可能有点远的：这条"国产芯片 + 开源权重"的路线如果跑通了，Agent 基础设施的供应链就不再是单点。不是说英伟达不重要了，而是"没有它也能干活"本身，就是一种议价权。对所有依赖大模型做产品的人来说，多一条能走通的路，永远是好消息。

## 我的结论

LongCat-2.5 值得认真看，但别急着下结论。看三件事的后续：第三方独立跑分能不能复现 88.4；API 的实际稳定性和延迟怎么样；以及会不会有团队真的把它用到生产 Agent 系统里，跑出可复用的经验。

如果这三件都兑现了，那 11 月 15 日这天就不只是一个模型开源，而是一个信号：Agent 模型的竞争，从"谁的模型更强"扩展到了"谁的整条链路更完整"。而完整，第一次有了不依赖英伟达的版本。

---

**来源：**

- The Decoder, "Meituan releases a 1.6-trillion-parameter agent model that never touched an Nvidia GPU", 2026-11-15：https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/
- TechiesJournal, "Meituan LongCat-2.5 Follows 2.0: Open Model, Chinese Chips"：https://www.techiesjournal.com/meituan-longcat-2-5-open-model-chinese-accelerators/11672/
- Oossa, "Meituan releases open weights for 1.6T LongCat-2.5"：https://oossa.com/en/meituan-releases-open-weights-for-1-6t-longcat-2-5
- AIFOD, "Meituan Releases Open-Weight 1.6T MoE Model LongCat-2.5"：https://af.net/realtime/meituan-releases-open-weight-1-6t-moe-model-longcat-2-5/
- dev.to, "LongCat-2.5's Weights Are Now Open: A 1.6T-Parameter Agent Model, Trained Without a Single Nvidia GPU"：https://dev.to/paullovelace/longcat-25s-weights-are-now-open-a-16t-parameter-agent-model-trained-without-a-single-nvidia-50ko

文中所有基准分数、价格、硬件配置均为美团自报或相关报道转述，尚未经独立验证，特此说明。
