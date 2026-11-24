// 经人工核实的专题选读和媒体；不会被计入当日 arXiv 新论文。
const focusTopics = {
  tactile: {name:'触觉感知', en:'Tactile Sensing', description:'机器人如何感知接触、受力和滑移，并用这些信号调整操作。'},
  rl: {name:'机器人强化学习', en:'Robot RL', description:'策略怎样通过交互习得；关注 SuperMimic、模型式强化学习、运动控制与仿真到现实。'},
  agentic: {name:'机器人智能体', en:'Agentic Robots', description:'智能体读取观测、规划并驱动机器人动作，或监控执行并纠错。'}
};
tracks.tactile = focusTopics.tactile.name;
const tactileProject = 'https://akashsharma02.github.io/sparsh-x-ssl/';
const agentProject = 'https://code-as-policies.github.io/';
const tactilePaper = article('2506.14754','Sparsh-X','Tactile Beyond Pixels: Multisensory Touch Representations for Robot Manipulation','tactile','2025-06-17','Carolina Higuera、Akash Sharma、Taosha Fan、Chaithanya Krishna Bodduluri、Byron Boots、Michael Kaess、Mike Lambeta、Tingfan Wu、Zixi Liu、Francois Robert Hogan、Mustafa Mukadam','Meta FAIR、卡内基梅隆大学、华盛顿大学','融合触觉图像、声音、加速度和压力，让机器人在接触中判断是否对齐、受力或打滑。','真机插头插入：90%（每种策略 20 次）','先对四类信号独立编码，再由少量瓶颈 token 交换信息。在约 100 万条未标注接触样本上做师生自蒸馏。下游冻结编码器，其表征可接到插入策略，也可用于真机适配仿真训练的掌内旋转策略。','插入任务用 Allegro 手的三指触觉和腕部相机，在固定插座、随机腕部初始位置下，完整模型 18/20 次成功。论文图 5 报告，相对只用触觉图像的端到端基线提高约 63%。法向力估计平均误差为 35 mN，较只用触觉图像下降约 17%。','结果来自特定指尖传感器、两类操作和有限试次，不能直接推广到其他手或插座。四个传感器并用时，作者报告端到端推理约 20 Hz。','https://arxiv.org/html/2506.14754v1/figures/teaser/sparsh-x-teaser.png','图 1：把四类指尖触觉信号编码成统一表征。',tactileProject);
const agentPaper = article('2209.07753','Code as Policies','Code as Policies: Language Model Programs for Embodied Control','agentic','2022-09-16','Jacky Liang、Wenlong Huang、Fei Xia、Peng Xu、Karol Hausman、Brian Ichter、Pete Florence、Andy Zeng','Robotics at Google','让语言模型为机器人写可执行策略，而不只是输出一句高层计划。','HumanEval pass@1：39.8% vs 36.6%','用少样本指令—程序对提示语言模型，生成解释观测和调用控制原语的程序；遇到未定义函数，再递归生成其实现。程序能表达条件、循环以及几何计算，运行时可读取传感器接口。','论文 v4 展示了真机桌面抓放、画图及移动操作。表 V 的 HumanEval 通用代码任务为分层生成 39.8% pass@1、带提示的平坦生成 36.6%；这不是机器人的任务成功率。','行为依赖预先暴露的感知、动作 API 和提示；代码能执行不代表动作正确或安全，真机演示不能推断开放任务可靠性。',null,'项目页包含桌面操作、画图和移动机器人的实机视频。',agentProject);
issues.push({key:'focus-reading',date:'2026-11-24',batch:null,scope:'专题入门选读，不计为当日首发。',title:'专题选读：触觉表征与语言模型驱动控制',insights:[['tactile','触觉作为操作反馈','Sparsh-X 对比多模态触觉与只用触觉图像的端到端策略。'],['agentic','代码作为机器人策略','Code as Policies 让生成的程序实际使用机器人的感知和控制接口。']],inference:'硬件验证、仿真和代码基准回答的是不同问题，不能用一个数字相互替代。',papers:[tactilePaper,agentPaper]});

const editorial = {
  '2506.14754':{zh:'超越像素：面向机器人操作的多模态触觉表征',keywords:['多模态触觉','Digit 360','接触丰富操作','触觉自监督'],why:'只读触觉图像容易错过初次接触、滑移和压力等线索；作者希望用同一触觉表征支持不同操作任务。'},
  '2209.07753':{zh:'代码即策略：具身控制中的语言模型程序',version:'v4',revision:'2023-05-25',keywords:['语言模型程序','分层代码生成','桌面操作','控制原语'],why:'自然语言计划本身难以表达持续反馈、精确几何或动作参数。作者希望用可执行程序把开放指令接到机器人控制。',video:'https://code-as-policies.github.io/videos/tasks.mp4'},
  '2610.28480':{zh:'使用同一个可微世界模型扩展人形全身控制',keywords:['全身控制','可微世界模型','动作跟踪','仿真到现实','SuperMimic'],why:'大动作库的跟踪策略往往需要为不同动作重复学习相同动力学。作者希望在动作之间复用一个模型，降低训练成本。',video:'https://supermimic.github.io/media/real/film-1080.mp4'},
  '2611.20452':{keywords:['SuperMimic','并行训练','动作跟踪','地形移动']},
  '2611.27648':{keywords:['SuperMimic','可微世界模型','梯度截断','动作跟踪']},
  '2610.32941':{keywords:['执行监控','失败恢复','VLA','回退重试']}
};

const otherTopics = [
  {name:'视觉语言动作模型', keywords:/\bVLA\b|vision.language.action/i},
  {name:'世界模型', keywords:/world model|world.action/i},
  {name:'导航', keywords:/navigat|PointGoal|VLN/i},
  {name:'灵巧操作', keywords:/dexterous|manipulation/i},
  {name:'仿真到现实', keywords:/sim.to.real|数字孪生|真实机器人示范/i},
  {name:'机器人数据', keywords:/dataset|数据引擎|数据基础/i}
];
