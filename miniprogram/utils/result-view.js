const { DIMENSIONS, QUIZ_RESULTS, typeCodeOf } = require('../data/index.js');
const storage = require('./storage.js');
const theme = require('./theme.js');

// 档案"生成日期"（首次生成时写入并固定，之后不变，YYYY.MM）
function genDateOf() {
  const KEY = 'archive_gen_date';
  const now = new Date();
  const fallback = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;
  try {
    let d = wx.getStorageSync(KEY);
    if (!d) {
      d = fallback;
      wx.setStorageSync(KEY, d);
    }
    return d;
  } catch (e) {
    return fallback;
  }
}

function buildCode(all) {
  const mbti = all.mbti && all.mbti.type ? all.mbti.type : '未知型';
  const att = all.attachment && all.attachment.label ? all.attachment.label : '待捕捉';
  const str = all.stress && all.stress.label ? all.stress.label : '待捕捉';
  const zod = all.zodiac && all.zodiac.label ? all.zodiac.label : '?';
  const jung = all.jung && all.jung.label ? all.jung.label : '?';
  return {
    code: `${mbti}-${att}-${str}`,
    nickname: `${zod}·${jung}`,
  };
}

// 各维度各结果的"速写句"：不出现任何标签词，只描述特质本身
const PERSONA_SNIPPETS = {
  jung: {
    power: '骨子里你不肯认输，遇到僵局就想亲手把它打破、推着一切往前走',
    wisdom: '你习惯先看透事情的本质，再不慌不忙地给人指一条路',
    freedom: '你受不了被定义和框住，心里总有一股翻过边界去看看的冲动',
    emotion: '你对别人的情绪格外敏感，你在的地方，会让人莫名觉得安心',
  },
  attachment: {
    secure: '在亲密里你松弛、稳得住，不会因为对方一时的沉默就乱了阵脚',
    anxious: '越在乎一个人，你越容易患得患失，忍不住反复确认他还在不在乎你',
    avoidant: '太靠近的关系会让你本能想退半步，你需要留一块只属于自己的空间',
    chaotic: '你一边渴望靠近一边又怕受伤，常在推开和挽留之间反复',
  },
  stress: {
    fight: '压力越大你反而越清醒，第一反应是迎上去，把问题解决掉',
    flight: '扛不住的时候，你需要先抽身离开，缓过来再回头面对',
    freeze: '压力过载时你会突然卡住，像被人按下了暂停键',
    fawn: '为难时你总先把别人安顿好，自己的情绪却排到最后才轮到',
  },
  social: {
    social: '你的电量来自人群，越热闹越来劲，独处太久反而空落落的',
    lone: '你在独处里悄悄回血，人多待久了就想躲回自己的角落',
    observer: '在人群里你惯于先看后说，别人细微的情绪都瞒不过你',
    connector: '你总爱把人和人牵到一起，是一群关系里穿针引线的那个',
  },
  script: {
    lead: '你习惯站到最前面，带着一群人往同一个方向冲',
    director: '比起站在台前，你更享受在幕后让一切按自己的节奏发生',
    writer: '你脑子里常装着完整的蓝图，能把模糊的念头变成清晰的剧本',
    support: '你习惯在背后默默托住别人，却很少把自己的需要说出口',
  },
  humanDesign: {
    generator: '一件真正对的事能点燃你，让你像有使不完的劲一直投入下去',
    manifestor: '你很少等信号，想到了就先开个头，再带着别人跟上来',
    projector: '你看人看事都很透，在被真正需要和邀请时最闪光',
    reflector: '你像一面敏感的镜子，所处环境的好坏会直接写在你身上',
  },
};
const ELEMENT_SNIPPETS = {
  火象: '天生带着一股藏不住的冲劲和热度',
  土象: '你脚踏实地，慢热，却格外靠得住',
  风象: '你思维轻盈，偏爱新鲜和流动的东西',
  水象: '你情感细腻，习惯用直觉去感知世界',
};

// 多维合成"速写"：挑 2~3 个维度的描述揉成一段话，让人读完觉得"这就是我"
// 不含 MBTI（已是大标题），也不出现任何标签词
function buildPersona(all) {
  const order = ['jung', 'attachment', 'stress', 'social', 'script', 'humanDesign'];
  const parts = [];
  for (let i = 0; i < order.length && parts.length < 3; i++) {
    const k = order[i];
    const r = all[k];
    if (r && PERSONA_SNIPPETS[k] && PERSONA_SNIPPETS[k][r.type]) {
      parts.push(PERSONA_SNIPPETS[k][r.type]);
    }
  }
  if (parts.length < 3 && all.zodiac && ELEMENT_SNIPPETS[all.zodiac.element]) {
    parts.push(ELEMENT_SNIPPETS[all.zodiac.element]);
  }
  if (!parts.length) return (all.mbti && all.mbti.desc) || '';
  return parts.join('；') + '。';
}

function buildArchiveMeta(doneCount) {
  if (doneCount >= DIMENSIONS.length) {
    return { title: '满格档案', subtitle: '8/8 个信号已捕捉，完整版人格卡已解锁。' };
  }
  if (doneCount >= 3) {
    return { title: '成型档案', subtitle: `已捕捉 ${doneCount}/8 个信号，轮廓已经有点像你了。` };
  }
  return { title: '临时档案', subtitle: `已捕捉 ${doneCount}/8 个信号，部分内容还在加载中。` };
}

function buildShortSummary(all) {
  const ready = Object.keys(all).filter(k => all[k] && all[k].label);
  if (!ready.length) {
    return '还没有捕捉到人格信号。\n先完成任意一个维度，就能生成临时档案。';
  }
  const labels = ready.slice(0, 4).map(k => all[k].label);
  return (
    `目前最明显的信号是「${labels[0]}」。\n` +
    `你像「${labels[1] || '待捕捉'}」和「${labels[2] || '后台加载中'}」的混合体。\n` +
    `剩下的部分还没完全上线，先别急着认领全部人设。\n` +
    `继续补全，可能会挖出一个「${labels[3] || '还没暴露'}」版本的你。`
  );
}

function buildLongSummary(all) {
  return DIMENSIONS.map(d => {
    const r = all[d.key];
    if (!r) return `「${d.name}」信号未捕捉，先留一个悬念。`;
    const status = r.calibrated === false ? '初判' : '稳定';
    return `「${d.name}」${status}为「${r.label}」，${r.desc}。`;
  }).join('\n');
}

function buildBars(dimKey, payload) {
  if (!payload || !payload.counts) return [];
  const results = QUIZ_RESULTS[dimKey];
  if (!results) return [];
  const total = Object.values(payload.counts).reduce((a, b) => a + b, 0) || 1;
  return Object.keys(results).map(t => {
    const cnt = payload.counts[t] || 0;
    return {
      type: t,
      name: results[t].name,
      label: results[t].label,
      pct: Math.round(cnt * 100 / total),
      isWinner: t === payload.type,
    };
  }).sort((a, b) => b.pct - a.pct);
}

function buildResultViewData(app) {
  const all = storage.getAll();
  if (app && app._refreshTheme) app._refreshTheme();
  const themeClass = (app.globalData && app.globalData.themeClass) || 'theme-default';
  const themeInfo = (app.globalData && app.globalData.themeInfo) || theme.infoOf('default');
  const mbtiType = (all.mbti && all.mbti.type) || '';
  const doneCount = DIMENSIONS.filter(d => !!all[d.key]).length;
  const archiveMeta = buildArchiveMeta(doneCount);
  const cells = DIMENSIONS.map(d => {
    const r = all[d.key];
    const done = !!r;
    return {
      key: d.key,
      name: d.name,
      emoji: d.emoji || '◇',
      done,
      type: done ? r.type : '',
      typeCode: done ? typeCodeOf(d.key, r) : '',
      label: done ? r.label : '信号未捕捉',
      desc: done ? r.desc : '这个维度还没扫描，档案先留一块空白。',
      statusText: done ? (r.calibrated === false ? '初判' : '稳定') : '未扫描',
      isQuick: done && r.calibrated === false,
      bars: buildBars(d.key, r),
    };
  });
  const miniCells = cells.map(c => ({
    key: c.key,
    name: c.name,
    emoji: c.emoji,
    typeCode: c.typeCode,
    label: c.label,
    done: c.done,
  }));
  const { code, nickname } = buildCode(all);

  // 卡片主视觉：以 MBTI 为主身份；没做 MBTI 时优雅降级
  const heroType = (all.mbti && all.mbti.name) || '';
  const heroTitle = (all.mbti && all.mbti.label) || '';
  let heroQuote = (all.mbti && all.mbti.desc) || '';
  if (!heroQuote) {
    const firstDone = cells.find(c => c.done);
    heroQuote = firstDone ? firstDone.desc : '';
  }
  const factionName = (themeInfo.name && themeInfo.name !== '中性') ? themeInfo.name : '神秘';

  return {
    cells,
    miniCells,
    shortSummary: buildShortSummary(all),
    longSummary: buildLongSummary(all),
    code,
    nickname,
    avatar: theme.avatarOf(mbtiType),
    heroType,
    heroTitle,
    heroQuote,
    persona: buildPersona(all),
    faction: factionName,
    factionIcon: themeInfo.icon || '🌀',
    factionSlogan: themeInfo.slogan || '',
    rarity: theme.rarityOf(heroType),
    genDate: genDateOf(),
    themeClass,
    themeColor: themeInfo.color,
    themeRgb: themeInfo.rgb,
    archiveTitle: archiveMeta.title,
    archiveSubtitle: archiveMeta.subtitle,
    doneCount,
  };
}

module.exports = {
  buildResultViewData,
};
