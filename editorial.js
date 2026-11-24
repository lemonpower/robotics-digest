// 经人工核实的专题选读和媒体；不会被计入当日 arXiv 新论文。
const focusTopics = {
  tactile: {name:'Tactile Sensing'},
  rl: {name:'Robot RL'},
  agentic: {name:'Agentic Robots'}
};
tracks.tactile = focusTopics.tactile.name;
const tactileProject = 'https://akashsharma02.github.io/sparsh-x-ssl/';
const agentProject = 'https://code-as-policies.github.io/';
const tactilePaper = article('2506.14754','Sparsh-X','Tactile Beyond Pixels: Multisensory Touch Representations for Robot Manipulation','tactile','2025-06-17','Carolina Higuera、Akash Sharma、Taosha Fan、Chaithanya Krishna Bodduluri、Byron Boots、Michael Kaess、Mike Lambeta、Tingfan Wu、Zixi Liu、Francois Robert Hogan、Mustafa Mukadam','Meta FAIR、卡内基梅隆大学、华盛顿大学','融合触觉图像、声音、加速度和压力，让机器人在接触中判断是否对齐、受力或打滑。','真机插头插入：90%（每种策略 20 次）','先对四类信号独立编码，再由少量瓶颈 token 交换信息。在约 100 万条未标注接触样本上做师生自蒸馏。下游冻结编码器，其表征可接到插入策略，也可用于真机适配仿真训练的掌内旋转策略。','插入任务用 Allegro 手的三指触觉和腕部相机，在固定插座、随机腕部初始位置下，完整模型 18/20 次成功。论文图 5 报告，相对只用触觉图像的端到端基线提高约 63%。法向力估计平均误差为 35 mN，较只用触觉图像下降约 17%。','结果来自特定指尖传感器、两类操作和有限试次，不能直接推广到其他手或插座。四个传感器并用时，作者报告端到端推理约 20 Hz。','https://arxiv.org/html/2506.14754v1/figures/teaser/sparsh-x-teaser.png','图 1：把四类指尖触觉信号编码成统一表征。',tactileProject);
const agentPaper = article('2209.07753','Code as Policies','Code as Policies: Language Model Programs for Embodied Control','agentic','2022-09-16','Jacky Liang、Wenlong Huang、Fei Xia、Peng Xu、Karol Hausman、Brian Ichter、Pete Florence、Andy Zeng','Robotics at Google','让语言模型为机器人写可执行策略，而不只是输出一句高层计划。','HumanEval pass@1：39.8% vs 36.6%','用少样本指令—程序对提示语言模型，生成解释观测和调用控制原语的程序；遇到未定义函数，再递归生成其实现。程序能表达条件、循环以及几何计算，运行时可读取传感器接口。','论文 v4 展示了真机桌面抓放、画图及移动操作。表 V 的 HumanEval 通用代码任务为分层生成 39.8% pass@1、带提示的平坦生成 36.6%；这不是机器人的任务成功率。','行为依赖预先暴露的感知、动作 API 和提示；代码能执行不代表动作正确或安全，真机演示不能推断开放任务可靠性。',null,'项目页包含桌面操作、画图和移动机器人的实机视频。',agentProject);
issues.push({key:'focus-reading',date:'2026-11-24',batch:null,scope:'专题入门选读，不计为当日首发。',title:'专题选读：触觉表征与语言模型驱动控制',insights:[['tactile','触觉作为操作反馈','Sparsh-X 对比多模态触觉与只用触觉图像的端到端策略。'],['agentic','代码作为机器人策略','Code as Policies 让生成的程序实际使用机器人的感知和控制接口。']],inference:'硬件验证、仿真和代码基准回答的是不同问题，不能用一个数字相互替代。',papers:[tactilePaper,agentPaper]});

const foresightProject = 'https://anson2333.github.io/foresight-forcing/';
const foresightMedia = foresightProject+'assets/videos/';
const foresightPaper = article('2611.30963','Foresight Forcing','Foresight Forcing: Learning Spatial Foresight for Robotic Manipulation','shared','2026-11-23','Mishuo Han、Zhixuan Liang、Zhaoyuan Wan、Wendi Chen、Jiarui Chen、Xinkai Wang、Yue Ma、Yu Zhou、Junting Chen、Yao Mu、Jun Lv、Chuan Wen、Cewu Lu','','让机器人学习下一段动作可能改变哪些空间关系。Foresight Forcing 在世界动作模型中预测冻结 VGGT 的三维特征变化，并用它辅助生成动作。RoboTwin 2.0 Full 平均成功率为 95.01%，六项真机双臂任务平均得分为 85.8%。','95.01% RoboTwin 2.0 Full','在 ImageWAM 上增加与视觉 token 对齐的查询。训练时先用光流对齐当前和未来观测，以冻结 VGGT 提取的 patch 特征差作为监督。共享模块根据当前图像、指令和本体状态更新查询，动作专家读取查询生成动作；推理时不使用未来观测或 VGGT。','RoboTwin 2.0 Full 平均成功率 95.01%；LIBERO-Plus 为 84.5%，ImageWAM 为 81.6%。六项真机双臂任务各做 15 次试验，无权重平均任务得分 85.8%，π₀.₅ 为 83.5%，ImageWAM 为 70.2%。','VGGT 特征差不是直接测得的三维位移。RoboTwin Clean-to-Random 中成功率由干净场景的 87.84% 降至随机场景的 67.06%；真机测试使用训练过的六类任务，不能证明可泛化到新任务。','https://arxiv.org/html/2611.30963v1/teaser.png','Figure 1 · Overview of the training signals, runtime policy, and benchmarks.',foresightProject);
issues.push({key:'2026-11-24',date:'2026-11-24',batch:'2026-11-24',title:'Foresight in Robot Manipulation',insights:[['shared','World Action Models','Foresight Forcing 用三维教师特征的变化量辅助动作生成，不在部署时预测未来图像作为控制输入。']],papers:[foresightPaper]});

const editorial = {
  '2506.14754':{keywords:['Multisensory Touch','Digit 360','Contact-Rich Manipulation','Self-Supervised Learning'],why:'只读触觉图像容易错过初次接触、滑移和压力等线索；作者希望用同一触觉表征支持不同操作任务。'},
  '2209.07753':{version:'v4',revision:'2023-05-25',keywords:['Language Model Programs','Hierarchical Code Generation','Manipulation'],why:'自然语言计划本身难以表达持续反馈、精确几何或动作参数。作者希望用可执行程序把开放指令接到机器人控制。',videos:[{src:'https://code-as-policies.github.io/videos/tasks.mp4',caption:'Robot tasks controlled by generated programs.'}]},
  '2610.28480':{keywords:['Whole-Body Control','World Models','Motion Tracking','Sim-to-Real','SuperMimic'],why:'大动作库的跟踪策略往往需要为不同动作重复学习相同动力学。作者希望在动作之间复用一个模型，降低训练成本。',videos:[{src:'https://supermimic.github.io/media/real/film-1080.mp4',caption:'SuperMimic demonstrations on Unitree G1.'}]},
  '2611.20452':{keywords:['SuperMimic','Parallel Training','Motion Tracking','Locomotion']},
  '2611.27648':{keywords:['SuperMimic','World Models','Gradient Capping','Motion Tracking']},
  '2610.32941':{keywords:['Execution Monitoring','Failure Recovery','VLA']},
  '2611.30963':{
    group:'Robot Foundation Models',
    keywords:['World Action Models','Imitation Learning','Bimanual Manipulation'],
    why:'标准世界动作模型预测未来画面，但物体相对目标的位置变化仍隐含在像素里。作者把预训练三维模型特征的时间差作为额外监督，显式学习与动作有关的空间变化。',
    results:[
      'RoboTwin 2.0 Full：平均成功率 95.01%，比 ImageWAM 高 1.63 个百分点。LIBERO：98.5% 对 98.4%。',
      'LIBERO-Plus：84.5% 对 ImageWAM 的 81.6%；同一套查询去掉几何蒸馏后为 82.3%。',
      '真机：六项双臂任务，每项 15 次。平均任务得分 85.8%，π₀.₅ 为 83.5%，ImageWAM 为 70.2%；两项任务按物体计分，并非全部按整项成功率计算。'
    ],
    videos:[
      {src:foresightMedia+'cup_stacking.mp4',poster:foresightMedia+'cup_stacking.jpg',caption:'Cup stacking · real robot, 2× playback'},
      {src:foresightMedia+'towel_folding.mp4',poster:foresightMedia+'towel_folding.jpg',caption:'Towel folding · real robot'},
      {src:foresightMedia+'egg_transfer.mp4',poster:foresightMedia+'egg_transfer.jpg',caption:'Egg transfer · real robot'}
    ],
    figures:[
      ['teaser.png','Figure 1 · Training and inference overview'],
      ['method_overview.png','Figure 2 · Network architecture and spatial queries'],
      ['zdelta_feature_readout_compact.png','Figure 4a · Teacher and student feature changes'],
      ['zdelta_point_readout_compact.png','Figure 4b · Future-point displacement'],
      ['robotwin_attention_single_column.png','Figure 5 · Attention on RoboTwin'],
      ['real_world_overview.png','Figure 6 · Real-world tasks'],
      ['attention_mask.png','Figure 7 · Training and inference attention masks'],
      ['real_world_progressions.png','Figure 8 · Real-world rollouts']
    ].map(([file,caption])=>({src:'https://arxiv.org/html/2611.30963v1/'+file,caption}))
  }
};

const otherTopics = [
  {name:'Vision-Language-Action', keywords:/\bVLAs?\b|vision.language.action/i},
  {name:'World Models', keywords:/world model|world.action/i},
  {name:'Navigation', keywords:/navigat|PointGoal|VLN/i},
  {name:'Dexterous Manipulation', keywords:/dexterous|in.hand|manipulation/i},
  {name:'Sim-to-Real', keywords:/sim.to.real|real.to.sim|数字孪生/i},
  {name:'Robot Data', keywords:/dataset|data engine|数据引擎/i}
];
