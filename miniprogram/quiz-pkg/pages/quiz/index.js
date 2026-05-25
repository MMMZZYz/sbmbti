// quiz-pkg/pages/quiz/index.js
const { DIMENSIONS, QUIZ_RESULTS, QUIZZES, calcQuizResult } = require('../../../data/index.js');
const storage = require('../../../utils/storage.js');

const app = getApp();
const QUICK_SCAN_COUNT = 4;

Page({
  data: {
    dim: '',
    dimName: '',
    questions: [],
    idx: 0,
    total: 0,
    answers: [],
    current: null,
    selectedIdx: -1,
    transitioning: false,
    slideClass: '',
    showCheckpoint: false,
    previewResult: null,
    acceptedResult: false,
    letters: ['A', 'B', 'C', 'D'],
    themeClass: 'theme-default',
  },

  onShow() {
    app._refreshTheme && app._refreshTheme();
    this.setData({
      themeClass: (app.globalData && app.globalData.themeClass) || 'theme-default',
    });
  },

  onLoad(options) {
    const dim = options.dim;
    const dimMeta = DIMENSIONS.find(d => d.key === dim);
    const questions = QUIZZES[dim];
    if (!dimMeta || !questions) {
      wx.showToast({ title: '维度错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    this.setData({
      dim,
      dimName: dimMeta.name,
      questions,
      total: questions.length,
    });
    this._tryRestoreDraft();
  },

  _tryRestoreDraft() {
    const { dim, questions } = this.data;
    const draft = storage.getDraft(dim);
    if (draft && draft.answers && draft.answers.length > 0 && draft.answers.length < questions.length) {
      wx.showModal({
        title: '检测到未完成的测试',
        content: `上次答到第 ${draft.answers.length + 1} 题，是否继续？`,
        confirmText: '继续',
        cancelText: '重新开始',
        success: (res) => {
          if (res.confirm) {
            const idx = draft.answers.length;
            this.setData({
              idx,
              answers: draft.answers,
              current: questions[idx],
            });
          } else {
            storage.clearDraft(dim);
            this._startFresh();
          }
        },
      });
    } else {
      this._startFresh();
    }
  },

  _startFresh() {
    const { questions } = this.data;
    this.setData({
      idx: 0,
      answers: [],
      current: questions[0],
      showCheckpoint: false,
      previewResult: null,
      acceptedResult: false,
    });
  },

  _buildResult(answers, calibrated) {
    const { dim } = this.data;
    const { winner, counts } = calcQuizResult(answers);
    const r = QUIZ_RESULTS[dim][winner];
    return {
      type: winner,
      name: r.name,
      label: r.label,
      desc: r.desc,
      counts,
      calibrated: !!calibrated,
      answered: answers.length,
      answeredAt: Date.now(),
    };
  },

  _saveResult(answers, calibrated) {
    storage.set(this.data.dim, this._buildResult(answers, calibrated));
    storage.clearDraft(this.data.dim);
    this.setData({ acceptedResult: true });
  },

  _showQuickCheckpoint(answers) {
    const result = this._buildResult(answers, false);
    storage.setDraft(this.data.dim, { answers, idx: answers.length, ts: Date.now() });
    this.setData({
      answers,
      showCheckpoint: true,
      previewResult: result,
      transitioning: false,
      slideClass: '',
      selectedIdx: -1,
    });
  },

  onAcceptQuick() {
    const { answers } = this.data;
    if (!answers.length) return;
    this._saveResult(answers, false);
    wx.showToast({ title: '已收进档案', icon: 'success', duration: 700 });
    setTimeout(() => wx.navigateBack(), 700);
  },

  onContinueCalibration() {
    const { answers, questions } = this.data;
    const nextIdx = answers.length;
    this.setData({
      idx: nextIdx,
      current: questions[nextIdx],
      showCheckpoint: false,
      previewResult: null,
      selectedIdx: -1,
      slideClass: 'slide-in',
      transitioning: true,
    });
    setTimeout(() => {
      this.setData({ slideClass: '', transitioning: false });
    }, 260);
  },

  onAnswer(e) {
    if (this.data.transitioning || this.data.showCheckpoint) return;
    const i = e.currentTarget.dataset.i;
    const { questions, idx, answers, current, dim } = this.data;
    const newAnswers = answers.concat([current.options[i].type]);

    // 高亮选中
    this.setData({ selectedIdx: i, transitioning: true });

    setTimeout(() => {
      // 划出动画
      this.setData({ slideClass: 'slide-out' });

      setTimeout(() => {
        if (newAnswers.length === QUICK_SCAN_COUNT && questions.length > QUICK_SCAN_COUNT) {
          this._showQuickCheckpoint(newAnswers);
          return;
        }

        if (idx + 1 >= questions.length) {
          // 完成测试
          this._saveResult(newAnswers, true);
          wx.showToast({ title: '校准完成', icon: 'success', duration: 700 });
          setTimeout(() => wx.navigateBack(), 700);
          return;
        }

        const nextIdx = idx + 1;
        // 保存草稿
        storage.setDraft(dim, { answers: newAnswers, idx: nextIdx, ts: Date.now() });

        // 划入下一题
        this.setData({
          idx: nextIdx,
          answers: newAnswers,
          current: questions[nextIdx],
          selectedIdx: -1,
          slideClass: 'slide-in',
        });
        setTimeout(() => {
          this.setData({ slideClass: '', transitioning: false });
        }, 260);
      }, 200);
    }, 200);
  },

  onBack() {
    const { idx, answers, questions, transitioning, showCheckpoint } = this.data;
    if (showCheckpoint) {
      const newAnswers = answers.slice(0, -1);
      const newIdx = Math.max(newAnswers.length, 0);
      storage.setDraft(this.data.dim, { answers: newAnswers, idx: newIdx, ts: Date.now() });
      this.setData({
        idx: newIdx,
        answers: newAnswers,
        current: questions[newIdx],
        showCheckpoint: false,
        previewResult: null,
        selectedIdx: -1,
      });
      return;
    }
    if (idx === 0 || transitioning) return;
    const newIdx = idx - 1;
    const newAnswers = answers.slice(0, -1);
    storage.setDraft(this.data.dim, { answers: newAnswers, idx: newIdx, ts: Date.now() });
    this.setData({
      idx: newIdx,
      answers: newAnswers,
      current: questions[newIdx],
      selectedIdx: -1,
    });
  },

  onUnload() {
    // 离开页面时若答题未完成，自动保存当前进度
    const { dim, answers, idx, questions, acceptedResult } = this.data;
    if (!acceptedResult && answers.length > 0 && answers.length < questions.length) {
      storage.setDraft(dim, { answers, idx, ts: Date.now() });
    }
  },
});
