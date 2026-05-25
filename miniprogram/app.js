// app.js
const storage = require('./utils/storage.js');
const theme = require('./utils/theme.js');

App({
  onLaunch: function () {
    this.globalData = {};
    this._refreshTheme();
  },
  // 由各页面 onShow 调用，确保 MBTI 完成/重测后主题色实时同步
  _refreshTheme() {
    try {
      const mbti = storage.get && storage.get('mbti');
      const type = mbti && mbti.type;
      this.globalData.themeGroup = theme.groupOf(type);
      this.globalData.themeClass = theme.themeClassOf(type);
      this.globalData.themeInfo = theme.infoOf(this.globalData.themeGroup);
    } catch (e) {
      this.globalData.themeGroup = 'default';
      this.globalData.themeClass = 'theme-default';
      this.globalData.themeInfo = theme.infoOf('default');
    }
  },
  onError(err) {
    console.error('[GlobalError]', err);
  },
  onUnhandledRejection({ reason, promise }) {
    console.error('[UnhandledRejection]', reason, promise);
  },
  onPageNotFound(res) {
    console.error('[PageNotFound]', res);
  },
});

