// data/index.js —— 数据层统一入口
const meta = require('./meta.js');
const { QUIZZES, calcQuizResult } = require('./quizzes.js');

module.exports = {
  ...meta,
  QUIZZES,
  calcQuizResult,
};
