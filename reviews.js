// Notes supplement the original arXiv/Robotica metadata; the reader always links to the paper.
const reviewNotes = {
  "2611.23143":{
    name:"TCP4D",first:"2026-11-17",depth:"Reviewed paper",keywords:["Robot Data","Pose Tracking","Cross-Embodiment"],
    project:"https://livioni.github.io/TCP4D/",picture:"https://arxiv.org/html/2611.23143v1/teaser.png",caption:"Figure 1 · Shared 4D scene representation",
    summary:"TCP4D 从单目视频恢复工具中心位姿和夹爪状态，再复用同一套时空特征生成新轨迹。在 DROID 和 RoboLab 上的绝对轨迹误差分别为 7.60 和 16.07 mm。",
    method:"以第一帧中的二维工具点为查询，从四维场景特征估计尺度化 SE(3) 位姿、夹爪状态和相机参数；再结合语言和机器人观测预测未来工具轨迹。",
    results:"RoboTwin 的 48 项任务各评测 100 次，clean-to-clean 平均成功率为 69.19%，EventVLA 为 65.71%；clean-to-hard 降至 10.94%。",
    metric:"RoboTwin clean-to-clean · 69.19%",
    caveat:"洁净场景的成功率不能代表较难域偏移设置；跨具身数据还受目标机器人可达性约束。"
  },
  "2611.24789":{
    name:"HINT-WAM",first:"2026-11-18",depth:"Reviewed paper",keywords:["World Models","Policy Distillation","Flow Matching"],
    picture:"https://arxiv.org/html/2611.24789v1/opsd_wam.png",caption:"Figure 2 · Hindsight-conditioned self-distillation",
    summary:"HINT-WAM 用示范里的未来视频作为教师特权信息，让学生在自己的去噪轨迹上学习教师动作分布，而不是只对专家动作做监督。LIBERO-90 成功率为 85.18%，高于全量监督微调的 81.24%。",
    method:"同一个模型承担师生角色：教师多看未来视频，学生只看部署时能获得的信息；用 energy score 对齐动作分布，不依赖环境奖励。",
    results:"LIBERO-90：85.18%，全量 SFT 81.24%，打乱未来示范后 80.28%。RoboTwin 2.0 的 Clean/Random 为 87.04%/83.68%，Fast-WAM 为 86.48%/83.44%。",
    metric:"LIBERO-90 · 85.18% vs 81.24%",
    caveat:"RoboTwin 上的提升小于 LIBERO-90；这些数字来自论文列出的模拟基准，不应解读为普遍的真机收益。"
  },
  "2611.27338":{
    name:"Latent Jacobian Steer",first:"2026-11-20",depth:"Reviewed paper",keywords:["Humanoid Control","Latent Control","Contact-Rich Manipulation"],
    project:"https://latent-jacobian-steer.github.io/",
    summary:"Latent Jacobian Steer 把关节空间中的定向试探映射成冻结人形控制器能接收的潜变量指令。仿真中，10 次随机种子跑通 7 次抬卷帘门并通过，而直接搜索潜变量跑通 0 次。",
    method:"在关节动作空间采样扰动，用冻结策略雅可比的阻尼逆得到候选潜变量；在模拟器中对物理目标打分，每次执行短步并重规划。",
    results:"BFM-Zero 抬卷帘门任务：CEM-LJS 7/10，直接潜变量搜索 0/10；灵巧手装配 31/40 对直接目标搜索的 21/40。",
    metric:"Simulated shutter traversal · 7/10 vs 0/10",
    caveat:"主要证据来自仿真搜索；作者需指定物理效果和搜索条件，不能当作零样本真机验证。"
  },
  "2611.26916":{
    name:"RoboCap-10k",first:"2026-11-20",depth:"Reviewed paper",keywords:["Robot Data","Egocentric Video","Hand Pose Estimation"],
    project:"https://robocap10k.com/",
    summary:"RoboCap-10k 汇集 11 个国家、共 10,000 小时的第一视角操作视频，使用同款六相机头戴设备采集，并为动作序列提供有尺度的头部轨迹、手部姿态和语言标注。",
    method:"通过在线相机校准和视觉惯性 SLAM 恢复头部六自由度轨迹，再用多视角追踪估计手部运动。",
    results:"覆盖 18 类任务家族、约 200 种任务类型。论文在校准环节报告极线误差小于 1 像素；这是设备校准指标，不是策略任务成功率。",
    metric:"10,000 hours · 11 countries",
    caveat:"数据规模与标注精度不等同于任意机器人策略的性能；跨具身部署还需要验证手部动作如何映射到机器人。"
  },
  "2611.29897": {
    name:"Motion Mamba 2.0",first:"2026-11-23",depth:"Reviewed paper",
    keywords:["Humanoid Control","Autoregressive Diffusion","Motion Generation"],
    project:"https://aigeeksgroup.github.io/MotionMamba2.0/",
    picture:"https://arxiv.org/html/2611.29897v1/exp5-g1.png",
    caption:"Figure 8 · Text, keyboard and mouse control on Unitree G1",
    videos:[{src:"https://aigeeksgroup.github.io/MotionMamba2.0/real-world-video/clean/real-1.mp4",caption:"Unitree G1 · author demonstration"}],
    summary:"Motion Mamba 2.0 用持续更新的记忆保存长时程动作上下文，并分开生成全局轨迹和身体姿态。在 RTX 4090 上，完整动作窗口的延迟中位数由 1,685.35 ms 降至 276.14 ms。真机 G1 的键盘与鼠标控制分别完成 29/30 和 28/30 次整项任务。",
    why:"长动作需要记住更早的指令和已经生成的动作，但扩大注意力缓存会加重推理。作者把保留长期信息和加快每次扩散采样分开处理。",
    method:"两阶段扩散去噪器先生成根轨迹，再用轨迹条件生成身体运动。Persistent Content Memory 从 Mamba 递归状态汇总历史，以便局部注意力读取；推理优化主要来自 CUDA Graph replay。",
    results:["RTX 4090：完整动作窗口 p50 延迟 1,685.35 → 276.14 ms，配对中位加速 6.138×，不是冷启动延迟。","Unitree G1：连续动作组合 18/20，表现性动作 19/20；键盘控制 29/30，鼠标控制 28/30。"],
    metric:"RTX 4090 · 276.14 ms per motion window",
    caveat:"延迟是稳态生成，不是从收到指令到机器人动作可见的端到端延迟；真机成功率仅覆盖论文的四组测试。"
  },
  "2611.28752": {
    name:"VTLA-RL",depth:"From the abstract",keywords:["Tactile Sensing","Robot RL","Force Control","Grasping"],
    summary:"VTLA-RL 将触觉图像历史和 RGB 送入共享编码器，同时输出运动和双侧夹持力。策略先学习真机与仿真示范，再只用仿真交互做两阶段强化学习，最后部署到真机。作者报告完整方法优于仅监督训练的初始策略。",
    why:"单靠视觉难以判断物体的质量和局部滑移，而固定条件下采集的示范未必覆盖抓取过程中负载的变化。",
    method:"用共享视觉编码器处理两类图像，在同一个动作空间联合预测运动和力。后训练使用多任务仿真及任务成功回报，不继续用真机示范监督。",
    results:"作者在仿真中比较触觉表征与强化学习路线，在真机上分别测试负载变化和放置扰动。摘要报告完整方案提高抓取成功率，未给出可比较的具体数值。",
    caveat:"这份解读只依据作者摘要。不同训练路线的收益并不一致，摘要也没有给出各条件下的试次或误差范围。"
  },
  "2611.28939": {
    name:"T-Tac",depth:"From the abstract",keywords:["Tactile Sensing","Thermal Sensing","Material Recognition"],
    summary:"T-Tac 在柔性薄膜内集成微型加热器和温度传感器，用抓取中的瞬态热响应辨别外观相似的材料。作者报告，施加 3 秒加热脉冲并观察 10 秒，在 12 种材料上取得 92.69% 的平均分类准确率。",
    why:"如果物体外观相似，纯视觉难以判断材料。主动加热可以补充材料与传感器交换热量的线索。",
    method:"聚酰亚胺薄膜加热，离子导电膜通过阻值变化读出温度；把手工提取的热响应特征与多尺度卷积特征拼接，再用 ExtraTrees 分类。",
    results:"12 种材料：3 秒加热、10 秒观测时，平均分类准确率为 92.69%。摘要没有报告同条件下的视觉基线或类别间误差。",
    metric:"12 materials · 92.69% mean accuracy",
    caveat:"证据仅覆盖论文摘要公开的 12 种材料和指定观测时长，不能推断对其他材料或更短接触时间的表现。"
  },
  "2611.29240": {
    name:"Tacinf",depth:"From the abstract",keywords:["Tactile Sensing","Force Control","Sim-to-Real","Robot Data"],
    summary:"Tacinf 把仿真触觉数据、真机示范、手持夹具采集和力控评测接入同一套流程。作者在物体位置与实例同时随机化时报告：三种数据混合训练的真机平均任务成功率为 60%，只用遥操作数据为 20%。",
    why:"带接触的操作不仅要决定怎么动，还要判断根据任务要求用多大力。不同采集方式的硬件和评测不一致，会让迁移结果难以比较。",
    method:"Tabero 提供仿真数据和触觉基准；Tacumi 用与机器人部署相同的夹具采集手持示范；Taco 对齐仿真与真机任务。VTLA 策略同时预测动作和指尖力。",
    results:["物体位置和实例均随机变化：遥操作＋仿真＋Tacumi 训练数据 60%，单用遥操作 20%，指标为真机平均任务成功率。","八种策略的仿真与真机平均成功率相关系数 Pearson r＝0.998；四种报告力测量的策略在三个任务中都按要求区分了大力与轻力。"],
    metric:"Real robot · 60% vs 20% mean task success",
    caveat:"这份解读只依据摘要。八种策略在论文任务中的高相关不等于其他硬件、接触任务或环境同样能迁移。"
  },
  "2611.26444": {
    name:"Mind2Act World",first:"2026-11-19",depth:"Reviewed paper",
    keywords:["Agentic Robots","Embodied Reasoning","Manipulation Benchmarks","Failure Diagnosis"],
    project:"https://mind2act-world.com/",
    picture:"https://mind2act-world.com/media/images/hero-memory/step-01.webp",
    caption:"Official project · memory task in simulation",
    summary:"Mind2Act World 把需要记忆推理、精确操作和两者联动的任务分开测试。即使表现最强的智能体，三类任务的成功率也分别只有 52.7%、39.0% 和 12.0%。",
    why:"统一报任务成功率，无法判断模型是做错了决策、执行错了动作，还是没有根据执行结果及时调整。",
    method:"用 30 个仿真任务覆盖五类应用，每类视角 10 个任务。诊断先用规则找失败，再用模型裁判和人工复核补充。",
    results:"最强智能体的 Mind、Act 与 Mind2Act 成功率分别为 52.7%、39.0% 和 12.0%；有八个任务没有系统成功。各类智能体与端到端策略分榜。",
    metric:"Mind2Act · 12.0% best-agent success",
    caveat:"三类任务不是同任务的受控消融，联动任务通常更长。仿真在推理时暂停，因此这里的计时结果不代表真机实时性能。"
  },
  "2611.26414": {
    name:"ZeroVLN",first:"2026-11-19",depth:"Reviewed paper",
    keywords:["Embodied Navigation","Vision-Language Navigation","Robot RL","Agentic Robots"],
    picture:"https://arxiv.org/html/2611.26414v1/fig_agent_architecture.png",
    caption:"Figure 2 · VLM planning and action-expert training",
    summary:"ZeroVLN 让视觉语言模型提出移动目标，再由动作专家执行。它不对上层 VLM 做导航专用监督微调，而是用联合强化学习改善两层配合。在 SAGE-3D 上成功率为 51.3%，NaVILA-SAGE 为 46.0%。",
    why:"作者想检验：如果不靠导航数据把上层模型训练成只会生成导航命令，能否保住它的通用视觉推理能力，同时获得有效的导航。",
    method:"先监督训练动作专家将语义请求转成一段动作，只执行前缀并按新观测重规划；再用导航回报联合训练上层请求与下层执行。",
    results:["SAGE-3D：51.3% 成功率，对照 NaVILA-SAGE 为 46.0%；联合 RL 让 R2R 成功率由 17.0% 提至 52.7%。","相较 NaVILA，R2R 的 Oracle Success Rate 较高（66.7% 对 51.8%），但路径效率 SPL 较低（29.2% 对 41.8%）。"],
    metric:"SAGE-3D · 51.3% success",
    caveat:"不做导航域监督微调不等于不训练：动作专家接受监督，整个系统还用 RL。主要结论来自模拟导航评测。"
  },
  "2611.24011": {
    name:"WAM-Policy",first:"2026-11-18",depth:"Reviewed paper",
    keywords:["World Models","Robot RL","Loco-Manipulation","Policy Distillation","Sim-to-Real"],
    project:"https://aigeeksgroup.github.io/WAM-Policy/",
    picture:"https://arxiv.org/html/2611.24011v1/three_tasks_key_frames_sim_real.png",
    caption:"Figure 5 · Real and simulated Unitree Go2 Air rollouts",
    videos:[{src:"https://aigeeksgroup.github.io/WAM-Policy/sim2real/press_button1/real/real_press_button1_exo-camera.mp4",caption:"Button pressing · Unitree Go2 Air"}],
    summary:"WAM-Policy 把为机械臂训练的世界动作模型迁到四足机器人的前腿操作，并用在线轨迹蒸馏降低采样步数。十项仿真任务中，少步学生保持 76.7% 的成功率；再蒸馏强化学习专家后提高到 85.0%。",
    why:"四足机器人用前腿接触物体时还要维持平衡。已有机械臂模型既有机体差异，也不够快，不能直接满足低延迟控制。",
    method:"先用 QLM-Bench 模拟示范适配机械臂教师，再在学生自己的闭环轨迹上蒸馏；第二阶段对教师按任务做 RL，最后合并成一个少步学生。",
    results:["在十项 QLM-Bench 任务上，迁移教师为 77.0%，直接减少采样步数为 69.3%，在线蒸馏恢复至 76.7%，采样快 14 倍。","多教师合并后仿真平均成功率为 85.0%；论文展示 Unitree Go2 Air 真机的是第一阶段蒸馏学生，不能把 85.0% 当作真机成功率。"],
    metric:"QLM-Bench · 85.0% simulation success",
    caveat:"仿真提升与真机验证对应不同训练阶段，不能直接外推至同一真机任务集。"
  }
};

// Chinese edition for the November 25 arXiv batch, read on November 26 (Beijing).
const nov26Edition = {
  "key": "2026-11-25",
  "date": "2026-11-26",
  "batch": "2026-11-25",
  "title": "Agentic Robots & Robot RL",
  "curated": true,
  "time": "08:34（北京时间）",
  "scope": "arXiv Robotics：91 条新提交、20 条交叉收录、47 条修订；下方五篇均核对全文。",
  "insights": [
    [
      "agentic",
      "Agentic Robots",
      "直接观察：Next-Manip 决定下一段动作由谁执行；Atomic Policy 根据技能执行结果决定是否重规划。两篇均报告定量真机对照。"
    ],
    [
      "rl",
      "Robot RL",
      "直接观察：DynaMimic 直接改进 SuperMimic 的可微世界模型；DexWAC 联合训练动力学和价值函数；ReFocus 将练习分配给最难的步骤。"
    ],
    [
      "shared",
      "Research Outlook",
      "趋势推断：固定低层控制器或地形输入，再改变高层调度或动力学模型，更容易解释收益来自哪里。"
    ]
  ],
  "papers": [
    {
      "id": "2611.32533",
      "name": "Next-Manip",
      "en": "Next-Manip: On-Demand Agent-Policy Collaboration for Robotic Manipulation",
      "authors": [
        "Jiayi Liu",
        "Ke Ye",
        "Jiaming Zhou",
        "Yufei Huang",
        "Haotian Liang",
        "Kun-Yu Lin",
        "Junwei Liang"
      ],
      "track": "agentic",
      "keywords": [
        "Agentic Robots",
        "Long Horizon",
        "Robot Manipulation"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "把通用智能体与精细操作策略接到同一闭环。固定低层 π₀.₅ 权重，四项 xArm7 真机任务平均成功率从 28.75% 提到 77.5%。",
      "why": "在长程操作里，动作是否应该交给视觉语言模型推理，取决于当前状态。已经对准的抓取不必每段都推理，但检测到物体已掉落或需要重新解释目标时，沿用原策略可能让错误继续累积。",
      "method": "任务动态上下文（TDC）从示范中抽取对物体或阶段变化有用的观测，并压缩成参考。调度器（AIC）结合最新图像和交互历史判断当前执行需求，决定用较轻量的操作策略，还是请 GPT-6 Astra 直接接管。\n\n作者用 GPT-6 Luna 作调度分类器。两种执行器在一次交接中都运行动作段的前十步；执行后把动作与分配决定写回历史，下一轮用新观测重新判断。智能体处理异常时可维持多段控制，避免在恢复中途频繁切换。",
      "result": "xArm7 真机固定同一 π₀.₅ 检查点，比较分类、盖块、按指令叠块、通用抓取。每项每方法 20 次，四项分别为 90%、75%、80%、65%，仅用策略为 45%、10%、40%、20%，平均 77.5% 对 28.75%。\n\n九项 RMBench 仿真平均 94.4%，EventVLA 为 67.9%。12 项 RoboDojo 中完整系统 59.58%，去掉任务参考为 51.67%，随机分配为 30.00%；与 Astra 独立执行相比，平均 Astra 调用从 76.72 降至 28.80 次/回合。",
      "caveat": "真机对照共享低层权重，是整体协作有效的证据，但没有在真机单独消融调度器和任务参考。调度模型本身也有开销，高成本调用减少不等于端到端费用同比减少。适合进一步比较同等总延迟下的恢复成功率。",
      "metric": "77.5% vs 28.75% · 四项真机任务",
      "picture": "https://arxiv.org/html/2611.32533v1/NextManip-teaser.png",
      "caption": "图 1：根据任务上下文和最新观察，把下一动作段交给智能体或低层策略。",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "Next-Manip 按执行反馈在通用智能体与专用操作策略之间切换，避免每一步都由大模型控制。四项 xArm7 真机任务，每项每方法 20 次：固定低层 π₀.₅ 权重，平均成功率从 28.75% 提到 77.5%。",
      "abstractZh": "通用智能体能处理语义歧义与失败恢复，专用策略更擅长稳定的精细动作。Next-Manip 用示范提取的任务变化作为参考，再用轻量调度器决定由哪一方执行下一动作段。仿真和真机对照表明，执行权适时切换能提高成功率，并减少调用高成本推理模型的次数。"
    },
    {
      "id": "2611.32813",
      "name": "Atomic Policy",
      "en": "Atomic Policy: Composing Atomic Manipulation Skills with Agentic Reasoning",
      "authors": [
        "Kaidi Zhang",
        "Pengyuan Guo",
        "Zhengtong Xu",
        "Caiyi Zhang",
        "Huayi Gou",
        "Guanlin Huang",
        "Aaron Lim",
        "Anas Rafei",
        "Yu She"
      ],
      "track": "agentic",
      "keywords": [
        "Agentic Robots",
        "Long Horizon",
        "Robot Manipulation"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "用符号计划组合抓取、放置等技能，并检查每个阶段的实际结果。真机分布外拼字任务中，Atomic + π₀.₅ 成功率 40%，端到端 π₀.₅ 为 0%。",
      "why": "会抓、会放不等于能理解按什么顺序拿哪些物体。例如拼字的目标来自白板，而不是训练过的旧单词；抽屉搜寻中，第一处没找到目标应改变计划。原计划若不读回执行结果，局部失败会让后续步骤失效。",
      "method": "用 VLM 把场景与意图转换为符号状态，再用 PDDL 生成依赖计划。执行阶段可把文本目标、MolmoPoint 在当前图上的坐标，或两者传给扩散策略或通用动作模型。定位指定对象，低层仍根据图像和本体状态生成连续动作。\n\n真机版每 128 个控制步调用检查器，阶段超过 256 步触发重规划。检查器负责根据最新观测推进或重规划，而不是让执行器自行猜测已经完成的阶段。",
      "result": "Franka Panda 三项任务，每方法每项 10 次分布内和 10 次分布外。与端到端 π₀.₅ 相比，Atomic + π₀.₅ 在分布外拼字为 40% 对 0%，叠块为 80% 对 70%，抽屉检索为 50% 对 80%；分布内拼字为 60% 对 10%。\n\nTabletop 仿真中完整配置 64.0%，关掉重规划 17.8%，移除目标点 4.4%。错误分析中，基线拼字失败以对象、顺序或位置选错为主，Atomic 的剩余失败则多为实际抓放错误。",
      "caveat": "阶段集合、PDDL 规则和检查提示按任务族手工定义，专用策略需要切段与点位标注。重规划能修正目标或顺序，但无法弥补不可靠的低层技能；分布外抽屉检索就是一个反例。",
      "metric": "40% vs 0% · 分布外真机拼字",
      "picture": "https://arxiv.org/html/2611.32813v1/architecture-v6.png",
      "caption": "图 2：从符号规划、目标点定位到连续动作执行，结果返回检查器触发下一阶段或重规划。",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "Atomic Policy 用 VLM 和符号规划组合抓取、放置等技能，边执行边检查，并在失败时重规划。Franka Panda 分布外拼字中，同用 π₀.₅ 时成功率为 40% 对端到端的 0%；分布外抽屉检索反而为 50% 对 80%。",
      "abstractZh": "长程操作要求机器人把含糊目标拆成有依赖关系的物理步骤。Atomic Policy 让高层规划器决定技能序列，通过语言或视觉点位指定技能作用对象，再由独立检查器验证阶段结果与修订计划。定量结果显示，显式目标指向和反馈能改善某些分布外任务，但低层抓放不准或分解不合适时收益并不一致。"
    },
    {
      "id": "2611.32944",
      "name": "DynaMimic",
      "en": "DynaMimic: A Physics-Informed World Model for Humanoid Motion Tracking",
      "authors": [
        "Chaoyue Xing",
        "Linyi Huang",
        "Yiting He",
        "Yixuan Yin",
        "Siqi Hou",
        "Yi Zhang",
        "Liyuan Pan",
        "Miaomiao Liu",
        "Daqi Liu"
      ],
      "track": "rl",
      "keywords": [
        "Robot RL",
        "Humanoid Control",
        "World Models",
        "Sim-to-Real"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "直接改进 SuperMimic 的可微世界模型：先预测接触力和力矩，再用刚体动力学推进。LAFAN1 仿真平均关节位置误差下降 18.6%。",
      "why": "站在地面旁边的手与真正承重的手，姿态可能很像，但下一时刻整机运动不同。把已知刚体结构和未知接触拆开，能让学习器重点处理支撑切换，而不是重新从数据拟合所有动力学。",
      "method": "从标准仿真轨迹读取动作、状态与候选支撑部位的力／力矩。网络预测这些接触分量和未建模的残余广义力，刚体积分器每 20 ms 控制步用四个子步推进；地形版本用随机器人预测位姿移动的局部高度图。\n\n策略用仿真缓存中的状态启动短想象滚动，世界模型和 critic 固定时，将跟踪回报沿运动和力预测反传到策略。上真机时保留输出关节目标的策略，不运行世界模型。",
      "result": "LAFAN1 60 条完整动作双方全完成，世界坐标平均关节位置误差（MPJPE）为 1,045.39 对 1,284.42 mm，下降 18.6%；骨盆相对误差为 39.62 对 41.52 mm。18 个困难片段来自同一批动作，骨盆相对误差 49.41 对 61.53 mm。\n\n同样输入局部地形，A3 Parkour 22 条动作 56.28 对 66.15 mm，GRAIL 9,736 个片段 126.57 对 141.88 mm。LAFAN1 分段消融中去掉前向动力学，误差 277.50 mm，完整为 240.63 mm；低强度非足部接触子组不是所有指标都赢。",
      "caveat": "A3 Parkour 和 GRAIL 测的是训练参考动作库。每方法每数据集用 1 张 H800，但没有可对应的 GPU 小时、总训练耗时及环境步数对照，不能说训练更快。A3 三项是真机演示，不能推断真机成功率。",
      "metric": "−18.6% MPJPE · LAFAN1 仿真",
      "picture": "https://arxiv.org/html/2611.32944v1/pipeline-policy-terrain-input.png",
      "caption": "图 2：接触预测结合物理积分，梯度经想象轨迹回传至策略。",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "DynaMimic 直接改进 SuperMimic：网络先预测哪些部位在支撑以及接触力，再用刚体方程预测下一状态。LAFAN1 仿真跟踪误差降低 18.6%，同地形输入下 A3 Parkour 和 GRAIL 也改善；A3 真机是动作演示，未做定量对照。",
      "abstractZh": "通用人形跟踪策略可用可微世界模型产生想象轨迹，但直接拟合状态变化容易在手、脚交替支撑时累积误差。DynaMimic 沿用 SuperMimic 的短轨迹反传，改为用接触力和力矩预测搭配显式刚体积分。三个动作库的同条件仿真对比显示位置误差下降；作者也在 A3 上展示了起身、侧手翻和翻箱。"
    },
    {
      "id": "2611.32654",
      "name": "DexWAC",
      "en": "DexWAC: A Unified World-Actor-Critic Model for Dexterous Robot Manipulation",
      "authors": [
        "Hongjia Liu",
        "Dacheng Zhou",
        "Minghao Fu",
        "Chuanjun Guo",
        "Tianze Wang",
        "Qingtao Liu",
        "He Wang",
        "Li Yi"
      ],
      "track": "rl",
      "keywords": [
        "Robot RL",
        "World Models",
        "Dexterous Manipulation"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "联合训练世界模型、动作策略和价值函数，再用模型生成的轨迹运行 PPO。DexJoCo 仿真成功率从 65.50% 提高到 67.75%；真机对照没有测试后续 PPO。",
      "why": "世界模型若只追求重建图片，可能学到纹理却没有学到任务成败。另训一个价值模型也可能重复学习相同视觉表征。研究的问题是让动作后果与任务价值共同监督，能否获得更实用的控制表示。",
      "method": "共享骨干编码指令、观测和本体状态，actor 生成动作段，世界模型预测动作段结束时的视觉潜变量、机器人状态、奖励和继续概率，critic 用自举目标评估价值。连续想象滚动不必生成中间视频帧。\n\nDexJoCo 的预训练使用 800 条专家示范；随后用演示和每任务 50 条策略执行轨迹校准模型与 critic。作者比较在想象轨迹上做 PPO，与仅在部署时让 critic 给候选动作排序。",
      "result": "DexJoCo 八项任务，三个评测种子，每任务每种子 50 回合：平均 65.50%→67.75%（PPO），候选重排 66.58%，Motus 66.83%；双臂任务是 PPO 增益的主要来源。另一组预训练消融中，去掉 critic 为 60.75%，完整为 68.00%。\n\n真机每项 30 次：移蛋 50% 对 π₀.₅ 的 20%，取杯 100% 对 70%。这些真机结果只比较联合预训练后的策略，没有验证后续想象 PPO。",
      "caveat": "仿真中改进幅度有限且部分单项退化，模型误差与多任务优化干扰都可能影响更新效果。真机只测两项，不能把预训练框架的胜出归因于想象 PPO；关键补充是同平台、同任务上的更新前后对照。",
      "metric": "67.75% vs 65.50% · DexJoCo 仿真",
      "picture": "https://arxiv.org/html/2611.32654v1/figures/dexrsi_workflow.png",
      "caption": "图 1：区分联合预训练、模型校准和后续策略改进。",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "DexWAC 联合训练世界模型、动作策略和价值函数，用预测的动作段结果做 PPO。DexJoCo 仿真成功率由 65.50% 提至 67.75%；真机移蛋、取杯各 30 次也优于 π₀.₅，但真机评估的是未做后续 PPO 的阶段。",
      "abstractZh": "预测动作如何改变场景和评估变化是否有利于任务是两个不同的信号。DexWAC 把动作、动力学和价值监督放进同一个预训练阶段。校准模型后，用短想象轨迹更新 actor，或让 critic 在推理时挑选动作候选。仿真验证了想象 PPO 的增益；真机实验单独验证联合预训练后的策略。"
    },
    {
      "id": "2611.32639",
      "name": "ReFocus",
      "en": "ReFocus: Progress-Guided Adaptive Practice for Long-Horizon Robotic Manipulation Reinforcement Learning",
      "authors": [
        "Haoyuan Li",
        "Wei Huang",
        "Jiehong Lin",
        "Shengrong Zhang",
        "Chenzhi Liu",
        "Shengchao Zhou",
        "Hehe Fan",
        "Xiaojuan Qi",
        "Yi Yang"
      ],
      "track": "rl",
      "keywords": [
        "Robot RL",
        "Long Horizon",
        "Vision-Language-Action"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "先用全任务进度找瓶颈，再把交互分配给最需要练习的阶段。仿真 RoboCasa365 已见复合任务成功率 51.3%，StructRL 为 45.8%。",
      "why": "把杯子放好却没有按下机器开关，与连杯子都没抓起来，都可能收到同一个失败信号。一直从任务起点采样，会使真正卡住的阶段练习不足，也难知道该把交互预算用在哪里。",
      "method": "全局强化学习把任务表示为有向无环的子任务图，利用阶段完成和进度做奖励与诊断。局部强化学习从历史反馈挑选包含瓶颈的练习窗口，混合常规开局与覆盖窗口前后阶段的训练片段。两阶段更新同一策略，再回到全任务验证。\n\n真机因中途重置和在线 PPO 成本高，改用 RECAP。调度器从已经记录的回合中识别瓶颈，价值训练加入进度奖励，并提高瓶颈片段的采样比例。",
      "result": "仿真：LIBERO-Long 97.8% 对 StructRL 96.2%；RoboCasa365 Composite-Seen 51.3% 对 45.8%，其中最长任务组 46.4% 对 39.4%。LIBERO-Long 保留进度奖励、移除练习窗口后为 96.8%。\n\nUnitree G1-D 三项真机任务每方法每项三组、每组 20 次。叠碗／挑水果／烤面包分别为 100%／100%／95%；RECAP 为 90%／85%／70%，仅监督微调为 80%／75%／30%。",
      "caveat": "仿真 RoboCasa365 是已见复合任务，结论不等于未见任务迁移。真机收益来自改造后的 RECAP 数据与训练流程，不能当作仿真在线 PPO 的实机复现。未来应在相同采样预算下分开测试进度奖励和难段过采样。",
      "metric": "95% vs 70% · 真机烤面包",
      "picture": "https://arxiv.org/html/2611.32639v1/method.png",
      "caption": "图 2：反复进行全局诊断、局部练习和全任务验证。",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "ReFocus 用子任务进度定位长程操作的瓶颈，再让策略集中练习难段。RoboCasa365 已见复合任务成功率为 51.3% 对 StructRL 的 45.8%；真机烤面包为 95% 对 RECAP 的 70%，实机版使用的是改造后的 RECAP。",
      "abstractZh": "只有最终成功奖励的强化学习很难分辨长程任务卡在哪一步。ReFocus 用子任务依赖图计算进度，在全局训练和局部练习之间交替：前者找困难阶段，后者提升这些阶段的成功率，再以完整任务评估局部改进能否串起来。两个仿真基准和真机改造版给出了量化对照，但仿真和实机训练协议不同。",
      "abstract": "Online reinforcement learning (RL) enables vision-language-action policies to improve through environmental interaction. However, in long-horizon manipulation, sparse success/failure feedback provides little information about where policies encounter bottlenecks. Moreover, repeated full-task rollouts also leave these bottlenecks weakly analyzed and insufficiently practiced. To this end, we introduce ReFocus, a progress-guided multi-round RL framework that alternates between Global and Local RL to identify task-specific bottlenecks and allocate additional practice to them. Specifically, during Global RL, we decompose each task into a Directed Acyclic Graph (DAG) of subtasks. Then a DAG-based Progress Reward is leveraged for both policy training and bottleneck diagnosis. Based on the identified bottlenecks, ReFocus selects Adaptive Practice Windows, defining task segments from an entry stage to a target stage. It allocates additional interaction to these segments during Local RL while updating the entire policy. After that, it evaluates the policy to perform the full task for the next round of RL, forming an iteration between Global and Local RL. Experiments on LIBERO-Long and RoboCasa365 show that ReFocus achieves success rates of 97.8% and 51.3%, respectively, compared with 90.6% and 39.3% for the $\\pi_{0.5}$ baseline. Furthermore, we evaluate a real-world adaptation on three long-horizon tasks. On BreadBaker, ReFocus achieves 95% success, compared with 30% for the $\\pi_{0.5}$. Project page: https://refocus-robotics.github.io.",
      "originalReading": {
        "method": "To this end, we introduce ReFocus, a progress-guided multi-round RL framework that alternates between Global and Local RL to identify task-specific bottlenecks and allocate additional practice to them.",
        "results": "On BreadBaker, ReFocus achieves 95% success, compared with 30% for the $\\pi_{0.5}$."
      }
    }
  ],
  "additional": [
    {
      "id": "2611.32101",
      "name": "Ego2Real",
      "en": "Ego2Real: Learning Bimanual Dexterous Manipulation from Egocentric Visuo-Tactile Demonstrations",
      "authors": [
        "Ange Bao",
        "Haishan Zhang",
        "Lingzi Xie",
        "Shuang Li",
        "Pei Zhao",
        "Ling Shi",
        "Bidan Huang"
      ],
      "track": "tactile",
      "keywords": [
        "Tactile Sensing",
        "Robot RL",
        "Dexterous Manipulation"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "通过带触觉手套的第一视角示范，把双手灵巧操作迁移到机器人手；触觉同时用于重建手—物接触和指导强化学习。",
      "why": "作者想解决的不是如何让机器人手逐关节复制人手，而是如何让不同形态的手保持同样的物理交互。例如在递瓶时，视频可以看见瓶子运动，却可能看不见哪几个手指在遮挡处承重，或哪只手应该先抓牢再释放。\n\n传统的纯视觉重建容易把手指放在物体表面之外或让手指穿模。若把这种轨迹直接交给机器人，偏差会在重新定向动作和训练策略时继续传递。",
      "method": "采集时，RealSense D435i 以 30 Hz 记录 RGB-D，触觉手套以 125 Hz 采样，两路数据按时间戳对齐。视觉部分先分割手和物体，再用 FoundationPose、HaMeR 初始化物体与 MANO 手模型。每只手的触觉被汇总到 54 个解剖区域，映射到手模型表面；优化让激活位置靠近物体表面、接触法向更合理，并在持续接触时减少不合理滑移。\n\n重定向时，算法对齐人手与 OmniHand 3 相对于物体的空间关系，而不是复制手指角度。最后用 PPO 学习对腕部和指关节目标的残差，同时奖励物体轨迹跟踪、区域接触和接触时序。部署时，策略只用跟踪到的物体位姿和机器人本体状态等信号，不读触觉。",
      "result": "真机（论文表 2）：Tianji Marvin Pro 机械臂搭配 OmniHand 3。每项每条件 15 次。用同样的触觉校正参考动作，Ego2Real 递瓶 12/15（80.0%），REGRIND 2/15（13.3%）；转盒两者均 15/15。撤掉触觉重建校正后，Ego2Real 递瓶降至 2/15，转盒降至 0/15。裸手示范对照分别为 1/15、4/15。\n\n仿真（表 1）：Ego2Real 和 REGRIND 两项成功率都为 100%；Ego2Real 平均物体跟踪误差反而稍大，递瓶为 4.73 对 3.98 mm、转盒为 2.29 对 1.99 mm。仿真成功率持平，不代表真机接触交接同样稳定。",
      "caveat": "只在两项刚体桌面任务上测试，策略按单条示范学习；训练仍依赖物体网格、触觉手套和仿真，部署依赖可用的物体位姿。不能据此断言能泛化到未见物体或无需感知工具。\n\n更有信息量的下一步，是在同一训练预算下比较多示范、多物体以及有无机器人端触觉反馈，区分收益究竟来自示范中的接触信息，还是执行时的纠偏能力。",
      "metric": "真机递瓶 12/15 vs 2/15（同参考动作）",
      "picture": "https://arxiv.org/html/2611.32101v1/pipeline.png",
      "caption": "图 2：实测触觉分别用来修正手—物重建和训练机器人策略；部署时策略不读取触觉。",
      "abstract": "Learning dexterous manipulation from egocentric human demonstrations offers a scalable path toward robot skill acquisition. Vision alone, however, provides limited information about physical contacts and the demonstrator's force intent, leading to ambiguities in interpreting hand-object interactions. Capturing human touch via tactile sensing is therefore crucial for reliable human-to-robot dexterous skill transfer. We present Ego2Real, a framework that leverages egocentric demonstrations and tactile gloves to transfer bimanual dexterous manipulation skills to robotic hands. Ego2Real incorporates tactile supervision at two complementary stages: (1) tactile-guided hand-object interaction reconstruction, which uses measured tactile signals to refine hand poses and contact geometry; and (2) contact-informed reinforcement learning, which translates human contact patterns into robotic contact rewards. By combining refined motion references with physical contact rewards during training, Ego2Real guides anthropomorphic robotic hands to emulate demonstrated contact behaviors while adapting to their own morphology and actuation. Experiments show that incorporating tactile supervision into both reconstruction and policy learning yields higher manipulation success rates, underscoring the importance of enriching egocentric demonstrations with tactile observations to improve their quality and transferability.",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "Ego2Real 让机器人从带触觉手套的第一视角示范中学习双手灵巧操作。触觉既用于校正手与物体的接触几何，也用于训练 PPO 策略。使用相同的触觉校正参考动作时，真机递瓶成功 12/15 次，对照 REGRIND 为 2/15 次。",
      "abstractZh": "第一视角视频便于采集人类示范，却看不清被遮挡的手指是否真正接触物体，也无法直接测到施力。Ego2Real 将同步采集的 RGB-D 与手套触觉用于两个环节：首先重建更可信的手—物运动，再用示范中的接触状态和力训练机器人残差策略。两项双手任务表明，运动参考和接触奖励各有作用；部署时机器人仍需跟踪物体，但不需要机器人侧触觉传感器。",
      "originalReading": {
        "method": "We present Ego2Real, a framework that leverages egocentric demonstrations and tactile gloves to transfer bimanual dexterous manipulation skills to robotic hands.",
        "results": "Experiments show that incorporating tactile supervision into both reconstruction and policy learning yields higher manipulation success rates, underscoring the importance of enriching egocentric demonstrations with tactile observations to improve their quality and transferability."
      }
    },
    {
      "id": "2611.31588",
      "name": "DRIFT",
      "en": "One Phase Is Enough: Sim-to-Real Transfer with Direct Visual Reinforcement Learning",
      "authors": [
        "John Marangola",
        "Antonia Bronars",
        "Younghyo Park",
        "Stephen Andrews",
        "Kushal Kedia",
        "Pulkit Agrawal"
      ],
      "track": "rl",
      "keywords": [
        "Robot RL",
        "Sim-to-Real",
        "Visual Reinforcement Learning"
      ],
      "first": "2026-11-23",
      "batch": "2026-11-25",
      "summary": "冻结预训练视觉编码器，直接从图像做低层策略强化学习，无须先训练特权状态教师再蒸馏。三项真机操作任务平均成功率相对提升 58.8%。",
      "why": "教师按精确物体姿态和速度做出的决定，未必能从学生的单视角图像恢复。让学生模仿这种决策，容易在新位置、光照或物体形状下失败。研究的问题是：在计算预算匹配时，直接优化最终部署的视觉策略是否更可靠。",
      "method": "在 ManiSkill 中并行收集 RGB 与本体状态。冻结预训练视觉编码器，重点训练把空间视觉特征变成关节目标与夹爪动作的控制部分。训练随机化物体摩擦、外观、桌面纹理、灯光和相机外参；相机和执行器以真机标称值校准。\n\n对照先用特权状态训练教师，再用 DAgger 式蒸馏训练视觉学生。真机为 Franka Research 3，以 20 Hz 运行腕部 RGB 与本体状态策略，不用真机训练数据或梯度更新。",
      "result": "表 1：插销每条件 30 次，66.7% 对冻结视觉编码器的蒸馏版 23.3%；推 T 每条件 30 次，76.7% 对 30.0%；抓取训练立方体每条件 20 次，两者均为 100%。换成四种未见物体时，每种 20 次，平均为 88.8% 对 50.0%。\n\n受控仿真中，直接 RL 在分布内相对领先约 8.6%，在所测分布偏移条件下相对领先约 61%。换骨干的迁移结果也说明仿真成功率不等于真机表现：插销上 DINOv3 ViT-S/16 真机 66.7%，SigLIP2 ViT-B/16 为 10.0%。",
      "caveat": "论文主表按各方法真机成功率最高的种子展示，不是跨种子的真机平均。实验仅涵盖单臂三项桌面任务，并使用了仿真标定和域随机化，因此不能把结果读成任意硬件上的免标定迁移。",
      "metric": "真机插销 66.7% vs 23.3%（各 30 次）",
      "picture": "https://arxiv.org/html/2611.31588v1/arch_figure_comparison.png",
      "caption": "图 2：左边先训练教师再蒸馏视觉学生；右边直接用部署可见的观测强化学习。",
      "abstract": "Sim-to-real reinforcement learning (RL) has enabled impressive robotic behaviors, yet deploying policies directly from vision remains challenging. A common approach first trains a teacher policy with RL using privileged state observations, then distills its behavior into a vision-based student via imitation. However, the resulting student can substantially underperform its teacher. Directly training visual policies with RL offers a promising alternative, but learning task-relevant visual representations from scratch can be sample-inefficient, making one-phase visual RL intractable. We propose DRIFT, a simple recipe for efficient one-phase visual RL using image observations available at test time. Our key insight is to use frozen, pretrained foundation vision encoders, allowing RL to focus on learning control from existing visual representations. Freezing the encoder avoids costly backpropagation through the vision backbone, while its pretrained representations enable real-world transfer from fast, rasterized simulation rendering. Under matched architectures, observations, and compute budgets, DRIFT outperforms two-phase distillation and achieves a 58.8% relative improvement in average real-world success rate across three manipulation tasks. Controlled simulation evaluations demonstrate that DRIFT's relative advantage grows from roughly 9% in-distribution to over 61% under out-of-distribution shifts, suggesting that stronger generalization contributes to superior real-world transfer. Project website: https://jmarangola.github.io/one-phase-visual-rl/",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "DRIFT 在仿真中用冻结的视觉编码器直接训练视觉强化学习策略，省去特权状态教师和蒸馏。零样本上真机后，插销成功率为 66.7% 对 23.3%，推 T 形块为 76.7% 对 30.0%；对照使用同样冻结的视觉骨干。",
      "abstractZh": "常见的 sim-to-real 方法先让能读取精确仿真状态的教师学习，再让只看图像的学生模仿。DRIFT 用部署时同样可得的 RGB 和本体状态训练策略，通过冻结强视觉表示、轻量聚合空间特征和快速仿真渲染降低开销。与预算和架构匹配的两阶段蒸馏相比，分布内仿真差距不大，但在分布外和真机上明显拉开。三项真机任务的平均成功率相对提高 58.8%，不是提高 58.8 个百分点。",
      "originalReading": {
        "method": "We propose DRIFT, a simple recipe for efficient one-phase visual RL using image observations available at test time.",
        "results": "Under matched architectures, observations, and compute budgets, DRIFT outperforms two-phase distillation and achieves a 58.8% relative improvement in average real-world success rate across three manipulation tasks."
      }
    },
    {
      "id": "2611.32016",
      "name": "RoboHarness-RL",
      "en": "RoboHarness-RL: Agentic Reinforcement Learning for VLM-Based Robot Manipulation",
      "authors": [
        "Liyang Li",
        "Mingyu Liu",
        "Xiaoman Li",
        "Zhiyue Zhao",
        "Jin-Chuan Shi",
        "Canyu Zhao",
        "Haokai Zhang",
        "Jinyuan Tian",
        "Linhao Zhong",
        "Hao Chen",
        "Chunhua Shen"
      ],
      "track": "agentic",
      "keywords": [
        "Agentic Robots",
        "Robot RL",
        "Tool Use"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "用多轮强化学习让 Qwen3.5-9B 根据执行反馈调整下一次机器人控制工具调用，无需额外的 VLA 或世界动作模型。",
      "why": "论文关心的是小模型能否学会根据新观察调整下一步，而不是把每次感知预测变成一个端到端的动作模型。单轮示范能教会模型怎么调用工具，未必能教会它如何在抓取失败、目标错位或检查返回否定时改变动作。",
      "method": "在 LiteHarness 中，VLM 先读取当前观察和分层历史，再选择感知查询、抓取／运动规划或控制工具；工具结果成为下一轮输入。训练先分别使用 RoboTwin 和 LIBERO-Pro 的 393、781 条成功教师示范，再以任务结果与常规工具使用约束训练多轮决策。感知工具和运动规划器不随 RL 更新。\n\n记忆保留近几次观测，并用摘要代表更远历史。训练调度器减少反复通过或极难成功任务的占比，并向 LIBERO-Pro 较难的 Goal、Long 子集多分配采样机会。",
      "result": "同一 9B 骨干、同一工具：RoboTwin 干净场景 31.2%→44.0%，随机场景 26.4%→38.0%（每种条件 250 回合，只在干净场景训练）；LIBERO-Pro 800 回合平均 57.8%→73.3%。在 RoboTwin 干净场景的配对成功回合中，VLM 调用均值从 23.3 降到 15.4 次。\n\n记忆消融中，RoboTwin 完整分层记忆成功率 44.0%，不保留历史 20.4%，使用完整原始历史 28.0%。从 LIBERO-Pro 第 15 轮起再训练 10 轮，自适应调度为 73.3%，均匀调度为 69.5%。",
      "caveat": "证据限于仿真，且策略仍依赖教师覆盖、固定视觉工具与运动规划器。未见随机双臂场景绝对成功率仍只有 38.0%；重要的下一步是固定工具并验证真机执行稳定性，而不是把仿真恢复直接等同于真机恢复。",
      "metric": "仿真未见随机场景 38.0% vs 26.4%",
      "picture": "https://arxiv.org/html/2611.32016v1/positioning_figure.png",
      "caption": "图 2：RoboHarness-RL 学的是工具调用，动作层级介于 VLA 的电机指令和通用智能体的高层文本动作之间。",
      "abstract": "Agentic harnesses enable frontier vision-language models (VLMs) to manipulate robots through perception, planning, and control tools, yet achieving comparable performance with compact open-weight VLMs remains challenging. We present RoboHarness-RL, an agentic reinforcement learning framework for improving VLM-based robot manipulation through tool calls. Starting from supervised fine-tuning on successful teacher demonstrations, the VLM further improves through multi-turn reinforcement learning with task-outcome rewards, without relying on vision-language-action models or world action models. To support efficient multi-turn training, we develop LiteHarness, which uses hierarchical memory to keep interaction contexts compact while preserving task performance. With Qwen3.5-9B, RL raises success from 31.2% to 44.0% on RoboTwin 2.0 and from 57.8% to 73.3% on LIBERO-Pro; these gains extend to randomized RoboTwin scenes unseen during training (26.4% to 38.0%). Behavioral analysis further shows that RL reduces repetitive-call rates by up to $4\\times$, shortens successful executions, and improves recovery from negative feedback. Project page: https://aim-uofa.github.io/RoboHarness-RL/",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "RoboHarness-RL 训练 Qwen3.5-9B 读取执行反馈并调用机器人工具，不依赖额外 VLA 或世界动作模型。相对只做监督微调，RoboTwin 2.0 未见随机场景成功率从 26.4% 提到 38.0%，LIBERO-Pro 从 57.8% 提到 73.3%；均为仿真。",
      "abstractZh": "小型开源视觉语言模型已经能调用感知、规划和运动工具，但常在失败后重复同类调用。RoboHarness-RL 先用教师成功示范做监督微调，再让智能体多轮交互，以任务结果反馈训练控制决策。LiteHarness 用分层记忆减少反复输入的历史。论文在两个仿真基准验证了成功率和部分失败恢复行为上的改善，没有报告真机验证。",
      "originalReading": {
        "method": "We present RoboHarness-RL, an agentic reinforcement learning framework for improving VLM-based robot manipulation through tool calls.",
        "results": "Agentic harnesses enable frontier vision-language models (VLMs) to manipulate robots through perception, planning, and control tools, yet achieving comparable performance with compact open-weight VLMs remains challenging."
      }
    },
    {
      "id": "2611.32476",
      "name": "ViTacLab",
      "en": "ViTacLab: Physically Consistent Visuo-Tactile Simulation, Benchmarking, and Representation Learning for Robotic Manipulation",
      "authors": [
        "Linjing You",
        "Zeming Yang",
        "Zhenhao Shen",
        "Shengqiang Xu",
        "Guanda Li",
        "Wenxuan Li",
        "Jiyu Guo",
        "Jasper Lu",
        "Kyle Xu",
        "Shawn Xie",
        "Junjie Zhu",
        "Siyu Wu",
        "Jian Liu",
        "Changhao Zhang",
        "Rongchong Li",
        "Zeyi Li",
        "Hengshuang Zhao",
        "Ruihai Wu"
      ],
      "track": "tactile",
      "keywords": [
        "Tactile Sensing",
        "Dexterous Manipulation",
        "Sim-to-Real"
      ],
      "first": "2026-11-24",
      "batch": "2026-11-25",
      "summary": "把触觉仿真、操作基准和多传感器策略放到一套框架中；对照实验中，法向和切向力误差分别从 2.31、1.85 N 降到 0.42、0.53 N。",
      "why": "接触位置细微改变就可能导致插接失败。若仿真只按几何穿透生成触觉，局部力和合力可能与物理求解器不一致。与此同时，光学触觉和阵列力传感器的数据格式不同，分别学表示会限制跨传感器复用。",
      "method": "ViTacSim 从 PhysX 的稀疏接触输出重建密集的传感器力场：用局部刚度修正法向分量、按滑动和黏着估计切向力，再联合投影，使整体力与力矩匹配、局部力符合摩擦约束。\n\nViTacBench 按视觉和触觉的依赖程度组织夹爪、灵巧手及双手任务。ViTacPolicy 用带传感器空间位置的 Transformer 融合输入，并用共享码本的双流 VQ-VAE 对齐力阵列与触觉图像。",
      "result": "受控力测试（图 5）：相对仅按穿透深度估计的模型，法向 RMSE 由 2.31 降至 0.42 N，切向由 1.85 降至 0.53 N；在 RTX 4090D、256 个并行环境下，触觉管线吞吐约 2,483 帧/秒，不是单机控制频率。\n\n真机夹爪（表 IV），每任务每配置 50 次：插销、螺母、齿轮分别成功 19、40、33 次，平均 61.3%；无仿真触觉预训练是 11、33、29 次，平均 48.7%。按任务分层的合并检验 p=0.018，但逐任务比较均未达 0.05。\n\n仿真中六个代表任务有四个完整模型领先；100 条示范的盲抓任务，各方法成功率均不超过 3%。",
      "caveat": "数据不能证明每项真机任务均有显著提升。真机定量范围是三项夹爪任务，灵巧手与双手的其他部署主要是定性展示。模拟器也未充分建模软体、大幅弹性变形、黏附和磨损。后续需要更丰富接触条件下的独立标定和任务对照。",
      "metric": "真机夹爪平均 61.3% vs 48.7%",
      "picture": "https://arxiv.org/html/2611.32476v1/vitaclab-teaser.png",
      "caption": "图 1：从接触力仿真到评测任务，再到融合两种触觉模态的操作策略。",
      "abstract": "Tactile sensing is essential for contact-rich robotic manipulation, but existing visuo-tactile simulators trade physical fidelity for scalability, and benchmarks largely focus on two-finger grippers. We present ViTacLab, a framework comprising ViTacSim, ViTacBench, and ViTacPolicy. ViTacSim uses a tri-modal tactile primitive: a global sparse contact-force lattice, a local dense force array, and tactile images. Anchored to PhysX contact-solver outputs, it corrects normal inconsistency through local stiffness alignment and reconstructs tangential forces under decoupled slip-stick regimes while preserving GPU parallelism. A joint projection preserves the sparse wrench and enforces local friction cones. ViTacBench spans parallel grippers, dexterous hands, and bimanual systems, with tasks ranging from vision-dominant to tactile-dominant regimes. ViTacPolicy aggregates variable numbers of heterogeneous tactile inputs using spatial-pose embeddings and a Transformer, and aligns force-array and tactile-image modalities through a two-stream VQ-VAE with a shared codebook. Controlled Hertzian-reference indentation and real-sensor sliding tests reduce normal and tangential force RMSE from 2.31 and 1.85 N to 0.42 and 0.53 N, respectively. Throughput reaches 2,482.9 tactile-pipeline FPS at 256 parallel environments. Simulation and real-world experiments show gains on several contact-rich tasks, while low absolute success on tactile-dominant tasks highlights the remaining difficulty of purely tactile control.",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "ViTacLab 把触觉力场仿真、操作基准和多传感器策略整合起来。受控测试中法向／切向力误差分别从 2.31／1.85 N 降至 0.42／0.53 N；真机夹爪三项任务平均成功率为 61.3%，去掉仿真触觉预训练则为 48.7%。",
      "abstractZh": "触觉 sim-to-real 同时要求力学量足够可靠、仿真足够快，还要能处理不同传感器输出。ViTacLab 用稀疏物理接触求解结果约束密集力场，再让力阵列与触觉图像共享离散表示。作者分别以受控力学测试、视觉受限的仿真任务和真机夹爪对照评估这三部分，发现力误差明显下降，真机整体有收益，但最依赖触觉的任务仍困难。",
      "originalReading": {
        "method": "We present ViTacLab, a framework comprising ViTacSim, ViTacBench, and ViTacPolicy.",
        "results": "Simulation and real-world experiments show gains on several contact-rich tasks, while low absolute success on tactile-dominant tasks highlights the remaining difficulty of purely tactile control."
      }
    }
  ],
  "community": [
    {
      "id": "2611.30989",
      "name": "WorldLeague",
      "en": "WorldLeague: Benchmarking Physical Agency",
      "track": "shared",
      "keywords": [
        "Robotics Benchmark",
        "Physical Agency"
      ],
      "first": "2026-11-23",
      "batch": "2026-11-24",
      "upvotes": 136,
      "summary": "用 60 个仿真任务同时衡量物理目标进度和最终成功，避免只看问答正确率。",
      "why": "只测视觉问答无法说明系统能否把观察和计划变成执行结果，只用最终成功率又看不出系统卡在找目标、规划路线还是完成操作。作者希望在同一组任务中比较语言模型、动作模型与世界动作模型。",
      "method": "WorldSeek 考察主动寻找信息，WorldShape 考察改变场景，WorldShift 考察面对场景变化时的适应。每项任务有相应的状态和轨迹检查，例如检查物体释放后是否在正确位置且保持稳定。\n\n评测同时跟踪 0–100 的 Interactive Score 和物理任务成功率。VLM 使用论文提供的目标与运动接口；VLA 和 WAM 用各自原生控制方式，不强制所有模型使用同一种动作表达。",
      "result": "主表种子 0 中，Claude Fable 5.2 在 60 项任务中完成 13 项，平均互动分 28.58/100。在 13 个系统共有的 59 项任务上，27 项所有系统均为零分，16 项有人部分推进但无人完成，只有 16 项至少有一个系统完成。\n\n八种 VLM 的 347 个终局问答全对回合中，有 249 个物理进展仍为零（71.8%）。这直接暴露了答题能力与执行能力的差异，但不能据此推断失败只发生在硬件控制层。",
      "caveat": "这是仿真基准而不是新的部署控制策略。主榜依赖给定任务、控制接口和种子：例如 Sol 换种子后总分接近，但 60 项中有 11 项得分改变。应同时报告多种子结果、任务级失败和接口条件，再作模型间归因。",
      "metric": "主榜最高 13/60；问答全对仍零进展 249/347",
      "picture": "https://arxiv.org/html/2611.30989v1/fig/WorldLeague_Task_Construction.png",
      "caption": "Figure 2",
      "abstract": "AI systems can now operate Blender, follow instructions in complex video games, and manipulate objects with robot arms. What range of physical goals can today's AI systems achieve autonomously? Answering this question requires testing systems on tasks that demand different combinations of perception, memory, planning, and action. We introduce \\textbf{WorldLeague}, a benchmark that compares AI systems on a common set of \\textbf{60 simulated robot tasks} by measuring progress toward each task's physical goal from the robot's trajectory. Robots explore scenes to gather evidence in \\textbf{WorldSeek}, rearrange objects in \\textbf{WorldShape}, and adapt to changes in \\textbf{WorldShift}. Tying these goals to a single control interface limits which AI systems can be compared. In WorldLeague, vision-language models (VLMs) choose targets and motions, while vision-language-action models (VLAs) and world-action models (WAMs) use their native controls. For each of six capability dimensions, we measure how much progress a system makes toward its goals (Interactive Score) and how often it achieves them (physical success rate). Together, these measures form the system's \\emph{Physical Agency Profile}. Among 13 representative AI systems, Claude Fable 5.2 achieves 13 of the 60 goals and earns the highest mean Interactive Score (28.58/100). Fable leads in four dimensions, while GPT-6.1-Sol and GPT-6-Astra tie for first on rule-following tasks. Even when VLMs answer every final question correctly, they receive an Interactive Score of zero in 71.8\\% of those episodes. WorldLeague gives Embodied AI, Physical AI, and Agentic AI a shared basis for comparing what AI systems achieve autonomously, from partial progress toward a physical goal to full goal completion. Project Webpage: https://xyangzhou.github.io/WorldLeague",
      "sourceDepth": "Benchmark review",
      "cardSummary": "WorldLeague 用 60 个仿真机器人任务分别测量实际进展和目标完成，避免把答对问题当成做对动作。13 个受测系统中，领先模型也只完成 13/60 个目标；347 个终局问答全对的 VLM 回合中，有 249 个物理进展为零。",
      "abstractZh": "WorldLeague 用同一批物理目标比较不同架构的机器人系统。任务涉及主动探索、改变物体布局，以及在场景变化后调整行动。除了给出是否达成目标的二元结果，基准还从轨迹中量化部分进展。实验显示，语言模型可以准确描述一个场景或失败，却不一定在这个场景中实现任何物理目标。",
      "originalReading": {
        "method": "We introduce \\textbf{WorldLeague}, a benchmark that compares AI systems on a common set of \\textbf{60 simulated robot tasks} by measuring progress toward each task's physical goal from the robot's trajectory.",
        "results": "WorldLeague gives Embodied AI, Physical AI, and Agentic AI a shared basis for comparing what AI systems achieve autonomously, from partial progress toward a physical goal to full goal completion."
      }
    },
    {
      "id": "2611.31201",
      "name": "Embo-Harness",
      "en": "Embo-Harness: Towards Understanding Frontier-Model-as-Policy Harness",
      "track": "agentic",
      "keywords": [
        "Agentic Robots",
        "Robot Manipulation",
        "Spatial Reasoning"
      ],
      "first": "2026-11-23",
      "batch": "2026-11-24",
      "upvotes": 98,
      "summary": "让通用模型从多视角观察直接输出末端目标，再由低层控制执行。RoboLab-120 仿真成功率 83.3%，四项真机零样本任务合计 15/20。",
      "why": "专用 VLA 通常通过动作数据学习控制；纯高层智能体往往只能调预定义技能。论文要找的是两者之间的界线：通用模型能否直接决定动作，以及哪些动作细节应交给确定性的低层控制。",
      "method": "使用多视角图像读任务和执行状态，GPT-6 Astra 输出短段末端绝对目标，逆运动学和轨迹插值生成低层指令。完成一段后重新获取观测，再决定下一段；工具可补充短动作组合和 VLA 提案的修正。\n\n实验拆开比较模型如何付出推理开销、如何读图、如何表示动作。对照特意把直接关节输出和逆运动学辅助分开，以检验收益是否来自显式学会关节级运动。",
      "result": "RoboLab-120 仿真：成功率 83.3%，SenseNova-RoboRSI 57.1%；任务完成分为 89.2 对 69.9。动作接口消融（20 项任务、3 次运行）：直接生成绝对关节角为 20.0%，借助运动学为 43.3%；同为 8 步，逐帧出动作 40.0%，输出目标位姿后插值为 58.3%。\n\nFranka Research 3 四项任务各五次，合计 15/20，对照 7/20。叠块、打包水果均 5/5，洗碗 2/5，插花 3/5；不能把总体结果理解为每个任务都可靠。",
      "caveat": "真机只有一套桌面平台和少量试验，在小开关、瓶口等目标上仍因定位、遮挡或对齐失败。结论支持本文动作接口的选择，但不能外推到灵巧手、高速动态控制或触觉任务。",
      "metric": "仿真 83.3% vs 57.1%；真机 15/20 vs 7/20",
      "picture": "https://arxiv.org/html/2611.31201v1/harness_baselines.png",
      "caption": "Figure 2",
      "abstract": "Frontier multimodal models exhibit extraordinary generalization in generating robot actions from observations and instructions, enabling a new paradigm in which they serve directly as policies within closed-loop robotic harnesses. However, the design principles of such harnesses, and the capabilities underlying their strong performance, remain unclear. We present Embo-Harness, a framework for systematically studying frontier-model-as-policy harnesses. We investigate four components of the robotic agentic loop, namely, prompting, planning, action execution, and tool use, and distill six empirical findings into a practical recipe. This recipe prioritizes interfaces that exploit the model's native visual reasoning and tool-use capabilities over handcrafted plans, skills, or action priors, and identifies effective choices for action representation, chunking, reasoning effort, visual observations, short multi-action sequences, and policy refinement. On RoboLab-120, Embo-Harness achieves an 83.3\\% success rate, outperforming the strongest reported baseline by 26.2 percentage points. It also succeeds in 15 of 20 zero-shot trials across four real-world manipulation tasks. Beyond performance, controlled interventions indicate that the studied model depends more strongly on accurate spatial target estimation than on explicit low-level joint or trajectory generation. These results provide both a practical recipe for building strong frontier-model-as-policy harnesses and a clearer account of the capabilities that drive their performance.",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "Embo-Harness 让通用视觉语言模型读多视角图像、决定短段末端目标，而把逆运动学和插值交给低层。RoboLab-120 仿真成功率为 83.3% 对同骨干基线 57.1%；四项零样本真机任务合计 15/20 对 7/20。",
      "abstractZh": "Embo-Harness 研究通用多模态模型何时适合直接充当机器人策略。作者比较动作坐标、动作段长度、视觉输入、推理配置和工具，从中选择最能利用模型空间推理的一组接口。仿真和真机结果显示，让模型决定末端空间目标、由传统控制器执行低层轨迹，比要求它直接逐帧生成关节指令更适合本文设置。",
      "originalReading": {
        "method": "We present Embo-Harness, a framework for systematically studying frontier-model-as-policy harnesses.",
        "results": "On RoboLab-120, Embo-Harness achieves an 83.3\\% success rate, outperforming the strongest reported baseline by 26.2 percentage points."
      }
    },
    {
      "id": "2611.31205",
      "name": "ACAP",
      "en": "ACAP: Asynchronous Coding Agents for Efficient Robot Control",
      "track": "agentic",
      "keywords": [
        "Agentic Robots",
        "Bimanual Manipulation",
        "Multi-Agent Coordination"
      ],
      "first": "2026-11-23",
      "batch": "2026-11-24",
      "upvotes": 47,
      "summary": "给同一台机器人的手臂等控制组分配异步智能体。25 个真机任务／平台设置中，平均任务时间成本从 19.04 分钟降到 13.67 分钟。",
      "why": "例如一只手准备物体、另一只手找位置时可以并行，但共同折毛巾时却需要双臂同步。这篇论文区分了两个问题：并行能否省掉等待，和谁能判断何时应放弃并行、对两臂统一发指令。",
      "method": "各成员保留局部会话和执行历史，在各自控制组运行观察、推理、编程与执行循环；底层控制器跟踪指令。协调智能体根据反馈授权共享区域、等待必要事件，或把耦合部件的控制权交回上层统一执行。\n\n通过消息缓冲和独占控制权检查，即使成员推理进度不同，两个成员也不会同时向同一控制组发指令。这是同一台机器人内部的分工，并非多机器人编队。",
      "result": "主真机对照：25 个设置、72 次运行，平均任务时间成本 13.67 对 19.04 分钟（比 Direct 少 28.2%）。8 个协作设置中，ACAP 为 13.75 分钟，Direct 为 16.25 分钟，固定委派为 26.02 分钟。\n\n追加的六任务、三策略、每组合五次试验共 90 次；采用 30 分钟封顶的时间成本，六任务平均 ACAP 15.14 分钟，Direct 21.43，固定委派 23.73。该口径与首组未完成至少计 30 分钟的口径不同。",
      "caveat": "任务分钟数包括推理、协调和执行，不是底层实时延迟；物理进度分包含人工评估。控制权检查也不能当作几何碰撞保障，论文尚无专门的全身碰撞与执行监控层，开放环境安全性未得到验证。",
      "metric": "真机时间成本 13.67 vs 19.04 分钟",
      "picture": "https://arxiv.org/html/2611.31205v1/teaser.png",
      "caption": "Figure 1",
      "abstract": "Coding agents can construct and revise robot behavior during execution, but using one agent for the whole robot can delay otherwise independent work. We introduce Asynchronous Coding Agents as Policy (ACAP), an asynchronous framework that organizes one robot as a team of persistent agents. Each member reasons and acts for a configurable control group, such as an arm with its gripper or the torso and chassis, enabling asynchronous reasoning and execution. However, different robot components often have physical dependencies that require coordination. To address this challenge, ACAP introduces a hyper-agent that assigns tasks, coordinates dependencies, and dynamically allocates control between the lead and member agents. This allows independent work to progress concurrently while supporting tightly coupled manipulation when necessary. Across 72 real-world rollouts covering 25 task/platform settings, ACAP reduces task-balanced time cost by 28.2% compared with a single-agent Direct Policy, with improvements across Fully Parallel, Parallel-Sequential, and Collaborative tasks. Across all eight Collaborative settings, ACAP also achieves lower mean time cost than Fixed Delegation, where only member agents can control their assigned groups. An additional 90-rollout study shows lower mean 30-minute-capped time cost than Direct on all six tasks. We further demonstrate mobile manipulation using the same member interface for chassis and torso control. We present the framework and a real-world rollout dataset containing observations, generated programs, actions, and feedback to support research on how coding agents reason and act in the physical world.",
      "sourceDepth": "Reviewed paper",
      "cardSummary": "ACAP 在一台机器人上让不同控制组并行推理和执行，并在物理动作耦合时临时交还控制权。25 个真机任务／平台设置、72 次运行中，按任务加权的平均时间成本从单智能体的 19.04 降到 13.67 分钟。",
      "abstractZh": "单智能体控制整台机器人时，独立的双臂动作也可能被串行化；固定分工则遇到共享物体或空间就难以协调。ACAP 让多个有持续记忆的编程智能体负责同一台机器人的不同控制组，上层根据观测和报告动态安排分工。跨实验设置和重复试验的任务级耗时对照表明，允许适时交接控制权比固定并行更有用。",
      "originalReading": {
        "method": "We introduce Asynchronous Coding Agents as Policy (ACAP), an asynchronous framework that organizes one robot as a team of persistent agents.",
        "results": "Across all eight Collaborative settings, ACAP also achieves lower mean time cost than Fixed Delegation, where only member agents can control their assigned groups."
      }
    }
  ]
};
issues.push(nov26Edition);
