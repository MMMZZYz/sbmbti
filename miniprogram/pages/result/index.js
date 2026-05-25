// pages/result/index.js
const { DIMENSIONS, QUIZ_RESULTS } = require('../../data/index.js');
const storage = require('../../utils/storage.js');
const theme = require('../../utils/theme.js');

const app = getApp();

function buildCode(all) {
  const mbti = all.mbti && all.mbti.type ? all.mbti.type : '未知型';
  const att = all.attachment && all.attachment.label ? all.attachment.label : '待捕捉';
  const str = all.stress && all.stress.label ? all.stress.label : '待捕捉';
  const zod = all.zodiac && all.zodiac.label ? all.zodiac.label : '?';
  const jung = all.jung && all.jung.label ? all.jung.label : '?';
  return {
    // 三元结构：人格底色 - 关系姿态 - 压力反应
    code: `${mbti}-${att}-${str}`,
    nickname: `${zod}·${jung}`,
  };
}

function buildArchiveMeta(doneCount) {
  if (doneCount >= DIMENSIONS.length) {
    return {
      title: '满格档案',
      subtitle: '8/8 个信号已捕捉，完整版人格卡已解锁。',
    };
  }
  if (doneCount >= 3) {
    return {
      title: '成型档案',
      subtitle: `已捕捉 ${doneCount}/8 个信号，轮廓已经有点像你了。`,
    };
  }
  return {
    title: '临时档案',
    subtitle: `已捕捉 ${doneCount}/8 个信号，部分内容还在加载中。`,
  };
}

// 中等长度总结：4-5 行，适合做分享卡正中（每行约 24-28 字）
function buildShortSummary(all) {
  const ready = Object.keys(all).filter(k => all[k] && all[k].label);
  if (!ready.length) {
    return '还没有捕捉到人格信号。\n先完成任意一个维度，就能生成临时档案。';
  }
  const labels = ready.slice(0, 4).map(k => all[k].label);
  const first = labels[0];
  const second = labels[1] || '待捕捉';
  const third = labels[2] || '后台加载中';
  const fourth = labels[3] || '还没暴露';
  return (
    `目前最明显的信号是「${first}」。\n` +
    `你像「${second}」和「${third}」的混合体。\n` +
    `剩下的部分还没完全上线，先别急着认领全部人设。\n` +
    `继续补全，可能会挖出一个「${fourth}」版本的你。`
  );
}

// 长总结：展开详情用
function buildLongSummary(all) {
  const lines = DIMENSIONS.map(d => {
    const r = all[d.key];
    if (!r) return `「${d.name}」信号未捕捉，先留一个悬念。`;
    const status = r.calibrated === false ? '初判' : '稳定';
    return `「${d.name}」${status}为「${r.label}」，${r.desc}。`;
  });
  return lines.join('\n');
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

Page({
  data: {
    cells: [],
    miniCells: [],
    shortSummary: '',
    longSummary: '',
    code: '',
    nickname: '',
    avatar: '🌀',
    saving: false,
    showDetail: false,
    themeClass: 'theme-default',
    themeColor: '#a0a8c0',
    archiveTitle: '临时档案',
    archiveSubtitle: '',
    doneCount: 0,
  },

  onLoad() {
    const all = storage.getAll();

    // 注入主题
    app._refreshTheme && app._refreshTheme();
    const themeClass = (app.globalData && app.globalData.themeClass) || 'theme-default';
    const themeInfo = (app.globalData && app.globalData.themeInfo) || theme.infoOf('default');
    const mbtiType = (all.mbti && all.mbti.type) || '';
    const avatar = theme.avatarOf(mbtiType);
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
        label: done ? r.label : '信号未捕捉',
        desc: done ? r.desc : '这个维度还没扫描，档案先留一块空白。',
        statusText: done ? (r.calibrated === false ? '初判' : '稳定') : '未扫描',
        isQuick: done && r.calibrated === false,
        bars: buildBars(d.key, r),
      };
    });
    const miniCells = cells.map(c => ({
      key: c.key, name: c.name, emoji: c.emoji, label: c.label, done: c.done,
    }));
    const { code, nickname } = buildCode(all);
    const shortSummary = buildShortSummary(all);
    const longSummary = buildLongSummary(all);

    this.setData({
      cells,
      miniCells,
      shortSummary,
      longSummary,
      code,
      nickname,
      avatar,
      themeClass,
      themeColor: themeInfo.color,
      themeRgb: themeInfo.rgb,
      archiveTitle: archiveMeta.title,
      archiveSubtitle: archiveMeta.subtitle,
      doneCount,
    });
  },

  onReady() {
    const q = wx.createSelectorQuery();
    q.select('#share-canvas').fields({ node: true, size: true }).exec((res) => {
      if (res && res[0] && res[0].node) {
        this._canvasNode = res[0].node;
      }
    });
  },

  toggleDetail() {
    this.setData({ showDetail: !this.data.showDetail });
  },

  onRetake() {
    wx.showModal({
      title: '重新测试',
      content: '清空所有结果并返回主页？',
      success: (res) => {
        if (res.confirm) {
          storage.clearAll();
          wx.reLaunch({ url: '/pages/index/index' });
        }
      },
    });
  },

  async onSaveImage() {
    if (this.data.saving) return;
    this.setData({ saving: true });
    wx.showLoading({ title: '生成中...', mask: true });
    try {
      const tmpPath = await this._drawCanvas();
      await this._saveToAlbum(tmpPath);
      wx.hideLoading();
      wx.showToast({ title: '已保存到相册', icon: 'success' });
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: e && e.errMsg ? e.errMsg : '保存失败', icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },

  // 一屏式截图：750×1334
  _drawCanvas() {
    return new Promise((resolve, reject) => {
      const W = 750;
      const H = 1334;
      const canvas = this._canvasNode;
      if (!canvas) {
        reject(new Error('画布尚未就绪，请稍后重试'));
        return;
      }
      const ctx = canvas.getContext('2d');
      let dpr = 2;
      try {
        if (wx.getWindowInfo) dpr = wx.getWindowInfo().pixelRatio || 2;
        else if (wx.getSystemInfoSync) dpr = wx.getSystemInfoSync().pixelRatio || 2;
      } catch (e) {}
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const themeColor = this.data.themeColor || '#a0a8c0';
      const themeRgb = this.data.themeRgb || '160,168,192';

      // —— 背景 ——
      const grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, '#0a0a1a');
      grd.addColorStop(0.5, '#101028');
      grd.addColorStop(1, '#0a0a1a');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // 顶部主题光晕
      const radial = ctx.createRadialGradient(W / 2, 280, 0, W / 2, 280, 520);
      radial.addColorStop(0, `rgba(${themeRgb}, 0.28)`);
      radial.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, W, 700);

      // —— 顶部标题 ——
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px monospace';
      ctx.shadowColor = `rgba(${themeRgb}, 0.7)`;
      ctx.shadowBlur = 14;
      ctx.fillText('CYBER ARCHIVE', W / 2, 80);
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '20px sans-serif';
      ctx.fillText(`${this.data.archiveTitle} · 已捕捉 ${this.data.doneCount}/8 个信号`, W / 2, 112);

      // —— 角色头像（大 emoji + 主题色光环）——
      const avatarCx = W / 2, avatarCy = 280;
      // 外环光晕（多层模糊）
      ctx.shadowColor = `rgba(${themeRgb}, 0.9)`;
      ctx.shadowBlur = 40;
      ctx.fillStyle = `rgba(${themeRgb}, 0.18)`;
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, 130, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 中环
      ctx.strokeStyle = `rgba(${themeRgb}, 0.6)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, 120, 0, Math.PI * 2);
      ctx.stroke();

      // 内环（虚线效果，用短弧模拟）
      ctx.strokeStyle = `rgba(${themeRgb}, 0.35)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, 145, 0, Math.PI * 2);
      ctx.stroke();

      // 大 emoji
      ctx.font = '140px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(this.data.avatar || '🌀', avatarCx, avatarCy);
      ctx.textBaseline = 'alphabetic';

      // —— 复合代号 ——
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 50px monospace';
      ctx.shadowColor = `rgba(${themeRgb}, 0.6)`;
      ctx.shadowBlur = 20;
      ctx.fillText(this.data.code, W / 2, 480);
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = '24px sans-serif';
      ctx.fillText('— ' + this.data.nickname + ' —', W / 2, 524);

      // —— 8 个 mini cell（2行 × 4列）——
      const cellW = 156, cellH = 130, gap = 18;
      const totalW = 4 * cellW + 3 * gap;
      const startX = (W - totalW) / 2;
      const startY = 580;
      this.data.miniCells.forEach((c, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = startX + col * (cellW + gap);
        const y = startY + row * (cellH + gap);
        ctx.fillStyle = c.done ? `rgba(${themeRgb}, 0.08)` : 'rgba(255,255,255,0.025)';
        this._roundRect(ctx, x, y, cellW, cellH, 14);
        ctx.fill();
        ctx.strokeStyle = c.done ? `rgba(${themeRgb}, 0.45)` : 'rgba(255,255,255,0.16)';
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, x, y, cellW, cellH, 14);
        ctx.stroke();
        // emoji
        ctx.fillStyle = c.done ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.emoji, x + cellW / 2, y + 44);
        // name
        ctx.fillStyle = c.done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.35)';
        ctx.font = '18px sans-serif';
        ctx.fillText(c.name, x + cellW / 2, y + 72);
        // label
        ctx.fillStyle = c.done ? '#ffffff' : 'rgba(255,255,255,0.48)';
        ctx.font = c.done ? 'bold 24px sans-serif' : '20px sans-serif';
        let label = c.label || '—';
        if (label.length > 5) label = label.slice(0, 5);
        ctx.fillText(label, x + cellW / 2, y + 106);
      });

      // —— summary 区 ——
      const sumY = startY + 2 * (cellH + gap) + 30;
      ctx.fillStyle = `rgba(${themeRgb}, 0.06)`;
      this._roundRect(ctx, 50, sumY, W - 100, 260, 16);
      ctx.fill();
      ctx.strokeStyle = `rgba(${themeRgb}, 0.4)`;
      ctx.lineWidth = 1;
      this._roundRect(ctx, 50, sumY, W - 100, 260, 16);
      ctx.stroke();

      ctx.fillStyle = themeColor;
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('— PROFILE SUMMARY —', W / 2, sumY + 38);

      ctx.fillStyle = '#e8e8f5';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'left';
      const sumLines = this.data.shortSummary.split('\n');
      let ly = sumY + 78;
      sumLines.forEach(line => {
        this._wrapText(ctx, line, 80, ly, W - 160, 36, 2);
        ly += 44;
      });

      // —— 底部 watermark ——
      ctx.fillStyle = `rgba(${themeRgb}, 0.7)`;
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CYBER ARCHIVE', W / 2, H - 70);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '18px sans-serif';
      ctx.fillText('微信搜索"赛博档案"测测你自己', W / 2, H - 40);

      wx.canvasToTempFilePath({
        canvas,
        x: 0, y: 0, width: W, height: H,
        destWidth: W * dpr, destHeight: H * dpr,
        fileType: 'png',
        success: (r) => resolve(r.tempFilePath),
        fail: reject,
      });
    });
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },

  _wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
    if (!text) return;
    let line = '';
    let lines = 0;
    for (let i = 0; i < text.length; i++) {
      const test = line + text[i];
      if (ctx.measureText(test).width > maxW && line.length > 0) {
        ctx.fillText(line, x, y);
        line = text[i];
        y += lineH;
        lines++;
        if (lines >= maxLines - 1) {
          const rest = text.slice(i);
          let trimmed = rest;
          while (ctx.measureText(trimmed + '…').width > maxW && trimmed.length > 0) {
            trimmed = trimmed.slice(0, -1);
          }
          ctx.fillText(trimmed + (rest.length > trimmed.length ? '…' : ''), x, y);
          return;
        }
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, y);
  },

  _saveToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      const doSave = () => {
        wx.saveImageToPhotosAlbum({
          filePath,
          success: resolve,
          fail: reject,
        });
      };
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum'] === false) {
            wx.showModal({
              title: '需要相册权限',
              content: '请前往设置允许保存图片到相册',
              confirmText: '去设置',
              success: (r) => {
                if (r.confirm) {
                  wx.openSetting({ success: doSave, fail: reject });
                } else {
                  reject(new Error('用户拒绝授权'));
                }
              },
              fail: reject,
            });
          } else {
            doSave();
          }
        },
        fail: doSave,
      });
    });
  },

  onShareAppMessage() {
    return {
      title: '我的赛博档案出来了，你敢来测吗',
      path: '/pages/index/index',
    };
  },

  onShareTimeline() {
    return { title: '我的赛博档案出来了，你敢来测吗' };
  },
});
