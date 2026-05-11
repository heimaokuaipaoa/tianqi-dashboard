function loadSavedPrices() {
  try {
    return JSON.parse(window.localStorage?.getItem("temperature-dashboard-prices") || "{}");
  } catch {
    return {};
  }
}

function loadSavedHoldings() {
  try {
    return JSON.parse(window.localStorage?.getItem("temperature-dashboard-holdings") || "{}");
  } catch {
    return {};
  }
}

const state = {
  data: null,
  accuracy: window.__TEMP_BACKTEST_ACCURACY__ || { summary: [] },
  prices: loadSavedPrices(),
  holdings: loadSavedHoldings(),
  polyPrices: window.__POLY_PRICES__ || { markets: [] },
};

const cityNames = {
  HK: "Hong Kong",
  ankara: "Ankara",
  ankarar: "Ankara",
  helsink: "Helsinki",
  lucknow: "Lucknow",
  madrid: "Madrid",
  milan: "Milan",
  moscow: "Moscow",
  munich: "Munich",
  telaviv: "Tel Aviv",
  warsaw: "Warsaw",
  london: "London",
  paris: "Paris",
  miami: "Miami",
  shanghai: "Shanghai",
  toyko: "Tokyo",
  amsterdam: "Amsterdam",
  chicago: "Chicago",
  dallas: "Dallas",
  NYC: "NYC",
  San: "San Francisco",
};

const timeOrder = [
  "昨6点到7点",
  "昨10到11点",
  "昨14到15点",
  "昨17点到18点",
  "昨22点到23点",
  "6点到7点",
  "10点到11点",
  "14点到15点",
  "17点到18点",
  "22点到23点",
];

const $ = (selector) => document.querySelector(selector);

function cityKey(field) {
  return String(field || "").replace(/预计$|棰勮$/u, "");
}

function displayCity(field) {
  const key = cityKey(field);
  return cityNames[key] || key;
}

function savePrices() {
  try {
    window.localStorage?.setItem("temperature-dashboard-prices", JSON.stringify(state.prices));
  } catch {
    // Some embedded file:// browsers disable localStorage. The dashboard still works without saved manual prices.
  }
}

function saveHoldings() {
  try {
    window.localStorage?.setItem("temperature-dashboard-holdings", JSON.stringify(state.holdings));
  } catch {
    // Hold markers are optional; the dashboard still works if localStorage is unavailable.
  }
}

function priceKey(item, bucket) {
  return `${item.date}|${item.timeNode}|${item.expectedField}|${bucket}`;
}

function holdingKey(item, bucket) {
  return `${item.date}|${item.timeNode}|${item.expectedField}|${bucket}`;
}

function parseHoldingKey(key) {
  const [date, timeNode, expectedField, ...bucketParts] = String(key || "").split("|");
  return {
    date,
    timeNode,
    expectedField,
    bucket: bucketParts.join("|"),
  };
}

function polyPriceKey(item, bucket) {
  return `${item.date}|${item.expectedField}|${bucket}`;
}

function buildPolyPriceMap() {
  const map = new Map();
  for (const market of state.polyPrices.markets || []) {
    for (const [bucket, price] of Object.entries(market.prices || {})) {
      map.set(`${market.date}|${market.expectedField}|${bucket}`, {
        price,
        url: market.url,
      });
    }
  }
  return map;
}

function marketPrice(item, bucket) {
  const manual = state.prices[priceKey(item, bucket)];
  if (manual !== undefined && manual !== "") return { price: Number(manual), source: "manual" };
  const poly = state.polyPriceMap?.get(polyPriceKey(item, bucket));
  if (poly) return { price: Number(poly.price), source: "poly", url: poly.url };
  return { price: null, source: "" };
}

function pct(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function trendText(item) {
  if (item.timeNode === "昨10点到11点") return "未用：基准窗口";
  const delta = item.baselineDelta == null ? "" : String(item.baselineDelta);
  if (item.modelLevel === "city-time-baseline-band" || item.modelLevel === "city-baseline-band") {
    return [delta, item.baselineBand ? `【${item.baselineBand}】` : ""].filter(Boolean).join(" ");
  }
  if (item.baselineBandEnabled) return "未用：样本不足<6";
  if (item.baselineBand) {
    const threshold = item.baselineBandMinSpread == null ? "" : `<${item.baselineBandMinSpread}`;
    return `未用：差异不足${threshold}`;
  }
  return "未用";
}

function momentumText(item) {
  const labels = {
    double_up: "双++",
    double_down: "双--",
    offset: "抵消",
    flat: "双平",
    first_flat: "最早平",
    recent_flat: "近期平",
    insufficient: "不足",
  };
  const signal = labels[item.momentumSignal] || item.momentumSignal || "不足";
  const regimeLabels = {
    high: "高修正派",
    low: "低修正派",
    unclear: "派别不明显",
    none: "派别不足",
  };
  const regime = regimeLabels[item.correctionRegime] || "派别不足";
  const rate = item.correctionRegimeHighRate == null ? "" : ` 高修正${Math.round(item.correctionRegimeHighRate * 100)}%`;
  const n = item.correctionRegimeN ? ` n=${item.correctionRegimeN}` : "";
  const threshold = item.momentumThreshold == null ? "" : ` 阈值${item.momentumThreshold}`;
  return `${signal} ${regime}${rate}${n}${threshold}`;
}

function modelLevelText(item) {
  if (item.timeNode === "昨10点到11点") return "未用分档：昨10是基准窗口";
  const labels = {
    "city-time-baseline-band": "启用分档：同窗",
    "city-baseline-band": "启用分档：同城",
    "city-time": "未用分档",
    none: "样本不足",
  };
  const level = labels[item.modelLevel] || item.modelLevel || "样本不足";
  if (!item.baselineBand) return level;
  if (item.modelLevel === "city-time-baseline-band" || item.modelLevel === "city-baseline-band") {
    const delta = item.baselineDelta == null ? "" : ` · Δ昨10 ${item.baselineDelta}`;
    return `${level} · ${item.baselineBand}${delta}`;
  }
  if (item.baselineBandEnabled) return `未用分档：样本不足<6 · ${item.baselineBand}`;
  const spread = item.baselineBandSpread == null ? "" : ` · 差异${item.baselineBandSpread}`;
  const threshold = item.baselineBandMinSpread == null ? "" : `<${item.baselineBandMinSpread}`;
  return `未用分档：差异不足${threshold}${spread}`;
}

function modelBadgeText(item) {
  if (item.modelLevel === "city-time-baseline-band") return "分档同窗";
  if (item.modelLevel === "city-baseline-band") return "分档同城";
  if (item.modelLevel === "city-time") return "未分档";
  return "样本不足";
}

function currentPreferredTime(times) {
  const now = new Date();
  const hour = now.getHours();
  const candidates = hour < 8 ? ["6点到7点", "昨22点到23点"] :
    hour < 12 ? ["10点到11点", "6点到7点"] :
    hour < 16 ? ["14点到15点", "10点到11点"] :
    hour < 20 ? ["17点到18点", "14点到15点"] :
    ["22点到23点", "17点到18点"];
  return candidates.find((time) => times.includes(time)) || times[times.length - 1] || "";
}

function currentPreferredDate(items, requestedTime) {
  const normalTime = requestedTime && !requestedTime.startsWith("昨") ? requestedTime : currentPreferredTime(uniqueSorted(items.map((item) => item.timeNode), timeOrder));
  const normalRows = items
    .filter((item) => item.timeNode === normalTime)
    .map((item) => item.date);
  const dates = uniqueSorted(normalRows).filter((date) => pairedSelection(date, normalTime).length > 1);
  if (!dates.length) return uniqueSorted(normalRows).at(-1) || uniqueSorted(items.map((item) => item.date)).at(-1) || "";
  return dates.length ? dates[dates.length - 1] : uniqueSorted(items.map((item) => item.date)).at(-1) || "";
}

function latestPairedDefault(items) {
  const normalTimes = timeOrder.filter((time) => !time.startsWith("昨"));
  const candidates = [];
  for (const item of items) {
    if (item.timeNode.startsWith("昨")) continue;
    if (pairedSelection(item.date, item.timeNode).length < 2) continue;
    candidates.push({ date: item.date, timeNode: item.timeNode });
  }
  return candidates.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare) return dateCompare;
    return normalTimes.indexOf(b.timeNode) - normalTimes.indexOf(a.timeNode);
  })[0] || null;
}

function uniqueSorted(values, order = null) {
  const items = [...new Set(values.filter(Boolean))];
  if (!order) return items.sort();
  return items.sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function addDays(dateText, days) {
  const match = String(dateText || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function comparableTimeCore(timeNode) {
  return String(timeNode || "")
    .replace(/^昨/, "")
    .replace(/点/g, "");
}

function pairedSelection(date, time) {
  if (!date || !time) return [];
  const targetCore = comparableTimeCore(time);
  const allItems = state.data?.probabilityCandidates || [];
  const isYesterdayWindow = time.startsWith("昨");
  const pairedDate = isYesterdayWindow ? addDays(date, -1) : addDays(date, 1);
  const pairedTimes = uniqueSorted(
    allItems
      .filter((item) => item.date === pairedDate)
      .map((item) => item.timeNode),
    timeOrder,
  );
  const pairedTime = pairedTimes.find((candidate) => {
    const candidateIsYesterday = candidate.startsWith("昨");
    return candidateIsYesterday !== isYesterdayWindow && comparableTimeCore(candidate) === targetCore;
  });
  const left = isYesterdayWindow && pairedTime
    ? { date: pairedDate, timeNode: pairedTime, side: "left" }
    : { date, timeNode: time, side: "left" };
  const right = isYesterdayWindow
    ? { date, timeNode: time, side: "right" }
    : { date: pairedDate, timeNode: pairedTime, side: "right" };
  return right.date && right.timeNode ? [left, right] : [left];
}

async function loadData() {
  if (window.__TEMP_DASHBOARD_DATA__) return window.__TEMP_DASHBOARD_DATA__;
  const response = await fetch("./feishu-analysis-output.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function setupFilters(items) {
  const dateFilter = $("#dateFilter");
  const timeFilter = $("#timeFilter");
  const dates = uniqueSorted(items.map((item) => item.date));
  const times = uniqueSorted(items.map((item) => item.timeNode), timeOrder);
  const params = new URLSearchParams(window.location.search);
  const requestedDate = params.get("date");
  const requestedTime = params.get("time");

  dateFilter.innerHTML = dates.map((date) => `<option value="${date}">${date}</option>`).join("");
  timeFilter.innerHTML = times.map((time) => `<option value="${time}">${time}</option>`).join("");

  timeFilter.value = times.includes(requestedTime) ? requestedTime : currentPreferredTime(times);
  const pairedDefault = latestPairedDefault(items);
  timeFilter.value = times.includes(requestedTime) ? requestedTime : pairedDefault?.timeNode || timeFilter.value;
  dateFilter.value = dates.includes(requestedDate) ? requestedDate : pairedDefault?.date || currentPreferredDate(items, timeFilter.value);

  dateFilter.addEventListener("change", render);
  timeFilter.addEventListener("change", render);
  $("#edgeFilter").addEventListener("input", render);
}

function edgeClass(edge) {
  if (edge >= 20) return "edge-strong";
  if (edge >= 8) return "edge-watch";
  return "edge-weak";
}

function modelLevelWeight(level) {
  const weights = {
    "city-time-baseline-band": 1,
    "city-baseline-band": 0.92,
    "city-time-trend": 1,
    "city-near-time-trend": 0.9,
    "city-time": 0.86,
    "city-trend": 0.74,
    city: 0.5,
    "time-trend": 0.35,
    time: 0.25,
    global: 0.15,
  };
  return weights[level] ?? 0.3;
}

function confidenceScore(item) {
  const exact = item.exactSampleSize || 0;
  const model = item.modelSampleSize || 0;
  const exactScore = Math.min(exact, 20) / 20;
  const modelScore = Math.min(model, 40) / 40;
  const levelScore = modelLevelWeight(item.modelLevel);
  const weakPenalty = exact === 0 ? -0.28 : exact < 3 ? -0.18 : exact < 8 ? -0.08 : 0;
  return Math.max(0, exactScore * 0.7 + modelScore * 0.1 + levelScore * 0.2 + weakPenalty);
}

function bestSavedEdge(item) {
  let best = null;
  (item.probabilities || []).forEach((probability) => {
    const { price } = marketPrice(item, probability.bucket);
    if (price == null) return;
    const edge = Math.round(probability.probability * 100) - price;
    if (best == null || edge > best) best = edge;
  });
  return best;
}

function cardScore(item) {
  return item.modelSampleSize || 0;
}

function topRawProbability(item) {
  return item.probabilities?.[0]?.probability || item.probabilities?.[0]?.rawProbability || 0;
}

function isYesterdayTime(timeNode) {
  const text = String(timeNode || "");
  return text.startsWith("昨") || text.startsWith("鏄?");
}

function tradeCostStep(timeNode) {
  const hour = timeStartHour(timeNode);
  if (hour == null) return null;
  const yesterday = isYesterdayTime(timeNode);
  if (yesterday) return ({ 10: 0, 14: 1, 17: 2, 22: 3 })[hour] ?? null;
  return ({ 6: 4, 10: 5, 14: 6, 17: 7, 22: 8 })[hour] ?? null;
}

function tradeScore(item) {
  const step = tradeCostStep(item.timeNode);
  const top = topProbabilities(item, 2);
  if (step == null || !top.length) return null;
  const top1Probability = Math.round((top[0].probability || 0) * 100);
  const top2Probability = Math.round(((top[0]?.probability || 0) + (top[1]?.probability || 0)) * 100);
  const top1Cost = 40 + step * 2;
  const top2Cost = 65 + step * 2;
  const top1Edge = top1Probability - top1Cost;
  const top2Edge = top.length >= 2 ? top2Probability - top2Cost : -999;
  const bestSide = top1Edge >= top2Edge ? "Top1" : "Top2";
  return {
    item,
    step,
    sample: item.modelSampleSize || 0,
    top1Bucket: top[0]?.bucket || "",
    top2Buckets: top.map((probability) => probability.bucket).join(" / "),
    top1Probability,
    top2Probability,
    top1Cost,
    top2Cost,
    top1Edge,
    top2Edge,
    bestSide,
    bestProbability: bestSide === "Top1" ? top1Probability : top2Probability,
    bestCost: bestSide === "Top1" ? top1Cost : top2Cost,
    bestEdge: Math.max(top1Edge, top2Edge),
    bestBuckets: bestSide === "Top1" ? top[0]?.bucket || "" : top.map((probability) => probability.bucket).join(" / "),
  };
}

function signedNumber(value) {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value > 0 ? "+" : ""}${value}`;
}

function accuracyKey(expectedField, timeNode) {
  return `${cityKey(expectedField)}|${timeNode}`;
}

function buildAccuracyMap() {
  const map = new Map();
  for (const row of state.accuracy?.summary || []) {
    map.set(accuracyKey(row.expectedField, row.timeNode), row);
  }
  return map;
}

function historicalAccuracy(item) {
  if (!state.accuracyMap) state.accuracyMap = buildAccuracyMap();
  return state.accuracyMap.get(accuracyKey(item.expectedField, item.timeNode)) || null;
}

function historicalScore(item) {
  const history = historicalAccuracy(item);
  if (!history) return null;
  return {
    item,
    history,
    n: history.n || 0,
    sample: item.modelSampleSize || 0,
    top1Accuracy: history.top1Accuracy || 0,
    top2Accuracy: history.top2Accuracy || 0,
    top1Hits: history.top1Hits || 0,
    top2Hits: history.top2Hits || 0,
  };
}

function bestHistoricalForCityDate(item) {
  const key = cityKey(item.expectedField);
  return (state.data?.probabilityCandidates || [])
    .filter((candidate) => candidate.date === item.date && cityKey(candidate.expectedField) === key)
    .map(historicalScore)
    .filter(Boolean)
    .filter((score) => (score.n || 0) >= 6 && (score.sample || 0) >= 6 && (score.top2Accuracy || 0) >= 75)
    .sort((a, b) =>
      b.top2Accuracy - a.top2Accuracy ||
      b.top1Accuracy - a.top1Accuracy ||
      (b.n || 0) - (a.n || 0)
    )[0] || null;
}

function windowAvailabilityForDate(date) {
  const expected = timeOrder.filter((time) => !isYesterdayTime(time) && tradeCostStep(time) != null);
  const available = new Set(
    (state.data?.probabilityCandidates || [])
      .filter((item) => item.date === date && tradeCostStep(item.timeNode) != null)
      .map((item) => item.timeNode),
  );
  const appeared = expected.filter((time) => available.has(time));
  const missing = expected.filter((time) => !available.has(time));
  return {
    appeared,
    missing,
    appearedText: appeared.length ? appeared.join("、") : "无",
    missingText: missing.length ? missing.join("、") : "无",
  };
}

function allTradeScoresForDates(dates) {
  const dateSet = new Set(dates.filter(Boolean));
  return (state.data?.probabilityCandidates || [])
    .filter((item) => dateSet.has(item.date))
    .map(tradeScore)
    .filter(Boolean);
}

function bestTradeForCityDate(item) {
  const key = cityKey(item.expectedField);
  return (state.data?.probabilityCandidates || [])
    .filter((candidate) => candidate.date === item.date && cityKey(candidate.expectedField) === key)
    .map(tradeScore)
    .filter(Boolean)
    .filter((score) => (score.sample || 0) >= 6)
    .sort((a, b) =>
      b.bestEdge - a.bestEdge ||
      (b.sample || 0) - (a.sample || 0)
    )[0] || null;
}

function compareBySampleThenRaw(a, b) {
  return (
    (b.modelSampleSize || 0) - (a.modelSampleSize || 0) ||
    topRawProbability(b) - topRawProbability(a) ||
    displayCity(a.expectedField).localeCompare(displayCity(b.expectedField))
  );
}

function filteredItems() {
  const date = $("#dateFilter").value;
  const time = $("#timeFilter").value;
  const selections = pairedSelection(date, time);
  return (state.data.probabilityCandidates || [])
    .filter((item) => selections.some((selection) => item.date === selection.date && item.timeNode === selection.timeNode))
    .map((item) => ({
      ...item,
      viewSide: selections.find((selection) => item.date === selection.date && item.timeNode === selection.timeNode)?.side || "left",
    }))
    .sort(compareBySampleThenRaw);
}

function groupByCity(items) {
  const groups = new Map();
  for (const item of items) {
    const key = cityKey(item.expectedField);
    if (!groups.has(key)) groups.set(key, { key, city: displayCity(item.expectedField), items: [] });
    groups.get(key).items.push(item);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => {
        if (a.viewSide !== b.viewSide) return a.viewSide === "left" ? -1 : 1;
        return a.date.localeCompare(b.date) || timeOrder.indexOf(a.timeNode) - timeOrder.indexOf(b.timeNode);
      }),
      sampleScore: Math.max(...group.items.map((item) => item.modelSampleSize || 0)),
      probabilityScore: Math.max(...group.items.map(topRawProbability)),
    }))
    .sort((a, b) =>
      b.sampleScore - a.sampleScore ||
      b.probabilityScore - a.probabilityScore ||
      a.city.localeCompare(b.city)
    );
}

function renderSummary(items) {
  const summary = $("#summaryGrid");
  const best = items[0];
  const selections = pairedSelection($("#dateFilter").value, $("#timeFilter").value);
  const strongCount = items.filter((item) => (item.probabilities?.[0]?.probability || 0) >= 0.5).length;
  const avgTop = items.length
    ? items.reduce((sum, item) => sum + (item.probabilities?.[0]?.probability || 0), 0) / items.length
    : 0;
  const html = [
    ["窗口", selections.map((selection) => `${selection.date} ${selection.timeNode}`).join(" + ")],
    ["城市组", `${groupByCity(items).length} 组`],
    ["候选卡", `${items.length} 张`],
    ["平均最高概率", pct(avgTop)],
    ["最强信号", best ? `${displayCity(best.expectedField)} ${best.probabilities[0]?.bucket || ""}` : "-"],
    ["高概率城市", `${strongCount} 个`],
  ]
    .map(([label, value]) => `<div class="summary"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  summary.innerHTML = html;
}

function renderBucket(item, probability) {
  const topRank = topProbabilities(item, 2).findIndex((top) => String(top.bucket) === String(probability.bucket));
  const topClass = topRank === 0 ? "bucket-top bucket-top-1" : topRank === 1 ? "bucket-top bucket-top-2" : "";
  const topLabel = topRank === 0 ? `<span class="top-badge">TOP1</span>` : topRank === 1 ? `<span class="top-badge">TOP2</span>` : "";
  const key = priceKey(item, probability.bucket);
  const holdKey = holdingKey(item, probability.bucket);
  const isHeld = Boolean(state.holdings[holdKey]);
  const modelPercent = Math.round(probability.probability * 100);
  const rawPercent = Math.round((probability.rawProbability || 0) * 100);
  const savedPrice = state.prices[key] ?? "";
  const market = marketPrice(item, probability.bucket);
  const priceNumber = market.price;
  const edge = priceNumber == null ? null : modelPercent - priceNumber;
  const cls = edge == null ? "" : edgeClass(edge);
  const displayPrice = savedPrice === "" && market.source === "poly" ? market.price : savedPrice;
  const priceTitle = market.source === "poly" ? "Poly 自动价格，可手动覆盖" : "手动价格";
  const edgeText = edge == null
    ? `raw ${rawPercent}%`
    : `${market.source === "poly" ? "Poly" : "手动"} ${priceNumber}% · 优势 ${edge > 0 ? "+" : ""}${edge}% · raw ${rawPercent}%`;

  return `
    <div class="bucket ${cls} ${topClass}">
      <span class="bucket-name">${probability.bucket}${topLabel}</span>
      <div class="bar" title="raw ${rawPercent}%">
        <div class="bar-fill" style="width: ${Math.max(modelPercent, 2)}%"></div>
      </div>
      <span class="prob">${modelPercent}%</span>
      <input class="price" data-price-key="${key}" type="number" min="0" max="100" step="1" value="${displayPrice}" placeholder="价格" title="${priceTitle}" />
      <button class="hold-toggle ${isHeld ? "is-held" : ""}" data-hold-key="${holdKey}" type="button">${isHeld ? "已持仓" : "持仓"}</button>
      <div class="edge">${edgeText}</div>
    </div>
  `;
}

function bucketSortValue(probability) {
  if (probability.bucketValue != null) return probability.bucketValue;
  const match = String(probability.bucket || "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function bucketSpan(probability) {
  const numbers = String(probability.bucket || "").match(/-?\d+(?:\.\d+)?/g) || [];
  if (!numbers.length) {
    const value = bucketSortValue(probability);
    return Number.isFinite(value) ? { min: value, max: value } : null;
  }
  const values = numbers.map(Number).filter(Number.isFinite);
  if (!values.length) return null;
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function displayProbabilities(item) {
  return [...(item.probabilities || [])].sort((a, b) => bucketSortValue(a) - bucketSortValue(b));
}

function topProbabilities(item, limit = 2) {
  return [...(item.probabilities || [])]
    .sort((a, b) =>
      (b.probability || 0) - (a.probability || 0) ||
      bucketSortValue(a) - bucketSortValue(b)
    )
    .slice(0, limit);
}

function topTwoGap(item) {
  const top = topProbabilities(item, 2);
  if (top.length < 2) return 0;
  const first = bucketSpan(top[0]);
  const second = bucketSpan(top[1]);
  if (!first || !second) return 0;
  if (first.max < second.min) return second.min - first.max;
  if (second.max < first.min) return first.min - second.max;
  return 0;
}

function hasSplitTopTwo(item) {
  return topTwoGap(item) > 1;
}

function timeStartHour(timeNode) {
  const match = String(timeNode || "").match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function previousWindowFor(item) {
  const hour = timeStartHour(item.timeNode);
  const prefix = String(item.timeNode || "").startsWith("昨") ? "昨" : "";
  if (prefix === "昨" && hour === 10) return null;
  const previousHour = { 10: 6, 14: 10, 17: 14, 22: 17 }[hour];
  if (previousHour == null) return null;
  const endHour = previousHour === 22 ? 23 : previousHour + 1;
  return {
    date: item.date,
    timeNode: `${prefix}${previousHour}点到${endHour}点`,
  };
}

function nextWindowFor(item) {
  const hour = timeStartHour(item.timeNode);
  const prefix = String(item.timeNode || "").startsWith("\u6628") ? "\u6628" : "";
  const nextHour = { 6: 10, 10: 14, 14: 17, 17: 22 }[hour];
  if (nextHour == null) return null;
  const endHour = nextHour === 22 ? 23 : nextHour + 1;
  return {
    date: item.date,
    timeNode: `${prefix}${nextHour}\u70b9\u5230${endHour}\u70b9`,
  };
}

function topSetSignature(item) {
  return topProbabilities(item, 2)
    .map((probability) => String(probability.bucket))
    .sort()
    .join("|");
}

function topSetChanged(a, b) {
  const aSignature = topSetSignature(a);
  const bSignature = topSetSignature(b);
  return Boolean(aSignature && bSignature && aSignature !== bSignature);
}

function probabilityByBucket(item, bucket) {
  const match = (item.probabilities || []).find((probability) => String(probability.bucket) === String(bucket));
  return match?.probability || 0;
}

function topSetDelta(a, b) {
  const buckets = new Set([
    ...topProbabilities(a, 2).map((probability) => String(probability.bucket)),
    ...topProbabilities(b, 2).map((probability) => String(probability.bucket)),
  ]);
  if (!buckets.size) return 0;
  let total = 0;
  for (const bucket of buckets) {
    total += Math.abs(probabilityByBucket(a, bucket) - probabilityByBucket(b, bucket));
  }
  return total / buckets.size;
}

function findNextItem(item) {
  const next = nextWindowFor(item);
  if (!next) return null;
  return (state.data.probabilityCandidates || []).find((candidate) =>
    candidate.date === next.date &&
    candidate.timeNode === next.timeNode &&
    candidate.expectedField === item.expectedField
  ) || null;
}

function findDashboardItem(date, timeNode, expectedField) {
  return (state.data.probabilityCandidates || []).find((candidate) =>
    candidate.date === date &&
    candidate.timeNode === timeNode &&
    candidate.expectedField === expectedField
  ) || null;
}

function rankOfBucket(item, bucket) {
  const sorted = topProbabilities(item, item.probabilities?.length || 0);
  const index = sorted.findIndex((probability) => String(probability.bucket) === String(bucket));
  return index === -1 ? null : index + 1;
}

function itemTimeIndex(item) {
  const index = timeOrder.indexOf(item.timeNode);
  if (index !== -1) return index;
  const hour = timeStartHour(item.timeNode);
  return hour == null ? 999 : hour;
}

function previousHoldingsForItem(item) {
  const currentIndex = itemTimeIndex(item);
  return Object.entries(state.holdings || {})
    .filter(([, active]) => active)
    .map(([key]) => parseHoldingKey(key))
    .filter((holding) =>
      holding.date === item.date &&
      holding.expectedField === item.expectedField &&
      holding.bucket &&
      itemTimeIndex({ timeNode: holding.timeNode }) < currentIndex
    )
    .map((holding) => ({
      ...holding,
      purchaseItem: findDashboardItem(holding.date, holding.timeNode, holding.expectedField),
    }))
    .filter((holding) => holding.purchaseItem)
    .sort((a, b) => itemTimeIndex(b.purchaseItem) - itemTimeIndex(a.purchaseItem));
}

function holdingAdvice(item, holding) {
  const purchaseProbability = probabilityByBucket(holding.purchaseItem, holding.bucket);
  const currentProbability = probabilityByBucket(item, holding.bucket);
  const nextItem = findNextItem(item);
  const nextProbability = nextItem ? probabilityByBucket(nextItem, holding.bucket) : null;
  const rank = rankOfBucket(item, holding.bucket);
  const nextRank = nextItem ? rankOfBucket(nextItem, holding.bucket) : null;
  const risk = nextWindowRisk(item);
  const volatileNext = Boolean(risk);
  const reboundVisible = nextItem && nextProbability != null && (
    nextProbability - currentProbability >= 0.2 ||
    (nextRank != null && nextRank <= 2)
  );
  let status = "observe";
  let action = "观察";
  let reason = "概率有变化，先结合下个窗口风险判断";

  if ((item.modelSampleSize || 0) < 6) {
    status = "danger";
    action = "不建议按这个窗口卖";
    reason = "样本太少，单个窗口容易误导";
  } else if (rank != null && rank <= 2) {
    status = "hold";
    action = "继续持有";
    reason = "仍在当前 Top2";
  } else if (reboundVisible) {
    status = "hold";
    action = "先别急卖";
    reason = `下个窗口已显示反弹到 ${Math.round(nextProbability * 100)}%`;
  } else if (volatileNext) {
    status = "observe";
    action = "先观察";
    reason = `历史上到下个窗口变化大，Top2变化 ${Math.round(risk.changeRate * 100)}%`;
  } else if (currentProbability < 0.1 && (rank == null || rank > 4)) {
    status = "danger";
    action = "考虑减仓";
    reason = "当前概率很低，且不在主要候选";
  }

  return {
    item,
    holding,
    purchaseProbability,
    currentProbability,
    nextProbability,
    rank,
    nextRank,
    status,
    action,
    reason,
  };
}

function holdingAdvicesForItem(item) {
  const seen = new Set();
  return previousHoldingsForItem(item)
    .filter((holding) => {
      if (seen.has(holding.bucket)) return false;
      seen.add(holding.bucket);
      return true;
    })
    .map((holding) => holdingAdvice(item, holding));
}

function nextWindowRisk(item) {
  const next = nextWindowFor(item);
  if (!next) return null;
  const pairs = [];
  for (const candidate of state.data.probabilityCandidates || []) {
    if (candidate.expectedField !== item.expectedField || candidate.timeNode !== item.timeNode) continue;
    const nextCandidate = findNextItem(candidate);
    if (!nextCandidate) continue;
    pairs.push({
      changed: topSetChanged(candidate, nextCandidate),
      delta: topSetDelta(candidate, nextCandidate),
    });
  }
  if (!pairs.length) return null;
  const changeRate = pairs.filter((pair) => pair.changed).length / pairs.length;
  const avgDelta = pairs.reduce((sum, pair) => sum + pair.delta, 0) / pairs.length;
  if (changeRate < 0.7 && avgDelta < 0.25) return null;
  return {
    n: pairs.length,
    changeRate,
    avgDelta,
    nextTimeNode: next.timeNode,
  };
}

function changeClass(delta) {
  if (delta > 0.005) return "up";
  if (delta < -0.005) return "down";
  return "flat";
}

function signedPercent(delta) {
  const points = Math.round(delta * 100);
  return `${points > 0 ? "+" : ""}${points}%`;
}

function findPreviousItem(item) {
  const previous = previousWindowFor(item);
  if (!previous) return null;
  return (state.data.probabilityCandidates || []).find((candidate) =>
    candidate.date === previous.date &&
    candidate.timeNode === previous.timeNode &&
    candidate.expectedField === item.expectedField
  ) || null;
}

function topChangeRows(items) {
  return items
    .filter((item) => (item.modelSampleSize || 0) >= 6)
    .map((item) => {
      const previous = findPreviousItem(item);
      if (!previous) return null;
      const currentTop = topProbabilities(item, 2);
      const previousTop = topProbabilities(previous, 2);
      if (!currentTop.length || !previousTop.length) return null;
      const currentTopSignature = currentTop.map((probability) => String(probability.bucket)).sort().join("|");
      const previousTopSignature = previousTop.map((probability) => String(probability.bucket)).sort().join("|");
      const changed = currentTopSignature !== previousTopSignature;
      const rows = currentTop.map((probability) => {
        const previousProbability = probabilityByBucket(previous, probability.bucket);
        return {
          bucket: probability.bucket,
          current: probability.probability || 0,
          previous: previousProbability,
          delta: (probability.probability || 0) - previousProbability,
        };
      });
      return {
        item,
        previous,
        currentTop,
        previousTop,
        changed,
        rows,
        maxDelta: Math.max(...rows.map((row) => Math.abs(row.delta))),
      };
    })
    .filter(Boolean)
    .sort((a, b) =>
      Number(b.changed) - Number(a.changed) ||
      b.maxDelta - a.maxDelta ||
      displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
    );
}

function renderTopChanges(items) {
  const container = $("#topChangePicks");
  if (!container) return;
  const label = $("#changeWindowLabel");
  const date = $("#dateFilter")?.value || "";
  const time = $("#timeFilter")?.value || "";
  const rows = topChangeRows(items);
  const changedRows = rows.filter((row) => row.changed);
  if (label) {
    const hour = timeStartHour(time);
    const previousHour = { 10: 6, 14: 10, 17: 14, 22: 17 }[hour];
    const prefix = String(time || "").startsWith("昨") ? "昨" : "";
    label.textContent = previousHour == null
      ? "当前窗口没有上一窗口可比"
      : `${date} ${time} 及配对日期，对比 ${prefix}${previousHour}点窗口`;
  }
  if (!changedRows.length) {
    container.innerHTML = `<div class="change-empty">当前窗口和配对日期没有样本 >= 6 且 Top2 组合变化的城市。</div>`;
    return;
  }
  container.innerHTML = changedRows
    .map((change) => {
      const previousTopText = change.previousTop
        .map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
        .join(" / ");
      const currentTopText = change.currentTop
        .map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
        .join(" / ");
      return `
        <article class="change-card">
          <strong>${displayCity(change.item.expectedField)} Top2组合已变化</strong>
          <small>${change.previous.timeNode} → ${change.item.timeNode}</small>
          <div class="top2-compare">
            <div>
              <span>原来Top2</span>
              <b>${previousTopText}</b>
            </div>
            <div>
              <span>现在Top2</span>
              <b>${currentTopText}</b>
            </div>
          </div>
          <div class="change-temps">
            ${change.rows.map((row) => `
              <div class="change-temp">
                <b>${row.bucket}</b>
                <span>${Math.round(row.previous * 100)}% → ${Math.round(row.current * 100)}%</span>
                <em class="change-delta ${changeClass(row.delta)}">${signedPercent(row.delta)}</em>
              </div>
            `).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function ensureHoldingBoard() {
  let board = $("#holdingBoard");
  if (board) return board;
  const summary = $("#summaryGrid");
  if (!summary) return null;
  board = document.createElement("section");
  board.id = "holdingBoard";
  board.className = "hold-board";
  board.innerHTML = `
    <div class="hold-board-head">
      <h2>持仓追踪</h2>
      <span>点温度行里的“持仓”，下个窗口自动判断是否卖飞风险</span>
    </div>
    <div id="holdingPicks" class="holding-picks"></div>
  `;
  summary.after(board);
  return board;
}

function renderHoldingBoard(items) {
  const board = ensureHoldingBoard();
  const container = $("#holdingPicks");
  if (!board || !container) return;
  const advices = items.flatMap((item) => holdingAdvicesForItem(item));
  const activeCount = Object.values(state.holdings || {}).filter(Boolean).length;
  if (!advices.length) {
    container.innerHTML = activeCount
      ? `<div class="hold-empty">当前窗口还没有可对比的持仓。切到持仓之后的下一个窗口，就会显示卖出/观察提示。</div>`
      : `<div class="hold-empty">还没有标记持仓。先在买入温度那一行点“持仓”。</div>`;
    return;
  }
  container.innerHTML = advices
    .sort((a, b) =>
      (b.currentProbability - a.currentProbability) ||
      displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
    )
    .map((advice) => {
      const nextText = advice.nextProbability == null
        ? "下个窗口未出"
        : `下个窗口 ${Math.round(advice.nextProbability * 100)}%${advice.nextRank ? ` · 排名${advice.nextRank}` : ""}`;
      const rankText = advice.rank ? `当前排名${advice.rank}` : "当前未入候选";
      return `
        <article class="hold-card hold-${advice.status}">
          <div>
            <strong>${displayCity(advice.item.expectedField)} ${advice.holding.bucket}</strong>
            <span>${advice.holding.timeNode} → ${advice.item.timeNode}</span>
          </div>
          <div class="hold-probs">
            <b>${Math.round(advice.purchaseProbability * 100)}% → ${Math.round(advice.currentProbability * 100)}%</b>
            <span>${rankText} · ${nextText}</span>
          </div>
          <div class="hold-action">
            <b>${advice.action}</b>
            <span>${advice.reason}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProfitPicks() {
  const container = $("#profitPicks");
  if (!container) return;
  const selections = pairedSelection($("#dateFilter")?.value, $("#timeFilter")?.value);
  const dates = [...new Set(selections.map((selection) => selection.date).filter(Boolean))];
  const bestByCityDate = new Map();
  const dateSet = new Set(dates);
  for (const item of state.data?.probabilityCandidates || []) {
    if (!dateSet.has(item.date)) continue;
    const score = historicalScore(item);
    if (!score || (score.n || 0) < 6 || (score.sample || 0) < 6 || (score.top2Accuracy || 0) < 75) continue;
    const key = `${score.item.date}|${cityKey(score.item.expectedField)}`;
    const current = bestByCityDate.get(key);
    const scoreRank = score.top2Accuracy * 10000 + score.top1Accuracy * 100 + (score.n || 0);
    if (!current || scoreRank > current.scoreRank) bestByCityDate.set(key, { ...score, scoreRank });
  }
  const picks = [...bestByCityDate.values()]
    .sort((a, b) =>
      b.top2Accuracy - a.top2Accuracy ||
      b.top1Accuracy - a.top1Accuracy ||
      (b.n || 0) - (a.n || 0) ||
      displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
    )
    .slice(0, 12);
  if (!picks.length) {
    container.innerHTML = `<div class="profit-empty">当前两天没有历史样本 >= 6 且当前样本 >= 6 的窗口。</div>`;
    return;
  }
  const grouped = dates
    .map((date, index) => ({
      date,
      label: index === 0 ? "今天" : index === 1 ? "明天" : date,
      availability: windowAvailabilityForDate(date),
      picks: picks.filter((pick) => pick.item.date === date),
    }))
    .filter((group) => group.picks.length);
  container.innerHTML = grouped
    .map((group) => `
      <section class="profit-date-group">
        <div class="profit-date-title">
          <strong>${group.label}</strong>
          <span>${group.date}</span>
          <em>已出窗口：${group.availability.appearedText}</em>
          <em class="missing">未出窗口：${group.availability.missingText}</em>
        </div>
        <div class="profit-date-picks">
          ${group.picks.map((pick) => `
            <article class="profit-pick ${pick.top2Accuracy >= 80 ? "profit-strong" : pick.top2Accuracy >= 65 ? "profit-watch" : "profit-weak"}">
              <div>
                <strong>${displayCity(pick.item.expectedField)}</strong>
                <span>${pick.item.timeNode} · 历史n=${pick.n} · 当前n=${pick.sample}</span>
              </div>
              <div class="buy-now">
                <span>马上看这两个温度</span>
                <b>买：${topProbabilities(pick.item, 2).map((probability) => `${probability.bucket}（${Math.round((probability.probability || 0) * 100)}%）`).join(" / ")}</b>
                <em>样本参考：当前n=${pick.sample} · 历史回测n=${pick.n}</em>
              </div>
              <div class="profit-main">
                <b>历史 Top2 ${pick.top2Accuracy}%</b>
                <em>Top1 ${pick.top1Accuracy}%</em>
              </div>
              <small>回测命中：Top1 ${pick.top1Hits}/${pick.n} · Top2 ${pick.top2Hits}/${pick.n}</small>
            </article>
          `).join("")}
        </div>
      </section>
    `)
    .join("");
}

function opportunityPicks(items) {
  const picks = [];
  for (const item of items) {
    if ((item.modelSampleSize || 0) < 8) continue;
    for (const probability of item.probabilities || []) {
      const modelPercent = Math.round(probability.probability * 100);
      const { price, source } = marketPrice(item, probability.bucket);
      if (price == null) continue;
      const edge = modelPercent - price;
      if (edge <= 15) continue;
      picks.push({
        item,
        bucket: probability.bucket,
        modelPercent,
        price,
        source,
        edge,
      });
    }
  }
  return picks.sort((a, b) =>
    b.edge - a.edge ||
    b.modelPercent - a.modelPercent ||
    b.item.modelSampleSize - a.item.modelSampleSize ||
    displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
  );
}

function renderEdgePicks(items) {
  const container = $("#edgePicks");
  const picks = opportunityPicks(items);
  if (!picks.length) {
    container.innerHTML = `<div class="edge-empty">当前窗口没有满足条件的低估温度。</div>`;
    return;
  }
  container.innerHTML = picks
    .map((pick) => `
      <article class="edge-pick">
        <div>
          <strong>${displayCity(pick.item.expectedField)} ${pick.bucket}</strong>
          <span>${pick.item.date} · ${pick.item.timeNode}</span>
        </div>
        <div class="edge-pick-stats">
          <span>模型 ${pick.modelPercent}%</span>
          <span>${pick.source === "poly" ? "Poly" : "手动"} ${pick.price}%</span>
          <b>+${Math.round(pick.edge)}%</b>
        </div>
        <small>样本 ${pick.item.modelSampleSize || 0} · ${pick.item.modelLevel}</small>
      </article>
    `)
    .join("");
}

function renderCardHtml(item) {
  const template = $("#cardTemplate").content.cloneNode(true);
  const article = template.querySelector(".city-card");
  const modelN = item.modelSampleSize ?? 0;
  const sampleText = modelN >= 10 ? "强参考" : modelN >= 5 ? "一般参考" : "弱参考";
  const droppedText = item.outlierDropped ? `（剔除${item.outlierDropped}异常）` : "";

  article.classList.add(item.viewSide === "right" ? "right-window" : "left-window");
  if (hasSplitTopTwo(item)) article.classList.add("split-top2");
  template.querySelector("h3").textContent = `${item.viewSide === "right" ? "右" : "左"} ${item.date}`;
  template.querySelector(".meta").textContent =
    `${item.date} · ${item.timeNode} · ${item.unit || "C"} · ${modelLevelText(item)}`;
  template.querySelector(".badge").textContent = modelBadgeText(item);
  template.querySelector(".predicted").textContent = String(item.predicted);
  template.querySelector(".baseline").textContent = item.baselinePredicted == null ? "-" : String(item.baselinePredicted);
  template.querySelector(".trend").textContent = trendText(item);
  template.querySelector(".samples").textContent = `${modelN} ${sampleText}${droppedText}`;
  template.querySelector(".buckets").innerHTML = displayProbabilities(item)
    .map((probability) => renderBucket(item, probability))
    .join("");
  const currentHistory = historicalScore(item);
  const bestHistory = bestHistoricalForCityDate(item);
  if (currentHistory) {
    const profitBox = document.createElement("div");
    const bestIsCurrent = bestHistory &&
      bestHistory.item.date === item.date &&
      bestHistory.item.timeNode === item.timeNode &&
      cityKey(bestHistory.item.expectedField) === cityKey(item.expectedField);
    profitBox.className = `profit-hint ${currentHistory.top2Accuracy >= 80 ? "profit-good" : currentHistory.top2Accuracy >= 65 ? "profit-ok" : "profit-bad"}`;
    profitBox.innerHTML = `
      <div>
        <span>当前窗口历史命中率</span>
        <b>Top1 ${currentHistory.top1Accuracy}% · Top2 ${currentHistory.top2Accuracy}% · n=${currentHistory.n}</b>
      </div>
      <div>
        <span>同城同日期最佳历史窗口</span>
        <b>${bestHistory ? `${bestHistory.item.timeNode} · Top1 ${bestHistory.top1Accuracy}% · Top2 ${bestHistory.top2Accuracy}% · n=${bestHistory.n}` : "暂无样本>=6窗口"}</b>
      </div>
      <em>${bestIsCurrent ? "当前就是该城市历史命中率最高窗口" : "当前不是该城市历史命中率最高窗口，可考虑等最佳窗口"}</em>
    `;
    template.querySelector(".signal-row").after(profitBox);
  }
  if (modelN < 6) {
    const warning = document.createElement("div");
    warning.className = "sample-warning";
    warning.textContent = "样本太少，不建议交易";
    template.querySelector(".signal-row").after(warning);
  }
  if (item.outlierDropped) {
    const warning = document.createElement("div");
    warning.className = "outlier-warning";
    const thresholdText = item.outlierThreshold == null ? "-" : String(item.outlierThreshold);
    warning.textContent = `已自动剔除 ${item.outlierDropped} 个异常历史样本：每 8 个样本最多剔 1 个，偏离均值 > ${thresholdText} 优先剔最远`;
    template.querySelector(".signal-row").after(warning);
  }
  if (hasSplitTopTwo(item)) {
    const warning = document.createElement("div");
    warning.className = "split-warning";
    warning.textContent = "Top2不相邻，分布分裂，不建议交易";
    template.querySelector(".signal-row").after(warning);
  }

  const nextRisk = nextWindowRisk(item);
  if (nextRisk) {
    const warning = document.createElement("div");
    warning.className = "next-window-warning";
    warning.textContent = `谨慎交易：历史上到下个窗口差别较大（${item.timeNode}→${nextRisk.nextTimeNode}，Top2变化${Math.round(nextRisk.changeRate * 100)}%，n=${nextRisk.n}）`;
    template.querySelector(".signal-row").after(warning);
  }

  const holdAdvices = holdingAdvicesForItem(item);
  if (holdAdvices.length) {
    const box = document.createElement("div");
    box.className = "hold-advice-box";
    box.innerHTML = holdAdvices.map((advice) => `
      <div class="hold-advice-line hold-${advice.status}">
        <b>持仓 ${advice.holding.bucket}</b>
        <span>${Math.round(advice.purchaseProbability * 100)}% → ${Math.round(advice.currentProbability * 100)}% · ${advice.action}：${advice.reason}</span>
      </div>
    `).join("");
    template.querySelector(".signal-row").after(box);
  }

  article.dataset.score = String(cardScore(item));
  return template;
}

function renderCards(items) {
  const cards = $("#cards");
  if (!items.length) {
    cards.innerHTML = `<div class="empty">当前日期和时间窗口没有开放概率数据。</div>`;
    return;
  }

  const minEdge = Number($("#edgeFilter").value || 0);
  cards.innerHTML = groupByCity(items)
    .map((group) => {
      const groupHasVisibleEdge = group.items.some((item) => (item.probabilities || []).some((probability) => {
        const { price } = marketPrice(item, probability.bucket);
        return price != null && Math.round(probability.probability * 100) - price >= minEdge;
      }));
      const wrap = document.createElement("div");
      wrap.className = `city-group${groupHasVisibleEdge ? " edge-match" : ""}`;
      wrap.innerHTML = `
        <div class="group-head">
          <h3>${group.city}</h3>
          <span>${group.items.length} 个日期窗口</span>
        </div>
        <div class="group-cards"></div>
      `;
      const groupCards = wrap.querySelector(".group-cards");
      group.items.forEach((item) => {
        const template = renderCardHtml(item);
        groupCards.appendChild(template);
      });
      return wrap.outerHTML;
    })
    .join("");

  cards.querySelectorAll("[data-price-key]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const target = event.target;
      if (target.value === "") delete state.prices[target.dataset.priceKey];
      else state.prices[target.dataset.priceKey] = target.value;
      savePrices();
      render();
    });
  });

  cards.querySelectorAll("[data-hold-key]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const key = event.currentTarget.dataset.holdKey;
      if (state.holdings[key]) delete state.holdings[key];
      else state.holdings[key] = true;
      saveHoldings();
      render();
    });
  });
}

function render() {
  const items = filteredItems();
  renderSummary(items);
  renderHoldingBoard(items);
  renderProfitPicks();
  renderEdgePicks(items);
  renderCards(items);
}

function setupExportButton() {
  const button = $("#exportFullPage");
  if (!button) return;
  button.addEventListener("click", async () => {
    const originalText = button.textContent;
    button.textContent = "生成中...";
    button.disabled = true;
    try {
      await exportFullPagePng();
    } catch (error) {
      alert(`截图失败：${error.message}`);
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}

async function exportFullPagePng() {
  const items = filteredItems();
  const groups = groupByCity(items);
  if (!groups.length) throw new Error("当前筛选没有数据");
  const width = 1320;
  const margin = 28;
  const gap = 18;
  const cardWidth = 610;
  const rowGap = 14;
  const bucketRowHeight = 33;
  const headerHeight = 94;
  const groupHeader = 42;
  const estimateCardHeight = (item) => 162 + Math.max(1, displayProbabilities(item).length) * bucketRowHeight;
  let height = margin + headerHeight;
  for (const group of groups) {
    const rows = [];
    for (let i = 0; i < group.items.length; i += 2) rows.push(group.items.slice(i, i + 2));
    height += groupHeader + rows.reduce((sum, row) => sum + Math.max(...row.map(estimateCardHeight)), 0) + Math.max(0, rows.length - 1) * rowGap + gap;
  }
  height += margin;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f6f7f9";
  ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "top";

  const date = $("#dateFilter")?.value || "";
  const time = $("#timeFilter")?.value || "";
  drawText(ctx, "温度交易看板", margin, 24, 30, 800, "#101828");
  drawText(ctx, `${date} · ${time} · ${groups.length} 个城市 · ${items.length} 张卡片`, margin, 62, 16, 500, "#667085");

  let y = margin + headerHeight;
  for (const group of groups) {
    drawText(ctx, group.city, margin, y, 24, 800, "#101828");
    drawText(ctx, `${group.items.length} 个日期窗口`, margin + 170, y + 5, 14, 500, "#667085");
    y += groupHeader;
    for (let i = 0; i < group.items.length; i += 2) {
      const row = group.items.slice(i, i + 2);
      const rowHeight = Math.max(...row.map(estimateCardHeight));
      row.forEach((item, index) => {
        drawExportCard(ctx, item, margin + index * (cardWidth + gap), y, cardWidth, rowHeight, bucketRowHeight);
      });
      y += rowHeight + rowGap;
    }
    y += gap;
  }

  const link = document.createElement("a");
  link.download = `temperature-dashboard-${date}-${time.replace(/[^\d\u4e00-\u9fa5a-zA-Z-]+/g, "")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function drawText(ctx, text, x, y, size = 14, weight = 400, color = "#101828", maxWidth = null) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Microsoft YaHei", "Segoe UI", sans-serif`;
  if (maxWidth) ctx.fillText(String(text || ""), x, y, maxWidth);
  else ctx.fillText(String(text || ""), x, y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
}

function strokeRoundRect(ctx, x, y, w, h, r, color) {
  ctx.strokeStyle = color;
  roundRect(ctx, x, y, w, h, r);
  ctx.stroke();
}

function drawExportCard(ctx, item, x, y, w, h, bucketRowHeight) {
  fillRoundRect(ctx, x, y, w, h, 8, "#ffffff");
  strokeRoundRect(ctx, x, y, w, h, 8, "#d9dee7");
  ctx.fillStyle = item.viewSide === "right" ? "#12a06a" : "#245bdb";
  ctx.fillRect(x, y, 5, h);
  drawText(ctx, `${item.viewSide === "right" ? "右" : "左"} ${item.date}`, x + 20, y + 16, 22, 800, "#101828");
  drawText(ctx, modelBadgeText(item), x + w - 112, y + 18, 14, 600, "#245bdb", 95);
  drawText(ctx, `${item.date} · ${item.timeNode} · ${item.unit || "C"} · ${modelLevelText(item)}`, x + 20, y + 50, 13, 400, "#667085", w - 40);

  const boxY = y + 78;
  fillRoundRect(ctx, x + 20, boxY, w - 40, 58, 6, "#f8fafc");
  const colW = (w - 56) / 4;
  [
    ["当前预计", item.predicted],
    ["昨10预计", item.baselinePredicted ?? "-"],
    ["分档", trendText(item)],
    ["样本", `${item.modelSampleSize || 0} ${item.modelSampleSize >= 10 ? "强参考" : item.modelSampleSize >= 5 ? "一般参考" : "弱参考"}`],
  ].forEach(([label, value], index) => {
    const xx = x + 34 + index * colW;
    drawText(ctx, label, xx, boxY + 10, 12, 400, "#667085", colW - 8);
    drawText(ctx, value, xx, boxY + 29, 17, 800, "#101828", colW - 8);
  });

  let yy = y + 154;
  for (const probability of displayProbabilities(item)) {
    const modelPercent = Math.round(probability.probability * 100);
    const { price } = marketPrice(item, probability.bucket);
    const edge = price == null ? null : modelPercent - price;
    const color = edge == null ? "#98b8ff" : edge >= 15 ? "#46b57a" : edge >= 0 ? "#e7b85a" : "#d97a7a";
    drawText(ctx, probability.bucket, x + 20, yy + 3, 18, 800, "#101828", 72);
    fillRoundRect(ctx, x + 112, yy, 230, 24, 6, "#edf0f4");
    fillRoundRect(ctx, x + 112, yy, Math.max(3, 230 * probability.probability), 24, 6, color);
    drawText(ctx, `${modelPercent}%`, x + 356, yy + 2, 18, 500, "#101828", 60);
    const marketText = price == null ? `raw ${modelPercent}%` : `Poly ${price}% · 优势 ${edge > 0 ? "+" : ""}${edge}% · raw ${modelPercent}%`;
    drawText(ctx, marketText, x + 430, yy + 5, 12, 400, "#667085", w - 450);
    yy += bucketRowHeight;
  }
}

loadData()
  .then((data) => {
    state.data = data;
    state.polyPriceMap = buildPolyPriceMap();
    const items = data.probabilityCandidates || [];
    setupFilters(items);
    setupExportButton();
    const polyCount = state.polyPriceMap.size;
    $("#dataStatus").textContent = `已加载 ${items.length} 条概率候选，${polyCount} 个 Poly 自动价格。价格输入会保存在本机浏览器。`;
    render();
  })
  .catch((error) => {
    $("#dataStatus").textContent = `读取失败：${error.message}`;
    $("#cards").innerHTML = `<div class="empty">请用本地服务器打开页面，确保 feishu-analysis-output.json 在同一目录。</div>`;
  });
