---
title: Agent 终于有了自己的钱包：ChatGPT Wallet 上线，但买东西这事，钱不是最难的
date: 2026-11-14 08:45:00 +0800
tags: [AI, Agent, OpenAI]
description: OpenAI 给 dots 发了官方钱包，Agent 买东西不用再碰你的卡号；但同一周，美联航把 Agent 写进禁令、亚马逊继续挡门——钱包解决的是付款，许可才是真正的战场。
---

一个月前，我写过一篇 Agent 在 Sepolia 测试网上"借"了个钱包自己付 Gas 的事。当时我的判断是：Agent 想花钱，最大的障碍不是它不会付，而是没人敢把真钱交给它。

昨天，OpenAI 把这事往前推了一大步：ChatGPT Wallet 上线，dots 终于有了一个官方钱包。

<!--more-->

## 钱包长什么样

先说事实。11 月 13 日，OpenAI 正式推出 ChatGPT Wallet，首批只给美国的 ChatGPT Pro 订阅用户，18 岁以上，美国账单地址，持有美国发行的 Visa、Mastercard 或 American Express 卡（The Verge 的版本里还包括 Chase）。入口在 dots——就是 OpenAI 在 9 月 DevDay 上推出的常驻 Agent；按 OpenAI 官方的说法，Wallet 同样覆盖 ChatGPT Work 和 Codex 里的 Agent。

流程设计得很克制，克制到几乎是在给外界吃定心丸：

- 卡只加一次，之后不用每次重复输卡信息；
- dot 帮你挑商品、填订单，但下单前你能看到商品、总价和将用哪张卡；
- 每一笔购买都要过一次生物识别——Face ID 或指纹——同时留下一条交易记录；
- 扣款走的是卡组织发的支付 token，也就是一张一次性的替身卡号，dot 和商家都看不到你的真实卡号；
- 信用卡原有的积分和争议保护都还在，退款走商家渠道。

OpenAI 的说法是，这是"第一个能让 Agent 付款、同时 Agent 碰不到用户卡号、且每笔交易都要安全校验的钱包"。话说得满，但技术上确实是把该做的隔离都做了：Agent 只拿到授权和结果，拿不到凭证本身。

## 0 抽成：OpenAI 这次图的分发，不是费用

这条新闻里最值得琢磨的数字是 0。

据 CNBC 报道，OpenAI 上线初期不从 Wallet 的交易里抽成。负责变现和支付的产品负责人 Chaya Nayak 的原话是，目标是"先和商家、卡组织一起，把一个安全、好用的基础搭起来"。对比一下 Meta：扎克伯格已经放过话，Muse 要向商家按笔收一小笔费用，而且不做广告。

两条路线的差别很直白。OpenAI 先不要钱，要的是商家别挡门、用户敢绑卡、交易量先跑起来。毕竟它去年秋天推过 Instant Checkout，今年 3 月又悄悄 pivot 回"发现和比价"——在购物这件事上，OpenAI 已经翻过一次车，这次不敢再一上来就收过路费。

这个策略对不对，要看商家买不买账。而这恰恰是 Wallet 解决不了的部分。

## 钱包发了，门还关着：美联航和亚马逊的两记耳光

Wallet 上线前两天，11 月 11 日，美联航干了一件很说明问题的事：它直接修改了《运输合同》（Contract of Carriage），把"AI Agent"写进了定义，并把"用 AI Agent 订票、改票、办票或购买任何服务和产品"列为禁止行为（Rule 6.J.6），同时给了自己"不经通知取消 Agent 经手预订"的权力（Rule 5.H）。

注意三个细节：第一，禁令覆盖经由旅行社和聚合平台来的 Agent，不只是直接访问官网的；第二，哪怕乘客全程盯着、每步都批准，也算违规；第三，11 月 11 日之前 Agent 已经订好的票不取消——只针对此后。美联航是第一家这么干的美国航司，理由是三条：账号凭证外泄风险、误购和里程被误花、以及 FAA 和 DOT 要求人工确认的规则。

另一边，亚马逊早就把 AI Agent 挡在门外，TechCrunch 的说法是，它要把用户引向自己的 Alexa。DoorDash 和 Uber 那边，Agent 下单量至今也很低。同一周，Meta 的 Muse 用户破了 1000 万，购物成了它 App 里的头部活动——需求在，门在。

所以局势很清楚：付款这条链路，OpenAI 用 token 化和生物识别打通了；但"商家让不让你家 Agent 进门"这条链路，没人替你打通。OpenAI 随 Wallet 一起发了本《Commerce Partner Playbook》，教商家怎么认领自己的业务、上传带实时价格和库存的商品 feed，还拉上了 Forter、Riskified、Adyen、Stripe 这些风控和支付厂商站台——翻译过来就是：求商家别拦。

还有一个数字值得记在账上：据报道，Visa 内部测试里 Agent 交易的失败率高达 42.8%。就算商家放行，Agent 自己把单下对的概率也还不到六成。钱包解决了"敢不敢让它付"，没解决"它付不付得明白"。

## 给开发者的三点启示

第一，**Agent 商务的竞争点已经从模型能力挪到了"许可基础设施"**。MCP 解决的是"Agent 怎么调你的接口"，Poppy（Sierra 和 Meta 昨天刚发 1.0 的个人 Agent 协议）解决的是"Agent 怎么认出你这家公司、能干什么"，Wallet 解决的是"Agent 怎么付钱"。三件套凑齐了，Agent 经济才算有了水电煤。但美联航这件事说明，协议和钱包都是供给侧的，需求侧——商家愿不愿意——才是决定速度的那一方。

第二，**预授权才是真正的产品形态**。OpenAI 自己也说了，下一步是让用户设消费上限、品类和时间段，然后在这些参数内预先批准购买，Agent 才能更自主地跑。也就是说，今天的 Wallet 还是"每笔都要你点头"，真正的 Agent 购物是"你定好规矩，它在规矩里自己花"。这中间的差距，就是权限模型、预算控制和事后审计要补的课。做 Agent 产品的，先把这套参数化授权想明白，比急着接支付更重要。

第三，**别只盯着支付成功率，盯着失败的 42.8%**。Agent 下单失败，原因往往不是付不了款，而是商品信息过期、库存对不上、地址格式不对、商家风控把它当成机器人。OpenAI 的 Playbook 反复强调"实时价格和库存 feed"，就是因为 Agent 购物对数据新鲜度的要求比人高得多——人看到"已售罄"会自己换，人不在场时 Agent 得自己判断。这对做电商、做预订系统的团队是个直接信号：你的商品数据越干净，Agent 流量越能转化；反之，Agent 只会给你带来一堆失败订单和客诉。

## 结论

一个月前 Agent 还在测试网上"借"钱包，今天它有了官方钱包、token 化支付、每笔生物识别确认、0 抽成开局。这一步是实的。

但别被"能付款"迷惑。Agent 经济真正的瓶颈从来不在钱怎么付，而在商家让不让它进门、以及它进门之后能不能把事办对。美联航把禁令写进合同的那天，比 Wallet 上线的那天更值得记住——因为前者决定了后者能走多远。

做 Agent 的人，接下来要拼的不是谁的模型更会挑商品，而是谁先把"许可、预算、审计"这三件事做成商家和用户都敢签字的东西。钱包只是发令枪。

## 来源

- OpenAI, "Introducing ChatGPT Wallet", 2026-11-13：https://openai.com/index/introducing-chatgpt-wallet
- TechCrunch, "ChatGPT's new Wallet lets AI agents shop and check out for you", 2026-11-13：https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/
- SiliconNoon, "ChatGPT Wallet launches: agents pay, OpenAI takes no cut", 2026-11-13（转述 CNBC：上线初期 0 抽成、Chaya Nayak 表态）：https://siliconnoon.com/chatgpt-wallet-launches-agents-pay-openai-takes-no-cut/
- Atlacis, "United Put Its AI Agent Ban in the Contract", 2026-11-12：https://atlacis.com/blog/united-airlines-blocks-ai-agents-contract-of-carriage-customer-agent-policy-what-business-owners-should-know
- Simple Flying, "United Airlines Officially Bans AI Agents From Booking Your Flights And Checking You In", 2026-11-12：https://simpleflying.com/united-airlines-bans-ai-agents-booking-flights-check-in/
- Dev.to, "ChatGPT Wallet takes 0% — but United banned its agents", 2026-11-13：https://dev.to/frankchu/chatgpt-wallet-takes-0-but-united-banned-its-agents-o4e
- AI Weekly, "OpenAI's ChatGPT Wallet lets 'dots' agents buy for US Pro users", 2026-11-13（Visa 内部测试 Agent 交易失败率 42.8%）：https://aiweekly.co/alerts/openais-chatgpt-wallet-lets-dots-agents-buy-for-us-pro-users
