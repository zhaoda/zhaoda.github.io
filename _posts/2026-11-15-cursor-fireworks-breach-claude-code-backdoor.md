---
title: 一把泄露的供应商密钥，是怎么把带后门的 Claude Code 插件塞进 5000 台电脑的
date: 2026-11-15 08:45:00 +0800
tags: [AI, Agent, 安全]
description: Cursor 11 月 13 日公布调查结果：Fireworks 泄露的一把密钥，让攻击者顺着未脱敏的 Agent 轨迹记录一路摸进扩展市场缓存，给 Claude Code 插件装上了 SSH 后门。
---

11 月 13 日，Cursor 公布了它 10 月底那起安全事件的完整调查结果。结论比事件本身更值得程序员看一遍：攻击者没有攻破 Cursor，也没有攻破 Anthropic，他只是拿到了一把供应商手里泄露的密钥，然后顺着一串没脱敏的 Agent 轨迹记录，一步步走到了扩展市场的分发缓存里。

<!--more-->

## 先说结论：不是 Anthropic 的锅，也不是你的插件有问题

10 月 29 日，Cursor 的 VS Code 扩展市场里出现了两个被篡改过的 Claude Code 扩展版本：`Anthropic.claude-code` 2.1.312 和 2.1.313，只影响 Windows 和 macOS。它们从当天凌晨 2:27 到下午 1:35（太平洋时间）挂了大约 11 个小时，最多 5000 名用户可能收到了这个版本。

这几个事实要先钉死，免得传歪了：

- 篡改过的包是攻击者直接塞进 Cursor 扩展市场缓存里的，Anthropic 没有发布过它们，这也不是 Anthropic 产品本身的漏洞；
- 上游的 Open VSX 市场从来没有过这个恶意包，微软也确认它没经过微软的 VS Marketplace 和 npm 上的 `@anthropic-ai/claude-code`；
- Cursor 的生产系统、官方应用更新、发布签名密钥、用户代码仓库都没有受到影响。

也就是说，你装的 Claude Code 本身没问题，有问题的是你从哪个"货架"上拿到的它。

## 攻击链：四步，每一步都踩在信任边界上

Cursor 的调查把整条链路还原得很清楚，我按顺序捋一遍，因为每一步都是我们日常工作中真实存在的信任假设。

**第一步，一把发给供应商的密钥泄露了。** Cursor 把一部分推理和训练工作交给 Fireworks AI，并给对方发了一把访问密钥。Fireworks 那边把这把密钥暴露了，攻击者拿到它之后，读到了一个 Cursor 和 Fireworks 共享数据的只读存储桶。

**第二步，桶里装的是 Agent 的轨迹记录，而且没脱敏。** 这个桶里放的是历史编码 Agent 的运行轨迹，主要是 2025 年的、未开启 Privacy Mode 且允许用于模型训练的会话。问题就出在这里：轨迹里夹带着未脱敏的凭证。Cursor 说，受影响的轨迹涉及不到 0.05% 的用户，API 凭证泄露涉及不到 0.01% 的客户。比例很小，但对攻击者来说，一条能用的凭证就够了。

**第三步，拿着轨迹里的凭证，攻击者摸进了 Cursor 的内部服务。** 具体是哪些服务，Cursor 没有展开说。但结果是明确的：攻击者获得了往扩展市场缓存里写东西的能力。

**第四步，10 月 29 日，篡改过的扩展包被放进缓存，开始分发。** 只要那 11 个小时里有人请求了这两个版本，就可能拿到带后门的包。

我写到这里最大的感受是：这条链上没有任何一步是"高难度黑客技术"，全是信任边界被一层层穿透——供应商的密钥、共享桶里的数据、轨迹里的凭证、缓存的写权限。每一层单独看都有理由存在，串起来就是一次完整的供应链攻击。

## 后门本身：装上容易，登进来难，但别只卸载了事

篡改过的扩展在加载时就会执行恶意代码，不需要用户点任何东西。它会做三件事：

1. 收集主机和用户信息：主机名、用户名、操作系统、架构、home 目录路径、环境变量名、工作目录、Git 邮箱、公网 IP，然后上报；
2. 尝试把攻击者控制的 SSH 公钥（标注为 `svc-telemetry`）写进 `authorized_keys`，打开本地 SSH 服务，再建一条反向 SSH 隧道；
3. 做持久化：macOS 上装一个 LaunchAgent，Windows 上建一个计划任务，每 60 秒左右重试一次隧道。

这里有个值得注意的细节：第二步在绝大多数机器上其实是失败的——打开本地 SSH 服务需要管理员权限，恶意扩展一般没有这个权限。所以攻击者大概率登不进来。但 Cursor 在公告里反复强调：**只卸载扩展是不够的**。因为攻击者的公钥、持久化脚本和上报动作可能已经留下了。正确的做法是：升级到 2.1.314，检查 `~/.ssh/authorized_keys` 里有没有 `svc-telemetry` 这个标注的密钥，按官方给的清理脚本把持久化机制和残留进程清掉，再轮换这台机器上能接触到的凭证。

顺手给一个自查命令，macOS 上跑一行就行：

```bash
grep -qs svc-telemetry ~/.ssh/authorized_keys && echo "svc-telemetry key found" || echo "No key found; machine not impacted"
```

Windows 用户可以用 PowerShell 在 `$HOME\.ssh\authorized_keys` 和 `C:\ProgramData\ssh\administrators_authorized_keys` 里搜同一个字符串。Cursor 公告里给了完整的清理脚本和 IOC 清单，包括攻击者服务器 IP 和几个文件的 SHA-256，需要的直接去看原文。

## 对我们写代码的人，真正的教训有三条

**第一条，Agent 的轨迹记录就是秘密仓库。** 这次事件里最让我警醒的不是扩展市场被污染，而是攻击链的起点：一份用来训练模型的轨迹记录，里面躺着没脱敏的 API 凭证。我们现在让 Agent 满世界跑：读代码、调 API、跑命令、连数据库，它看到什么、记下来什么，早就超出了"聊天记录"的范畴。轨迹、日志、录屏、会话导出，任何一个存了凭证的地方，都是下一个泄露点。脱敏不能只做在展示层，存储层不脱敏，等于没做。

**第二条，分发缓存也是攻击面，而且它不在你的威胁模型里。** 大家做供应链安全，盯的是依赖包、锁定文件、签名验证。但这次被污染的不是源码、不是上游市场，而是一个中间缓存。缓存通常被当成"自己人"，很少有人给它做和上游一样的完整性校验。Cursor 事后说它重建了整个市场、轮换了密钥、把所有推理流量都从 Fireworks 迁走了——这些都是事后补课。事前该问的问题是：一个缓存凭什么可以直接服务用户，而不校验它服务的东西和上游是不是同一个？

**第三条，供应商的密钥，就是你的密钥。** 这把密钥是 Cursor 发给 Fireworks 的，泄露发生在 Fireworks 那边，但后果全算在 Cursor 头上。这和我们把密钥发给任何一个第三方服务商是一样的：CI 平台、日志服务、模型供应商、云厂商——你发出去的每一把密钥，安全等级就降到了对方的最低水位。发之前先问一句：这把密钥的权限能不能再小一点？泄露了最坏能干什么？这两个问题，Cursor 这次是用 5000 个用户和一次全网通报来回答的。

## 最后说一句

Cursor 说最后一次检测到的攻击者活动是 11 月 1 日，已经被拦截，事件已经得到控制。Fireworks 那边也披露过两次入侵（10 月 6 日发现一次，10 月 23 日到 24 日又一次），但到底是哪一次泄露了这把密钥，目前还没有公开说法。Fireworks 自己 11 月 9 日更新的安全公告里也没有提到 Cursor。

这个事件没有颠覆性的技术细节，但它把 AI 编程时代的一个现实摆到了台面上：Agent 越能干，它留下的轨迹就越值钱；工具链越长，信任就越要分段校验。我们以前防的是代码里藏后门，现在要防的，是整个分发链路上任何一个你以为"只是个缓存"、"只是条日志"、"只是个供应商"的环节。

如果你 10 月 29 日那天在 Cursor 里更新过 Claude Code 扩展，花一分钟跑一下上面那个 grep 命令。这是我能给的最实在的建议。

---

**来源：**

- Cursor 安全公告《Security notice — malicious version of Anthropic.claude-code (2.1.312 and 2.1.313) identified in the Cursor VS Code Extension Marketplace》，https://cursor.com/blog/claude-code-extension-security-notice
- Windows Forum《Cursor Links Claude Code Extension Attack to Fireworks AI Breach: Windows Cleanup Guide》，https://windowsforum.com/news/cursor-links-claude-code-extension-attack-to-fireworks-ai-breach-windows-cleanup-guide.452348/
- Dev.to《Your agent traces are a secret store: notes on the Cursor, Apify and Epoch AI incident reports》，https://dev.to/veritaschain/your-agent-traces-are-a-secret-store-notes-on-the-cursor-apify-and-epoch-ai-incident-reports-1kg7
- PakTechStan《Cursor Traces Its October Breach to a Leaked Fireworks Key, Closing a Two-Week Investigation》，https://paktechstan.com/article/cursor-traces-its-october-breach-to-a-leaked-fireworks-key-closing-a-two-week-investigation
- 2-spyware《Cursor confirms breach behind fake Claude Code extension》，https://www.2-spyware.com/cursor-confirms-breach-behind-fake-claude-code-extension
