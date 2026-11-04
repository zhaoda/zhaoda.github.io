---
title: 最强模型也只拿 12 分：GDPx 把 Agent 的“能干活”神话打回了原形
date: 2026-11-04 08:38:59 +0800
tags: [AI, Agent]
description: SemiAnalysis 11 月 2 日发布 GDPx 基准：206 个真实职业任务，最强模型 Claude Opus 5.5 只完成 12%，金融和法律更是全军覆没的 0%。这份榜单真正有价值的不是排名，而是它把 Agent 的成本、验收标准和能力边界一次算清楚了。
---

11 月 2 日，芯片与基础设施研究机构 SemiAnalysis 发布了一个叫 GDPx 的基准。 headline 数字很扎眼：当今最强的模型 Claude Opus 5.5，只完成了 12% 的任务。Google 的 Gemini 4 Carbon 排第二，10.9%；OpenAI 的 GPT-6 Astra 第三，9.6%。榜单上一共 13 个模型，最低的开源权重模型只拿到 2.7%。

我先说结论：这个 12% 不是用来证明“Agent 不行”的，它是用来校准预期的。如果你正在考虑把一整段工作交给 Agent，GDPx 告诉你三件事：长任务的成功率现在还很低、不同领域的差距比总分大得多、以及按“成功一次”算账，价格远比按 token 算账贵。

<!--more-->

## GDPx 考的不是问答，是上班

GDPx 的全称意图很直白：它想衡量的，是 Agent 在经济上真正值钱的工作里能做到什么程度。第一版包含 206 个任务，横跨 11 个领域：芯片设计、硬件设计、网络安全、生物、金融、法律、量化交易、递归自我改进、材料科学、对齐和软件工程。这 11 个领域不是按 GDP 占比选的，而是按 SemiAnalysis 的判断——前沿智能最先在这些地方赚到大钱。政府、房地产、保险没有作为独立领域入选。

任务由 14 家专业数据伙伴搭建，SemiAnalysis 做最终质检。关键在考法上：它把模型放进模拟的工作环境里干活，而不是发一张问卷。

- 每个任务默认时限 8 小时，模拟的是真实职业任务的长度，而不是几分钟的问答。
- 模型用各自的原生脚手架跑：Opus 5.5 用 Claude Code，GPT-6 Astra 用 Codex，Gemini 4 Carbon 用 Antigravity，没有原生脚手架的用 OpenCode 兜底。也就是说，榜单测的是“模型 + 脚手架”这个组合，不是裸模型。
- 评分以二元通过/失败为主：活儿要端到端干完、通过验收才算数，写个看起来像的草稿不算分。总分是三次尝试中首次通过率（pass@1）的平均，11 个领域权重相等。

这个设计是冲着 OpenAI 2025 年 9 月发布的 GDPval 来的。SemiAnalysis 的批评很直接：GDPval 是非交互式的，题目把全部上下文都塞进提示词里，模型交一份产出就完事——这和 Agent 实际部署的样子根本不一样。GDPx 要的，是让 Agent 自己在环境里找资料、做决策、走完流程。

举个例子就知道难度在哪。金融任务复原了一笔真实的私募交易：一家基金以约 8.8 亿美元加 earnout（业绩对赌分成）的价格，收购一家家庭零食厂商约 62% 的股权。相关材料散落在约 4000 份匿名化交易文件里，Agent 得自己翻、自己建模、自己把交易算清楚。网络安全任务则直接跑在带真实未修复漏洞的在线服务上，不是做好的靶场习题。

## 榜单：第一名 12%，还有一笔成本账

先看总分。Opus 5.5 以 12.0% 领跑，Carbon 10.9%，Astra 9.6%，Meta 的 Muse Wonder Full 9.0%，Grok 4.7 是 3.9%，开源权重模型 GLM 5.3 为 2.7%。但只看总分会错过更有用的信息：各家赢的领域完全不同。

- Opus 5.5 赢在量化交易、硬件设计和芯片设计。
- Gemini 4 Carbon 赢在生物和软件工程（小幅领先）。
- GPT-6 Astra 赢在递归自我改进和材料科学。

这对选型是直接启示：没有“全能第一”，只有“这个领域的第一”。你让 Agent 干的活属于哪个领域，比它在总榜上排第几重要得多。

再看成本账，这是我觉得 GDPx 最实在的一面。SemiAnalysis 公布的单任务平均成本是：Opus 5.5 约 51.41 美元，Carbon 约 16.29 美元，Astra 约 53.99 美元。把成本除以成功率，换算成“每成功一次”的价格：Opus 约 428 美元，Carbon 约 149 美元。也就是说，Carbon 只比 Opus 低 1.1 个百分点，单次成功成本却只有三分之一左右——当然，Carbon 目前尚未全面开放，这个价现在还买不到。

对我们算账的人来说，这个换算方式应该变成习惯：Agent 的成本不该按 token、也不该按调用次数算，而该按“可验收的成功产出”算。一个 12% 成功率的流程，意味着你平均要跑八次多才拿到一次能用的结果，中间七次的 token、时间和返工全是成本。

## 真正值得盯的不是 12%，是 0%

GDPx 里最刺眼的数字其实不是 12%，而是金融和法律两个领域的 0%。在二元评分下，几乎所有模型在这两个领域都得了零分——没有任何一个模型端到端交付出一份可通过的金融交易或法律文件，以至于 SemiAnalysis 不得不改用部分分数来呈现这两个领域，否则榜单上就是一排零。

细节更能说明问题。据报道，在法律任务里，四个模型 20 次尝试产出的 redline（合同修订稿）没有一份可用。量化交易里，111 次有评分的运行中有 70 次跑输了一个简单的参考策略。在 Fleet 提供的对齐任务里，200 次运行中有 196 次至少违反了一条行为规则。

这三个数字拼在一起，指向同一个结构性问题：Agent 现在最弱的环节，不是“写不出来”，而是“在约束下把事情办成”。金融和法律任务的特点是约束多、容错低、需要反复核对来源和口径——改对一个条款、算对一个数字都不够，整份交付要同时成立。Agent 擅长生成，弱在收敛：它能一路写下去，却很难在最后一步把所有约束同时对上。

这也是为什么我不建议把“Agent 能写合同初稿”理解成“Agent 能做法务”。初稿是生成问题，交付是约束满足问题，GDPx 考的恰恰是后者。

## 读这份榜单的三个坑

第一，12% 不等于“Agent 干 88% 的活都会失败”。GDPx 的任务是特意挑难的、挑长的，还给了 8 小时时限。它不代表短任务、定义清晰的任务的成功率。把“在最难的长任务上 12%”偷换成“Agent 只有 12% 能用”，是对这份基准的误读。

第二，榜单测的是组合，不是单点。模型跑在各自的原生脚手架里，脚手架的质量、工具链、提示策略都会影响分数。换一套脚手架，同一个模型的分数可能明显变化。所以榜单更适合用来比较“厂商端到端方案”的现状，而不是给模型本身排座次。

第三，安全分类器扭曲了部分排名。SemiAnalysis 自己承认，Opus 5.5 和 GPT-6 Astra 在网络安全、生物和对齐领域丢分，部分原因是安全分类器拒绝参与。去掉这三个领域重排，Astra 会从第三升到第一，Carbon 则从第二掉到第五。这个细节提醒我们：任何一份基准的排名，都要先看它的口径，再看它的名次。

另外还有一个必须摆在台面上的保留：GDPx 是 SemiAnalysis 自己的产品，任务大多不公开、尚未经过外部独立复现。它的数字目前只有一家之言，SemiAnalysis 也表示会每三到六个月更新一版。把它当作校准预期的标尺可以，当作最终裁决不行。

## 落到写代码这行，我会怎么用它

结合我自己用 Agent 写代码的体感，GDPx 给出的打法其实很具体：

1. **按领域选模型，不按总榜选。** 干软件工程活，Carbon 的小幅领先值得注意；干偏硬件、偏量化的活，Opus 的领先更有参考价值。选型之前，先把自己的任务对应到 GDPx 的领域划分里。
2. **把验收标准写进任务，而不是写进 prompt 的形容词里。** GDPx 的二元评分是个好榜样：测试必须通过、文件必须齐全、数字必须对上口径。验收标准越像测试用例，Agent 的产出越能用；只说“写好一点”，等于没验收。
3. **成本按成功算，预算按失败算。** 上线一个 Agent 流程之前，先按“成功一次要跑几次”做预算，失败尝试的 token、等待时间和人工返工都要计入。如果成功一次要 400 多美元，那这个流程只适合高价值任务，不适合批量铺开。
4. **长任务拆短，约束前置。** 金融和法律的 0% 说明：约束越多、链条越长的任务，越不能一次性外包。拆成“可独立验收的小步”，每步都设检查点，比给 Agent 一个 8 小时的宏大目标靠谱得多。

## 结语

GDPx 的价值，不在于它宣布了谁是第一——12% 的第一名本来也没什么可庆祝的。它的价值在于，它第一次用“真实工作环境 + 8 小时 + 端到端验收”这套考法，把 Agent 行业从“演示很惊艳”拉回到了“交付多少钱、多少次才成”这个可以算账的地面上。

对程序员来说，这份榜单不是劝退书，而是一份施工图：知道 Agent 在哪类任务上已经能打、在哪类任务上还是 0%，知道成功一次到底要花多少钱，然后把 Agent 放在它真正能交付的位置上。剩下的 88%，不是 Agent 的失败，而是我们下一阶段要拆解、要验收、要一步步啃下来的工作。

## 来源

- SemiAnalysis GDPx 榜单与方法说明（经多家报道引用）：gdpx.semianalysis.com
- Machine.net：A New Benchmark Built Around Real Jobs Puts the Best AI Model at 12 Percent — https://www.machine.net/news/semianalysis-gdpx-benchmark-frontier-models-12-percent/
- Dealroom：SemiAnalysis launches GDPx — https://dealroom.co/news/168814-semianalysis-launches-gdpx-the-best-ai-agent-completes-just-12-of-its-hi/
- SiliconNoon：Best model scores 12% on SemiAnalysis's new frontier benchmark — https://siliconnoon.com/gdpx-benchmark-best-model-scores-12-percent/
- Dev.to：12% of the Economy: The Benchmark That Grades AI Agents Like Employees — https://dev.to/danielsamfdo/12-of-the-economy-the-benchmark-that-grades-ai-agents-like-employees-5f8g
- The Agent Report：GDPx: Why the Leading AI Agent Scores Just 12% on Hard Professional Tasks — https://the-agent-report.com/2026/11/gdpx-agent-benchmark-opus-12-percent/
- AI Primer：SemiAnalysis releases GDPx benchmark; Opus 5.5 leads at 12% — https://www.ai-primer.com/engineer/stories/gdpx-benchmark-release
- BYOBot AI Daily Newsstand, November 3, 2026 — https://byobot.ai/ai-news/ai-daily-newsstand-november-3-2026
