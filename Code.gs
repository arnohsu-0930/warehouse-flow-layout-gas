/**
 * Floor Plan Flow & Layout Studio (GAS Backend) — v2
 * Serves the unified single-page Web App and provides chunked gzip-compressed
 * cloud temporary storage via PropertiesService with fixed 14-day auto-cleanup.
 */

const PRESET_INDEX_KEY = 'FPLS_PRESET_INDEX_V1';
const PRESET_PREFIX = 'FPLS_P_';
const CHUNK_SIZE = 7500; // Safe margin below 9KB per-property limit
const MAX_CHUNKS_PER_PRESET = 40; // ~300KB base64-gzipped per preset safety cap
const CLOUD_TTL_DAYS = 14; // Fixed 14-day auto-delete retention (non-configurable)
const CLOUD_TTL_MS = CLOUD_TTL_DAYS * 24 * 60 * 60 * 1000;

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('平面動線與空間配置工作室 | Floor Plan Flow & Layout Studio')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function getPresetIndex_() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(PRESET_INDEX_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function savePresetIndex_(indexList) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty(PRESET_INDEX_KEY, JSON.stringify(indexList));
}

function sanitizeId_(rawId) {
  const cleaned = String(rawId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 32);
  return cleaned || ('p_' + Date.now().toString(36));
}

function computeExpiryMs_(entry) {
  if (entry && entry.expiresAt) {
    const t = Date.parse(entry.expiresAt);
    if (!isNaN(t)) return t;
  }
  const baseStr = (entry && (entry.updatedAt || entry.createdAt)) || '';
  const baseMs = Date.parse(baseStr);
  if (!isNaN(baseMs)) return baseMs + CLOUD_TTL_MS;
  return Date.now() + CLOUD_TTL_MS;
}

/**
 * Automatically purges any cloud temp projects older than fixed 14 days.
 * Deletes both data chunks and index entries.
 */
function cleanupExpiredPresets_() {
  const props = PropertiesService.getScriptProperties();
  const indexList = getPresetIndex_();
  const nowMs = Date.now();
  const kept = [];
  let purgedCount = 0;

  for (var idx = 0; idx < indexList.length; idx++) {
    var entry = indexList[idx];
    if (!entry || !entry.id) {
      purgedCount++;
      continue;
    }
    var expMs = computeExpiryMs_(entry);
    if (nowMs >= expMs) {
      var chunks = entry.chunks || 0;
      for (var c = 0; c < chunks; c++) {
        props.deleteProperty(PRESET_PREFIX + entry.id + '_' + c);
      }
      purgedCount++;
    } else {
      if (!entry.expiresAt) {
        entry.expiresAt = new Date(expMs).toISOString();
      }
      entry.ttlDays = CLOUD_TTL_DAYS;
      kept.push(entry);
    }
  }

  if (purgedCount > 0) {
    savePresetIndex_(kept);
  }

  return {
    presets: kept,
    purgedCount: purgedCount,
    ttlDays: CLOUD_TTL_DAYS
  };
}

/**
 * Callable cleanup routine (can also be bound to a daily GAS time-driven trigger).
 */
function cleanupExpiredCloudPresets() {
  try {
    const res = cleanupExpiredPresets_();
    return {
      ok: true,
      purgedCount: res.purgedCount,
      remainingCount: res.presets.length,
      ttlDays: CLOUD_TTL_DAYS
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

function listCloudPresets() {
  try {
    const cleaned = cleanupExpiredPresets_();
    const list = cleaned.presets.slice();
    list.sort(function (a, b) {
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
    return {
      ok: true,
      presets: list,
      purgedCount: cleaned.purgedCount,
      ttlDays: CLOUD_TTL_DAYS
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

function saveCloudPreset(presetId, name, jsonString) {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { ok: false, error: '專案資料為空，無法暫存。' };
    }

    // Purge expired items first to keep PropertiesService quota clean
    const cleaned = cleanupExpiredPresets_();
    const id = sanitizeId_(presetId);
    const displayName = String(name || '未命名專案').trim().slice(0, 80) || '未命名專案';

    // Compress with gzip + base64 encode for safe PropertiesService storage
    const blob = Utilities.newBlob(jsonString, 'application/json', 'preset.json');
    const gzBlob = Utilities.gzip(blob);
    const b64 = Utilities.base64Encode(gzBlob.getBytes());

    const totalChunks = Math.ceil(b64.length / CHUNK_SIZE);
    if (totalChunks > MAX_CHUNKS_PER_PRESET) {
      return {
        ok: false,
        error: '專案容量過大（可能包含高解析度底圖），超過雲端暫存上限。建議改用「儲存專案」下載保存，或壓縮底圖後再暫存。'
      };
    }

    const props = PropertiesService.getScriptProperties();
    const indexList = cleaned.presets;
    const existing = indexList.find(function (item) { return item.id === id; });
    const oldChunks = existing && existing.chunks ? existing.chunks : 0;

    // Write new chunks in batch
    const batch = {};
    for (var i = 0; i < totalChunks; i++) {
      batch[PRESET_PREFIX + id + '_' + i] = b64.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    }
    props.setProperties(batch, false);

    // Clean up stale trailing chunks if new payload is smaller
    for (var j = totalChunks; j < oldChunks; j++) {
      props.deleteProperty(PRESET_PREFIX + id + '_' + j);
    }

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    const expiresIso = new Date(nowMs + CLOUD_TTL_MS).toISOString();
    const entry = {
      id: id,
      name: displayName,
      createdAt: (existing && existing.createdAt) || nowIso,
      updatedAt: nowIso,
      expiresAt: expiresIso,
      ttlDays: CLOUD_TTL_DAYS,
      chunks: totalChunks,
      compressedBytes: b64.length,
      rawBytes: jsonString.length
    };

    const nextIndex = indexList.filter(function (item) { return item.id !== id; });
    nextIndex.unshift(entry);
    savePresetIndex_(nextIndex);

    return { ok: true, preset: entry, ttlDays: CLOUD_TTL_DAYS };
  } catch (err) {
    return { ok: false, error: '雲端暫存失敗：' + (err.message || String(err)) };
  }
}

function loadCloudPreset(presetId) {
  try {
    const cleaned = cleanupExpiredPresets_();
    const id = sanitizeId_(presetId);
    const entry = cleaned.presets.find(function (item) { return item.id === id; });
    if (!entry) {
      return { ok: false, error: '找不到指定的雲端暫存專案（可能已超過 14 天自動刪除）。' };
    }

    const props = PropertiesService.getScriptProperties();
    const parts = [];
    for (var i = 0; i < entry.chunks; i++) {
      const chunk = props.getProperty(PRESET_PREFIX + id + '_' + i);
      if (chunk === null) {
        return { ok: false, error: '雲端暫存資料分片不完整，請重新儲存。' };
      }
      parts.push(chunk);
    }

    const b64 = parts.join('');
    const bytes = Utilities.base64Decode(b64);
    const gzBlob = Utilities.newBlob(bytes, 'application/x-gzip', 'preset.json.gz');
    const unzipped = Utilities.ungzip(gzBlob);
    const jsonString = unzipped.getDataAsString('UTF-8');

    return { ok: true, preset: entry, data: jsonString, ttlDays: CLOUD_TTL_DAYS };
  } catch (err) {
    return { ok: false, error: '讀取雲端暫存失敗：' + (err.message || String(err)) };
  }
}

function deleteCloudPreset(presetId) {
  try {
    const cleaned = cleanupExpiredPresets_();
    const id = sanitizeId_(presetId);
    const props = PropertiesService.getScriptProperties();
    const indexList = cleaned.presets;
    const entry = indexList.find(function (item) { return item.id === id; });

    if (entry && entry.chunks) {
      for (var i = 0; i < entry.chunks; i++) {
        props.deleteProperty(PRESET_PREFIX + id + '_' + i);
      }
    }

    const nextIndex = indexList.filter(function (item) { return item.id !== id; });
    savePresetIndex_(nextIndex);
    return { ok: true, id: id };
  } catch (err) {
    return { ok: false, error: '刪除雲端暫存失敗：' + (err.message || String(err)) };
  }
}
