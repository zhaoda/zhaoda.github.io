---
title: Google 给 AI 编程 Agent 发了本《现代 Web 规范》：1.0 版实测通过率从 56% 提到 88%
date: 2026-11-11 08:40:00 +0800
tags: [AI, Agent, 前端, Chrome]
description: Google 11 月 10 日发布 Modern Web Guidance 1.0，一套 200 多篇专家指南组成的技能包，专治 AI 编程 Agent 写出的过时前端代码。公开评测里，有指南的 Agent 通过率 88%，没指南的只有 56%。
---

我最近让 Agent 写前端时，越来越多地遇到一种别扭：代码能跑，测试能过，但一看就知道是"上个时代"的写法——首屏大图又加高优先级又加懒加载，无障碍全靠运气，动画在 Firefox 里直接罢工。模型不是不会写，是它脑子里装的 Web 知识停在几年前，而且没人告诉它现在该怎么写。

11 月 10 日，Google 把 Modern Web Guidance 推到了 1.0。这个东西今年 5 月 Google I/O 上只是一个早期预览，现在正式版出来了，Chrome、Firefox、Edge 三家一起背书。说白了，它就是给 AI 编程 Agent 发的一本《现代 Web 规范》，而且是能直接装进项目的技能包。

<!--more-->

## Agent 的毛病不是不会写，是不知道现在该怎么写

先把问题说清楚。AI 编程 Agent 写前端代码，最大的短板不在逻辑，而在"知识保鲜期"。

大模型训练数据的截止日期决定了它对 Web 平台的认知：它知道 `fetch`，但不一定知道今年的 Baseline 2024 里哪些特性已经全浏览器可用；它会写轮播图，但大概率不知道正确的做法应该用原生的弹窗、过渡动画和焦点管理，而不是自己手搓一堆 div 加 `tabindex`。更麻烦的是，它写出来的东西看起来是对的——浏览器不报错，页面能打开——只有拿 Lighthouse、无障碍检查或者真人用键盘走一遍，才会发现一堆暗病。

Google 这套指南瞄准的就是这个缺口：200 多篇专家写的指南，每一篇针对一个已经验证过的"AI 知识盲区"——做一个弹窗、做一个滚动进度条、接 Passkey 登录、处理自动填充的地址表单，每种场景该用什么原生能力、顺序是什么、哪里容易踩坑，都写成 Agent 能直接查的技能。Chrome 团队的说法是，早期结果显示，装了这套指南的 Agent，遵循现代最佳实践的程度平均提高了 37 个百分点。

## 1.0 版新加的，是一次"体检"

1.0 版最值得注意的新功能不是又多了几篇指南，而是一个审计（audit）能力。装好之后，它能扫一遍你现有的 HTML、CSS、JavaScript 和 package.json，找出哪些地方可以安全地升级到现代写法，然后带着 Agent 一步步改。

第一版审计用的是静态分析，能识别的代码模式还有限，Google 也直说了这只是个起点，后面会加上让 Agent 真正"理解"被审代码的推理式审计。但方向是对的：之前这套东西只管新生成的代码，现在开始管你手里那堆跑了五年的老代码了。对我们这种老项目一堆的人来说，这个比多几篇指南实在。

## 数字先摆出来：88% 对 56%

Google 这次没有只讲故事，而是挂了一个公开评测看板：Anthropic、OpenAI、Google 三家的编程 Agent，每天晚上跑同一批任务，一半带指南、一半不带，跑完由真实浏览器检查 DOM、样式和源码。

11 月 8 日那晚的结果：带指南的通过率 88%，不带的 56%。每家 Agent 那晚跑了 199 到 215 个任务。注意一个细节——任务提示里根本不提这套指南，Agent 得自己判断什么时候该去查指南。这说明效果不是靠提示词作弊刷出来的，是 Agent 真的学会了"遇到前端任务先查规范"。

代价也有，Google 没藏着：带指南的运行普遍更慢、烧更多 token。好东西从来不免费，只是这笔账现在算得过来——多花点 token，换来少返工、少修无障碍 bug，我认。

另外两个独立验证也值得看。日本创作者平台 note inc. 拿两家 Agent 在自己生产代码的克隆库上跑了 6 个 UI 任务、180 次测试：Agent One 的得分从 60.8%（没装指南）涨到 76.5%（装了但不提），再涨到 94.0%（提示里明确说用指南）；Agent Two 是 75.8% → 86.2% → 90.0%。有意思的点是，"装了"和"装了还告诉它"之间又差了一大截——技能在那儿是一回事，Agent 愿不愿意主动用是另一回事。

MetaMask 则把它接进了 PR 自动评审：到 10 月 21 日的前五周里，它在 57 个功能和修复 PR 中找出了 102 个问题，工程师完整修复了 43 个、部分修复 3 个，16 个被认定为误报或拒绝，还有 20 个没处理、20 个结果未知。不是百分百靠谱，但作为一层自动网，够用了。

## 怎么装：一条命令，十分钟的事

装法简单得有点不像 Google 的风格：

```bash
npx modern-web-guidance@latest install
```

它会把技能放进 `.agents/skills`（Amp、Cline、Codex 等十几个 Agent 都读这个位置），同时链接一份到 Claude Code 的 `.claude/skills`。也可以走别的路：Vercel 的 `npx skills add`、Claude Code 插件、Copilot CLI、Antigravity CLI、Gemini 扩展都有官方安装路径。预览版用户升级用 `npx modern-web-guidance@latest update`。

装完之后的工作流是这样的：Agent 写前端代码前，先用内置的 search 按关键词找指南，再用 retrieve 把对应指南拉出来读一遍，写完对照指南自查一遍再交差。Google 还建议配上 Chrome DevTools for agents，让 Agent 自己把代码跑起来、在浏览器里测一遍，形成"写—查—跑"的闭环。

两个细节要提醒：第一，这套指南默认只认 Baseline 2024，也就是各大浏览器都支持了至少 30 个月的特性；更新的特性（比如视图过渡、`@starting-style`、滚动驱动动画）只允许做渐进增强——先做功能检测，关掉动画页面也必须能用。第二，CLI 会向 Google 发匿名使用统计，不想要的话在 shell 配置里加 `DISABLE_TELEMETRY=1` 就行。独立博主实测还提到，安装时有个安全扫描曾把这个 Google 官方项目标成"严重风险"，他读完文件确认里面只有 Markdown、没有脚本和钩子——扫描误报而已，但装任何技能之前自己扫一眼文件，永远是好习惯。

## 三家浏览器一起站台，苹果没来

1.0 发布前一天（11 月 9 日），项目仓库上传了一份治理文档：六个负责人席位，Chrome 占两个，Edge 和 Mozilla 各一个，剩下两个给独立 Web 平台专家，目前还有一个独立席位空着——苹果没有席位。

这个格局本身就值得琢磨。Chrome、Firefox、Edge 三家加上 MDN 一起推，说明大家终于在"AI 写的代码质量太差"这件事上达成了共识：模型厂商自己补不上这个课，因为这不是模型能力问题，是 Web 平台知识的供给问题。谁最懂 Web 平台的最新实践？浏览器厂商自己。

但也要泼一盆冷水。无障碍顾问 Adrian Roselli 在 5 月预览版时测过：让 Antigravity 按文档里的手风琴示例写，出来的东西既不符合 WCAG，动画在 Firefox 里还是坏的，而且当时没有任何保证能让 Agent 真去遵守指南。那是预览版，不是 1.0，但提醒仍然有效：指南再好，也只是供给侧的改进，Agent 会不会读、读完会不会照做、做完谁来验收，这三道关一关都不能少。Google 自己的评测也承认，指南在无障碍、安全头、脚本和图片加载优先级这几类上，模型仍然有短板。

## 我的判断：技能包正在变成 Agent 时代的基础设施

这件事我放在更大的图景里看：Agent Skills 刚捐给基金会、有了中立的规矩（我 10 月 30 日写过那篇），现在 Chrome 就把自家最拿手的 Web 知识打包成技能发出来。技能包正在从"某个人的提示词技巧"变成"某个领域的官方知识供给"——以后每个专业领域都可能有这么一份官方技能：浏览器厂商给前端，数据库厂商给 SQL，云厂商给部署。

对我们写代码的人来说，实操建议就三条：

1. **先装上，再谈效果。** 一条 `npx` 命令的事，装进你最常用的那个项目里，跑一周看看你的 Agent 写前端时有没有变化。别在空项目里测，去你的真实老项目里测，1.0 的审计就是给老项目准备的。
2. **提示词里点名要用它。** note inc. 的数据摆在那儿：装了不说 76.5%，装了还说 94%。在任务描述里加一句"按 modern-web-guidance 的指南写"，这句话本身就是性价比最高的提示词。
3. **别把它当免检。** 88% 的通过率不是 100%，无障碍和安全头还是短板。让它帮你把 80% 的脏活干了，剩下的 20%——键盘走一遍、Lighthouse 跑一遍、真人看一眼——还是得你自己来。Agent 的评审瓶颈那篇我之前写过，结论到现在也没变：代码量涨上去之后，人才是最后一道关。

AI 编程 Agent 的竞争，正在从"谁的模型更聪明"变成"谁的工具箱更懂行"。Google 这次没发新模型，只发了一套指南，但它可能比发模型更实在——模型三个月就换代，规范一旦立住，就是所有 Agent 的公共底座。

## 参考来源

- Search Engine Journal：Google Releases Modern Web Guidance 1.0 For AI Coding Agents（2026-11-10）— <https://www.searchenginejournal.com/google-releases-modern-web-guidance-1-0-for-ai-coding-agents/596495/>
- Chrome for Developers：Modern Web Guidance 文档 — <https://developer.chrome.com/docs/modern-web-guidance>
- Chrome for Developers：Get started with Modern Web Guidance — <https://developer.chrome.com/docs/modern-web-guidance/get-started>
- Manas Mehrotra：Chrome's Modern Web Guidance（独立实测，含遥测与安全扫描细节）— <https://www.manasmehrotra.info/blog/modern-web-guidance-css-transitions>
