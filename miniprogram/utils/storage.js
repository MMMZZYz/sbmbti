// utils/storage.js —— 带版本号的本地存储
const KEY = 'cyber_archive_v2';
const VERSION = 2;

function readRaw() {
  try {
    const v = wx.getStorageSync(KEY);
    if (!v || typeof v !== 'object') return null;
    if (v.version !== VERSION) return null; // 版本不一致视为脏数据
    return v;
  } catch (e) {
    return null;
  }
}

function writeRaw(obj) {
  try { wx.setStorageSync(KEY, obj); } catch (e) {}
}

// === 结果 ===
function getAll() {
  const r = readRaw();
  return (r && r.results) ? r.results : {};
}
function get(dimKey) {
  return getAll()[dimKey] || null;
}
function set(dimKey, payload) {
  const raw = readRaw() || { version: VERSION, results: {}, drafts: {} };
  raw.results[dimKey] = payload;
  if (raw.drafts) delete raw.drafts[dimKey];
  writeRaw(raw);
}
function remove(dimKey) {
  const raw = readRaw();
  if (!raw) return;
  delete raw.results[dimKey];
  writeRaw(raw);
}
function clearAll() {
  try { wx.removeStorageSync(KEY); } catch (e) {}
}

// === 答题草稿（断点续答） ===
function getDraft(dimKey) {
  const r = readRaw();
  if (!r || !r.drafts) return null;
  return r.drafts[dimKey] || null;
}
function setDraft(dimKey, draft) {
  const raw = readRaw() || { version: VERSION, results: {}, drafts: {} };
  if (!raw.drafts) raw.drafts = {};
  raw.drafts[dimKey] = draft;
  writeRaw(raw);
}
function clearDraft(dimKey) {
  const raw = readRaw();
  if (!raw || !raw.drafts) return;
  delete raw.drafts[dimKey];
  writeRaw(raw);
}

module.exports = {
  getAll, get, set, remove, clearAll,
  getDraft, setDraft, clearDraft,
};
