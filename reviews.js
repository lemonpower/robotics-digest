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
      "why": "通用智能体适合处理歧义和失败，专用策略适合稳定执行精细动作。系统需要知道何时切换，而不是每段动作都询问大模型。",
      "method": "将示范中的关键场景变化压缩成任务参考。轻量调度器读当前观测和参考，在每段动作前决定由 Astra 还是低层操作策略执行。",
      "result": "xArm7：四项任务，每项每方法各 20 次，平均 77.5% 对 28.75%。RMBench 九项仿真：94.4% 对 EventVLA 的 67.9%。RoboDojo：随机分配执行权只有 30.00%，完整方法 59.58%；Astra 调用从 76.72 降至 28.80 次/回合。",
      "caveat": "真机对照验证的是整套调度和任务参考，不能单独归因于门控。调度也要调用模型，Astra 调用量不是系统总成本。",
      "metric": "77.5% vs 28.75% · 四项真机任务",
      "picture": "https://arxiv.org/html/2611.32533v1/NextManip-teaser.png",
      "caption": "图 1：根据任务上下文和最新观察，把下一动作段交给智能体或低层策略。",
      "sourceDepth": "Reviewed paper"
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
      "why": "会执行某项技能并不等于会在正确时机对正确物体执行；前一步失败也会使原计划失效。",
      "method": "视觉语言模型估计状态与目标，PDDL 规划器安排技能；低层按阶段读取文本、图像点位或两者。独立检查器验证执行进展，必要时重规划。",
      "result": "Franka Panda 三项任务，每方法每任务各 10 次分布内、10 次分布外。分布外叠块 80% 对 70%，抽屉检索却是 50% 对 80%。Tabletop 仿真 64.0%，禁用重规划后 17.8%，移除点位后 4.4%。",
      "caveat": "任务族仍需手工定义技能阶段、PDDL 域和检查提示；精细抓放依然受低层能力限制。",
      "metric": "40% vs 0% · 分布外真机拼字",
      "picture": "https://arxiv.org/html/2611.32813v1/architecture-v6.png",
      "caption": "图 2：从符号规划、目标点定位到连续动作执行，结果返回检查器触发下一阶段或重规划。",
      "sourceDepth": "Reviewed paper"
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
      "why": "单纯拟合下一状态容易在支撑部位切换时累积误差。已知的刚体动力学不必从数据重新学习。",
      "method": "网络预测候选支撑部位的接触力和力矩和残余广义力，用刚体方程积分；接触标注和状态轨迹共同监督模型。沿用 SuperMimic 的短想象轨迹反传优化，真机上只运行跟踪策略。",
      "result": "LAFAN1 60 条完整动作：世界坐标 MPJPE 1,045.39 对 1,284.42 mm；A3 Parkour 22 条动作、相同高度图输入：56.28 对 66.15 mm；GRAIL 9,736 个片段：126.57 对 141.88 mm。LAFAN1 分段消融去掉前向动力学后是 277.50 对完整 240.63 mm。",
      "caveat": "地形实验用的是训练参考动作库，不是未见动作评估。每方法每数据集单张 H800，不代表已证明训练提速。A3 起身、侧手翻、翻箱是演示，无真机成功率对照。",
      "metric": "−18.6% MPJPE · LAFAN1 仿真",
      "picture": "https://arxiv.org/html/2611.32944v1/pipeline-policy-terrain-input.png",
      "caption": "图 2：接触预测结合物理积分，梯度经想象轨迹回传至策略。",
      "sourceDepth": "Reviewed paper"
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
      "why": "预测未来图像不足以说明哪个动作更接近目标，分开训练策略和价值模型也难共享任务相关特征。",
      "method": "预测动作段末端的视觉潜变量、本体状态、奖励和终止，其间不生成视频帧；再据执行中的成功与失败校准模型，比较想象 PPO 与 critic 候选排序。",
      "result": "DexJoCo 8 项任务、3 个种子、每任务每种子 50 回合：PPO 67.75%，未更新 65.50%，Motus 66.83%。预训练消融移除 critic 为 60.75%，完整配置 68.00%。真机移蛋/取杯各 30 次，未做后续 PPO 的 DexWAC 为 50%/100%，π₀.₅ 为 20%/70%。",
      "caveat": "仿真提升主要来自双臂任务，个别任务退化。不能把真机预训练模型的胜出归因于想象 PPO。",
      "metric": "67.75% vs 65.50% · DexJoCo 仿真",
      "picture": "https://arxiv.org/html/2611.32654v1/figures/dexrsi_workflow.png",
      "caption": "图 1：区分联合预训练、模型校准和后续策略改进。",
      "sourceDepth": "Reviewed paper"
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
      "why": "只用最终成败训练长程策略，很难知道任务卡在哪一步，也浪费了在局部瓶颈上进行针对性练习的机会。",
      "method": "显式记录子任务依赖与进度；全局 RL 定位瓶颈，局部 RL 在瓶颈前后增加练习，并用同一策略再做全任务验证。真机版改用 RECAP 加进度奖励与瓶颈片段过采样。",
      "result": "LIBERO-Long 97.8% 对 StructRL 96.2%，去练习窗口后 96.8%。Unitree G1-D 真机烤面包成功率 95%，RECAP 70%，仅监督微调 30%；每方法每任务三组、每组 20 次。",
      "caveat": "真机版没有复制仿真的在线 PPO 和中间状态重置，不应把真机提升归因于同一在线训练流程；RoboCasa365 用的是已见任务。",
      "metric": "95% vs 70% · 真机烤面包",
      "picture": "https://arxiv.org/html/2611.32639v1/method.png",
      "caption": "图 2：反复进行全局诊断、局部练习和全任务验证。",
      "sourceDepth": "Reviewed paper"
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
      "why": "仅凭视频难以判断手何时真正接触物体以及施力意图。",
      "method": "先用触觉信号校正手部姿态和接触几何，再把人手的接触模式作为机器人训练奖励，而非直接复制人手动作。",
      "result": "论文报告同时在重建和策略训练中加入触觉监督有助于提高操作成功率。",
      "caveat": "这条解读依据原摘要，未列未核实的任务级数值；采集方案需要触觉手套。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.32101v1/pipeline.png",
      "caption": "Figure 2",
      "abstract": "Learning dexterous manipulation from egocentric human demonstrations offers a scalable path toward robot skill acquisition. Vision alone, however, provides limited information about physical contacts and the demonstrator's force intent, leading to ambiguities in interpreting hand-object interactions. Capturing human touch via tactile sensing is therefore crucial for reliable human-to-robot dexterous skill transfer. We present Ego2Real, a framework that leverages egocentric demonstrations and tactile gloves to transfer bimanual dexterous manipulation skills to robotic hands. Ego2Real incorporates tactile supervision at two complementary stages: (1) tactile-guided hand-object interaction reconstruction, which uses measured tactile signals to refine hand poses and contact geometry; and (2) contact-informed reinforcement learning, which translates human contact patterns into robotic contact rewards. By combining refined motion references with physical contact rewards during training, Ego2Real guides anthropomorphic robotic hands to emulate demonstrated contact behaviors while adapting to their own morphology and actuation. Experiments show that incorporating tactile supervision into both reconstruction and policy learning yields higher manipulation success rates, underscoring the importance of enriching egocentric demonstrations with tactile observations to improve their quality and transferability.",
      "sourceDepth": "Abstract brief"
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
      "why": "两阶段蒸馏会让能看见特权状态的教师和只有图像的学生能力不匹配。",
      "method": "训练直接使用部署时可用的图像，冻结视觉骨干，用快速栅格化仿真渲染学习控制头。",
      "result": "与匹配架构、观察和计算预算的两阶段蒸馏相比，真机三项任务平均相对提高 58.8%；这是相对提升，不是 58.8 个百分点。",
      "caveat": "真机证据来自三项操作任务，不能直接推广到其他机器人形态或长程任务。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.31588v1/arch_figure_comparison.png",
      "caption": "Fig. 2",
      "abstract": "Sim-to-real reinforcement learning (RL) has enabled impressive robotic behaviors, yet deploying policies directly from vision remains challenging. A common approach first trains a teacher policy with RL using privileged state observations, then distills its behavior into a vision-based student via imitation. However, the resulting student can substantially underperform its teacher. Directly training visual policies with RL offers a promising alternative, but learning task-relevant visual representations from scratch can be sample-inefficient, making one-phase visual RL intractable. We propose DRIFT, a simple recipe for efficient one-phase visual RL using image observations available at test time. Our key insight is to use frozen, pretrained foundation vision encoders, allowing RL to focus on learning control from existing visual representations. Freezing the encoder avoids costly backpropagation through the vision backbone, while its pretrained representations enable real-world transfer from fast, rasterized simulation rendering. Under matched architectures, observations, and compute budgets, DRIFT outperforms two-phase distillation and achieves a 58.8% relative improvement in average real-world success rate across three manipulation tasks. Controlled simulation evaluations demonstrate that DRIFT's relative advantage grows from roughly 9% in-distribution to over 61% under out-of-distribution shifts, suggesting that stronger generalization contributes to superior real-world transfer. Project website: https://jmarangola.github.io/one-phase-visual-rl/",
      "sourceDepth": "Abstract brief"
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
      "why": "小型开源视觉语言模型能使用控制工具，但错误后容易重复无效调用。",
      "method": "先在成功教师轨迹上监督微调，再用任务结果奖励做多轮 RL；LiteHarness 用分层记忆控制上下文长度，将感知、规划和控制工具接入闭环。",
      "result": "仿真成功率：RoboTwin 干净场景 31.2%→44.0%，未见随机场景 26.4%→38.0%；LIBERO-Pro 57.8%→73.3%，分别与同骨干监督微调版对比。",
      "caveat": "这些对照来自仿真；随机双臂场景仍明显落后于论文报告的更强模型。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.32016v1/positioning_figure.png",
      "caption": "Figure 2",
      "abstract": "Agentic harnesses enable frontier vision-language models (VLMs) to manipulate robots through perception, planning, and control tools, yet achieving comparable performance with compact open-weight VLMs remains challenging. We present RoboHarness-RL, an agentic reinforcement learning framework for improving VLM-based robot manipulation through tool calls. Starting from supervised fine-tuning on successful teacher demonstrations, the VLM further improves through multi-turn reinforcement learning with task-outcome rewards, without relying on vision-language-action models or world action models. To support efficient multi-turn training, we develop LiteHarness, which uses hierarchical memory to keep interaction contexts compact while preserving task performance. With Qwen3.5-9B, RL raises success from 31.2% to 44.0% on RoboTwin 2.0 and from 57.8% to 73.3% on LIBERO-Pro; these gains extend to randomized RoboTwin scenes unseen during training (26.4% to 38.0%). Behavioral analysis further shows that RL reduces repetitive-call rates by up to $4\\times$, shortens successful executions, and improves recovery from negative feedback. Project page: https://aim-uofa.github.io/RoboHarness-RL/",
      "sourceDepth": "Reviewed paper"
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
      "why": "触觉仿真既要跟真实接触力吻合，也要支持够快的并行数据生成。",
      "method": "从 PhysX 接触结果重建法向与切向力，约束摩擦和合力；用共享表示对齐阵列力传感器与触觉图像。",
      "result": "上述数字是受控压入与传感器滑动测试的均方根误差，不是操作成功率。论文另报告若干接触密集任务获益。",
      "caveat": "高度依赖触觉的任务绝对成功率仍低；不要把传感器拟合精度等同于控制性能。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.32476v1/vitaclab-teaser.png",
      "caption": "Fig. 1",
      "abstract": "Tactile sensing is essential for contact-rich robotic manipulation, but existing visuo-tactile simulators trade physical fidelity for scalability, and benchmarks largely focus on two-finger grippers. We present ViTacLab, a framework comprising ViTacSim, ViTacBench, and ViTacPolicy. ViTacSim uses a tri-modal tactile primitive: a global sparse contact-force lattice, a local dense force array, and tactile images. Anchored to PhysX contact-solver outputs, it corrects normal inconsistency through local stiffness alignment and reconstructs tangential forces under decoupled slip-stick regimes while preserving GPU parallelism. A joint projection preserves the sparse wrench and enforces local friction cones. ViTacBench spans parallel grippers, dexterous hands, and bimanual systems, with tasks ranging from vision-dominant to tactile-dominant regimes. ViTacPolicy aggregates variable numbers of heterogeneous tactile inputs using spatial-pose embeddings and a Transformer, and aligns force-array and tactile-image modalities through a two-stream VQ-VAE with a shared codebook. Controlled Hertzian-reference indentation and real-sensor sliding tests reduce normal and tangential force RMSE from 2.31 and 1.85 N to 0.42 and 0.53 N, respectively. Throughput reaches 2,482.9 tactile-pipeline FPS at 256 parallel environments. Simulation and real-world experiments show gains on several contact-rich tasks, while low absolute success on tactile-dominant tasks highlights the remaining difficulty of purely tactile control.",
      "sourceDepth": "Abstract brief"
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
      "why": "系统可能给出正确答案，却没有做出任务要求的搜索或操作。",
      "method": "在同一组目标上容纳视觉语言模型、VLA 和世界动作模型的执行接口，按真实轨迹量化达成进度。",
      "result": "13 个受测系统中，Claude Fable 5.2 达成 13/60 个目标、平均互动分 28.58/100；视觉语言模型答对全部终问的回合中，71.8% 的互动分仍为零。",
      "caveat": "这是仿真评测基准，不是新的机器人闭环控制方法，也没有真机结果。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.30989v1/fig/WorldLeague_Task_Construction.png",
      "caption": "Figure 2",
      "abstract": "AI systems can now operate Blender, follow instructions in complex video games, and manipulate objects with robot arms. What range of physical goals can today's AI systems achieve autonomously? Answering this question requires testing systems on tasks that demand different combinations of perception, memory, planning, and action. We introduce \\textbf{WorldLeague}, a benchmark that compares AI systems on a common set of \\textbf{60 simulated robot tasks} by measuring progress toward each task's physical goal from the robot's trajectory. Robots explore scenes to gather evidence in \\textbf{WorldSeek}, rearrange objects in \\textbf{WorldShape}, and adapt to changes in \\textbf{WorldShift}. Tying these goals to a single control interface limits which AI systems can be compared. In WorldLeague, vision-language models (VLMs) choose targets and motions, while vision-language-action models (VLAs) and world-action models (WAMs) use their native controls. For each of six capability dimensions, we measure how much progress a system makes toward its goals (Interactive Score) and how often it achieves them (physical success rate). Together, these measures form the system's \\emph{Physical Agency Profile}. Among 13 representative AI systems, Claude Fable 5.2 achieves 13 of the 60 goals and earns the highest mean Interactive Score (28.58/100). Fable leads in four dimensions, while GPT-6.1-Sol and GPT-6-Astra tie for first on rule-following tasks. Even when VLMs answer every final question correctly, they receive an Interactive Score of zero in 71.8\\% of those episodes. WorldLeague gives Embodied AI, Physical AI, and Agentic AI a shared basis for comparing what AI systems achieve autonomously, from partial progress toward a physical goal to full goal completion. Project Webpage: https://xyangzhou.github.io/WorldLeague",
      "sourceDepth": "Abstract brief"
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
      "why": "模型直接给关节角、目标位姿或高层计划时，执行表现不一定相同。",
      "method": "模型输出短段末端绝对目标，低层负责逆运动学和轨迹插值；执行后更新观察继续决策。",
      "result": "仿真 83.3% 对 SenseNova-RoboRSI 57.1%；真机 15/20 对论文自设基线 7/20。",
      "caveat": "只测一套桌面真机，极小开关与遮挡下的精确定位仍容易失败。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.31201v1/harness_baselines.png",
      "caption": "Figure 2",
      "abstract": "Frontier multimodal models exhibit extraordinary generalization in generating robot actions from observations and instructions, enabling a new paradigm in which they serve directly as policies within closed-loop robotic harnesses. However, the design principles of such harnesses, and the capabilities underlying their strong performance, remain unclear. We present Embo-Harness, a framework for systematically studying frontier-model-as-policy harnesses. We investigate four components of the robotic agentic loop, namely, prompting, planning, action execution, and tool use, and distill six empirical findings into a practical recipe. This recipe prioritizes interfaces that exploit the model's native visual reasoning and tool-use capabilities over handcrafted plans, skills, or action priors, and identifies effective choices for action representation, chunking, reasoning effort, visual observations, short multi-action sequences, and policy refinement. On RoboLab-120, Embo-Harness achieves an 83.3\\% success rate, outperforming the strongest reported baseline by 26.2 percentage points. It also succeeds in 15 of 20 zero-shot trials across four real-world manipulation tasks. Beyond performance, controlled interventions indicate that the studied model depends more strongly on accurate spatial target estimation than on explicit low-level joint or trajectory generation. These results provide both a practical recipe for building strong frontier-model-as-policy harnesses and a clearer account of the capabilities that drive their performance.",
      "sourceDepth": "Reviewed paper"
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
      "why": "只用一个智能体会串行化可并行操作，但固定分工也难处理两臂物理耦合。",
      "method": "各成员独立观测、推理和生成程序，上层协调器根据反馈切换控制权；必要时统一接管耦合的部件。",
      "result": "72 次真机运行中任务平均时间成本降低 28.2%；额外 90 次重复试验中，六项任务平均时间成本均低于单智能体。",
      "caveat": "这是任务级时间成本，不是伺服延迟或开放环境的安全保证。",
      "metric": "",
      "picture": "https://arxiv.org/html/2611.31205v1/teaser.png",
      "caption": "Figure 1",
      "abstract": "Coding agents can construct and revise robot behavior during execution, but using one agent for the whole robot can delay otherwise independent work. We introduce Asynchronous Coding Agents as Policy (ACAP), an asynchronous framework that organizes one robot as a team of persistent agents. Each member reasons and acts for a configurable control group, such as an arm with its gripper or the torso and chassis, enabling asynchronous reasoning and execution. However, different robot components often have physical dependencies that require coordination. To address this challenge, ACAP introduces a hyper-agent that assigns tasks, coordinates dependencies, and dynamically allocates control between the lead and member agents. This allows independent work to progress concurrently while supporting tightly coupled manipulation when necessary. Across 72 real-world rollouts covering 25 task/platform settings, ACAP reduces task-balanced time cost by 28.2% compared with a single-agent Direct Policy, with improvements across Fully Parallel, Parallel-Sequential, and Collaborative tasks. Across all eight Collaborative settings, ACAP also achieves lower mean time cost than Fixed Delegation, where only member agents can control their assigned groups. An additional 90-rollout study shows lower mean 30-minute-capped time cost than Direct on all six tasks. We further demonstrate mobile manipulation using the same member interface for chassis and torso control. We present the framework and a real-world rollout dataset containing observations, generated programs, actions, and feedback to support research on how coding agents reason and act in the physical world.",
      "sourceDepth": "Reviewed paper"
    }
  ]
};
issues.push(nov26Edition);
