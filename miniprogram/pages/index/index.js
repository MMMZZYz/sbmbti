// pages/index/index.js
const { DIMENSIONS, typeCodeOf } = require('../../data/index.js');
const storage = require('../../utils/storage.js');
const { buildResultViewData } = require('../../utils/result-view.js');
const { drawShareCanvas } = require('../../utils/result-canvas.js');

const app = getApp();

Page({
  data: {
    cells: [],
    doneCount: 0,
    allDone: false,
    canGenerate: false,
    archiveStatus: '等待扫描',
    archiveHint: '完成任意一个维度，就能先生成临时档案。',
    showGuide: false,
    themeClass: 'theme-default',
    themeGroupName: '',
    showCard: false,
    saving: false,
    avatarUrl: '',
    card: null,
  },

  onLoad() {
    try {
      const seen = wx.getStorageSync('cyber_guide_seen');
      if (!seen) this.setData({ showGuide: true });
      const avatarUrl = (app.globalData && app.globalData.avatarUrl)
        || wx.getStorageSync('user_avatar_url') || '';
      if (avatarUrl) this.setData({ avatarUrl });
    } catch (e) {}
  },

  onReady() {
    this._ensureCanvasNode().catch(() => {});
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
        type: d.type,
        hint: d.hint || '',
        done: !!r,
        typeCode: r ? typeCodeOf(d.key, r) : '',
        nickname: r ? (r.label || '') : '',
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
      ? '完成任意一个维度，就能先生成临时档案。'
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
    const cell = this.data.cells.find(c => c.key === key);
    if (!cell) return;
    if (cell.done) {
      wx.navigateTo({ url: `/pages/dimResult/index?dim=${key}` });
    } else {
      const dim = DIMENSIONS.find(d => d.key === key);
      if (dim) wx.navigateTo({ url: dim.page });
    }
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
          if (dim) wx.navigateTo({ url: dim.page });
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
    const card = buildResultViewData(app);
    this.setData({
      card,
      themeClass: card.themeClass || this.data.themeClass,
      showCard: true,
    });
  },

  goFullReport() {
    if (!this.data.canGenerate) {
      wx.showToast({ title: '先完成任意一个维度', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/fullReport/index' });
  },

  closeCard() {
    this.setData({ showCard: false });
  },

  noop() {},

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    if (!avatarUrl) return;
    this.setData({ avatarUrl });
    try {
      wx.setStorageSync('user_avatar_url', avatarUrl);
      if (app.globalData) app.globalData.avatarUrl = avatarUrl;
    } catch (err) {}
  },

  onGenChooseAvatar(e) {
    this.onChooseAvatar(e);
    if (!this.data.showCard) this.goResult();
  },

  onSaveImage() {
    if (this.data.saving) return;
    this.setData({ saving: true });
    wx.showLoading({ title: '生成中...', mask: true });
    const data = Object.assign({}, this.data.card, { avatarUrl: this.data.avatarUrl });
    this._ensurePrivacyAuthorize()
      .then(() => this._ensureCanvasNode())
      .then(canvas => drawShareCanvas(canvas, data))
      .then(tmpPath => this._saveToAlbum(tmpPath))
      .then(() => {
        wx.hideLoading();
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({ title: this._formatSaveError(err), icon: 'none' });
      })
      .then(() => this.setData({ saving: false }));
  },

  _ensureCanvasNode() {
    if (this._canvasNode) return Promise.resolve(this._canvasNode);
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .in(this)
        .select('#share-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const node = res && res[0] && res[0].node;
          if (node) {
            this._canvasNode = node;
            resolve(node);
          } else {
            reject(new Error('画布尚未就绪，请稍后重试'));
          }
        });
    });
  },

  _ensurePrivacyAuthorize() {
    if (!wx.requirePrivacyAuthorize) return Promise.resolve();
    return new Promise((resolve, reject) => {
      wx.requirePrivacyAuthorize({
        success: resolve,
        fail: reject,
      });
    });
  },

  _saveToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      const doSave = () => wx.saveImageToPhotosAlbum({ filePath, success: resolve, fail: reject });
      const openAlbumSetting = () => {
        wx.showModal({
          title: '需要相册权限',
          content: '请允许保存图片到相册，才能把卡片保存到手机。',
          confirmText: '去设置',
          success: (r) => {
            if (!r.confirm) {
              reject(new Error('用户取消保存'));
              return;
            }
            wx.openSetting({
              success: (setting) => {
                if (setting.authSetting && setting.authSetting['scope.writePhotosAlbum']) doSave();
                else reject(new Error('未开启相册权限'));
              },
              fail: reject,
            });
          },
          fail: reject,
        });
      };
      wx.getSetting({
        success: (res) => {
          const albumAuth = res.authSetting['scope.writePhotosAlbum'];
          if (albumAuth === true) {
            doSave();
          } else if (albumAuth === false) {
            openAlbumSetting();
          } else {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: doSave,
              fail: openAlbumSetting,
            });
          }
        },
        fail: doSave,
      });
    });
  },

  _formatSaveError(err) {
    const msg = (err && (err.errMsg || err.message)) || '';
    if (/privacy/i.test(msg) || msg.indexOf('隐私') >= 0) return '请先同意隐私授权';
    if (/auth|authorize/i.test(msg) || msg.indexOf('权限') >= 0 || msg.indexOf('拒绝') >= 0) return '未获得相册权限';
    if (/canvas/i.test(msg) || msg.indexOf('画布') >= 0) return '图片生成失败，请重试';
    return '保存失败，请重试';
  },

  onShareAppMessage() {
    return {
      title: '我的赛博档案出来了，你敢来测吗？',
      path: '/pages/index/index',
    };
  },

  onShareTimeline() {
    return { title: '我的赛博档案出来了，你敢来测吗？' };
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
