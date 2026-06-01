// pages/zodiac/index.js
const { ZODIAC_SIGNS, ZODIAC_ELEMENT, signFromMonthDay } = require('../../data/index.js');
const storage = require('../../utils/storage.js');

const app = getApp();

const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1) + '月');
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SIGN_EMOJI = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
};

Page({
  data: {
    themeClass: 'theme-default',
    months: MONTHS,
    days: [],
    monthIndex: 0,
    dayIndex: 0,
    pickerValue: [0, 0],
    sign: '',
    element: '',
    emoji: '✨',
    desc: '',
  },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    this.setData({
      themeClass: (app.globalData && app.globalData.themeClass) || 'theme-default',
    });
  },

  onLoad() {
    // 若已有记录，定位到上次选择
    const saved = storage.get('zodiac');
    let mi = 0, di = 0;
    if (saved && saved.birthMonth) {
      mi = saved.birthMonth - 1;
      di = (saved.birthDay || 1) - 1;
    }
    const days = this._buildDays(mi + 1);
    if (di >= days.length) di = days.length - 1;
    this.setData({ days, monthIndex: mi, dayIndex: di, pickerValue: [mi, di] });
    this._updatePreview(mi + 1, di + 1);
  },

  _buildDays(month) {
    const n = DAYS_IN_MONTH[month - 1];
    return Array.from({ length: n }, (_, i) => (i + 1) + '日');
  },

  onPickerChange(e) {
    let [mi, di] = e.detail.value;
    let days = this.data.days;
    if (mi !== this.data.monthIndex) {
      days = this._buildDays(mi + 1);
      if (di >= days.length) di = days.length - 1;
    }
    this.setData({ monthIndex: mi, dayIndex: di, days, pickerValue: [mi, di] });
    this._updatePreview(mi + 1, di + 1);
  },

  _updatePreview(month, day) {
    const sign = signFromMonthDay(month, day);
    const info = ZODIAC_SIGNS[sign] || {};
    this.setData({
      sign,
      element: ZODIAC_ELEMENT[sign] || '',
      emoji: SIGN_EMOJI[sign] || '✨',
      desc: info.desc || '',
    });
  },

  onConfirm() {
    const month = this.data.monthIndex + 1;
    const day = this.data.dayIndex + 1;
    const sign = signFromMonthDay(month, day);
    const info = ZODIAC_SIGNS[sign];
    if (!info) return;
    storage.set('zodiac', {
      type: sign,
      name: sign,
      label: sign,
      element: ZODIAC_ELEMENT[sign] || '',
      desc: info.desc,
      birthMonth: month,
      birthDay: day,
    });
    wx.showToast({ title: '已记录', icon: 'success', duration: 600 });
    setTimeout(() => wx.navigateBack(), 600);
  },
});
