// 编辑这一个文件即可新增期次；用日期降序排列。专题与日常批次分开标注。
const tracks = {agentic:"Agentic", robots:"Robots", rl:"Robot RL", shared:"数据基础设施"};
const article = (id, name, en, track, first, author, org, summary, metric, method, result, caveat, picture, caption, project) =>
  ({id, name, en, track, first, author, org, summary, metric, method, result, caveat, picture, caption, project});
const issues = [
  {
    key:"2026-10-27", date:"2026-10-27", batch:"2026-10-26", time:"08:45（北京时间）", scope:"cs.RO 53 篇首次投稿、11 篇交叉投稿、43 篇修订；补查 cs.AI、cs.CV。",
    title:"导航表征、机器人数据与失败恢复",
    insights:[
      ["agentic","让策略有机会重试","Backtrack 在不重训 VLA 的情况下检测失败并回退；WorldMirror 用失败反馈修正数字孪生。"],
      ["robots","导航开始预测下一刻","RepresentNav 在为导航学习的表征里先预测未来，再生成航点；Go2 和 Bumi 真机也有对照。"],
      ["shared","海量数据不等于可靠监督","FLORA 自动生成动作描述和奖励。EgoForesight 则按数据来源处理人类第一视角动作中的噪声。"]
    ],
    inference:"把失败识别、数据质量和实际执行放在同一条链上，可能比只报策略平均成功率更有用。本期没有以 SuperMimic 路线为主的入选论文，专题另列。",
    papers:[
      article("2610.31762","RepresentNav","See What I Need, Dream What I Want: A Navigation Foundation Model on a Self-Constructed Representation Space","robots","2026-10-22","Jiawei Chen、Yinxi Wang、Zihan Yang、Meijun Gao、Yaowei Liu、Shuming Zhang、Zecheng Li、Xiangju Mi、Yuxuan Liu、Runzhong Huang、Tianlin Li、Xun Zhang、Zhengyang Wang、Xu Miao、Tong Yang","北京大学、伦敦大学学院、DataCanvas","用任务驱动的表征预测未来场景，再据此生成导航航点。","VLNVerse 细粒度成功率 83.80%",
        "三层 Representation Residuals 从冻结的 DINOv3、DA3、OpenD4RT 多层读出语义、几何和动态特征。先学习适合导航的未来表征，再让策略用 JEPA 预测的短期表征规划航点。与直接拼接编码器的输出不同，融合权重受导航训练目标塑造。",
        "VLNVerse Full Test（3 m 判据）：细粒度 83.80%，较 Qwen-RobotNav-8B 高 20.05 个百分点。Go2/Bumi 真机：语言导航 14/20 vs Uni-NaVid 7/20，跟踪 18/20 vs 8/20。4,000 条 PointGoal 轨迹上，无未来预测时碰撞率 18.05%，完整模型为 13.45%。",
        "真机合计 40 个语言导航和跟踪案例；推理依赖外部 RTX 4090。事后可解码三维占用不等于能迁移到接触操作。","https://arxiv.org/html/2610.31762v1/representnav_pipeline.png","论文图 2：先融合多层视觉先验，再预测短期潜在状态供动作决策。","https://wang-yinxi.github.io/representnav/"),
      article("2610.31779","FLORA","FLORA: An Open Model Suite for Scaling Robotics Data Engines","shared","2026-10-22","Sicong Leng、Yunze Man、Zhiqi Li、Jing Wang、Yuhe Zhang、Ryan Punamiya、Siddharth Patki、Kaiyuan Zheng、Zi-ang Cao、Zhiding Yu、Sifei Liu、Danfei Xu、Ben Levin、Jan Kautz、Yuke Zhu、Johan Bjorck、Linxi Jim Fan","NVIDIA 项目；未逐一核实作者机构","同一个数据引擎，为机器人视频生成动作时间戳、过程奖励和结果奖励。","RoboRewardBench：MAE 0.400",
        "以 Qwen3.5 初始化分段、描述和奖励模型。分段器和描述器先做 SFT，再分别使用 GRPO 优化时间边界和描述；发布的奖励模型使用共同的监督微调流程输出结果、过程与 rubric 分数。",
        "WGO-Bench 100 个 episode，时序 tIoU ≥ 0.75：分段 F1 50.3%，联合 F1 34.5%，后者低于 Astra 39.0%；相较 Refiner，联合 F1 高 7.3 个百分点。RoboRewardBench 2,831 条轨迹上，1–5 分量表 MAE 0.400，Astra 0.554，RoboReward 0.665。",
        "论文报告的是标注质量与吞吐，不是下游 VLA 成功率的独立提升。部分训练数据与基准未公开；成本估计依赖硬件和计费假设。","https://arxiv.org/html/2610.31779v1/release_pull_figure.png","论文图 1：分段与描述接力，奖励模型提供不同粒度的监督。","https://research.nvidia.com/labs/gear/flora/"),
      article("2610.31834","WorldMirror","WorldMirror: Agentic Real-to-Sim Generation of Interactive Worlds from In-the-Wild Robot Demonstrations","agentic","2026-10-22","Tianling Xu、Weijie Wan、Honghao Su、Kailun Su、Junyuan Tang、Huichi Zhou、Haozheng Zhang、Qi Xiong、Ping Luo、Wenbo Ding、Tianxing Chen、Yue Chen","Xspark AI、清华大学、香港大学、伦敦大学学院、北京大学","用重放反馈迭代构造可执行、可交互的数字孪生。","DROID 轨迹重放：最终误差 5.83 cm",
        "从 RGB 示范与机器人轨迹生成 Isaac Sim 世界。编码智能体维护可编辑世界程序，用统一的相机坐标系对齐场景、物体、机器人与支撑面，再根据渲染和交互失败回退到相应组件进行修正。",
        "10 个 DROID 场景的首帧比较中，LPIPS 0.427 vs RoLA 0.506。直接重放未修改的机器人轨迹，作者报告最终误差 5.83 cm vs Astra 21.98 cm，接触 F1 0.873 vs 0.653。单个轨道操作消融中，一次性重建、固定迭代均失败，定向细化后成功。",
        "可执行重放证明了有限样本上的物理一致性；没有验证重建场景是否能提升下游策略或 sim-to-real。","https://arxiv.org/html/2610.31834v1/Framework.png","论文图 2：路由器根据渲染、几何及交互结果调用工具并修正失败组件。","https://worldmirror-page.github.io/"),
      article("2610.31845","EgoForesight","EgoForesight: Effectively Scaling Policy Learning with Noisy Egocentric Actions","robots","2026-10-22","Chubin Zhang、Changyuan Wang、Yirui Wang、Ao Li、Shilin Ma、Yue Su、Cai Zhou、Xiuwei Xu、Tianle Zhang、Yansong Tang","清华大学、京东未来学院、香港大学、MIT、Loopeva","让带噪的第一视角动作参与训练，同时用真实未来画面补上监督。","RoboCasa-GR1 少样本成功率 66.0%",
        "联合预测未来视觉与动作。对低可靠性来源施加更强的动作扰动，并调节动作回归权重。训练中 EMA 教师可看真实未来，帮助学生学习和任务结果相关的表征；执行时不需要未来画面。",
        "RoboCasa-GR1 24 任务，每任务 100 条示范、50 次评测：66.0%，高于 robot-only DIAL 的 58.3%。十分之一预训练规模下，基线 52.0%，只加可靠性 54.3%，只加教师 56.3%，合用 58.6%。Galaxea R1 Pro＋Sharpa Wave 真机四项任务、每项 20 次，平均成功率 63.8%。",
        "数据来源级可靠性处理不了个别片段的噪声或系统性重定向误差。基线预训练不完全匹配；单套真机硬件的结果不是开放场景泛化证据。","https://arxiv.org/html/2610.31845v1/pipeline_page1.png","论文图 1：可靠性控制动作噪声，训练期的未来教师提供额外信号。"),
      article("2610.32941","Backtrack","If at First You Don’t Succeed, Backtrack: Lightweight Recovery for Frozen VLAs","agentic","2026-10-23","Thomas Landeg、Thierry Tambe","斯坦福大学、苏黎世联邦理工学院","预测失败后，让机械臂沿实际运动回退，再由原策略重试。","LIBERO-Long：SmolVLA +7.40 个百分点",
        "仅训练一个失败预测头，读冻结 VLA 的已有中间特征，占策略参数约 0.48%–0.88%。风险超过阈值时回放近期实际运动的逆序，再交回原策略；不用恢复演示。",
        "LIBERO-Long 同等步数预算，5 种子、每任务每种子 50 次。SmolVLA 61.00% +7.40 pp，π₀.₅ 94.72% +1.60 pp，π₀-FAST 85.32% +7.08 pp。π₀.₅ 预测头留出轨迹 AUROC 0.977；阈值从 0.99 降到 0.9，检出率 80%→96%，误报率 2.0%→6.1%。",
        "只有仿真证据。退回机械臂姿态不等于恢复物体状态，无法修复不可逆错误或需要新策略的失败。","https://arxiv.org/html/2610.32941v1/backtrack_overview.svg","论文图 1：VLA 特征并行供失败头使用，控制权在策略与回退控制器之间切换。")
    ]
  },
  {
    key:"2026-10-24",date:"2026-10-24",batch:"2026-10-23",time:"08:25（北京时间）",scope:"cs.RO 63 篇首次投稿、6 篇交叉投稿、38 篇修订；补查 cs.AI、cs.CV。",
    title:"人形移动操作、记忆与几何世界模型",
    insights:[
      ["robots","未见场景考验人形策略","LocoManiLab 的统一评测揭示了已见任务与未见场景之间的大幅落差。"],
      ["agentic","先决定保留什么历史","WholeBodyMem 保留物体事件帧，FocusVLA 按未来动作阶段切换视觉关注。"],
      ["rl","将已知动力学与学习分开","DiffDreamer 让可微仿真处理机器人本体，学习模型预测外部运动。"]
    ],
    inference:"显式结构有助于集中模型的学习任务，但场景变化、传感器配置和硬件证据仍决定结果能外推多远。",
    papers:[
      article("2610.30876","LocoManiLab","LocoManiLab: A Unified Testbed for Data, Policies, Controllers, and Deployment in Humanoid Loco-Manipulation","robots","2026-10-22","Dewei Wang、Jinrui Han、Jiyuan Shi、Chenyun Zhang、Xianbo Lu、Jiabao Wu、Jiqin Feng、Jipeng Kong、Ping Luo、Chenjia Bai、Xuelong Li","中国电信人工智能研究院、中国科学技术大学、香港大学等","在相同数据与控制器设定下比较人形移动操作策略。","XR-1：已见 80.2% · 未见场景 8.2%",
        "统一数据采集、策略训练、全身控制和部署；13 个仿真场景实例，234 个原子或组合任务，12 种策略、5 种控制器。统一接口用于拆分策略与控制器的影响。",
        "SONIC、无域随机化的主评测中，XR-1 已见任务、未见任务和未见场景成功率分别为 80.2%、25.2% 和 8.2%。三项匹配任务上，XR-1 仿真 76.7%、真机 70.0%；每模型每任务真机 10 次。部分数据混合实验中加入合成数据反而降低效果。",
        "真机覆盖有限，输送带任务仿真与真机的成功条件不完全相同；策略排名不能直接推及开放环境。","https://arxiv.org/html/2610.30876v1/figure1_overview.png","论文图 1：测试平台串联任务、数据、策略、控制器和部署。"),
      article("2610.31166","WholeBodyMem","Memory before Goal: Role of Pre-History Memory for Humanoid Loco-Manipulation","agentic","2026-10-22","Chenyuan Chen、Ran Ding、Lechen Zhang、Zewen He、Yoshihiko Nakamura","MBZUAI","在转身或移动后，仍能利用已经离开视野的历史线索。","G1 真机记忆任务：53/60 vs 22/60",
        "SAM3 跟踪物体，经相机运动补偿后用对象事件选帧；动作专家按需查询关键帧和带时间信息的对象 token。不同于在提示里均匀堆叠帧，记忆预算与读取由任务驱动。",
        "六项仿真记忆任务上，完整模型 72.6%，均匀历史 44.4%，无记忆 Ψ₀ 29.1%；仅改为事件筛选且不加物体 token/决策头时为 60.4%。G1 真机六任务每项 10 次，完整模型 88.3%，无记忆基线 36.7%。",
        "SAM3 漏检会丢掉线索；真机样本小，尚未验证更长的开放任务。","https://arxiv.org/html/2610.31166v1/ral_pipeline.png","论文图 3：代理从历史视频选取物体事件，再将关键特征交给动作专家。"),
      article("2610.30991","UniFlowWAM","UniFlowWAM: A Unified World–Action Model with Visual Semantics and 4D Geometry","robots","2026-10-22","Jialin Tian、Zhuofan Li、Xinkai Wang、Bokai Lin、Chenyi Wang、Xinyu Zhan、Cewu Lu、Lixin Yang","上海交通大学 MVIG、上海人工智能创新研究院、Noematrix","联合建模未来视觉特征、场景三维流和动作。","双臂真机成功率 87.0% vs π₀.₅ 68.5%",
        "多模态扩散 Transformer 的三类专家处理动作、视觉语义和三维场景流，以十种目标/条件组合训练正逆动力学等任务；普通策略推理可不显式生成几何流。",
        "RoboCasa-GR1 24 任务中，无 flow 52.1%，完整 56.4%。ALOHA 风格平台四项目标，每任务 50 条示范，完整模型每任务 50 次评测，平均成功率 87.0%，π₀.₅ 68.5%，DreamZero 30.0%。追加 flow 的分阶段消融有收益，但部分配置试次数不同。",
        "Track4World 提取的三维流是伪标签；真机初始配置位于示范范围，尚不能证明开放环境几何泛化。","https://arxiv.org/html/2610.30991v1/UniFlowWAM-teaser.png","论文图 1：三个专家联合去噪，推理阶段按需要启用不同预测。"),
      article("2610.31423","FocusVLA","FocusVLA: Future-Intent Guided Dynamic View Routing for Vision-Language-Action Models","robots","2026-10-22","Huixin Xu、Ziya Yu、Peng Li","南京软件技术研究院、中科院软件所、国科大等","按未来动作阶段协调全局相机与腕部相机的信息。","RoboTwin 2.0：76.92% · +10.10 pp",
        "在 π₀.₅ 之上加入未来意图和动作侧路由模块。用末端轨迹弱监督预测未来动作步是否需要精细交互，再分配全局与局部视角权重。无需更换视觉、语言或动作主干。",
        "RoboTwin 2.0 共 50 任务，各 100 次，平均成功率 76.92%，较 π₀.₅ 高 10.10 pp。Piper 真机六任务各 30 次，成功率 85.0% vs 71.7%。九任务消融中，完整模型 73.7%，固定可学习视角分配 67.5%，无显式意图监督 55.7%。",
        "真机只测单类机械臂和相机配置；轨迹衍生的意图标签不能直接替代更丰富的子目标和交互语义。","https://arxiv.org/html/2610.31423v1/methods.png","论文图 4：未来意图被映射为逐步路由权重和动作块条件。"),
      article("2610.31617","DiffDreamer","DiffDreamer: Coupling World Models with Differentiable Simulation for Agile Quadrotor Control","rl","2026-10-22","Fanxing Li、Yuxiang Huang、Shengyang Wang、Fangyu Sun、Shuyu Wu、Tianbao Zhang、Dexin Zuo、Yan Yufei、Danping Zou、Wenxian Yu","","把外部环境预测和四旋翼本体动力学拆成两条训练路径。","VisFly 平均距离误差：0.381 m",
        "学习到的世界模型预测外部动态；可微物理传播飞行器位置、姿态和速度。策略同时用两类状态，分别从 critic 和物理梯度学习非可微事件与平滑运动奖励。",
        "VisFly 敏捷跟踪距离误差 0.381±0.282 m，DreamerV3 为 1.003±0.556 m。动态门最大速度 2 m/s 时，512 仿真步平均通过 8 门，PPO 3、MPC 1；移除离散过门奖励后降至 0 门，移除可微奖励降至 2 门。",
        "真机是依赖外部动捕的概念验证，没有定量成功率。四旋翼的平滑刚体动力学不能直接代表触碰丰富的机器人操作。","https://arxiv.org/html/2610.31617v1/figures/overview.png","论文图 1：同一动作同步推进外部 latent 与显式本体状态。")
    ]
  },
  {
    key:"supermimic",date:"2026-11-24",batch:null,time:null,scope:"专题串读 SuperMimic 与两篇明确沿用或改进其方法的预印本。",
    title:"SuperMimic 路线：速度与难动作泛化",
    insights:[
      ["rl","共享模型降低学习成本","SuperMimic 用一个可微动力学模型服务整套动作库，从短期想象轨迹求策略梯度。"],
      ["rl","训练加速有不同来源","XMimic 把训练步骤并行化；墙钟时间、GPU 数、硬件型号和交互步数应分开比较。"],
      ["rl","平均回报之外看最差 1%","Trust What Repeats 检查大梯度在模拟器中是否可信，并在未见动作上报告尾部表现。"]
    ],
    inference:"不同论文使用不同动作库、硬件和目标回报，不能把三者的训练耗时直接排列为同条件排行榜。",
    papers:[
      article("2610.28480","SuperMimic","SuperMimic: Scaling Humanoid Whole-Body Control with One Differentiable World Model","rl","2026-10-20","Qiayuan Liao、Yiyang Shao、Junfeng Long、Kevin Zakka、Roberto Horowitz、Pieter Abbeel、Koushil Sreenath","","训练一个共享可微世界模型，给多动作人形跟踪策略提供解析梯度。","统一动作库上的模型式全身控制",
        "利用刚体模拟器记录的转移训练共享动力学模型。在交替训练循环中，从模拟数据采样起点，在模型内进行短期 rollout，沿跟踪回报反向传播更新策略。",
        "原始版本摘要报告：单 GPU 约 3 小时的策略超过使用 128 GPU 训练 7 天的基线回报；129,514 个基准动作的失败数为 25 对 179；并展示迁移到 Unitree G1。",
        "上述是原始论文自己的基准口径，不能和后续小动作库或不同硬件的墙钟时间直接比较。真机演示不等于在完整动作库上的定量真机测评。","supermimic-fig2.png","论文图 2：共享世界模型及策略的交替训练流程。","https://supermimic.github.io/"),
      article("2611.20452","XMimic / XSoma","XMimic and XSoma: Learning Humanoid Motion Tracking and Locomotion in Under a Minute","rl","2026-11-16","Nico Bohlinger、Jan Peters","达姆施塔特工业大学、RIG、DFKI、hessian.AI","把模型式训练循环编译并并行化，同时扩展到粗糙地形速度跟踪。","4×H100：XMimic 0.86 分钟",
        "在 SuperMimic/BlinkMimic 路线基础上用 JAX 编译模拟采样和优化，跨 GPU 并行采样、更新世界模型和策略。XSoma 从地形场中精确查询足下高度，只学习机器人自身动力学。",
        "四张 H100 上，XMimic 在 0.86 分钟达到 Unitree G1 的 40 段 LAFAN1 动作跟踪目标；单卡相对 BlinkMimic 为约 1.3 倍加速。XSoma 达到 FastSAC 速度跟踪目标耗时 0.77 分钟，环境交互步数约为对照的八分之一。",
        "单卡和多卡结果不能混算；这不是对 SuperMimic 大动作库的等规模重跑。此处记录的是论文报告的仿真训练时间。",null,"原文 Figure 2 展示跨 GPU 拆分数据收集、世界模型与策略更新的方式。"),
      article("2611.27648","Trust What Repeats","Trust What Repeats: Capped World-Model Policy Gradients for Humanoid Motion Tracking","rl","2026-11-20","Xuzhe Dang、Stefan Edelkamp","布拉格捷克理工大学、查理大学","检验极大梯度的可信度，通过梯度截断改善最难的未见运动。","最差 1% 测试片段回报：0.65 → 0.76",
        "以模拟器核对世界模型给出的动作梯度，在短期想象轨迹中限制异常大的梯度；结合起点采样和基于模型估值的重置把训练更多用在难例。",
        "223 小时动作训练，353 个未见动作、三个种子。归一化测试回报 0.9531→0.9671，最差 1% 片段 0.65→0.76；持续跌倒片段从 15–18 减至 7–10。作者消融显示截断主要改善均值，模型排序重置主要改善尾部。",
        "用同一个模拟器核对训练用的学习模型，不能证明梯度在真实机器人上同样可靠。部分超出机器人能力的参考动作两种方法均失败。",null,"原文 Figure 3 对比均值与最差 1% 测试片段的训练曲线。")
    ]
  }
];
