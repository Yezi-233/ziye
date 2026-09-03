// ============================================================
// 站点内容 —— 按简历能力结构组织
// 图片放入 public/images 后填写路径即可替换占位
// ============================================================

export const site = {
  name: '罗叶子',
  latin: 'LUO YEZI',
  role: ['工业工程', '机械设计', '智能诊断'],
  identity: '工业工程 · 大三 · 2027 推免',
  location: '湖南 · 湘潭',
  status: '大三 · 2027 推免',
  email: 'luoyezi@mail.hnust.edu.cn',
  phone: '请替换为真实手机号',
  wechat: '请替换为微信号',
  nav: [
    { label: '个人简介', href: '#about' },
    { label: '个人能力', href: '#abilities' },
    { label: '项目概述', href: '#projects-overview' },
    { label: '实践经历', href: '#practice' },
    { label: '联系方式', href: '#contact' },
  ],
  cta: '联系我',
  socials: [
    { label: 'GitHub', href: '#' },
    { label: '知乎', href: '#' },
    { label: '小红书', href: '#' },
    { label: '邮箱', href: 'mailto:luoyezi@mail.hnust.edu.cn' },
  ],
}

export const about = {
  avatar: '/images/avatar.png',
  introTitle: '罗叶子',
  introAccent: '行胜于言，微以致博',
  paragraphs: [
    '我是罗叶子，湖南科技大学工业工程专业学生。以机械结构为基石、以智能诊断为视角、以扎实落地为目标——我相信好的工程不是空想，而是让复杂问题通过精密设计与反复调试得到清晰解决的实践。',
    '从鲍鱼自动化采摘机的整机机械设计，到基于 YOLOv8 的故障诊断算法开发，从复合材料传动轴的热力学仿真，到多项发明专利与国家级奖项的落地，我习惯在理论设计与物理实现之间搭建桥梁，把抽象的工程构想翻译成可运行、可验证、可优化的实物系统。',
    '理工科训练赋予的系统思维与工程直觉，让我在面对跨学科项目时，既能深入技术细节守住严谨逻辑，也能跳出固有框架寻找创新突破。无论是深夜调试机械臂的卡顿，还是反复优化仿真的边界条件，我始终坚信：行胜于言，尺寸间的毫厘之差，终将沉淀为技术实力的千丈之台。',
  ],
  tags: ['机械设计与落地', '故障信号诊断', '精密控制', 'AI 探索', '创新实干'],
  skills: [
    { label: '工程应用软件', items: ['SolidWorks', 'Abaqus'] },
    { label: '编程仿真软件', items: ['Python', 'Matlab'] },
    { label: '前沿 AI 训练', items: ['Claude Code', 'Cursor'] },
    { label: '论文编辑软件', items: ['Origin', 'LaTeX', 'DeepL'] },
  ],
  stats: [
    { value: 'TOP 6%', label: '专业绩点排名' },
    { value: '502', label: '英语四级' },
    { value: '3', label: '国家级奖项' },
    { value: '7', label: '省级奖项' },
    { value: '2', label: '发明专利', note: '（实审中）' },
    { value: '1', label: '实用新型专利', note: '（办登中）' },
  ],
}

export const awards = {
  title: '获奖情况',
  certificates: [
    { src: '/images/honors/01-volunteer.jpg', title: '优秀志愿者' },
    { src: '/images/honors/02-meicc-national.jpg', title: '国家级三等奖' },
    { src: '/images/honors/04-meicc-central.jpg', title: '华中区域二等奖' },
    { src: '/images/honors/10-gdm-ie.jpg', title: '粤港澳二等奖' },
    { src: '/images/honors/11-frog-province.jpg', title: '省级三等奖' },
    { src: '/images/honors/05-thermo-project.jpg', title: '省级结项' },
    { src: '/images/honors/06-drawing-cup.jpg', title: '校级一等奖' },
    { src: '/images/honors/07-3d-design.jpg', title: '校级二等奖' },
    { src: '/images/honors/03-frog-school.jpg', title: '校级二等奖' },
    { src: '/images/honors/09-abalone-school.jpg', title: '校级三等奖' },
    { src: '/images/honors/08-zhichuang.jpg', title: '优秀个人' },
  ],
}

/**
 * 能力模块（对齐简历 + 图2）
 * layout: 'featured' = 左图右文 / 'gallery' = 卡片网格，点击展开详情
 */
export const abilities = {
  title: '个人能力',
  overviewTitle: '项目概述',
  titleAccent: '多学科交叉与实践应用',
  desc: '不按项目清单罗列，而是按能力维度展开——结构、信号、仿真、编程与学科交叉。',
  jumpTags: [
    { id: 'tag-structure', label: '结构设计能力', href: '#structure' },
    { id: 'tag-signal', label: '信号处理与故障诊断能力', href: '#signal' },
    { id: 'tag-simulation', label: '仿真分析能力', href: '#simulation' },
    { id: 'tag-programming', label: '编程项目能力', href: '#programming' },
    { id: 'tag-frog', label: '仿生与机械结构设计', href: '#frog' },
    {
      id: 'tag-learn',
      label: '自主学习能力',
      detail: '本科工业工程自主学习机械知识、软件并通过竞赛落地',
    },
    { id: 'tag-dust', label: '电场与机械结构设计', href: '#dust' },
    {
      id: 'tag-explore',
      label: '探索创新能力',
      detail: '关注 AI 能力发展等新技术',
    },
    { id: 'tag-nozzle', label: '电磁与机械结构设计', href: '#nozzle' },
    { id: 'tag-paper', label: '论文严谨性与规范性撰写', href: '#signal' },
    {
      id: 'tag-team',
      label: '团队统筹与沟通能力',
      detail: '作为领队参与机械创新设计大赛等多项赛事；作为实验室负责人与导师对接竞赛通知、团队成果、会议事项等',
    },
  ],
  /** 项目概述侧边栏导航（含温差小车「精密控制」） */
  sideNav: [
    { id: 'nav-structure', label: '结构设计能力', href: '#structure' },
    { id: 'nav-signal', label: '信号处理与故障诊断能力', href: '#signal' },
    { id: 'nav-simulation', label: '仿真分析能力', href: '#simulation' },
    { id: 'nav-programming', label: '编程项目能力', href: '#programming' },
    { id: 'nav-frog', label: '仿生与机械结构设计', href: '#frog' },
    { id: 'nav-car', label: '精密控制与机械结构设计', href: '#car' },
    { id: 'nav-dust', label: '电场与机械结构设计', href: '#dust' },
    { id: 'nav-nozzle', label: '电磁与机械结构设计', href: '#nozzle' },
  ],
  sideIntro: '工业工程 · 机械设计 · 智能诊断\n以结构落地、算法编程与交叉实践串联项目能力',
  items: [
    {
      id: 'structure',
      no: '01',
      title: '结构设计能力',
      en: 'STRUCTURAL DESIGN',
      layout: 'featured',
      reverse: false,
      hue: 72,
      project: {
        title: '“智取鲜鲍”——全自动鲍鱼加工取肉机',
        award: '机械创新设计大赛省级三等奖',
        summary: '设计并制作鲍鱼挖取清洁一体机，结合视觉识别与机械臂实现鲍鱼挖取。',
        work: [
          '搭建机械臂、尾部剪切模块、自适应固定模块等核心机械结构',
          '协调视觉电控与机械，实现整体联动运转',
          '完成模型与实物验证，梳理关键部件运动逻辑',
        ],
        tags: ['机械结构', '视觉识别', '人机协同'],
        image: '/images/projects/ability-1.jpg',
        galleryHint: '模型与实物',
        slides: [
          { src: '/images/projects/abalone/slide-1.jpg', label: '鲍鱼机实物图' },
          { src: '/images/projects/abalone/slide-2.jpg', label: '清洁模块' },
          { src: '/images/projects/abalone/slide-3.jpg', label: '取肉去尾模块' },
          { src: '/images/projects/abalone/slide-4.jpg', label: '总体模型图' },
        ],
        video: '/videos/abalone-motion.mp4',
        media: [
          { src: '/images/from-pptx/image14.jpg', label: '结构总览' },
          { src: '/images/from-pptx/image3.jpeg', label: '模型展示' },
          { src: '/images/from-pptx/image4.jpeg', label: '实物细节' },
          { src: '/images/from-pptx/image5.jpeg', label: '关键模块' },
        ],
      },
    },
    {
      id: 'signal',
      no: '02',
      title: '信号处理与故障诊断能力',
      en: 'SIGNAL & DIAGNOSIS',
      layout: 'featured',
      reverse: true,
      hue: 198,
      project: {
        title: '基于多轴格拉姆角场与双分支 YOLOv8-cls 融合的轴承故障诊断方法',
        award: '论文二区在投',
        summary: '针对多工况轴承故障类别进行信号识别与故障分类，把不可见的振动信号转译为可判断的视觉表征。',
        work: [
          '构建 GAF 与 RGB 融合的表征方法，实现信号的图像化转换',
          '设计并实现基于双分支 YOLOv8-cls 的分类网络架构',
          '完成模型全流程训练与性能评估',
        ],
        tags: ['GAF 表征', 'YOLOv8', '故障诊断'],
        image: '/images/projects/ability-2.jpg',
        galleryHint: '论文框架',
        paperIdea: '/images/projects/paper/idea-flowchart.png',
        paperPdf: '/docs/bearing-fault-diagnosis.pdf',
        media: [
          { src: '/images/from-pptx/image20.jpg', label: '方法框架' },
          { src: '/images/from-pptx/image10.jpeg', label: '表征可视化' },
          { src: '/images/from-pptx/image11.jpeg', label: '网络结构' },
          { src: '/images/from-pptx/image12.jpeg', label: '结果分析' },
        ],
      },
    },
    {
      id: 'simulation',
      no: '03',
      title: '仿真分析能力',
      en: 'SIMULATION',
      layout: 'sim-module',
      hue: 145,
      project: {
        title: '超混杂复合材料传动轴一体化制造的设计理论与技术开发',
        award: '节能减排省级二等奖',
        summary:
          '通过设计复合材料铺层方式与导流罩式模具结构，改善了复合材料传动轴热压罐成型过程中的温度均匀性与固化质量。',
        work: [
          '负责前处理阶段的网格质量评估与优化，确保仿真模型的计算稳定性',
          '后处理与数据分析，提取多工况固化度云图并进行量化对比，支撑工艺优化',
          '完成科研成果的可视化展示，使用PPT绘制示意图',
        ],
        tags: ['Abaqus', '热力学仿真', '科研可视化'],
        image: '/images/projects/ability-3.jpg',
        overview: {
          src: '/images/projects/sim/overview.png',
          label: '整体概括图',
        },
        slides: [
          {
            src: '/images/projects/sim/mesh-skewness.png',
            label: '有限元网格质量检查与偏度云图',
            hoverHtml:
              '该图直观反映了网格畸变程度。我负责模型的<strong>前处理</strong>工作，完成了<strong>网格划分</strong>并对局部高偏度区域进行了优化调整，保障了仿真模型的稳定性，为后续<strong>热-化学耦合计算</strong>奠定基础。',
          },
          {
            src: '/images/projects/sim/cure-compare.png',
            label: '多工况下固化度分布对比云图',
            hoverHtml:
              '该图直观展示了导流罩结构的优化效果。我基于研究生学长完成的求解结果进行<strong>后处理分析</strong>，提取了三种模具结构的固化度云图，并通过<strong>关键节点取点</strong>与<strong>标准差计算</strong>进行了量化对比，验证导流罩方案对提升轴件固化均匀性的作用。',
          },
          {
            src: '/images/projects/sim/resin-flow.png',
            label: 'CFRP/铝合金复合结构树脂流动机理',
            hoverHtml:
              '该图是我在理解项目原理的基础上使用<strong>PPT</strong>等基础绘图工具绘制，清晰展示了树脂在压力作用下填充微孔洞并实现<strong>界面强化</strong>的物理过程。为论文插图、组会汇报和专利附图提供了高质量的可视化素材。',
          },
        ],
      },
    },
    {
      id: 'programming',
      no: '04',
      title: '编程项目能力',
      en: 'PROGRAMMING',
      layout: 'featured',
      reverse: true,
      hue: 210,
      project: {
        title: '基于多目标模型与模拟退火算法的机场值机柜台优化',
        award: '中国大学生机械工程创新创意大赛国家级三等奖',
        summary:
          '通过 GERT 流程分析与模拟退火多目标优化算法，针对 J 机场值机系统进行旅客分流和柜台动态配置，实现运营成本降低约 40%、旅客平均等待时间减少约 20% 的目标。',
        work: [
          'Python 代码编程实现算法落地，将数学问题转化为可求解程序',
          '构建多目标优化模型，求解最优柜台动态配置方案',
        ],
        tags: ['Python', '模拟退火', '多目标优化', '值机系统'],
        image: '/images/projects/programming/slide-1.jpg',
        galleryHint: '系统界面',
        sourceUrl: '/code/checkin-optimization.html',
        sourceLabel: '点击此处查看源码',
        slides: [
          {
            src: '/images/projects/programming/slide-1.jpg',
            label: '求解方法选择与模型构建',
          },
          {
            src: '/images/projects/programming/slide-2.jpg',
            label: '总体模型与人工/自助值机假设',
          },
          {
            src: '/images/projects/programming/slide-3.jpg',
            label: '数据验证与算法求解',
          },
        ],
      },
    },
    {
      id: 'cross',
      no: '05',
      title: '学科交叉设计能力',
      en: 'CROSS-DISCIPLINARY',
      layout: 'gallery',
      hue: 250,
      note: '跨学科项目落地精选。点击卡片展开查看更多图文与视频。',
      projects: [
        {
          id: 'frog',
          title: '高性能仿生青蛙',
          field: '仿真与机械设计',
          summary: '运用仿生学原理构建青蛙跳跃多体动力学模型，完成机构设计与结构优化。',
          detail: '负责协助后肢建模与装配与青蛙头部曲面建模',
          tags: ['仿生学', '多体动力学', '实验迭代'],
          image: '/images/projects/cross/frog-cover.png',
          gallery: [
            '/images/projects/cross/frog-detail.png',
          ],
          hue: 310,
        },
        {
          id: 'car',
          title: '温差发电小车',
          field: '精密控制与机械设计',
          summary:
            '考虑地图轨迹、传动比、重心等因素，设计传动比、凸轮等，通过 SolidWorks 建模小车及实物调试，实现纯机械控制小车定轨运动。',
          detail:
            '运用 MATLAB 进行精确建模与运动仿真设计凸轮，综合考量小车重心分布、车轮转向力矩及传动效率，协调团队实践调试轨道。',
          tags: ['MATLAB', '凸轮轨迹', '精密控制'],
          image: '/images/projects/cross/car-cover.png',
          slides: [
            { src: '/images/projects/cross/car-model.png', label: '小车模型图' },
            { src: '/images/projects/cross/car-real.png', label: '小车最终实物图' },
          ],
          video: '/videos/car-motion.mp4',
          hue: 260,
        },
        {
          id: 'dust',
          title: '基于温差发电的杀菌除尘装置',
          field: '电场与机械设计',
          summary: '利用空调管道内外气体温差实现温差发电，超级电容收集电量并完成静电除尘。',
          detail:
            '负责静电除尘模块的传送履带及极板的结构仿真与设计，实现了温差发电与静电除尘的能量闭环。',
          tags: ['温差发电', '静电除尘', '能源装置'],
          image: '/images/projects/cross/thermo-cover.png',
          gallery: [
            '/images/projects/cross/thermo-detail.png',
          ],
          hue: 200,
        },
        {
          id: 'nozzle',
          title: '消防喷头防护罩及安装结构',
          field: '电磁与机械设计',
          summary: '设计消防玻泡防护构件，采用自适应伸缩与磁吸卡扣实现快速安装。',
          detail:
            '受超市防盗扣磁力锁止原理启发，我将相关电磁与机械原理迁移到本装置中并创新改进，最终实现了“通电开锁、断电自锁”的可靠控制。',
          tags: ['防护结构', '磁吸卡扣', '发明专利'],
          image: '/images/projects/cross/fire-cover.png',
          gallery: [
            '/images/projects/cross/fire-detail.png',
          ],
          hue: 40,
        },
      ],
    },
  ],
}

// 实践经历 —— 对应 PPT「社会活动」板块
export const practice = {
  title: '实践经历',
  titleAccent: '统筹协调与动手实践',
  items: [
    {
      id: 'metalwork',
      title: '金工实习',
      category: '专业实习',
      summary: '学习了激光雕刻、热处理、铸造等加工工艺。',
      image: '/images/practice/metalwork.jpg',
    },
    {
      id: 'lab-study',
      title: '实验室学习',
      category: '专业实习',
      summary: '加入「头脑风暴」实验室，学会了粘接、热压、真空压材等复合工艺。',
      image: '/images/practice/lab-study.jpg',
    },
    {
      id: 'lab-lead',
      title: '「头脑风暴」实验室负责人',
      category: '相关任职',
      summary: '负责机械创新设计大赛的团队统筹，包括对接指导老师、组织团队会议及推进备赛进度。',
      image: '/images/practice/lab-lead.jpg',
    },
    {
      id: 'union',
      title: '院学生会副部长',
      category: '相关任职',
      summary: '协助策划并执行学院工程创新训练大赛、科技节等活动，负责全程组织与宣传工作。',
      image: '/images/practice/union.jpg',
    },
    {
      id: 'volunteer',
      title: '优秀志愿者',
      category: '社会实践',
      summary: '参与暑期科学支教、学校秋招等活动组织，志愿时长达 113 小时。',
      image: '/images/practice/volunteer.jpg',
    },
  ],
}

export const contact = {
  image: '/images/contact-bee.png',
  tagline: '2027 推免 · 湖南科技大学 · 工业工程',
  footer: '© 罗叶子 · 湖南科技大学 · 工业工程 · 2027 推免',
}
