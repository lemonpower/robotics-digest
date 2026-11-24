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
