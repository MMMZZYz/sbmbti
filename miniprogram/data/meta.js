// 八个维度配置（顺序即卡片格子顺序）
const DIMENSIONS = [
  { key: 'mbti',       name: 'MBTI',       emoji: '🧠', type: 'select', page: '/pages/mbti/index' },
  { key: 'attachment', name: '依恋类型',   emoji: '💞', type: 'quiz',   page: '/quiz-pkg/pages/quiz/index?dim=attachment' },
  { key: 'stress',     name: '压力应对',   emoji: '⚡', type: 'quiz',   page: '/quiz-pkg/pages/quiz/index?dim=stress' },
  { key: 'social',     name: '社交动物',   emoji: '🦊', type: 'quiz',   page: '/quiz-pkg/pages/quiz/index?dim=social' },
  { key: 'script',     name: '人生剧本',   emoji: '🎭', type: 'quiz',   page: '/quiz-pkg/pages/quiz/index?dim=script' },
  { key: 'zodiac',     name: '星座元素',   emoji: '✨', type: 'select', page: '/pages/zodiac/index' },
  { key: 'humanDesign',name: '人类图',     emoji: '🌌', type: 'quiz',   page: '/quiz-pkg/pages/quiz/index?dim=humanDesign' },
  { key: 'jung',       name: '荣格原型',   emoji: '🪞', type: 'quiz',   page: '/quiz-pkg/pages/quiz/index?dim=jung' },
];

// MBTI 16 类型
const MBTI = {
  INTJ: { label: '建筑师',   desc: '世界是我的棋盘，我只是还没落子' },
  INTP: { label: '逻辑学家', desc: '脑子里有一千个问题，嘴上一个都没说' },
  ENTJ: { label: '指挥官',   desc: '没有计划的人生不值得过' },
  ENTP: { label: '辩论家',   desc: '我不是要吵架，我只是觉得你说得不够准确' },
  INFJ: { label: '提倡者',   desc: '看穿了很多人，但只字不提' },
  INFP: { label: '调停者',   desc: '活在自己故事里的人，外面的世界只是背景' },
  ENFJ: { label: '主人公',   desc: '我不需要聚光灯，但聚光灯总找到我' },
  ENFP: { label: '竞选者',   desc: '热情是我的燃料，好奇心是我的方向盘' },
  ISTJ: { label: '检查者',   desc: '说到做到，这不是优点，这是底线' },
  ISFJ: { label: '守护者',   desc: '记住了所有人的生日，却忘了自己需要什么' },
  ESTJ: { label: '总裁',     desc: '规则存在是有原因的，不服来辩' },
  ESFJ: { label: '执政官',   desc: '房间里有人不开心，我第一个察觉' },
  ISTP: { label: '鉴赏家',   desc: '少说话，多解决问题' },
  ISFP: { label: '探险家',   desc: '不需要舞台，但每一步都是表演' },
  ESTP: { label: '企业家',   desc: '先行动，边走边想，错了再说' },
  ESFP: { label: '表演者',   desc: '生活就是要好玩，不然要它干嘛' },
};

// 星座 → 元素
const ZODIAC_LIST = [
  { name: '白羊座', element: 'fire'  },
  { name: '金牛座', element: 'earth' },
  { name: '双子座', element: 'air'   },
  { name: '巨蟹座', element: 'water' },
  { name: '狮子座', element: 'fire'  },
  { name: '处女座', element: 'earth' },
  { name: '天秤座', element: 'air'   },
  { name: '天蝎座', element: 'water' },
  { name: '射手座', element: 'fire'  },
  { name: '摩羯座', element: 'earth' },
  { name: '水瓶座', element: 'air'   },
  { name: '双鱼座', element: 'water' },
];

const ZODIAC_ELEMENTS = {
  fire:  { name: '火象', label: '引火者', desc: '我到哪里，哪里就先燃起来' },
  earth: { name: '土象', label: '锚',     desc: '别人在飘的时候，我已经扎根了' },
  air:   { name: '风象', label: '信号',   desc: '我在每个地方都留下了一点什么' },
  water: { name: '水象', label: '深海',   desc: '表面平静，底下什么都有' },
};

// 答题维度结果
const QUIZ_RESULTS = {
  attachment: {
    secure:   { name: '安全型', label: '安全岛',  desc: '我不怕你离开，因为我也不会消失' },
    anxious:  { name: '焦虑型', label: '追光者',  desc: '越在乎越害怕，越害怕越靠近' },
    avoidant: { name: '回避型', label: '刺猬',    desc: '不是不想靠近，是靠近了会扎到你' },
    chaotic:  { name: '混乱型', label: '漩涡',    desc: '想要你，又怕要了你，所以原地转圈' },
  },
  stress: {
    fight:  { name: '战斗型', label: '冲锋者',   desc: '压力越大，我越清醒' },
    flight: { name: '逃跑型', label: '候鸟',     desc: '不是逃避，是战略性撤退' },
    freeze: { name: '僵住型', label: '断电体',   desc: '系统过载，正在重启，请稍候' },
    fawn:   { name: '讨好型', label: '缓冲垫',   desc: '先把所有人安顿好，再崩溃也不迟' },
  },
  social: {
    social:     { name: '群居动物', label: '电池',     desc: '人群是我的充电器，离开就没电' },
    lone:       { name: '独行侠',   label: '信号塔',   desc: '一个人的时候才能接收到自己的信号' },
    observer:   { name: '观察者',   label: '摄像头',   desc: '什么都看见了，但不会告诉你' },
    connector:  { name: '串联者',   label: '路由器',   desc: '我不是主角，但没有我你们连不上' },
  },
  script: {
    lead:      { name: '主角剧本', label: '主角光环', desc: '我的人生里，我就是那个被命运选中的人' },
    director:  { name: '导演剧本', label: '幕后黑手', desc: '不在台前，但每一幕都是我设计的' },
    writer:    { name: '编剧剧本', label: '造梦师',   desc: '我写好了剧本，就等别人来演' },
    support:   { name: '配角剧本', label: '隐形翼',   desc: '我成就了很多人，但没人知道我在场' },
  },
  humanDesign: {
    generator:   { name: '生产者', label: '发动机', desc: '给我一个回应，我能跑很久' },
    manifestor:  { name: '显示者', label: '开荒者', desc: '我不等信号，我就是信号' },
    projector:   { name: '投射者', label: '透镜',   desc: '我看见你身上连你自己都没发现的东西' },
    reflector:   { name: '反映者', label: '月亮',   desc: '我映照周围的一切，所以我需要好的环境' },
  },
  jung: {
    power:    { name: '力量型', label: '破局者', desc: '我来了，我看见了，我改变了' },
    wisdom:   { name: '智慧型', label: '灯塔',   desc: '我不给答案，我帮你看清问题' },
    freedom:  { name: '自由型', label: '越界者', desc: '我不属于任何地方，所以我哪里都能去' },
    emotion:  { name: '情感型', label: '港湾',   desc: '我在这里，所以你不孤单' },
  },
};

module.exports = {
  DIMENSIONS,
  MBTI,
  ZODIAC_LIST,
  ZODIAC_ELEMENTS,
  QUIZ_RESULTS,
};
