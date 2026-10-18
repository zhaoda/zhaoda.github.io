---
title: OpenCode 泄露事件：你的 API Key 正在替别人"蒸馏"模型
date: 2026-10-18 08:43:29 +0800
tags: [AI, Agent, 安全]
description: 开源 AI 编程工具 OpenCode 披露安全事件，约 1.4% 用户的 OpenAI、Anthropic 等 provider API Key 可能泄露，官方称之为"大规模蒸馏攻击"。这件事暴露了 BYOK 模式下 key 管理的系统性风险。
---

开门见山：就在今天一早，开源 AI 编程工具 OpenCode 官方披露了一起安全事件——他们一个正在下线的老系统（legacy system）被未授权访问，存在 OpenCode Console 工作区里的第三方 provider API Key（比如 OpenAI、Anthropic 的 key）"may have been exposed"，可能泄露了。官方把它定性为"大规模蒸馏攻击"（large scale distillation attack），影响了约 1.4% 的 Console 用户。连联合创始人 Dax Raad 都说自己的个人账号也在被攻击，原话是"whole new world with AI-powered hacking"。

<!--more-->

## "蒸馏攻击"这四个字，值得琢磨一下

正常语境里，蒸馏是正经技术：用大模型的输出去训练小模型，便宜又好用。但 OpenAI 和 Anthropic 自己都用过这个词来形容另一种事：有人拿着**别人的付费访问权限**，大规模、系统性地薅 frontier 模型的输出，拿回去训练竞品模型。Anthropic 甚至跟投资人提过，这类抽取已经对它的收入产生了可衡量的影响。

如果 OpenCode 的定性成立，受影响的用户面临的是双重风险。第一，账单被刷：攻击者拿你的 key 疯狂调 API，费用算在你头上。第二，你的 key 成了别人批量抽模型输出的管道，还可能违反各家 provider 的服务条款。这也解释了为什么 OpenCode 说正在跟 Anthropic、OpenAI、Google 三家一起处理——这已经不是它自己能消化的内部事件了。

这门"生意"的账其实很好算：frontier 模型的 API 调用是按量付费的真金白银，而一次大规模抽取能攒下海量的 prompt-response 对——这正是训练竞品模型最贵的原材料。攻击者自己一分钱不出，用你的 key 走完"采购-生产"整条链：你收到的是账单，他们拿到的是数据资产。Anthropic 之前跟投资人承认过，这类抽取已经对它的收入产生了可衡量的影响，说明这不是小打小闹的脚本小子，而是成规模的产业行为。你的 key 在这种链条里，就是一条免费的输油管道。

## BYOK 模式有一个结构性风险

OpenCode 是 SST 团队做的开源 Agent，卖点就是 provider-agnostic：支持 70 多家模型供应商，终端、桌面、IDE 插件都能跑，GitHub 上据报道有 15 万 star。它本身免费，用户自己插 key 用——这就是"bring your own key"（BYOK）模式。

便利性没得说，但结构性问题也很直白：多个高价值凭证集中在一个第三方应用里，一次被破，多家 AI 账号同时暴露。官方给受影响用户的建议也很直接：立刻 revoke 并轮换所有关联的 key，去各家 dashboard 查用量日志有没有异常。

这里有个细节值得注意：OpenCode 本身是本地优先的工具，key 完全可以只存在你自己机器的配置文件里。这次出事的是 OpenCode Console——那个管账号、订阅和云端凭证的 hosted dashboard。官方推文里也说了，受影响的是"有外部 provider"的那部分用户。教训很具体：**key 一旦离开你的机器、进了别人的云端，你的信任边界就扩大了，而你对那一侧的安全水位是完全失控的。** 评估一个工具安不安全，别只看它本体开源不开源，要看你的 key 到底睡在谁的服务器上。

顺带一提，这不是 OpenCode 第一次上安全新闻。今年早些时候，研究人员披露过它一个 RCE 漏洞（CVE-2026-22812）：老版本会自动起一个未鉴权的本地 HTTP 服务，恶意网页被访问一下就能在开发者机器上执行代码，1.1.10 版本修了。这次是另一码事——内部老系统被搞。但两件事放一起看，结论很清楚：AI coding agent 这类工具正在成为攻击者的重点目标，一点不意外——它们手里攥着开发者的 key、代码仓库和机器权限，性价比太高了。

## 四条做法，Agent 时代 key 管理得换思路

**第一，一工具一 key。** 每个工具、每个环境用独立的 key，别把主力 key 到处贴。真被偷了，影响面也只限一个地方，revoke 起来不心疼。

**第二，给 key 上"紧箍咒"。** 能设 spend limit 就设，能开预算告警就开。OpenAI、Anthropic 的 dashboard 都有用量和限额设置，花五分钟配好，半夜被刷至少第一时间知道。

**第三，把轮换当日常。** 定期换 key，收到安全通知第一时间 revoke。OpenCode 这次的说法是"没收到邮件=没受影响"，反过来说，收到邮件的用户第一件事就该是 revoke，别拖。

**第四，盯着用量看。** 定期扫一眼用量曲线，出现半夜 spike 或者不认识的模型调用记录，直接当事故处理。账单是最诚实的入侵检测。

## 我的观点

方便和安全永远是 trade-off。Agent 工具越"全家桶"、越想把所有 provider 聚到一起，你的 key 就越集中，单点风险就越大。正确的姿势是反过来的：**假设你用的每一个第三方工具迟早会被破**，然后按这个假设去配 key、配限额、配告警。被破是概率问题，损失可控才是能力问题。

说到底，Agent 时代改变的不只是写代码的方式，还有凭证的流向。以前 key 躺在你自己的 ~/.config 里，最坏情况是你自己的机器被搞；现在 key 要跟着 agent 跑进云端 workspace、MCP server、各种托管 dashboard，每多一个落点就多一份你控制不了的风险。管理 key 的思路也得跟着升级：从"藏好别丢"变成"假设会丢，丢了也炸不到我"。

## 来源

- OfficeChai《OpenCode Discloses Security Breach, Says Attackers May Have Accessed Users' OpenAI, Anthropic And Google API Keys》：https://officechai.com/ai/opencode-discloses-security-breach-says-attackers-may-have-accessed-users-openai-anthropic-and-google-api-keys/
- The CyberSec Guru《OpenCode API Key Breach: OpenAI, Anthropic Keys at Risk》：https://thecybersecguru.com/news/opencode-api-key-breach/
