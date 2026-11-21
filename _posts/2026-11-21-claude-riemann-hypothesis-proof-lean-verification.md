---
title: Claude「证明」了黎曼猜想：167 年难题倒下那天，程序员该看懂的三件事
date: 2026-11-21 08:41:00 +0800
tags: [AI, Claude, Lean]
description: 11 月 20 日，Anthropic 数学家 Levent Alpöge 宣布与 Claude 一起证明了黎曼猜想，并放出 Lean 形式化证明；同一天，斯坦福还出现了第二份纯人类证明。证明还没盖棺定论，但验证方式本身，已经值得每个程序员认真看一眼。
---

11 月 20 日，数学界过了魔幻的一天。

Anthropic 的数论学家 Levent Alpöge 在个人网站贴出一份四页说明："I believe I have, working with Claude, discovered a proof of the Riemann Hypothesis."——我相信，我和 Claude 一起，发现了黎曼猜想的证明。同一天，几个小时后，美国数学会主席、斯坦福教授 Ravi Vakil 也放出了一份证明：斯坦福博士后 Alessandro Masullo 十二年纯人工工作的广义黎曼猜想证明。

167 年来没人碰掉的数学皇冠，一天之内出现了两个候选答案。其中一个的作者里，有一个 AI。

先把结论放在前面：**黎曼猜想现在还不能算"已证明"。但这件事已经不是笑话，也不是营销。** 独立验证正在以小时为单位推进，而验证本身的机制——Lean 形式化证明——才是对我们程序员最有启发的东西。

<!--more-->

## 先说清楚：到底发生了什么

黎曼猜想是 1859 年 Bernhard Riemann 提出的命题：黎曼 zeta 函数的所有"非平凡零点"，实部都恰好等于 1/2。它管的是素数的分布规律，是克莱数学研究所七个千禧年大奖难题之一，奖金 100 万美元。七个难题至今只解决了一个：2003 年佩雷尔曼的庞加莱猜想。

Alpöge 的说法有三个层次，强度不一样：

1. **黎曼猜想本身**：已用 Lean 形式化，代码就是全部证据。
2. **广义黎曼猜想（GRH）**：推广到 Dirichlet L-函数，他说同一方法"无假设"地解决。
3. **扩展黎曼猜想**：只说是未来工作的预期，不是结果。

他从 10 月 6 日起就和 Claude 在多个数学方向上并行工作，几个关键步骤的日期是 11 月 15 日。值得注意的一个细节：他说 Claude 帮他生成的完整自然语言版证明超过了 25 万页，他称之为"slop"（注水货），没发出来。发出来的只有四页说明和 14 个压缩包的 Lean 代码。

更值得注意的是他的坦诚：他直说，自己是在还没完全掌握证明所涉及的全部数学的情况下，先把完整论证拿出来的，接下来要慢慢理解它、做报告、写成正式文章。也就是说，**这一次，AI 跑在了人类合作者前面**。

## 程序员最该看懂的部分：Lean 到底在验证什么

如果你没接触过 Lean，可以把它理解成数学界的"编译器 + 类型检查器"。一段 Lean 证明如果能无错编译，通常就意味着每一步逻辑都站得住脚——机器不会被话术说服。

但这句话有个关键的后半句，伦敦帝国理工的数学家 Kevin Buzzard 说得很准：拿到一份带 Lean 代码的 PDF，第一个问题永远是——**Lean 代码里定理的陈述，到底是不是你想证明的那个定理？**

编译器能保证逻辑链不断，但保证不了你证的是不是正主。你完全可以在代码里把 zeta 函数"重新定义"成一个好证的东西，然后"证明"一个同名不同义的命题。编译照样通过。

所以验证分三关：

1. **能不能编译，依赖什么公理。** 任何人都能下载那 14 个文件让 Lean 检查。Lean 还能打印出定理依赖的全部公理，任何偷偷塞进去的未证明假设都会现形。
2. **最后那个定理，是不是标准黎曼猜想。** 这一步必须由人类数论学家来做，编译器帮不上忙。检查者要确认代码末尾的陈述和标准陈述一致，且底下每一个定义——从 zeta 函数开始——都是真货，不是长得像的替身。
3. **人类能不能读懂它。** 即便前两关都过了，一个没人读得懂的证明也还不算数学知识。OpenAI 那个 Navier-Stokes 的证明，两个多月过去了，数学界还在消化。

到我写这篇文章时，第一关已经有了实质性进展：MIT 的数学家 Andrew Sutherland 独立编译了 Alpöge 的 Lean 证明，"已经由 Lean 内核独立复核，只依赖三个标准公理"，"说实话，出问题的概率约等于零"。但 Buzzard 提醒的第二关——"comparator run"（对照运行），检查代码有没有偷换符号定义、以及能否在"偏执模式"下用多个独立内核编译——还在进行中，通常需要几个小时。

换句话说：**逻辑链大概率是真的，证的是不是正主，还在等最后一道手续。**

## 同一天的第二份证明，为什么重要

Masullo 那份是另一条路：十二年纯人工手稿，没有 AI 参与，斯坦福的 Brian Conrad——圈内出了名的最难缠的审稿人之一——已经私下审了几个月、给了详细反馈，至今站得住。

原来的计划是：把 Masullo 接到斯坦福待一年，慢慢打磨、悄悄在专家小圈子里传阅，确认无误再公布。Alpöge 的帖子一出，这个计划没法执行了，Vakil 当场把草稿放了出来，并公开请全社区来检查、形式化、补小漏洞。

两份证明走的是完全不同的技术路线（Alpöge 那边是自守形式、Galois 表示那套重型机械，Masullo 是另一条 lineage）。如果两份都站住，数学界得到的不是"一个答案"，而是"两种独立路线"——这比单一证明有价值得多。如果只站住一份，另一份也会成为很有意思的"接近成功"的案例。

对我们写代码的人来说，这里有个熟悉的味道：**两个独立实现，互相印证**。就像关键系统里用两种语言各写一遍再对结果。

## 时间点：上市第二天，巧合吗

这件事还有一个绕不开的背景：Anthropic 前一天——11 月 19 日——刚在纳斯达克上市，股票代码 ANT，发行价 83 美元，募资 813 亿美元，史上最大 IPO，完全摊薄估值约 1.5 万亿美元，首日收涨 17%。第二天，公司数学家就宣布攻克了数学史上最著名的难题。

Alpöge 在说明里主动回应了这一点：他说发布前咨询过公司领导（据 phys.org 报道，他咨询的是 CEO Dario Amodei），也承认这个时间点"可能被 cynically 解读"，但他否认这是为了抬股价，并表示是他自己决定不再等下去。

信不信由你。但有两个事实让"纯炒作"的解释站不住脚：第一，工作记录显示他从 10 月 6 日就开始和 Claude 推进这件事，关键步骤在 11 月 15 日完成，远早于上市；第二，他放出来的是能被全世界下载、编译、挑错的 Lean 代码，不是 PPT。炒作不需要把自己放在这种可证伪的位置上。

还有一个铺垫值得提：今年 8 月，Anthropic 就透露过，一个未发布的 Claude 版本改进了一个与黎曼猜想相关的、50 年未动的界，虽然当时明确说"没有证明它"。陶哲轩几周前也公开说过，AI 有可能在 2050 年代之前触及黎曼猜想。没人想到是这个月。

## 三个对程序员真正有用的启示

**第一，形式化验证正在从数学蔓延到软件，而 AI 是催化剂。**

Harmonic 的 CEO Tudor Achim 在 8 月就说过：机器检查的证明消除了数学长期依赖"可信审稿人签字"的瓶颈，而同样的工具正在向软件扩散。AI 在数学上的优势不是灵感，是耐力——能在人类喝咖啡就停下的地方一直 grind 下去。

这话放在写代码上同样成立。我们早就习惯了"编译通过 ≠ 程序正确"，现在数学界也走到了同一步：Lean 编译通过 ≠ 证的是你想证的定理。**验证的重心，正在从"逻辑对不对"转向"规约对不对"。** 这对 AI 编程 Agent 同样适用：Agent 写出的代码能跑、测试能过，但它实现的到底是不是你真正想要的需求？这个 gap，编译器和测试都不会替你填。

**第二，"做出来"和"理解它"正在分离。**

Alpöge 的坦诚是整件事里最有时代感的一句：证明已经完整地躺在那里了，但他本人还没完全掌握它。过去，做出证明的人就是最懂证明的人；现在，AI 可以先把结果交出来，人类再慢慢追上来理解。

这和我们用 Agent 写代码的体验一模一样：Agent 一晚上能交出一个你三天写不完的模块，但你得花时间读它、理解它、确认它没有埋雷。**交付速度超过理解速度，是 AI 时代的常态，不是例外。** 应对办法也不是拒绝 AI，而是把"读懂"当成正式工序——就像数学界现在做的：编译是一关，对照陈述是另一关，读懂是第三关。

**第三，别急着问"加密是不是要崩了"。**

这是我看到最多人问的问题，答案是：不会。RSA 的安全性依赖的是"把两个大素数的乘积分解回去"这件具体难事，黎曼猜想说的是素数整体怎么分布，不会给你分解某个具体大数的捷径。而且密码学家几十年来做安全论证时，本来就经常直接假设广义黎曼猜想成立（"在 GRH 下证明"）。真正能威胁 RSA 的，是能跑 Shor 算法的实用量子计算机，不是这份证明。

## 现在到底能不能说"解决了"？

我的判断是：先别急着改教科书，但也别当成又一个"AI 吹牛"段子。

支持"这次可能是真的"的信号很强：严肃的数学家、完整的 Lean 形式化、MIT 的独立编译通过、"只依赖三个标准公理"。反对"现在就下结论"的理由也很实在：comparator run 还没跑完，没有同行评议的论文，100 万美元的 Clay 奖金按规则至少要等正式发表两年、获得普遍接受之后——最早 2028 年，更可能 2029 年。

接下来几天值得盯的三件事：comparator run 的结果、数论学家对定理陈述的核对、以及 Masullo 那份手稿的社区审查进度。任何一个环节出问题，故事都会反转。

但有一点已经不需要等了：**"AI 只能做重复劳动，做不了真正的数学发现"这个说法，死了。** 不管最终结论如何，一个 AI 参与推进、人类合作者坦言"还没完全跟上"的证明，已经摆在全世界面前了。

而对我们程序员来说，更近的问题是：如果连数学证明都可以先由 AI 交出来、再由人类慢慢验证，那么我们手里那些"AI 写的代码"——是不是也该配上同样严格的三关：能跑、规约对、读得懂？

---

**来源：**

- Scientific American：Anthropic mathematician claims to prove Riemann hypothesis, most famous problem in all of math — https://www.scientificamerican.com/article/anthropic-mathematician-claims-to-prove-riemann-hypothesis-most-famous-problem-in-all-of-math/
- Scientific American：The AI Riemann hypothesis proof is almost certainly true, independent mathematicians attest — https://www.scientificamerican.com/article/the-ai-riemann-hypothesis-proof-is-almost-certainly-true-independent-mathematicians-attest/
- DataCamp：Riemann Hypothesis: Two Proofs in One Day, One Using AI — https://www.datacamp.com/blog/ai-solved-riemann-hypothesis
- phys.org：Anthropic researcher says he and Claude proved the Riemann hypothesis — https://phys.org/news/2026-11-anthropic-claude-math-greatest-riddle.html
- The Wall Street Journal：Anthropic Raises $81 Billion in Biggest IPO Ever — https://www.wsj.com/finance/stocks/anthropic-prices-ipo-at-83-a-share-0290494c
- eWeek：Claude and a 167-Year-Old Math Mystery: The Riemann Hypothesis Proof Claim — https://www.eweek.com/news/claude-riemann-hypothesis-proof-claim/
