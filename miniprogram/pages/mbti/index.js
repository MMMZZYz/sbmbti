// pages/mbti/index.js
const { MBTI } = require('../../data/index.js');
const storage = require('../../utils/storage.js');
const themeUtil = require('../../utils/theme.js');

const app = getApp();

Page({
  data: { list: [], themeClass: 'theme-default', mode: 'choose' },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    this.setData({
      themeClass: (app.globalData && app.globalData.themeClass) || 'theme-default',
    });
  },

  onLoad() {
    const current = storage.get('mbti');
    const list = Object.keys(MBTI).map(code => ({
      code,
      label: MBTI[code].label,
      desc: MBTI[code].desc,
      group: themeUtil.groupOf(code),
      selected: current && current.type === code,
    }));
    this.setData({ list });
  },

  goSelect() {
    this.setData({ mode: 'select' });
  },

  goQuiz() {
    wx.navigateTo({ url: '/pages/mbtiQuiz/index' });
  },

  backToChoose() {
    this.setData({ mode: 'choose' });
  },

  onPick(e) {
    const code = e.currentTarget.dataset.code;
    const t = MBTI[code];
    storage.set('mbti', {
      type: code,
      name: code,
      label: t.label,
      desc: t.desc,
    });
    // 立刻刷新全局主题
    app._refreshTheme && app._refreshTheme();
    wx.showToast({ title: '已记录', icon: 'success', duration: 600 });
    setTimeout(() => wx.navigateBack(), 600);
  },
});

