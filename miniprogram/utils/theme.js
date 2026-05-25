// utils/theme.js —— MBTI → 荣格分组主题色 + 角色 emoji
// 4 个分组：NT 紫 / NF 绿 / SJ 蓝 / SP 橙；未做 MBTI 时为中性银

const GROUP = {
  nt: { name: '分析师', color: '#9b6bff', rgb: '155,107,255' },
  nf: { name: '外交官', color: '#5fd9a8', rgb: '95,217,168' },
  sj: { name: '守护者', color: '#5fa8ff', rgb: '95,168,255' },
  sp: { name: '探险家', color: '#ff9b5f', rgb: '255,155,95' },
  default: { name: '中性', color: '#a0a8c0', rgb: '160,168,192' },
};

const TYPE_TO_GROUP = {
  INTJ: 'nt', INTP: 'nt', ENTJ: 'nt', ENTP: 'nt',
  INFJ: 'nf', INFP: 'nf', ENFJ: 'nf', ENFP: 'nf',
  ISTJ: 'sj', ISFJ: 'sj', ESTJ: 'sj', ESFJ: 'sj',
  ISTP: 'sp', ISFP: 'sp', ESTP: 'sp', ESFP: 'sp',
};

// 每个 MBTI 类型的标志性 emoji 角色（动物/物件双维度）
const TYPE_AVATAR = {
  INTJ: '🦉',  // 夜枭：远见、孤行
  INTP: '🧪',  // 试剂：实验、推演
  ENTJ: '♟️',  // 棋子王：统筹、布局
  ENTP: '🎲',  // 骰子：辩论、变量
  INFJ: '🌙',  // 月亮：洞察、不可言说
  INFP: '🌱',  // 嫩芽：理想、内生
  ENFJ: '🔥',  // 火焰：感染、汇聚
  ENFP: '🐬',  // 海豚：跳跃、好奇
  ISTJ: '🗝️',  // 钥匙：可靠、守规
  ISFJ: '🧸',  // 玩偶：温柔、记得
  ESTJ: '⚖️',  // 天平：秩序、执行
  ESFJ: '🍞',  // 面包：温饱、互助
  ISTP: '🔧',  // 扳手：解谜、不语
  ISFP: '🎨',  // 调色板：审美、即兴
  ESTP: '🦁',  // 雄狮：在场、直接
  ESFP: '🎈',  // 气球：欢快、即刻
  '': '🌀',    // 未做 MBTI 时
};

function groupOf(mbtiType) {
  if (!mbtiType) return 'default';
  return TYPE_TO_GROUP[String(mbtiType).toUpperCase()] || 'default';
}

function infoOf(group) {
  return GROUP[group] || GROUP.default;
}

function themeClassOf(mbtiType) {
  return `theme-${groupOf(mbtiType)}`;
}

function avatarOf(mbtiType) {
  if (!mbtiType) return TYPE_AVATAR[''];
  return TYPE_AVATAR[String(mbtiType).toUpperCase()] || TYPE_AVATAR[''];
}

module.exports = {
  GROUP,
  TYPE_TO_GROUP,
  TYPE_AVATAR,
  groupOf,
  infoOf,
  themeClassOf,
  avatarOf,
};

