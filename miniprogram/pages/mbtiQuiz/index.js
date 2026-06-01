// pages/mbtiQuiz/index.js
const { MBTI, MBTI_QUIZ, scoreMbti } = require('../../data/index.js');
const storage = require('../../utils/storage.js');

const app = getApp();

Page({
  data: {
    themeClass: 'theme-default',
    idx: 0,
    total: MBTI_QUIZ.length,
    q: '',
    dots: [0, 1, 2, 3, 4],
    answers: [],
    selectedValue: null,
    previousEcho: '',
    choosing: false,
    finishing: false,
  },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    this.setData({
      themeClass: (app.globalData && app.globalData.themeClass) || 'theme-default',
    });
  },

  onLoad() {
    this.setData({ q: MBTI_QUIZ[0].q });
  },

  onChoose(e) {
    if (this.data.choosing || this.data.finishing) return;
    const v = Number(e.currentTarget.dataset.v);
    const answers = this.data.answers.slice();
    answers[this.data.idx] = v;
    const currentQuestion = MBTI_QUIZ[this.data.idx].q;
    const answerText = this._answerText(v);
    const next = this.data.idx + 1;
    if (next >= this.data.total) {
      this.setData({ answers, selectedValue: v, previousEcho: `刚才选择：${answerText}`, choosing: true, finishing: true });
      setTimeout(() => this._finish(answers), 260);
    } else {
      this.setData({ answers, selectedValue: v, previousEcho: `已记录：${answerText}`, choosing: true });
      setTimeout(() => {
        if (this.data.idx !== next - 1) return;
        this.setData({
          answers,
          idx: next,
          q: MBTI_QUIZ[next].q,
          selectedValue: answers[next] == null ? null : answers[next],
          previousEcho: `上一题：${currentQuestion} · ${answerText}`,
          choosing: false,
        });
      }, 220);
    }
  },

  onBack() {
    if (this.data.choosing || this.data.finishing) return;
    if (this.data.idx === 0) {
      wx.navigateBack();
      return;
    }
    const idx = this.data.idx - 1;
    this.setData({
      idx,
      q: MBTI_QUIZ[idx].q,
      selectedValue: this.data.answers[idx] == null ? null : this.data.answers[idx],
      previousEcho: idx > 0 ? `上一题已记录：${this._answerText(this.data.answers[idx - 1])}` : '',
    });
  },

  _answerText(v) {
    return ['强烈不同意', '有点不同意', '中立 / 不确定', '有点同意', '强烈同意'][v] || '未选择';
  },

  _finish(answers) {
    const type = scoreMbti(answers);
    const t = MBTI[type] || {};
    storage.set('mbti', {
      type,
      name: type,
      label: t.label || '',
      desc: t.desc || '',
      calibrated: true,
    });
    app._refreshTheme && app._refreshTheme();
    wx.showToast({ title: '你是 ' + type, icon: 'none', duration: 800 });
    setTimeout(() => {
      wx.reLaunch({ url: '/pages/index/index' });
    }, 800);
  },
});
