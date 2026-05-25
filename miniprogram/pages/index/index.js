// pages/index/index.js
const { DIMENSIONS } = require('../../data/index.js');
const storage = require('../../utils/storage.js');

const app = getApp();

Page({
  data: {
    cells: [],
    doneCount: 0,
    allDone: false,
    canGenerate: false,
    archiveStatus: '等待扫描',
    archiveHint: '完成任意一个维度，就能先偷看临时档案。',
    showGuide: false,
    themeClass: 'theme-default',
    themeGroupName: '',
  },

  onLoad() {
    try {
      const seen = wx.getStorageSync('cyber_guide_seen');
      if (!seen) this.setData({ showGuide: true });
    } catch (e) {}
  },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    this.setData({
      themeClass: (app.globalData && app.globalData.themeClass) || 'theme-default',
      themeGroupName: (app.globalData && app.globalData.themeInfo && app.globalData.themeInfo.name) || '',
    });
    this.refresh();
  },

  refresh() {
    const all = storage.getAll();
    const cells = DIMENSIONS.map(d => {
      const r = all[d.key];
      return {
        key: d.key,
        name: d.name,
        emoji: d.emoji || '◇',
        page: d.page,
        done: !!r,
        label: r ? r.label : '',
        desc: r ? r.desc : '',
        statusText: r ? (r.calibrated === false ? '初判' : '稳定') : '未扫描',
        isQuick: r && r.calibrated === false,
      };
    });
    const doneCount = cells.filter(c => c.done).length;
    const archiveStatus = doneCount === 0
      ? '等待扫描'
      : doneCount < cells.length
        ? '临时档案'
        : '满格档案';
    const archiveHint = doneCount === 0
      ? '完成任意一个维度，就能先偷看临时档案。'
      : doneCount < cells.length
        ? `已捕捉 ${doneCount}/8 个信号，档案会有缺失，但已经可以生成。`
        : '八个信号全部捕捉完成，可以生成完整档案。';
    this.setData({
      cells,
      doneCount,
      allDone: doneCount === cells.length,
      canGenerate: doneCount > 0,
      archiveStatus,
      archiveHint,
    });
  },

  onCellTap(e) {
    const key = e.currentTarget.dataset.key;
    const dim = DIMENSIONS.find(d => d.key === key);
    if (!dim) return;
    wx.navigateTo({ url: dim.page });
  },

  onCellLongPress(e) {
    const key = e.currentTarget.dataset.key;
    const cell = this.data.cells.find(c => c.key === key);
    if (!cell || !cell.done) return;
    wx.showActionSheet({
      itemList: ['重新测试此维度', '清除此维度结果'],
      success: (res) => {
        if (res.tapIndex === 0) {
          const dim = DIMENSIONS.find(d => d.key === key);
          wx.navigateTo({ url: dim.page });
        } else if (res.tapIndex === 1) {
          storage.remove(key);
          this.refresh();
          if (key === 'mbti') {
            app._refreshTheme && app._refreshTheme();
            this.setData({
              themeClass: app.globalData.themeClass,
              themeGroupName: app.globalData.themeInfo.name,
            });
          }
        }
      },
    });
  },

  goResult() {
    if (!this.data.canGenerate) {
      wx.showToast({ title: '先完成任意一个维度', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/result/index' });
  },

  onReset() {
    wx.showModal({
      title: '重置全部',
      content: '确认清空所有已完成的测试结果？',
      success: (res) => {
        if (res.confirm) {
          storage.clearAll();
          this.refresh();
          app._refreshTheme && app._refreshTheme();
          this.setData({
            themeClass: app.globalData.themeClass,
            themeGroupName: app.globalData.themeInfo.name,
          });
        }
      },
    });
  },

  dismissGuide() {
    this.setData({ showGuide: false });
    try { wx.setStorageSync('cyber_guide_seen', 1); } catch (e) {}
  },
});
