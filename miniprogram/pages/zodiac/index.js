// pages/zodiac/index.js
const { ZODIAC_LIST, ZODIAC_ELEMENTS } = require('../../data/index.js');
const storage = require('../../utils/storage.js');

const app = getApp();

Page({
  data: { list: [], themeClass: 'theme-default' },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    this.setData({
      themeClass: (app.globalData && app.globalData.themeClass) || 'theme-default',
    });
  },

  onLoad() {
    const list = ZODIAC_LIST.map(z => ({
      name: z.name,
      element: z.element,
      elementName: ZODIAC_ELEMENTS[z.element].name,
    }));
    this.setData({ list });
  },

  onPick(e) {
    const name = e.currentTarget.dataset.name;
    const z = ZODIAC_LIST.find(x => x.name === name);
    const el = ZODIAC_ELEMENTS[z.element];
    storage.set('zodiac', {
      type: z.element,
      name: el.name,
      label: el.label,
      desc: el.desc,
      extra: { zodiac: name },
    });
    wx.showToast({ title: '已记录', icon: 'success', duration: 600 });
    setTimeout(() => wx.navigateBack(), 600);
  },
});
