// pages/dimResult/index.js
const storage = require('../../utils/storage.js');
const { DIMENSIONS, QUIZ_RESULTS, MBTI, ZODIAC_SIGNS, typeCodeOf } = require('../../data/index.js');

const app = getApp();

function getDetail(dim, type) {
  if (dim === 'mbti') return (MBTI[type] && MBTI[type].detail) || '';
  if (dim === 'zodiac') return (ZODIAC_SIGNS[type] && ZODIAC_SIGNS[type].detail) || '';
  return (QUIZ_RESULTS[dim] && QUIZ_RESULTS[dim][type] && QUIZ_RESULTS[dim][type].detail) || '';
}

Page({
  data: {
    dimEmoji: '',
    dimName: '',
    typeCode: '',
    nickname: '',
    label: '',
    desc: '',
    detail: '',
    statusText: '',
    isQuick: false,
    themeClass: 'theme-default',
    dim: '',
  },

  onLoad(options) {
    const dim = options.dim;
    if (!dim) { wx.navigateBack(); return; }

    app._refreshTheme && app._refreshTheme();
    const themeClass = (app.globalData && app.globalData.themeClass) || 'theme-default';

    const dimInfo = DIMENSIONS.find(d => d.key === dim);
    const result = storage.get(dim);
    if (!dimInfo || !result) { wx.navigateBack(); return; }

    const detail = getDetail(dim, result.type || result.name);
    const isQuick = result.calibrated === false;

    this.setData({
      dim,
      dimEmoji: dimInfo.emoji,
      dimName: dimInfo.name,
      typeCode: typeCodeOf(dim, result),
      nickname: result.label || result.name || '',
      label: result.label || result.name || '',
      desc: result.desc || '',
      detail,
      statusText: isQuick ? '初判结果' : '稳定结果',
      isQuick,
      themeClass,
    });
  },

  onRetake() {
    const dim = this.data.dim;
    const dimInfo = DIMENSIONS.find(d => d.key === dim);
    if (!dimInfo) return;
    wx.showModal({
      title: '重新测试',
      content: `清除「${dimInfo.name}」的结果并重新开始？`,
      success: (res) => {
        if (res.confirm) {
          storage.remove(dim);
          wx.navigateBack();
          setTimeout(() => wx.navigateTo({ url: dimInfo.page }), 350);
        }
      },
    });
  },
});
