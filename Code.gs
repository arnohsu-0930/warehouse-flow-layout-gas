/**
 * Floor Plan Flow & Layout Studio (GAS Backend)
 * Serves the unified single-page Web App and provides chunked gzip-compressed
 * cloud preset storage via PropertiesService.
 */

const PRESET_INDEX_KEY = 'FPLS_PRESET_INDEX_V1';
const PRESET_PREFIX = 'FPLS_P_';
const CHUNK_SIZE = 7500; // Safe margin below 9KB per-property limit
const MAX_CHUNKS_PER_PRESET = 40; // ~300KB base64-gzipped per preset safety cap

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

function listCloudPresets() {
  try {
    const list = getPresetIndex_();
    list.sort(function (a, b) {
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
    return { ok: true, presets: list };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

function saveCloudPreset(presetId, name, jsonString) {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { ok: false, error: '設定資料為空，無法儲存。' };
    }
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
        error: '專案容量過大（可能包含高解析度底圖），超過雲端儲存上限。建議改用「匯出 .json」保存，或壓縮底圖後再儲存。'
      };
    }

    const props = PropertiesService.getScriptProperties();
    const indexList = getPresetIndex_();
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

    const nowIso = new Date().toISOString();
    const entry = {
      id: id,
      name: displayName,
      updatedAt: nowIso,
      chunks: totalChunks,
      compressedBytes: b64.length,
      rawBytes: jsonString.length
    };

    const nextIndex = indexList.filter(function (item) { return item.id !== id; });
    nextIndex.unshift(entry);
    savePresetIndex_(nextIndex);

    return { ok: true, preset: entry };
  } catch (err) {
    return { ok: false, error: '雲端儲存失敗：' + (err.message || String(err)) };
  }
}

function loadCloudPreset(presetId) {
  try {
    const id = sanitizeId_(presetId);
    const indexList = getPresetIndex_();
    const entry = indexList.find(function (item) { return item.id === id; });
    if (!entry) {
      return { ok: false, error: '找不到指定的雲端專案。' };
    }

    const props = PropertiesService.getScriptProperties();
    const parts = [];
    for (var i = 0; i < entry.chunks; i++) {
      const chunk = props.getProperty(PRESET_PREFIX + id + '_' + i);
      if (chunk === null) {
        return { ok: false, error: '雲端專案資料分片不完整，請重新儲存。' };
      }
      parts.push(chunk);
    }

    const b64 = parts.join('');
    const bytes = Utilities.base64Decode(b64);
    const gzBlob = Utilities.newBlob(bytes, 'application/x-gzip', 'preset.json.gz');
    const unzipped = Utilities.ungzip(gzBlob);
    const jsonString = unzipped.getDataAsString('UTF-8');

    return { ok: true, preset: entry, data: jsonString };
  } catch (err) {
    return { ok: false, error: '讀取雲端專案失敗：' + (err.message || String(err)) };
  }
}

function deleteCloudPreset(presetId) {
  try {
    const id = sanitizeId_(presetId);
    const props = PropertiesService.getScriptProperties();
    const indexList = getPresetIndex_();
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
    return { ok: false, error: '刪除雲端專案失敗：' + (err.message || String(err)) };
  }
}
