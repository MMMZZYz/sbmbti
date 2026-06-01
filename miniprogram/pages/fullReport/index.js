// pages/fullReport/index.js
const { buildResultViewData } = require('../../utils/result-view.js');

const app = getApp();

Page({
  data: {
    themeClass: 'theme-default',
    report: null,
  },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    const report = buildResultViewData(app);
    if (!report.doneCount) {
      wx.showToast({ title: '先完成任意一个维度', icon: 'none' });
      wx.navigateBack();
      return;
    }
    this.setData({
      themeClass: report.themeClass || 'theme-default',
      report,
    });
  },

  goHome() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: '我的赛博档案完整解读',
      path: '/pages/index/index',
    };
  },
});
