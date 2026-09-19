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

function dashboardPageMode() {
  return "mid";
}

function isMidRangePage() {
  return dashboardPageMode() === "mid";
}

function recommendationModeText() {
  return isMidRangePage() ? "\u4e2d\u6863\u673a\u4f1a" : "\u5f3a\u63a8";
}

const cityNames = {
  wellington: "Wellington",
  HK: "Hong Kong",
  hk: "Hong Kong",
  hongkong: "Hong Kong",
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
  "miami本土": "Miami 本土",
  beijing: "Beijing",
  qingdao: "Qingdao",
  seoul: "Seoul",
  shanghai: "Shanghai",
  shenzhen: "Shenzhen",
  toyko: "Tokyo",
  tokyo: "Tokyo",
  amsterdam: "Amsterdam",
  busan: "Busan",
  chengdu: "Chengdu",
  wuhan: "Wuhan",
  chongqing: "Chongqing",
  chicago: "Chicago",
  dallas: "Dallas",
  atlanta: "Atlanta",
  austin: "Austin",
  houston: "Houston",
  la: "LA",
  LA: "LA",
  jakarta: "Jakarta",
  NYC: "NYC",
  nyc: "NYC",
  San: "San Francisco",
  san: "San Francisco",
  seattle: "Seattle",
  denver: "Denver",
  toronto: "Toronto",
};

const PAUSED_REGISTRATION_CITY_NOTES = {
  toyko: "6\u670816 \u6682\u505c\u767b\u8bb0",
  tokyo: "6\u670816 \u6682\u505c\u767b\u8bb0",
  houston: "6\u670816 \u6682\u505c\u767b\u8bb0",
  austin: "6\u670816 \u6682\u505c\u767b\u8bb0",
  chengdu: "6\u670816 \u6682\u505c\u767b\u8bb0",
  atlanta: "6\u670816 \u6682\u505c\u767b\u8bb0",
  san: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  london: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  beijing: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  seoul: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  busan: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  qingdao: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  taipei: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  wuhan: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  lucknow: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  paris: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  nyc: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  amsterdam: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  seattle: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  chongqing: "\u80dc\u7387\u592a\u5dee\uff0c\u5df2\u505c\u6b62\u7edf\u8ba1",
  denver: "\u80dc\u7387\u592a\u5dee\uff0c\u5df2\u505c\u6b62\u7edf\u8ba1",
  dallas: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0",
  chicago: "8\u670817\u65e5 \u6682\u505c\u767b\u8bb0",
  hk: "8\u670817\u65e5 \u6682\u505c\u767b\u8bb0",
  hongkong: "8\u670817\u65e5 \u6682\u505c\u767b\u8bb0",
  shenzhen: "6\u67089\u65e5 \u6682\u505c\u767b\u8bb0",
  "miami本土": "8\u670818\u65e5 \u6682\u505c\u767b\u8bb0",
  shanghai: "8\u670818\u65e5 \u6682\u505c\u767b\u8bb0",
  toronto: "8\u670818\u65e5 \u6682\u505c\u767b\u8bb0",
  warsaw: "8\u670828\u65e5 \u6682\u505c\u767b\u8bb0",
  wellington: "8\u670828\u65e5 \u6682\u505c\u767b\u8bb0",
  kualalumpur: "8\u670829\u65e5 \u6682\u505c\u767b\u8bb0",
  buenos: "9\u67084\u65e5 \u6682\u505c\u767b\u8bb0",
  moscow: "9\u67086\u65e5 \u6682\u505c\u767b\u8bb0",
  milan: "9\u67086\u65e5 \u6682\u505c\u767b\u8bb0",
  la: "\u80dc\u7387\u592a\u5dee\uff0c\u5df2\u505c\u6b62\u7edf\u8ba1",
  jakarta: "\u80dc\u7387\u592a\u5dee\uff0c\u5df2\u505c\u6b62\u7edf\u8ba1",
};

const RETIRED_CITY_DETAIL_NOTES = {
  san: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  london: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  beijing: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  seoul: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  busan: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  qingdao: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  taipei: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  wuhan: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  lucknow: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  paris: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  nyc: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  amsterdam: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  seattle: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  chongqing: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  denver: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  dallas: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  chicago: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  hk: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  hongkong: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  shenzhen: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  "miami本土": "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  shanghai: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  toronto: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  warsaw: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  wellington: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  kualalumpur: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  buenos: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  moscow: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
  milan: "\u5df2\u505c\u6b62\u67e5\u8be2\u548c\u767b\u8bb0 \u00b7 \u6682\u505c\u66f4\u65b0",
};

const HIDDEN_CITY_KEYS = new Set(["hk", "hongkong", "chicago"]);

function isHiddenCity(city) {
  const identity = city && typeof city === "object"
    ? city.expectedField || city.city || city.cityKey || city.forecastField || city.actualField || ""
    : city || "";
  return HIDDEN_CITY_KEYS.has(normalizedCityKey(identity));
}

function withoutHiddenCities(value) {
  if (Array.isArray(value)) {
    return value
      .filter((item) => !isHiddenCity(item))
      .map((item) => withoutHiddenCities(item));
  }
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      key === "retiredCityHistory" ? item : withoutHiddenCities(item),
    ]),
  );
}

state.accuracy = withoutHiddenCities(state.accuracy);
state.polyPrices = withoutHiddenCities(state.polyPrices);

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

const HISTORY_TOP2_THRESHOLD = 90;
const HISTORY_MIN_SAMPLE = 10;
const MAX_RECOMMENDATION_WINDOWS_PER_CITY_DAY = 2;
const STRONG_RECOMMENDATION_TOP2_THRESHOLD = 90;
const STRONG_RECOMMENDATION_MIN_SAMPLE = 12;
const STRONG_RECOMMENDATION_TOP1_THRESHOLD = 55;
const STRONG_RECOMMENDATION_SECOND_HIT_THRESHOLD = 0;
const STRONG_RECOMMENDATION_CURRENT_TOP2_THRESHOLD = 88;
const STRONG_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD = 30;
const BALANCED_EXPANSION_RECOMMENDATION_TOP2_THRESHOLD = HISTORY_TOP2_THRESHOLD;
const BALANCED_EXPANSION_RECOMMENDATION_TOP1_THRESHOLD = 53;
const BALANCED_EXPANSION_RECOMMENDATION_CURRENT_TOP2_THRESHOLD = 88;
const BALANCED_EXPANSION_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD = 20;
const MEDIUM_CLUSTER_RECOMMENDATION_TOP2_THRESHOLD = 88;
const MEDIUM_CLUSTER_RECOMMENDATION_CURRENT_TOP2_MIN = 80;
const MEDIUM_CLUSTER_RECOMMENDATION_CURRENT_TOP2_MAX = 101;
const MEDIUM_CLUSTER_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD = 20;
const EXTENDED_RECOMMENDATION_TOP2_THRESHOLD = 85;
const EXTENDED_RECOMMENDATION_MIN_SAMPLE = 18;
const EXTENDED_RECOMMENDATION_SECOND_HIT_THRESHOLD = 15;
const EXTENDED_RECOMMENDATION_CURRENT_TOP2_THRESHOLD = 75;
const EXTENDED_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD = 20;
const MID_RECOMMENDATION_TOP2_MIN = 85;
const MID_RECOMMENDATION_TOP2_MAX = 95;
const MID_RECOMMENDATION_MIN_SAMPLE = 18;
const MID_RECOMMENDATION_CURRENT_TOP2_THRESHOLD = 70;
const MID_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD = 30;
const CITY_RANKING_WINDOWS_PER_CITY = 2;
const CITY_RANKING_TEMPERATURE_REMINDER_TOP2_MIN = 80;
const CITY_RANKING_TEMPERATURE_REMINDER_RECENT_TOP2_MIN = 90;
const CITY_RANKING_TEMPERATURE_REMINDER_RECENT_10_DAY_TOP2_MIN = 80;
const CITY_RANKING_SMALL_POSITION_TOP2_WARNING = 90;
const CITY_RANKING_COMPOUND_TOP2_MIN = 90;
const CITY_RANKING_COMPOUND_RECENT_TOP2_MIN = 95;
const CITY_RANKING_COMPOUND_RECENT_10_DAY_TOP2_MIN = 100;
const CITY_RANKING_TIME_RECOMMENDATION_LIMIT = 15;
const RECOMMENDATION_STABILITY_LOOKBACK = 3;
const RECOMMENDATION_STABILITY_MIN_HITS = 2;
const RECOMMENDATION_RECENT_ADDED_POOL_TOP2_THRESHOLD = HISTORY_TOP2_THRESHOLD;
const RECOMMENDATION_RECENT_ADDED_POOL_MIN_SAMPLE = 5;
const WEATHER_SANITY_MAX_DIFF_C = 3.5;
const WEATHER_SANITY_MAX_DIFF_F = 7;

function round(value, digits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

const CITY_TIME_ZONES = {
  wellington: "Pacific/Auckland",
  toyko: "Asia/Tokyo",
  tokyo: "Asia/Tokyo",
  seoul: "Asia/Seoul",
  busan: "Asia/Seoul",
  shanghai: "Asia/Shanghai",
  shenzhen: "Asia/Shanghai",
  chengdu: "Asia/Shanghai",
  beijing: "Asia/Shanghai",
  wuhan: "Asia/Shanghai",
  chongqing: "Asia/Shanghai",
  hk: "Asia/Hong_Kong",
  hongkong: "Asia/Hong_Kong",
  singa: "Asia/Singapore",
  singapore: "Asia/Singapore",
  lucknow: "Asia/Kolkata",
  warsaw: "Europe/Warsaw",
  london: "Europe/London",
  paris: "Europe/Paris",
  madrid: "Europe/Madrid",
  milan: "Europe/Rome",
  ankara: "Europe/Istanbul",
  ankarar: "Europe/Istanbul",
  munich: "Europe/Berlin",
  moscow: "Europe/Moscow",
  telaviv: "Asia/Jerusalem",
  helsink: "Europe/Helsinki",
  helsinks: "Europe/Helsinki",
  amsterdam: "Europe/Amsterdam",
  toronto: "America/Toronto",
  buenos: "America/Argentina/Buenos_Aires",
  atlanta: "America/New_York",
  dallas: "America/Chicago",
  miami: "America/New_York",
  miami本土: "America/New_York",
  nyc: "America/New_York",
  seattle: "America/Los_Angeles",
  san: "America/Los_Angeles",
  chicago: "America/Chicago",
  austin: "America/Chicago",
  la: "America/Los_Angeles",
  denver: "America/Denver",
  houston: "America/Chicago",
};
const CITY_LOCAL_TIME_ORDER = [
  "wellington",
  "toyko",
  "tokyo",
  "seoul",
  "busan",
  "shanghai",
  "hk",
  "hongkong",
  "shenzhen",
  "chengdu",
  "beijing",
  "wuhan",
  "chongqing",
  "singa",
  "singapore",
  "lucknow",
  "moscow",
  "ankara",
  "ankarar",
  "telaviv",
  "helsink",
  "helsinks",
  "warsaw",
  "amsterdam",
  "munich",
  "milan",
  "paris",
  "madrid",
  "london",
  "buenos",
  "toronto",
  "nyc",
  "atlanta",
  "miami",
  "chicago",
  "dallas",
  "austin",
  "houston",
  "denver",
  "san",
  "la",
  "seattle",
];
const CITY_LOCAL_TIME_RANK = new Map(CITY_LOCAL_TIME_ORDER.map((key, index) => [key, index]));
const ASIA_CONFIRMATION_CITY_KEYS = new Set([
  "toyko",
  "tokyo",
  "seoul",
  "busan",
  "shanghai",
  "hk",
  "hongkong",
  "shenzhen",
  "chengdu",
  "beijing",
  "wuhan",
  "chongqing",
  "singa",
  "singapore",
  "lucknow",
  "wellington",
]);
const EUROPE_CONFIRMATION_CITY_KEYS = new Set([
  "amsterdam",
  "ankara",
  "ankarar",
  "helsink",
  "helsinks",
  "london",
  "madrid",
  "milan",
  "moscow",
  "munich",
  "paris",
  "telaviv",
  "warsaw",
]);
const US_CONFIRMATION_CITY_KEYS = new Set([
  "atlanta",
  "austin",
  "chicago",
  "dallas",
  "denver",
  "houston",
  "la",
  "miami",
  "miami本土",
  "nyc",
  "san",
  "seattle",
]);
const LATE_SETTLEMENT_CITY_KEYS = new Set([
  "amsterdam",
  "ankara",
  "ankarar",
  "helsink",
  "helsinks",
  "london",
  "madrid",
  "milan",
  "moscow",
  "munich",
  "paris",
  "telaviv",
  "warsaw",
]);
const EARLY_TRADE_ONLY_CITY_KEYS = new Set(["lucknow"]);
const PRE_10_TRADE_ONLY_CITY_KEYS = new Set([
  "toyko",
  "tokyo",
  "shanghai",
  "hk",
  "hongkong",
  "singa",
  "singapore",
  "seoul",
  "busan",
  "beijing",
  "chengdu",
  "shenzhen",
  "wuhan",
  "chongqing",
  "wellington",
]);

const $ = (selector) => document.querySelector(selector);

function cityKey(field) {
  return String(field || "").replace(/预计$|棰勮$/u, "");
}

function normalizedCityKey(field) {
  return cityKey(field)
    .toLowerCase()
    .replace(/(?:\u5929\u6c14|\u6e29\u5ea6|\u6570\u91cf|\u5b9e\u6e29|\u5dee\u989d|\u9884\u8ba1|\u526f\u672c|weather|condition|temp|count|actual|copy)/gi, "")
    .replace(/\s+/g, "");
}

function displayCity(field) {
  const key = cityKey(field);
  return cityNames[key] || key;
}

function pausedRegistrationNoteForCity(city) {
  const key = normalizedCityKey(city?.expectedField || city?.city || city || "");
  return PAUSED_REGISTRATION_CITY_NOTES[key] || "";
}

function cityLocalTimeRank(field) {
  const key = normalizedCityKey(field);
  return CITY_LOCAL_TIME_RANK.has(key) ? CITY_LOCAL_TIME_RANK.get(key) : 999;
}

function compareCityFields(a, b) {
  return cityLocalTimeRank(a) - cityLocalTimeRank(b) || displayCity(a).localeCompare(displayCity(b));
}

function weatherMaxForItem(item) {
  const date = item?.date;
  const city = normalizedCityKey(item?.expectedField);
  if (!date || !city) return null;
  return state.data?.weatherMaxByCityDate?.[date]?.[city] || null;
}

function weatherPredictionSanityEligible(item) {
  const weather = weatherMaxForItem(item);
  if (!weather) return true;
  const predicted = Number(item?.predicted);
  if (!Number.isFinite(predicted)) return true;
  const unit = (item?.unit || "C").toUpperCase();
  const weatherMax = unit === "F" ? Number(weather.fahrenheitMax) : Number(weather.celsiusMax);
  if (!Number.isFinite(weatherMax)) return true;
  const threshold = unit === "F" ? WEATHER_SANITY_MAX_DIFF_F : WEATHER_SANITY_MAX_DIFF_C;
  return Math.abs(weatherMax - predicted) <= threshold;
}

function recommendationBucketsNearPredictionEligible(item) {
  const predicted = Number(item?.predicted);
  if (!Number.isFinite(predicted)) return true;
  const unit = (item?.unit || "C").toUpperCase();
  const threshold = unit === "F" ? WEATHER_SANITY_MAX_DIFF_F : WEATHER_SANITY_MAX_DIFF_C;
  return topProbabilities(item, 2).every((probability) => {
    const span = bucketSpan(probability);
    if (!span) return true;
    if (predicted < span.min) return span.min - predicted <= threshold;
    if (predicted > span.max) return predicted - span.max <= threshold;
    return true;
  });
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

function sameItem(a, b) {
  return Boolean(a && b) &&
    a.date === b.date &&
    a.timeNode === b.timeNode &&
    a.expectedField === b.expectedField;
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

function tradeWindowCutoffHour() {
  return null;
}

function isTradableEntryWindow() {
  return true;
}

function tradeCostStep(timeNode) {
  const hour = timeStartHour(timeNode);
  if (hour == null) return null;
  const yesterday = isYesterdayTime(timeNode);
  if (yesterday) return ({ 6: -1, 10: 0, 14: 1, 17: 2, 22: 3 })[hour] ?? null;
  return ({ 6: 4, 10: 5, 14: 6, 17: 7, 22: 8 })[hour] ?? null;
}

function windowClockDate(dateText, timeNode) {
  const match = String(dateText || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const hour = timeStartHour(timeNode);
  if (!match || hour == null) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, 0, 0, 0);
  if (isYesterdayTime(timeNode)) date.setDate(date.getDate() - 1);
  return date;
}

function isFutureWindow(dateText, timeNode, now = new Date()) {
  const clockDate = windowClockDate(dateText, timeNode);
  return clockDate ? clockDate.getTime() > now.getTime() : false;
}

function localDateText(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function beijingDateText(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function recommendationDates(items) {
  const dates = uniqueSorted(items.map((item) => item.date));
  const today = localDateText();
  if (dates.includes(today)) {
    const tomorrow = addDays(today, 1);
    return [today, dates.includes(tomorrow) ? tomorrow : dates.find((date) => date > today)]
      .filter(Boolean);
  }
  const futureOrToday = dates.filter((date) => date >= today);
  if (futureOrToday.length) return futureOrToday.slice(0, 2);
  return dates.slice(-2);
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

function cityOptimizationForField(expectedField) {
  const key = cityKey(expectedField);
  return (state.data?.cityModelOptimizations || []).find((optimization) => cityKey(optimization.expectedField) === key) || null;
}

function cityTop2ForField(expectedField) {
  if (isHiddenCity(expectedField)) return null;
  const key = cityKey(expectedField);
  return (state.data?.cityTop2Winrates?.cities || []).find((city) => cityKey(city.expectedField) === key) || null;
}

function cityTop2WindowForItem(item) {
  const cityTop2 = cityTop2ForField(item.expectedField);
  return (cityTop2?.topWindows || []).find((window) => window.timeNode === item.timeNode) || null;
}

function hasCityTop2Windows(expectedField) {
  const cityTop2 = cityTop2ForField(expectedField);
  return Boolean(cityTop2?.topWindows?.length);
}

function isRecommendationCandidateWindow(item) {
  if (!item) return false;
  const sample = item.optimizedRuleN || item.optimizedWindowN || 0;
  return Boolean(sample > 0 && item.optimizedRuleApplies !== false);
}

function cityTop2WindowScore(item, window) {
  if (!window) return null;
  const history = {
    expectedField: item.expectedField,
    timeNode: item.timeNode,
    n: window.n || 0,
    top1Hits: window.top1Hits || 0,
    top2Hits: window.top2Hits || 0,
    top1Accuracy: window.top1Accuracy || 0,
    top2Accuracy: window.top2Accuracy || 0,
    optimizedModelName: window.configName || "",
    optimizedModelLabel: window.configLabel || "",
  };
  return {
    item,
    history,
    n: history.n,
    sample: item.modelSampleSize || 0,
    top1Accuracy: history.top1Accuracy,
    top2Accuracy: history.top2Accuracy,
    top1Hits: history.top1Hits,
    top2Hits: history.top2Hits,
    optimizedModelLabel: history.optimizedModelLabel,
    optimizedRuleLabel: window.ruleLabel || window.strategyLabel || "condition training",
    optimizedRuleBased: (window.ruleType || "all") !== "all",
    tradableBestWindow: window.tradableBestWindow !== false && isTradableEntryWindow(item.expectedField, item.timeNode),
    tradeCutoffReason: window.tradeCutoffReason || "",
  };
}

function isOptimizedBestWindowItem(item) {
  const bestTimeNode = item.optimizedBestTimeNode || cityOptimizationForField(item.expectedField)?.bestTimeNode || "";
  return Boolean(item.optimizedIsBestWindow || (bestTimeNode && item.timeNode === bestTimeNode));
}

function historicalScore(item) {
  if ((item.optimizedWindowN || 0) > 0 && item.optimizedWindowTop2Accuracy != null) {
    const ruleN = item.optimizedRuleN || item.optimizedWindowN || 0;
    const ruleTop1Hits = item.optimizedRuleTop1Hits || item.optimizedWindowTop1Hits || 0;
    const ruleTop2Hits = item.optimizedRuleTop2Hits || item.optimizedWindowTop2Hits || 0;
    const ruleTop1Accuracy = item.optimizedRuleTop1Accuracy ?? item.optimizedWindowTop1Accuracy ?? 0;
    const ruleTop2Accuracy = item.optimizedRuleTop2Accuracy ?? item.optimizedWindowTop2Accuracy ?? 0;
    const history = {
      expectedField: item.expectedField,
      timeNode: item.timeNode,
      n: ruleN,
      top1Hits: ruleTop1Hits,
      top2Hits: ruleTop2Hits,
      top1Accuracy: ruleTop1Accuracy,
      top2Accuracy: ruleTop2Accuracy,
      optimizedModelName: item.optimizedModelName || "",
      optimizedModelLabel: item.optimizedModelLabel || "",
    };
    return {
      item,
      history,
      n: history.n,
      sample: item.modelSampleSize || 0,
      top1Accuracy: history.top1Accuracy,
      top2Accuracy: history.top2Accuracy,
      top1Hits: history.top1Hits,
      top2Hits: history.top2Hits,
      optimizedModelLabel: history.optimizedModelLabel,
      optimizedRuleLabel: item.optimizedBestRuleLabel || "全窗口",
      optimizedRuleBased: (item.optimizedBestRuleType || "all") !== "all",
      tradableBestWindow: item.optimizedWindowTradableBest !== false && isTradableEntryWindow(item.expectedField, item.timeNode),
      tradeCutoffReason: item.optimizedWindowCutoffReason || "",
    };
  }
  const top2Window = cityTop2WindowForItem(item);
  if (top2Window) return cityTop2WindowScore(item, top2Window);
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
      optimizedRuleLabel: "",
      optimizedRuleBased: false,
      tradableBestWindow: isTradableEntryWindow(item.expectedField, item.timeNode),
      tradeCutoffReason: "",
  };
}

function earlierTimeRank(timeNode) {
  return tradeCostStep(timeNode) ?? 99;
}

function compareHistoricalWindow(a, b) {
  return (
    (b.top2Accuracy || 0) - (a.top2Accuracy || 0) ||
    (b.n || 0) - (a.n || 0) ||
    earlierTimeRank(a.item?.timeNode || a.timeNode) - earlierTimeRank(b.item?.timeNode || b.timeNode) ||
    displayCity(a.item?.expectedField || a.expectedField).localeCompare(displayCity(b.item?.expectedField || b.expectedField))
  );
}

function limitTopWindowsPerCityDate(scores, limit = MAX_RECOMMENDATION_WINDOWS_PER_CITY_DAY) {
  const groups = new Map();
  for (const score of scores) {
    const key = `${score.item.date}|${cityKey(score.item.expectedField)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(score);
  }
  return [...groups.values()]
    .flatMap((items) => items.sort(compareHistoricalWindow).slice(0, limit));
}

function bestHistoricalForCityDate(item) {
  const key = cityKey(item.expectedField);
  return (state.data?.probabilityCandidates || [])
    .filter((candidate) => candidate.date === item.date && cityKey(candidate.expectedField) === key)
    .filter((candidate) => isRecommendationCandidateWindow(candidate))
    .map(historicalScore)
    .filter(Boolean)
    .filter((score) =>
      (score.n || 0) >= HISTORY_MIN_SAMPLE &&
      score.tradableBestWindow !== false &&
      (score.top2Accuracy || 0) >= HISTORY_TOP2_THRESHOLD
    )
    .sort(compareHistoricalWindow)[0] || null;
}

function windowAvailabilityForDate(date) {
  const allItems = state.data?.probabilityCandidates || [];
  const now = new Date();
  const availableTimes = new Set(
    allItems
      .filter((item) => item.date === date && tradeCostStep(item.timeNode) != null)
      .map((item) => item.timeNode),
  );
  const normalExpected = ["6点到7点", "10点到11点", "14点到15点", "17点到18点", "22点到23点"];
  const yesterdayExpected = ["昨6点到7点", "昨10点到11点", "昨14点到15点", "昨17点到18点", "昨22点到23点"];
  const normalCount = normalExpected.filter((time) => availableTimes.has(time)).length;
  const yesterdayCount = yesterdayExpected.filter((time) => availableTimes.has(time)).length;
  const expected = normalCount > 0 ? normalExpected : yesterdayExpected;
  const available = new Set(
    allItems
      .filter((item) => item.date === date && tradeCostStep(item.timeNode) != null)
      .map((item) => item.timeNode),
  );
  const itemsByTime = new Map();
  for (const item of allItems) {
    if (item.date !== date || tradeCostStep(item.timeNode) == null) continue;
    if (!itemsByTime.has(item.timeNode)) itemsByTime.set(item.timeNode, []);
    itemsByTime.get(item.timeNode).push(item);
  }
  const emptyTopTimes = new Set(
    [...itemsByTime.entries()]
      .filter(([, items]) => items.length && !items.some((item) => topProbabilities(item, 2).length))
      .map(([timeNode]) => timeNode),
  );
  const appeared = expected.filter((time) => available.has(time));
  const appearedEmptyTop = appeared.filter((time) => emptyTopTimes.has(time));
  const missing = expected.filter((time) => !available.has(time) && isFutureWindow(date, time, now));
  const expiredMissing = expected.filter((time) => !available.has(time) && !isFutureWindow(date, time, now));
  return {
    appeared,
    appearedEmptyTop,
    missing,
    expiredMissing,
    appearedText: appeared.length ? appeared.join("、") : "无",
    appearedEmptyTopText: appearedEmptyTop.length ? appearedEmptyTop.join("、") : "无",
    missingText: missing.length ? missing.join("、") : "无",
    expiredMissingText: expiredMissing.length ? expiredMissing.join("、") : "无",
  };
}

function windowAvailabilitySummaryText(availability) {
  const parts = [
    `已出：${availability.appearedText}`,
    `未出：${availability.missingText}`,
  ];
  if (availability.expiredMissingText && availability.expiredMissingText !== "无") {
    parts.push(`已过未出：${availability.expiredMissingText}`);
  }
  if (availability.appearedEmptyTopText && availability.appearedEmptyTopText !== "无") {
    parts.push(`已出无Top：${availability.appearedEmptyTopText}`);
  }
  return parts.join(" · ");
}

function missingWindowWatchlist(date, availability, excludedCityKeys = new Set()) {
  if (!state.accuracyMap) state.accuracyMap = buildAccuracyMap();
  const knownCities = new Set((state.data?.probabilityCandidates || []).map((item) => cityKey(item.expectedField)).filter(Boolean));
  const validCurrentKeys = new Set(
    (state.data?.probabilityCandidates || [])
      .filter((item) => item.date === date)
      .map((item) => accuracyKey(item.expectedField, item.timeNode)),
  );
  const bestByCity = new Map();
  const seen = new Set();
  const optimizedHistoryRows = (state.data?.cityModelOptimizations || [])
    .filter((optimization) => optimization.bestTimeNode)
    .map((optimization) => ({
      expectedField: optimization.expectedField,
      timeNode: optimization.bestTimeNode,
      n: optimization.bestN || 0,
      top1Accuracy: optimization.bestTop1Accuracy || 0,
      top2Accuracy: optimization.bestTop2Accuracy || 0,
      top1Hits: optimization.bestTop1Hits || 0,
      top2Hits: optimization.bestTop2Hits || 0,
      optimizedModelLabel: optimization.configLabel || "",
      optimizedRuleLabel: optimization.bestRuleLabel || "全样本",
      tradableBestWindow: isTradableEntryWindow(optimization.expectedField, optimization.bestTimeNode),
      tradeCutoffReason: "",
    }));
  const conditionHistoryRows = (state.data?.cityTop2Winrates?.cities || [])
    .flatMap((city) => (city.topWindows || []).map((window) => ({
      expectedField: city.expectedField,
      timeNode: window.timeNode,
      n: window.n || 0,
      top1Accuracy: window.top1Accuracy || 0,
      top2Accuracy: window.top2Accuracy || 0,
      top1Hits: window.top1Hits || 0,
      top2Hits: window.top2Hits || 0,
      optimizedModelLabel: window.configLabel || "",
      optimizedRuleLabel: window.ruleLabel || window.strategyLabel || "condition training",
      tradableBestWindow: window.tradableBestWindow !== false && isTradableEntryWindow(city.expectedField, window.timeNode),
      tradeCutoffReason: window.tradeCutoffReason || "",
    })));
  const sourceHistoryRows = conditionHistoryRows.length || optimizedHistoryRows.length
    ? [...conditionHistoryRows, ...optimizedHistoryRows]
    : (state.accuracy?.summary || []);
  for (const history of sourceHistoryRows) {
    const city = cityKey(history.expectedField);
    if (!knownCities.has(city) || excludedCityKeys.has(city)) continue;
    if (history.tradableBestWindow === false) continue;
    if (!isFutureWindow(date, history.timeNode)) continue;
    if (!missingWindowStrongHistoryEligible(history)) continue;
    const key = accuracyKey(history.expectedField, history.timeNode);
    if (validCurrentKeys.has(key) || seen.has(key)) continue;
    seen.add(key);
    const row = {
      expectedField: history.expectedField,
      timeNode: history.timeNode,
      n: history.n || 0,
      top1Accuracy: history.top1Accuracy || 0,
      top2Accuracy: history.top2Accuracy || 0,
      top1Hits: history.top1Hits || 0,
      top2Hits: history.top2Hits || 0,
      optimizedRuleLabel: history.optimizedRuleLabel || "全样本",
    };
    const current = bestByCity.get(city);
    if (!current || compareHistoricalWindow(row, current) < 0) bestByCity.set(city, row);
  }
  return [...bestByCity.values()]
    .sort((a, b) =>
      earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
      b.top2Accuracy - a.top2Accuracy ||
      (b.n || 0) - (a.n || 0) ||
      displayCity(a.expectedField).localeCompare(displayCity(b.expectedField))
    )
    .slice(0, 16);
}

function groupedWatchlist(items) {
  const groups = new Map();
  for (const item of items || []) {
    if (!groups.has(item.timeNode)) groups.set(item.timeNode, []);
    groups.get(item.timeNode).push(item);
  }
  return [...groups.entries()]
    .map(([timeNode, rows]) => ({
      timeNode,
      rows: rows.sort((a, b) =>
        b.top2Accuracy - a.top2Accuracy ||
        (b.n || 0) - (a.n || 0) ||
        displayCity(a.expectedField).localeCompare(displayCity(b.expectedField))
      ),
    }))
    .sort((a, b) => earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode));
}

function groupedProfitPicks(picks) {
  const groups = new Map();
  for (const pick of picks || []) {
    const timeNode = pick.item?.timeNode || pick.timeNode;
    if (!groups.has(timeNode)) groups.set(timeNode, []);
    groups.get(timeNode).push(pick);
  }
  return [...groups.entries()]
    .map(([timeNode, rows]) => ({
      timeNode,
      rows: rows.sort((a, b) =>
        b.top2Accuracy - a.top2Accuracy ||
        (b.n || 0) - (a.n || 0) ||
        displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
      ),
    }))
    .sort((a, b) => earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode));
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
    .filter((score) => (score.sample || 0) >= HISTORY_MIN_SAMPLE)
    .sort((a, b) =>
      b.bestEdge - a.bestEdge ||
      (b.sample || 0) - (a.sample || 0)
    )[0] || null;
}

function compareBySampleThenRaw(a, b) {
  return (
    compareCityFields(a.expectedField, b.expectedField) ||
    (b.modelSampleSize || 0) - (a.modelSampleSize || 0) ||
    topRawProbability(b) - topRawProbability(a)
  );
}

function missingWindowStrongHistoryEligible(history) {
  return Boolean(strongHistoryWatchEligible(history));
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
      compareCityFields(a.items[0]?.expectedField || a.city, b.items[0]?.expectedField || b.city) ||
      b.sampleScore - a.sampleScore ||
      b.probabilityScore - a.probabilityScore
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

function itemTradeStep(item) {
  const step = tradeCostStep(item?.timeNode);
  return step == null ? itemTimeIndex(item || {}) : step;
}

function bucketRiskRange(bucket, unit) {
  const span = bucketSpan({ bucket });
  if (!span) return null;
  const text = String(bucket || "");
  const hasRange = text.includes("-");
  if (unit === "F" && hasRange) {
    return { min: span.min, max: span.max + 0.99 };
  }
  if (unit !== "F" && !hasRange && Number.isFinite(span.min)) {
    return { min: span.min, max: span.min + 0.99 };
  }
  return span;
}

function sameCityDateItems(item) {
  return (state.data?.probabilityCandidates || [])
    .filter((candidate) =>
      candidate.date === item.date &&
      candidate.expectedField === item.expectedField &&
      candidate.predicted != null &&
      Number.isFinite(Number(candidate.predicted)) &&
      (candidate.probabilities || []).length
    )
    .sort((a, b) => itemTradeStep(a) - itemTradeStep(b));
}

function highPointItemAfter(item) {
  if (!item) return null;
  const baseStep = itemTradeStep(item);
  const candidates = sameCityDateItems(item)
    .filter((candidate) => itemTradeStep(candidate) >= baseStep);
  if (!candidates.length) return null;
  return candidates
    .sort((a, b) =>
      Number(b.predicted) - Number(a.predicted) ||
      itemTradeStep(b) - itemTradeStep(a)
    )[0] || null;
}

function timeZoneParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function timeZoneOffsetMinutes(timeZone, date) {
  const parts = timeZoneParts(date, timeZone);
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  return (localAsUtc - date.getTime()) / 60000;
}

function zonedLocalTimeToUtc(dateText, timeZone, hour = 10, minute = 30) {
  const match = String(dateText || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match || !timeZone) return null;
  const [, year, month, day] = match.map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute);
  let utcTime = wallTime;
  for (let index = 0; index < 3; index += 1) {
    const offset = timeZoneOffsetMinutes(timeZone, new Date(utcTime));
    utcTime = wallTime - offset * 60000;
  }
  return new Date(utcTime);
}

function dateUtcFromText(dateText) {
  const match = String(dateText || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  return Date.UTC(year, month - 1, day);
}

function localPeakBeijingTarget(item) {
  const timeZone = CITY_TIME_ZONES[normalizedCityKey(item?.expectedField)];
  const utcDate = zonedLocalTimeToUtc(item?.date, timeZone, 10, 30);
  const baseDateUtc = dateUtcFromText(item?.date);
  if (!utcDate || baseDateUtc == null) return null;
  const beijing = timeZoneParts(utcDate, "Asia/Shanghai");
  const beijingDateUtc = Date.UTC(beijing.year, beijing.month - 1, beijing.day);
  const dayOffset = Math.round((beijingDateUtc - baseDateUtc) / 86400000);
  return {
    timeZone,
    absoluteHour: dayOffset * 24 + beijing.hour + beijing.minute / 60,
  };
}

function timeNodeMidHour(timeNode) {
  const start = timeStartHour(timeNode);
  if (start == null) return null;
  return start + 0.5;
}

function timeNodeDayOffset(timeNode) {
  return isYesterdayTime(timeNode) ? -1 : 0;
}

function confirmationDistance(candidate, target) {
  const midHour = timeNodeMidHour(candidate.timeNode);
  if (!target || midHour == null) return Infinity;
  const absoluteHour = timeNodeDayOffset(candidate.timeNode) * 24 + midHour;
  return Math.abs(absoluteHour - target.absoluteHour);
}

const confirmationSlotHours = [6, 10, 14, 17, 22];

function confirmationAbsoluteHourForTimeNode(timeNode) {
  const midHour = timeNodeMidHour(timeNode);
  if (midHour == null) return null;
  return timeNodeDayOffset(timeNode) * 24 + midHour;
}

function preferredConfirmationSlot(target) {
  if (!target) return null;
  return confirmationSlotHours
    .map((hour) => ({
      dayOffset: 0,
      hour,
      absoluteHour: hour + 0.5,
      distance: Math.abs(hour + 0.5 - target.absoluteHour),
    }))
    .sort((a, b) =>
      a.distance - b.distance ||
      b.hour - a.hour
    )[0] || null;
}

function forcedConfirmationSlot(item) {
  const key = normalizedCityKey(item?.expectedField);
  if (ASIA_CONFIRMATION_CITY_KEYS.has(key)) {
    return {
      dayOffset: 0,
      hour: 10,
    };
  }
  if (EUROPE_CONFIRMATION_CITY_KEYS.has(key)) {
    return {
      dayOffset: 0,
      hour: 17,
    };
  }
  if (US_CONFIRMATION_CITY_KEYS.has(key)) {
    return {
      dayOffset: 0,
      hour: 22,
    };
  }
  return null;
}

function samePrefixAsPurchase(candidate, purchaseItem) {
  return isYesterdayTime(candidate?.timeNode) === isYesterdayTime(purchaseItem?.timeNode);
}

function trustedConfirmationItemAfter(item) {
  if (!item) return null;
  const baseStep = itemTradeStep(item);
  const candidates = sameCityDateItems(item)
    .filter((candidate) => itemTradeStep(candidate) > baseStep);
  if (!candidates.length) return null;
  const forcedSlot = forcedConfirmationSlot(item);
  if (forcedSlot) {
    return candidates
      .filter((candidate) =>
        timeNodeDayOffset(candidate.timeNode) === forcedSlot.dayOffset &&
        timeStartHour(candidate.timeNode) === forcedSlot.hour
      )
      .sort((a, b) => itemTradeStep(a) - itemTradeStep(b))[0] || null;
  }
  const target = localPeakBeijingTarget(item);
  if (!target) return highPointItemAfter(item);
  const preferredSlot = preferredConfirmationSlot(target);
  if (preferredSlot) {
    const strictMatch = candidates
      .filter((candidate) =>
        timeNodeDayOffset(candidate.timeNode) === preferredSlot.dayOffset &&
        timeStartHour(candidate.timeNode) === preferredSlot.hour
      )
      .sort((a, b) =>
        itemTradeStep(a) - itemTradeStep(b)
      )[0];
    if (strictMatch) return strictMatch;
    return null;
  }
  return candidates
    .map((candidate) => ({
      candidate,
      distance: confirmationDistance(candidate, target),
      samePrefix: samePrefixAsPurchase(candidate, item),
    }))
    .filter((entry) => entry.distance <= 4)
    .sort((a, b) =>
      a.distance - b.distance ||
      Number(b.samePrefix) - Number(a.samePrefix) ||
      itemTradeStep(a.candidate) - itemTradeStep(b.candidate)
    )[0]?.candidate || null;
}

function topTextForItem(item) {
  return topProbabilities(item, 2)
    .map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
    .join(" / ");
}

function topHasHigherBucket(top, range, unit) {
  return top.some((probability) => {
    const bucketRange = bucketRiskRange(probability.bucket, unit);
    return bucketRange && bucketRange.min > range.max && (probability.probability || 0) >= 0.12;
  });
}

function peakWindowCheckForItem(item) {
  const peakItem = trustedConfirmationItemAfter(item);
  if (!peakItem || sameItem(peakItem, item)) return null;
  const unit = item.unit || peakItem.unit || "C";
  const isFahrenheit = unit === "F";
  const rise = Number(peakItem.predicted) - Number(item.predicted);
  const originalTop = topProbabilities(item, 2);
  const peakTop = topProbabilities(peakItem, 2);
  if (rise < (isFahrenheit ? 1 : 0.35) && !topSetChanged(item, peakItem)) return null;

  const originalRanges = originalTop
    .map((probability) => bucketRiskRange(probability.bucket, unit))
    .filter(Boolean);
  const originalMax = originalRanges.length ? Math.max(...originalRanges.map((range) => range.max)) : null;
  const newHigher = originalMax != null && topHasHigherBucket(peakTop, { min: -Infinity, max: originalMax }, unit);
  const nearUpper = originalMax != null && Number(peakItem.predicted) >= originalMax - (isFahrenheit ? 0.6 : 0.35);
  if (!newHigher && !nearUpper && !topSetChanged(item, peakItem)) return null;

  const status = newHigher || Number(peakItem.predicted) > (originalMax ?? Infinity) ? "danger" : "observe";
  return {
    status,
    peakItem,
    rise,
    topText: topTextForItem(peakItem),
    reason: status === "danger"
      ? `当地10点附近确认窗口 ${peakItem.timeNode} 已上移到 ${peakItem.predicted}，Top2 变成 ${topTextForItem(peakItem)}`
      : `当地10点附近确认窗口 ${peakItem.timeNode} 预计 ${peakItem.predicted}，已经接近原Top2上沿，注意更高一档`,
  };
}

function peakHoldingRisk(item, holding) {
  const purchaseItem = holding.purchaseItem || findDashboardItem(holding.date, holding.timeNode, holding.expectedField);
  if (!purchaseItem) return null;
  const peakItem = trustedConfirmationItemAfter(purchaseItem);
  if (!peakItem || sameItem(peakItem, purchaseItem)) return null;
  const unit = peakItem.unit || purchaseItem.unit || "C";
  const isFahrenheit = unit === "F";
  const range = bucketRiskRange(holding.bucket, unit);
  if (!range) return null;
  const top = topProbabilities(peakItem, 2);
  const peakRank = rankOfBucket(peakItem, holding.bucket);
  const peakProbability = probabilityByBucket(peakItem, holding.bucket);
  const purchaseProbability = probabilityByBucket(purchaseItem, holding.bucket);
  const probabilityDrop = purchaseProbability - (peakProbability || 0);
  const rise = Number(peakItem.predicted) - Number(purchaseItem.predicted);
  const topShiftedAbove = top.length && top.every((probability) => {
    const bucketRange = bucketRiskRange(probability.bucket, unit);
    return bucketRange && bucketRange.min > range.max;
  });
  const higherTop = topHasHigherBucket(top, range, unit);
  const aboveUpper = Number(peakItem.predicted) > range.max;
  const nearUpper = Number(peakItem.predicted) >= range.max - (isFahrenheit ? 0.6 : 0.35);
  const meaningfulRise = rise >= (isFahrenheit ? 1 : 0.4);
  const movedOutAfterConfirmation =
    (peakRank == null || peakRank > 2) &&
    probabilityDrop >= 0.15 &&
    topSetChanged(purchaseItem, peakItem);

  if (movedOutAfterConfirmation) {
    return {
      status: "danger",
      action: "重新确认持仓",
      peakItem,
      probability: peakProbability,
      rank: peakRank,
      reason: `后续确认窗口 ${peakItem.timeNode} 的Top2已变成 ${topTextForItem(peakItem)}，持仓 ${holding.bucket} 从 ${Math.round((purchaseProbability || 0) * 100)}% 降到 ${Math.round((peakProbability || 0) * 100)}%`,
    };
  }

  if (topShiftedAbove || ((peakRank == null || peakRank > 2) && meaningfulRise && peakProbability < 0.15)) {
    return {
      status: "danger",
      action: "考虑止损",
      peakItem,
      probability: peakProbability,
      rank: peakRank,
      reason: `当地10点附近确认窗口 ${peakItem.timeNode} 的Top2已变成 ${topTextForItem(peakItem)}，持仓 ${holding.bucket} 已不在核心区`,
    };
  }

  if (aboveUpper && (meaningfulRise || higherTop)) {
    return {
      status: "danger",
      action: "考虑减仓",
      peakItem,
      probability: peakProbability,
      rank: peakRank,
      reason: `当地10点附近确认窗口 ${peakItem.timeNode} 预计 ${peakItem.predicted}，已经高过持仓 ${holding.bucket} 的安全上沿`,
    };
  }

  if (nearUpper && higherTop) {
    return {
      status: "observe",
      action: "警惕上破",
      peakItem,
      probability: peakProbability,
      rank: peakRank,
      reason: `当地10点附近确认窗口 ${peakItem.timeNode} 预计 ${peakItem.predicted}，更高温度已进入Top2：${topTextForItem(peakItem)}`,
    };
  }

  return null;
}

function stopLossSignal(item, holding, context) {
  const span = bucketSpan({ bucket: holding.bucket });
  if (!span || item.predicted == null || holding.purchaseItem?.predicted == null) return null;

  const unit = item.unit || holding.purchaseItem.unit || "C";
  const isFahrenheit = unit === "F";
  const predictedRise = item.predicted - holding.purchaseItem.predicted;
  const overUpper = item.predicted - span.max;
  const dangerOver = isFahrenheit ? 1 : 0.7;
  const meaningfulRise = predictedRise >= (isFahrenheit ? 1 : 0.4);
  const top = topProbabilities(item, 2);
  const top1 = top[0] || null;
  const topMin = top.length ? Math.min(...top.map(bucketSortValue)) : null;
  const higherTop = top.some((probability) =>
    bucketSortValue(probability) > span.max &&
    (probability.probability || 0) >= 0.2
  );
  const topShiftedAbove = topMin != null && topMin > span.max;
  const probabilityDrop = (context.purchaseProbability || 0) - (context.currentProbability || 0);
  const peakRisk = peakHoldingRisk(item, holding);

  if (peakRisk?.status === "danger") {
    return peakRisk;
  }

  if (topShiftedAbove) {
    return {
      status: "danger",
      action: "考虑止损",
      reason: `新Top2已经整体上移到 ${top.map((probability) => probability.bucket).join("/")}，原持仓 ${holding.bucket} 已落到下方`,
    };
  }

  if (
    context.rank === 2 &&
    top1 &&
    bucketSortValue(top1) > span.max &&
    (top1.probability || 0) >= 0.45 &&
    predictedRise >= (isFahrenheit ? 1 : 0.5)
  ) {
    return {
      status: "danger",
      action: "考虑减仓",
      reason: `更高温度 ${top1.bucket} 已经变成Top1，且预计从买入窗口上移 ${round(predictedRise, 2)}`,
    };
  }

  if ((context.rank == null || context.rank > 2) && probabilityDrop >= 0.15) {
    return {
      status: "danger",
      action: "考虑止损",
      reason: `原温度从 ${Math.round((context.purchaseProbability || 0) * 100)}% 降到 ${Math.round((context.currentProbability || 0) * 100)}%，且已不在当前Top2`,
    };
  }

  if (overUpper >= dangerOver && (meaningfulRise || higherTop)) {
    return {
      status: "danger",
      action: "考虑减仓",
      reason: `当前预计 ${item.predicted} 已明显高过持仓档 ${holding.bucket}，从买入窗口已上移 ${round(predictedRise, 2)}`,
    };
  }

  if (overUpper >= 0 && meaningfulRise && higherTop) {
    return {
      status: "observe",
      action: "警惕上破",
      reason: `当前预计 ${item.predicted} 已顶到 ${holding.bucket} 上沿，且更高温度进入Top2`,
    };
  }

  if (peakRisk?.status === "observe") {
    return peakRisk;
  }

  return null;
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
  const stopLoss = stopLossSignal(item, holding, {
    purchaseProbability,
    currentProbability,
    rank,
    nextProbability,
    nextRank,
  });
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
  } else if (stopLoss?.status === "danger") {
    status = "danger";
    action = stopLoss.action;
    reason = stopLoss.reason;
  } else if (stopLoss?.status === "observe") {
    status = "observe";
    action = stopLoss.action;
    reason = stopLoss.reason;
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
    stopLoss,
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

function activeHoldings() {
  return Object.entries(state.holdings || {})
    .filter(([, active]) => active)
    .map(([key, value]) => ({
      key,
      ...parseHoldingKey(key),
      snapshot: value && typeof value === "object" ? value : null,
    }))
    .filter((holding) => holding.date && holding.timeNode && holding.expectedField && holding.bucket);
}

function holdingCurrentCheck(item, bucket) {
  const history = historicalScore(item);
  const bestHistory = bestHistoricalForCityDate(item);
  const rank = rankOfBucket(item, bucket);
  const probability = probabilityByBucket(item, bucket);
  const sample = item.modelSampleSize || 0;
  const historyOk = Boolean(history && (history.n || 0) >= HISTORY_MIN_SAMPLE && (history.top2Accuracy || 0) >= HISTORY_TOP2_THRESHOLD);
  const bestOk = Boolean(bestHistory && sameItem(bestHistory.item, item));
  const bucketOk = rank != null && rank <= 2;
  const reasons = [];
  if (!history) reasons.push("没有历史胜率");
  else {
    if ((history.top2Accuracy || 0) < HISTORY_TOP2_THRESHOLD) reasons.push(`历史 Top2 ${history.top2Accuracy}% < ${HISTORY_TOP2_THRESHOLD}%`);
    if ((history.n || 0) < HISTORY_MIN_SAMPLE) reasons.push(`回测样本 ${history.n || 0} < ${HISTORY_MIN_SAMPLE}`);
  }
  if (!bestOk) reasons.push(bestHistory ? `同城同日最优是 ${bestHistory.item.timeNode}` : "同城同日没有达标推荐");
  if (!bucketOk) reasons.push(rank ? `该温度当前排名第 ${rank}` : "该温度不在当前概率列表");
  return {
    item,
    bucket,
    history,
    bestHistory,
    rank,
    probability,
    sample,
    buyable: historyOk && bestOk && bucketOk,
    reasons,
  };
}

function createHoldingSnapshot(item, bucket, sourceSnapshot = null) {
  const check = holdingCurrentCheck(item, bucket);
  return {
    heldAt: new Date().toISOString(),
    purchaseProbability: check.probability,
    purchaseRank: check.rank,
    purchaseTop1Accuracy: check.history?.top1Accuracy ?? null,
    purchaseTop2Accuracy: check.history?.top2Accuracy ?? null,
    purchaseHistoryN: check.history?.n ?? null,
    purchaseSample: check.sample,
    purchaseBestTimeNode: check.bestHistory?.item?.timeNode || null,
    purchaseRecommended: check.buyable,
    sourceSnapshot: sourceSnapshot ? {
      snapshotAt: sourceSnapshot.snapshotAt || "",
      predicted: sourceSnapshot.predicted ?? null,
      topText: snapshotTopText(sourceSnapshot),
      topBuckets: sourceSnapshot.topBuckets || [],
      topProbabilities: sourceSnapshot.topProbabilities || [],
    } : null,
  };
}

function recommendationSnapshotKeyForItem(item) {
  return `${item.date}|${cityKey(item.expectedField)}|${item.timeNode || ""}`;
}

function firstRecommendationSnapshotForItem(item) {
  const key = recommendationSnapshotKeyForItem(item);
  return (state.data?.recommendationSnapshots || [])
    .filter((snapshot) =>
      snapshot?.snapshotVersion === "full-window-top2-v1" &&
      `${snapshot.date}|${cityKey(snapshot.expectedField)}|${snapshot.timeNode || ""}` === key
    )
    .sort((a, b) => String(a.snapshotAt || "").localeCompare(String(b.snapshotAt || "")))[0] || null;
}

function holdingSourceProbabilities(item, sourceSnapshot) {
  if (sourceSnapshot?.topProbabilities?.length) return sourceSnapshot.topProbabilities;
  if (sourceSnapshot?.topBuckets?.length) {
    return sourceSnapshot.topBuckets.map((bucket) => ({ bucket, probability: null }));
  }
  return topProbabilities(item, 2);
}

function probabilityTextFromList(probabilities) {
  return (probabilities || [])
    .slice(0, 2)
    .map((probability) => probability.probability == null
      ? probability.bucket
      : `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
    .join(" / ");
}

function topBucketSignature(probabilities) {
  return (probabilities || [])
    .slice(0, 2)
    .map((probability) => String(probability.bucket))
    .join("|");
}

function sourceProbabilityByBucket(sourceSnapshot, bucket) {
  const found = (sourceSnapshot?.topProbabilities || [])
    .find((probability) => String(probability.bucket) === String(bucket));
  return found ? Number(found.probability || 0) : null;
}

function recommendationSnapshotChangeRisk(item, holding) {
  const sourceSnapshot = holding.snapshot?.sourceSnapshot || firstRecommendationSnapshotForItem(item);
  if (!sourceSnapshot) return null;
  const sourceTop = holdingSourceProbabilities(item, sourceSnapshot);
  const currentTop = topProbabilities(item, 2);
  if (!sourceTop.length || !currentTop.length) return null;
  const sourcePredicted = Number(sourceSnapshot.predicted);
  const currentPredicted = Number(item.predicted);
  const predictedDelta = Number.isFinite(sourcePredicted) && Number.isFinite(currentPredicted)
    ? currentPredicted - sourcePredicted
    : 0;
  const sourceProbability = sourceProbabilityByBucket(sourceSnapshot, holding.bucket);
  const currentProbability = probabilityByBucket(item, holding.bucket);
  const probabilityDrop = sourceProbability == null || currentProbability == null
    ? 0
    : sourceProbability - currentProbability;
  const topChanged = topBucketSignature(sourceTop) !== topBucketSignature(currentTop);
  const rank = rankOfBucket(item, holding.bucket);
  const movedOut = rank == null || rank > 2;
  const meaningfulPredictedMove = Math.abs(predictedDelta) >= ((item.unit || "C") === "F" ? 1 : 0.4);
  const meaningfulProbabilityDrop = probabilityDrop >= 0.15;
  if (!topChanged && !movedOut && !meaningfulPredictedMove && !meaningfulProbabilityDrop) return null;
  return {
    status: movedOut || topChanged || meaningfulProbabilityDrop ? "danger" : "observe",
    action: movedOut || topChanged ? "重新确认持仓" : "观察变化",
    sourceSnapshot,
    sourceTopText: probabilityTextFromList(sourceTop),
    currentTopText: probabilityTextFromList(currentTop),
    predictedDelta,
    probabilityDrop,
    rank,
    reason: `首次推荐后同窗口已变化：原Top2 ${probabilityTextFromList(sourceTop)}，当前Top2 ${probabilityTextFromList(currentTop)}，预计变化 ${round(predictedDelta, 2)}`,
  };
}

function currentRecommendationPickScores(limitPerDate = null) {
  const dates = recommendationDates(state.data?.probabilityCandidates || []);
  const bestByCityDate = new Map();
  const dateSet = new Set(dates);
  for (const item of state.data?.probabilityCandidates || []) {
    if (!dateSet.has(item.date)) continue;
    if (!isRecommendationCandidateWindow(item)) continue;
    const score = historicalScore(item);
    if (
      !score ||
      (score.n || 0) < HISTORY_MIN_SAMPLE ||
      score.tradableBestWindow === false ||
      (score.top2Accuracy || 0) < HISTORY_TOP2_THRESHOLD
    ) continue;
    const key = `${score.item.date}|${cityKey(score.item.expectedField)}|${score.item.timeNode}`;
    const current = bestByCityDate.get(key);
    if (!current || compareHistoricalWindow(score, current) < 0) bestByCityDate.set(key, score);
  }
  const picks = limitTopWindowsPerCityDate([...bestByCityDate.values()]);
  return dates.flatMap((date) =>
    picks
      .filter((pick) => pick.item.date === date)
      .sort((a, b) =>
        earlierTimeRank(a.item.timeNode) - earlierTimeRank(b.item.timeNode) ||
        b.top2Accuracy - a.top2Accuracy ||
        (b.n || 0) - (a.n || 0) ||
        displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
      )
      .slice(0, Number.isFinite(limitPerDate) ? limitPerDate : undefined)
  );
}

function defaultRecommendationHoldings() {
  return currentRecommendationPickScores()
    .flatMap((score) => {
      const sourceSnapshot = firstRecommendationSnapshotForItem(score.item);
      return holdingSourceProbabilities(score.item, sourceSnapshot).slice(0, 2).map((probability) => ({
        key: holdingKey(score.item, probability.bucket),
        date: score.item.date,
        timeNode: score.item.timeNode,
        expectedField: score.item.expectedField,
        bucket: probability.bucket,
        snapshot: createHoldingSnapshot(score.item, probability.bucket, sourceSnapshot),
        source: "recommendation",
        sourceLabel: "默认推荐Top2",
      }));
    });
}

function trackedHoldings() {
  const manual = activeHoldings().map((holding) => ({
    ...holding,
    source: "manual",
    sourceLabel: "手动持仓",
  }));
  const seen = new Set(manual.map((holding) => holding.key));
  const automatic = defaultRecommendationHoldings().filter((holding) => {
    if (seen.has(holding.key)) return false;
    seen.add(holding.key);
    return true;
  });
  return [...manual, ...automatic];
}

function probabilityPercentText(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function predictedDisplayText(item) {
  return item?.predicted == null ? "-" : String(item.predicted);
}

function compactTop2Text(item) {
  const top = topProbabilities(item, 2);
  return top.length
    ? top.map((probability) => `${probability.bucket} ${probabilityPercentText(probability.probability)}`).join(" / ")
    : "-";
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
  const anchor = $(".recommendation-board") || $(".profit-board") || $("#summaryGrid");
  if (!anchor) return null;
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
  anchor.after(board);
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

function renderProfitPickCard(pick) {
  const rawTier = pick.recommendationTier || (isMidRangePage() ? "mid" : "strong");
  const tier = rawTier === "mid" ? "extended" : rawTier;
  const tierText = "强推";
  return `
    <article class="profit-pick profit-${tier}">
      <div class="profit-card-head">
        <div class="profit-city-title">
          <strong>${displayCity(pick.item.expectedField)}</strong>
          <b class="pick-tier pick-tier-${tier}">${rawTier === "mid" ? "85-95" : tierText}</b>
        </div>
        <span>${pick.item.timeNode}</span>
      </div>
      <div class="buy-now">
        <span>\u9a6c\u4e0a\u770b</span>
        <b>${topProbabilities(pick.item, 2).map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`).join(" / ")}</b>
      </div>
      <div class="profit-main">
        <b>\u5386\u53f2Top2\u547d\u4e2d ${pick.top2Accuracy}%</b>
        <b>\u5386\u53f2Top1\u547d\u4e2d ${pick.top1Accuracy}%</b>
        <b>\u5386\u53f2\u7b2c\u4e8c\u540d\u547d\u4e2d ${historicalSecondHitAccuracy(pick)}%</b>
        <span>\u56de\u6d4b\u6837\u672c ${pick.n}</span>
      </div>
    </article>
  `;
}

function renderProfitPickWindowGroups(picks, countLabel) {
  if (!picks?.length) return "";
  return groupedProfitPicks(picks).map((windowGroup) => `
    <section class="profit-window-group">
      <div class="profit-window-title">
        <b>${windowGroup.timeNode}</b>
        <span>${windowGroup.rows.length} ${countLabel}</span>
      </div>
      <div class="profit-date-picks">
        ${windowGroup.rows.map(renderProfitPickCard).join("")}
      </div>
    </section>
  `).join("");
}

function recommendationScoresForItems(items, dates = null) {
  const bestByCityDate = new Map();
  const dateSet = dates ? new Set(dates) : null;
  for (const item of items || []) {
    if (dateSet && !dateSet.has(item.date)) continue;
    if (!isRecommendationCandidateWindow(item)) continue;
    const score = historicalScore(item);
    if (!score || score.tradableBestWindow === false) continue;
    const tier = recommendationOpportunityTier(item, score);
    if (!tier) continue;
    score.recommendationTier = tier;
    const key = `${score.item.date}|${cityKey(score.item.expectedField)}|${score.item.timeNode}`;
    const current = bestByCityDate.get(key);
    if (!current || compareHistoricalWindow(score, current) < 0) bestByCityDate.set(key, score);
  }
  return limitTopWindowsPerCityDate([...bestByCityDate.values()])
    .sort((a, b) =>
      b.top2Accuracy - a.top2Accuracy ||
      (b.n || 0) - (a.n || 0) ||
      earlierTimeRank(a.item.timeNode) - earlierTimeRank(b.item.timeNode) ||
      displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
    );
}

function currentRecommendationScores() {
  const dates = recommendationDates(state.data?.probabilityCandidates || []);
  return recommendationScoresForItems(state.data?.probabilityCandidates || [], dates);
}

function formatRankingPercent(value) {
  if (value == null || value === "") return "-";
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  const rounded = round(number, number % 1 === 0 ? 0 : 2);
  return `${rounded}%`;
}

function formatRankingSignedPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  const prefix = number > 0 ? "+" : "";
  return `${prefix}${formatRankingPercent(number)}`;
}

function formatRankingShortDate(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;
  return `${Number(match[2])}/${Number(match[3])}`;
}

function rankingDateRangeText(start, end) {
  if (!start || !end) return "";
  return `${formatRankingShortDate(start)}-${formatRankingShortDate(end)}`;
}

function rankingRecentHalfMetric(rankWindow) {
  const recentN = Number(rankWindow?.recentHalfN || 0);
  if (!recentN) return `<span><b>近半Top2</b>-</span>`;
  const delta = Number(rankWindow?.recentHalfTop2Delta);
  const trendClass = Number.isFinite(delta)
    ? delta > 0
      ? "ranking-trend-up"
      : delta < 0
        ? "ranking-trend-down"
        : "ranking-trend-flat"
    : "ranking-trend-flat";
  const dateRangeText = rankingDateRangeText(rankWindow.recentHalfStartDate, rankWindow.recentHalfEndDate);
  const hitText = [`${rankWindow.recentHalfTop2Hits || 0}/${recentN}`, dateRangeText].filter(Boolean).join(" · ");
  const previousText = Number(rankWindow?.previousHalfN || 0)
    ? `较前半 ${formatRankingSignedPercent(delta)}`
    : "前半样本不足";
  return `
    <span class="${trendClass}">
      <b>近半Top2</b>${formatRankingPercent(rankWindow.recentHalfTop2Accuracy)}
      <small>${hitText} · ${previousText}</small>
    </span>
  `;
}

function rankingRecentHalfTop1Metric(rankWindow) {
  const recentN = Number(rankWindow?.recentHalfN || 0);
  if (!recentN) return `<span><b>近半Top1命中</b>-</span>`;
  const top1Hits = Number(rankWindow?.recentHalfTop1Hits || 0);
  const storedAccuracy = Number(rankWindow?.recentHalfTop1Accuracy);
  const accuracy = Number.isFinite(storedAccuracy)
    ? storedAccuracy
    : round((top1Hits / recentN) * 100, 2);
  return `
    <span>
      <b>近半Top1命中</b>${formatRankingPercent(accuracy)}
      <small>${top1Hits}/${recentN}</small>
    </span>
  `;
}

function rankingRecentHalfSecondMetric(rankWindow) {
  const recentN = Number(rankWindow?.recentHalfN || 0);
  if (!recentN) return `<span><b>近半第二名命中</b>-</span>`;
  const top1Hits = Number(rankWindow?.recentHalfTop1Hits || 0);
  const top2Hits = Number(rankWindow?.recentHalfTop2Hits || 0);
  const secondHits = Math.max(0, top2Hits - top1Hits);
  const accuracy = round((secondHits / recentN) * 100, 2);
  return `
    <span>
      <b>近半第二名命中</b>${formatRankingPercent(accuracy)}
      <small>${secondHits}/${recentN}</small>
    </span>
  `;
}

function rankingRecentHalfTop2Accuracy(rankWindow) {
  const recentN = Number(rankWindow?.recentHalfN || 0);
  if (!recentN) return null;
  const recentTop2Accuracy = Number(rankWindow?.recentHalfTop2Accuracy);
  return Number.isFinite(recentTop2Accuracy) ? recentTop2Accuracy : null;
}

function rankingRecent10DayMetric(rankWindow) {
  const recentN = Number(rankWindow?.recent10DayN || 0);
  if (!recentN) return `<span><b>最近10次Top2</b>-</span>`;
  const dateRangeText = rankingDateRangeText(rankWindow.recent10DayStartDate, rankWindow.recent10DayEndDate);
  const hitText = [`${rankWindow.recent10DayTop2Hits || 0}/${recentN}`, dateRangeText].filter(Boolean).join(" · ");
  return `
    <span>
      <b>最近10次Top2</b>${formatRankingPercent(rankWindow.recent10DayTop2Accuracy)}
      <small>${hitText}</small>
    </span>
  `;
}

function rankingRecent10DayTop2Accuracy(rankWindow) {
  const recentN = Number(rankWindow?.recent10DayN || 0);
  if (!recentN) return null;
  const recentTop2Accuracy = Number(rankWindow?.recent10DayTop2Accuracy);
  return Number.isFinite(recentTop2Accuracy) ? recentTop2Accuracy : null;
}

function rankingTop2MetricValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function rankingTop2VoteScore(rankWindow) {
  return rankingTop2MetricValue(rankWindow?.top2Accuracy) +
    rankingTop2MetricValue(rankingRecent10DayTop2Accuracy(rankWindow)) +
    rankingTop2MetricValue(rankingRecentHalfTop2Accuracy(rankWindow));
}

function compareRankingTop2VoteWindows(a, b) {
  return rankingTop2VoteScore(b) - rankingTop2VoteScore(a) ||
    rankingTop2MetricValue(rankingRecent10DayTop2Accuracy(b)) - rankingTop2MetricValue(rankingRecent10DayTop2Accuracy(a)) ||
    rankingTop2MetricValue(rankingRecentHalfTop2Accuracy(b)) - rankingTop2MetricValue(rankingRecentHalfTop2Accuracy(a)) ||
    rankingTop2MetricValue(b?.top2Accuracy) - rankingTop2MetricValue(a?.top2Accuracy) ||
    Number(b?.n || 0) - Number(a?.n || 0);
}

function rankingTemperatureReminderStatus(rankWindow) {
  const top2Accuracy = Number(rankWindow?.top2Accuracy || 0);
  const recentTop2Accuracy = rankingRecentHalfTop2Accuracy(rankWindow);
  const recent10DayTop2Accuracy = rankingRecent10DayTop2Accuracy(rankWindow);
  if (top2Accuracy < CITY_RANKING_TEMPERATURE_REMINDER_TOP2_MIN) {
    return {
      eligible: false,
      reason: `历史Top2低于${CITY_RANKING_TEMPERATURE_REMINDER_TOP2_MIN}%，不提示温度`,
    };
  }
  if (recentTop2Accuracy == null) {
    return {
      eligible: false,
      reason: "近半Top2无样本，不提示温度",
    };
  }
  if (recentTop2Accuracy < CITY_RANKING_TEMPERATURE_REMINDER_RECENT_TOP2_MIN) {
    return {
      eligible: false,
      reason: `近半Top2 ${formatRankingPercent(recentTop2Accuracy)} < ${CITY_RANKING_TEMPERATURE_REMINDER_RECENT_TOP2_MIN}%，不提示温度`,
    };
  }
  if (recent10DayTop2Accuracy == null) {
    return {
      eligible: false,
      reason: "最近10次Top2无样本，不提示温度",
    };
  }
  if (recent10DayTop2Accuracy < CITY_RANKING_TEMPERATURE_REMINDER_RECENT_10_DAY_TOP2_MIN) {
    return {
      eligible: false,
      reason: `最近10次Top2 ${formatRankingPercent(recent10DayTop2Accuracy)} < ${CITY_RANKING_TEMPERATURE_REMINDER_RECENT_10_DAY_TOP2_MIN}%，不提示温度`,
    };
  }
  return {
    eligible: true,
    top2Accuracy,
    recentTop2Accuracy,
    recent10DayTop2Accuracy,
    smallPosition: [top2Accuracy, recentTop2Accuracy, recent10DayTop2Accuracy]
      .some((value) => Number.isFinite(Number(value)) && Number(value) < CITY_RANKING_SMALL_POSITION_TOP2_WARNING),
  };
}

function isRankingSmallPositionWindow(rankWindow) {
  return rankingTemperatureReminderStatus(rankWindow).smallPosition === true;
}

function isRankingTemperatureReminderEligible(row) {
  if (row?.retiredReason) return false;
  return rankingTemperatureReminderStatus(row?.window || row).eligible;
}

function isRankingCompoundPosition(row) {
  const rankWindow = row?.window || row;
  const top2Accuracy = Number(rankWindow?.top2Accuracy || 0);
  const recentTop2Accuracy = rankingRecentHalfTop2Accuracy(rankWindow);
  const recent10DayTop2Accuracy = rankingRecent10DayTop2Accuracy(rankWindow);
  return (
    top2Accuracy >= CITY_RANKING_COMPOUND_TOP2_MIN &&
    recentTop2Accuracy != null &&
    recentTop2Accuracy >= CITY_RANKING_COMPOUND_RECENT_TOP2_MIN &&
    recent10DayTop2Accuracy != null &&
    recent10DayTop2Accuracy >= CITY_RANKING_COMPOUND_RECENT_10_DAY_TOP2_MIN
  );
}

function rankingReminderSortTier(row) {
  if (!isRankingTemperatureReminderEligible(row)) return 2;
  return rankingReminderItems(row).length ? 0 : 1;
}

function compareCityRankingRows(a, b) {
  return Number(Boolean(a.retiredReason)) - Number(Boolean(b.retiredReason)) ||
    rankingReminderSortTier(a) - rankingReminderSortTier(b) ||
    compareRankingTop2VoteWindows(a.window, b.window) ||
    a.cityLabel.localeCompare(b.cityLabel) ||
    earlierTimeRank(a.window.timeNode) - earlierTimeRank(b.window.timeNode);
}

function cityRankingWindowLimit(city) {
  const key = cityKey(city?.expectedField || city?.city || "");
  if (key === "telaviv") return 6;
  if (key === "wellington") return 5;
  if (key === "madrid") return 6;
  return key === "miami" ? 3 : CITY_RANKING_WINDOWS_PER_CITY;
}

function cityRankingRetiredReason(city) {
  const key = normalizedCityKey(city?.expectedField || city?.city || city || "");
  if (RETIRED_CITY_DETAIL_NOTES[key]) return RETIRED_CITY_DETAIL_NOTES[key];
  const pausedNote = pausedRegistrationNoteForCity(city);
  if (pausedNote) return `${pausedNote} · 胜率太差，暂停更新`;
  return "";
}

function retiredCityKeysFromDashboardFields() {
  const keys = new Set(Object.keys(PAUSED_REGISTRATION_CITY_NOTES));
  for (const fieldName of state.data?.fieldNames || []) {
    const text = String(fieldName || "");
    if (!text.includes("\u592a\u5dee\u4e0d\u7edf\u8ba1")) continue;
    const cityName = text.split("\u6e29\u5ea6")[0] || text;
    const key = normalizedCityKey(cityName);
    if (key && !HIDDEN_CITY_KEYS.has(key)) keys.add(key);
  }
  return keys;
}

function retiredCityHistoryForKey(key) {
  const normalized = normalizedCityKey(key);
  const targetLabel = displayCity(normalized).toLowerCase();
  return (state.data?.retiredCityHistory?.cities || []).find((item) => {
    const itemKey = normalizedCityKey(item.cityKey || item.expectedField || item.city || "");
    const itemLabel = displayCity(item.city || item.cityKey || "").toLowerCase();
    return itemKey === normalized || itemLabel === targetLabel;
  }) || null;
}

function retiredCityPlaceholderWindow(key) {
  const historyWindow = retiredCityHistoryForKey(key)?.bestWindow || null;
  if (!historyWindow) {
    return {
      timeNode: "\u4e0d\u518d\u7edf\u8ba1",
      ruleLabel: "\u5df2\u6dd8\u6c70",
      top2Accuracy: null,
      top1Accuracy: null,
      top2Hits: null,
      top1Hits: null,
      recentHalfTop2Accuracy: null,
      recent10DayTop2Accuracy: null,
      n: 0,
    };
  }
  return {
    ...historyWindow,
    timeNode: historyWindow.timeNode || "\u4e0d\u518d\u7edf\u8ba1",
    ruleLabel: historyWindow.ruleLabel || "\u5386\u53f2\u5feb\u7167",
    retiredBestWindow: true,
  };
}

function retiredCityPlaceholderRows(existingCityKeys) {
  const existingCityLabels = new Set([...existingCityKeys].map((key) => displayCity(key).toLowerCase()));
  const seenCityLabels = new Set();
  return [...retiredCityKeysFromDashboardFields()]
    .filter((key) => {
      if (!key || existingCityKeys.has(key)) return false;
      const label = displayCity(key).toLowerCase();
      if (existingCityLabels.has(label) || seenCityLabels.has(label)) return false;
      seenCityLabels.add(label);
      return true;
    })
    .sort((a, b) => displayCity(a).localeCompare(displayCity(b)))
    .map((key) => {
      const city = { city: key, expectedField: key, retiredPlaceholder: true };
      return {
        city,
        cityLabel: displayCity(key),
        cityWindowRank: null,
        retiredPlaceholder: true,
        retiredReason: cityRankingRetiredReason(city) || "\u80dc\u7387\u592a\u5dee\uff0c\u5df2\u505c\u6b62\u7edf\u8ba1",
        window: retiredCityPlaceholderWindow(key),
      };
    });
}

function cityTop2RankingRows() {
  const rows = [];
  const existingCityKeys = new Set();
  for (const city of state.data?.cityTop2Winrates?.cities || []) {
    if (isHiddenCity(city)) continue;
    const cityLabel = displayCity(city.expectedField || city.city || "");
    const retiredReason = cityRankingRetiredReason(city);
    if (retiredReason) continue;
    existingCityKeys.add(normalizedCityKey(city.expectedField || city.city || ""));
    const selectedWindows = (city.topWindows || [])
      .filter((rankWindow) => Number.isFinite(Number(rankWindow?.top2Accuracy)))
      .slice()
      .sort((a, b) =>
        Number(b.top2Accuracy || 0) - Number(a.top2Accuracy || 0) ||
        Number(b.top1Accuracy || 0) - Number(a.top1Accuracy || 0) ||
        Number(b.n || 0) - Number(a.n || 0) ||
        earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode)
      )
      .slice(0, cityRankingWindowLimit(city));
    selectedWindows.forEach((rankWindow, cityWindowRank) => {
      rows.push({
        city,
        cityLabel,
        cityWindowRank: cityWindowRank + 1,
        window: rankWindow,
        retiredReason,
      });
    });
  }
  rows.push(...retiredCityPlaceholderRows(existingCityKeys));
  return rows.sort(compareCityRankingRows);
}

function rankingTimeCore(timeNode) {
  return comparableTimeCore(timeNode);
}

function rankingExactTimeKey(timeNode) {
  return String(timeNode || "").replace(/点/g, "");
}

function isSameRankingWindow(row, item) {
  return rankingExactTimeKey(item?.timeNode) === rankingExactTimeKey(row?.window?.timeNode);
}

function rankingReminderItems(row) {
  const dates = recommendationDates(state.data?.probabilityCandidates || []);
  const targetCity = cityKey(row.city?.expectedField || row.city?.city || row.cityLabel || "");
  const targetTime = rankingExactTimeKey(row.window?.timeNode);
  if (!dates.length || !targetCity || !targetTime) return [];
  return (state.data?.probabilityCandidates || [])
    .filter((item) => dates.includes(item.date))
    .filter((item) => cityKey(item.expectedField) === targetCity)
    .filter((item) => rankingExactTimeKey(item.timeNode) === targetTime)
    .filter((item) => isSameRankingWindow(row, item))
    .sort((a, b) =>
      dates.indexOf(a.date) - dates.indexOf(b.date) ||
      earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode)
    );
}

function rankingReminderLabel(item) {
  const dates = recommendationDates(state.data?.probabilityCandidates || []);
  const index = dates.indexOf(item.date);
  const label = index === 0 ? "今天" : index === 1 ? "明天" : item.date;
  return `${label} ${item.timeNode}`;
}

function rankingTemperatureReminder(row) {
  if (row?.retiredReason) {
    const sampleText = Number(row.window?.n || 0) ? `回测样本 ${row.window.n}` : "暂无足够样本";
    return `
      <div class="ranking-reminder ranking-reminder-muted ranking-reminder-retired">
        <b>窗口提醒</b>
        <span>已停止更新，仅展示历史最强窗口 · ${sampleText}</span>
      </div>
    `;
  }
  const status = rankingTemperatureReminderStatus(row.window);
  if (!status.eligible) {
    return `
      <div class="ranking-reminder ranking-reminder-muted">
        <b>窗口提醒</b>
        <span>${status.reason}</span>
      </div>
    `;
  }
  const items = rankingReminderItems(row);
  if (!items.length) {
    return `
      <div class="ranking-reminder ranking-reminder-pending">
        <b>窗口提醒</b>
        <span>今天/明天暂无该窗口数据</span>
      </div>
    `;
  }
  return `
    <div class="ranking-reminder ${status.smallPosition ? "ranking-reminder-low" : ""}">
      <b>窗口提醒</b>
      ${status.smallPosition ? `<span class="ranking-reminder-warning">胜率较低，仓位要较小</span>` : ""}
      ${items.map((item) => {
        const top = topProbabilities(item, 2);
        const text = top.length
          ? top.map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`).join(" / ")
          : "待该窗口数据";
        return `<span><em>${rankingReminderLabel(item)}</em>${text}</span>`;
      }).join("")}
    </div>
  `;
}

function rankingWindowRecommendationTier(row) {
  if (isRankingSmallPositionWindow(row?.window || row)) {
    return { key: "low", label: "小仓位" };
  }
  return { key: "watch", label: "Top2" };
}

function rankingWindowRecommendationEntries(rows) {
  const entries = new Map();
  for (const row of rows || []) {
    if (!isRankingTemperatureReminderEligible(row)) continue;
    for (const item of rankingReminderItems(row)) {
      const top = topProbabilities(item, 2);
      if (!top.length) continue;
      const key = [
        item.date,
        item.timeNode,
        cityKey(item.expectedField),
        rankingExactTimeKey(row.window?.timeNode),
      ].join("|");
      const entry = { row, item, top, tier: rankingWindowRecommendationTier(row) };
      const existing = entries.get(key);
      if (!existing || compareHistoricalWindow(entry.row.window, existing.row.window) < 0) entries.set(key, entry);
    }
  }
  return [...entries.values()].sort((a, b) =>
    String(a.item.date).localeCompare(String(b.item.date)) ||
    earlierTimeRank(a.item.timeNode) - earlierTimeRank(b.item.timeNode) ||
    compareRankingTop2VoteWindows(a.row.window, b.row.window) ||
    a.row.cityLabel.localeCompare(b.row.cityLabel)
  );
}

function rankingWindowRecommendationGroups(entries) {
  const groups = new Map();
  for (const entry of entries || []) {
    const key = entry.item.timeNode;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  return [...groups.entries()]
    .map(([timeNode, rows]) => ({
      timeNode,
      rows: rows.sort((a, b) =>
        compareRankingTop2VoteWindows(a.row.window, b.row.window) ||
        a.row.cityLabel.localeCompare(b.row.cityLabel)
      ),
    }))
    .sort((a, b) => earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode));
}

function rankingWindowHasCandidate(row, date) {
  const targetCity = cityKey(row.city?.expectedField || row.city?.city || row.cityLabel || "");
  const targetTime = rankingExactTimeKey(row.window?.timeNode);
  if (!targetCity || !targetTime) return false;
  return (state.data?.probabilityCandidates || []).some((item) =>
    item.date === date &&
    cityKey(item.expectedField) === targetCity &&
    rankingExactTimeKey(item.timeNode) === targetTime &&
    topProbabilities(item, 2).length
  );
}

function rankingWindowPendingGroups(rows, date) {
  const groups = new Map();
  for (const row of rows || []) {
    if (!isRankingTemperatureReminderEligible(row)) continue;
    if (rankingWindowHasCandidate(row, date)) continue;
    const timeNode = row.window?.timeNode || "";
    if (!timeNode) continue;
    if (!groups.has(timeNode)) groups.set(timeNode, []);
    groups.get(timeNode).push(row);
  }
  return [...groups.entries()]
    .map(([timeNode, pendingRows]) => ({
      date,
      timeNode,
      rows: pendingRows.sort((a, b) =>
        compareRankingTop2VoteWindows(a.window, b.window) ||
        a.cityLabel.localeCompare(b.cityLabel)
      ),
    }))
    .sort((a, b) => earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode));
}

function rankingTopTemperatureText(item) {
  const top = topProbabilities(item, 2);
  return top.length
    ? top.map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`).join(" / ")
    : "待该窗口数据";
}

function renderRankingWindowRecommendationCard(entry) {
  const row = entry.row;
  const rankWindow = row.window;
  return `
    <article class="ranking-time-card ranking-time-${entry.tier.key}">
      <div class="ranking-time-card-head">
        <div>
          <strong>${row.cityLabel}</strong>
          <span>城市第 ${row.cityWindowRank} 窗口 · ${rankWindow.ruleLabel || rankWindow.source || "全窗口"}</span>
        </div>
        <b>${entry.tier.label}</b>
      </div>
      <div class="buy-now ranking-time-buy">
        <span>马上看</span>
        <b>${rankingTopTemperatureText(entry.item)}</b>
      </div>
      ${entry.tier.key === "low" ? `<div class="ranking-time-warning">胜率较低，仓位要较小</div>` : ""}
      <div class="ranking-time-metrics">
        <span>历史Top2命中 <b>${formatRankingPercent(rankWindow.top2Accuracy)}</b></span>
        <span>最近10次Top2 <b>${formatRankingPercent(rankWindow.recent10DayTop2Accuracy)}</b></span>
        <span>近半Top2 <b>${formatRankingPercent(rankWindow.recentHalfTop2Accuracy)}</b></span>
        <span>历史Top1命中 <b>${formatRankingPercent(rankWindow.top1Accuracy)}</b></span>
        <span>历史第二名命中 <b>${formatRankingPercent(historicalSecondHitAccuracy(rankWindow))}</b></span>
        <span>回测样本 <b>${rankWindow.n || 0}</b></span>
      </div>
    </article>
  `;
}

function renderRankingWindowRecommendationGroups(entries) {
  const groups = rankingWindowRecommendationGroups(entries);
  if (!groups.length) {
    return `<div class="ranking-time-empty">当前已出窗口里，还没有历史 Top2 ≥ ${CITY_RANKING_TEMPERATURE_REMINDER_TOP2_MIN}%、近半 Top2 ≥ ${CITY_RANKING_TEMPERATURE_REMINDER_RECENT_TOP2_MIN}%、最近10次 Top2 ≥ ${CITY_RANKING_TEMPERATURE_REMINDER_RECENT_10_DAY_TOP2_MIN}% 的可看温度。</div>`;
  }
  return groups.map((group) => {
    return `
      <section class="ranking-time-group">
        <div class="ranking-time-group-title">
          <b>${group.timeNode}</b>
          <span>${group.rows.length} 个Top2窗口</span>
        </div>
        <div class="ranking-time-cards">
          ${group.rows.map(renderRankingWindowRecommendationCard).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function renderRankingPendingWindowGroups(groups) {
  const visibleGroups = (groups || []).filter((group) => group.rows.length);
  if (!visibleGroups.length) return "";
  return `
    <div class="ranking-time-pending">
      <strong>未出城市窗口预告</strong>
      <span>同一时间可能只有部分城市已出；这里列的是排行榜里还没拿到该城市温度概率的窗口。</span>
      ${visibleGroups.map((group) => {
        const shown = group.rows.slice(0, 8);
        const hiddenCount = Math.max(0, group.rows.length - shown.length);
        return `
          <section class="ranking-pending-group">
            <div class="ranking-pending-title">
              <b>${group.timeNode}</b>
              <span>${group.rows.length} 个城市窗口未出</span>
            </div>
            <div class="ranking-pending-list">
              ${shown.map((row) => `
                <article>
                  <b>${row.cityLabel}</b>
                  <span>${row.window.ruleLabel || row.window.source || "全窗口"} · Top2 ${formatRankingPercent(row.window.top2Accuracy)} · 近半 ${formatRankingPercent(row.window.recentHalfTop2Accuracy)} · 近10次 ${formatRankingPercent(row.window.recent10DayTop2Accuracy)} · n=${row.window.n || 0}</span>
                </article>
              `).join("")}
              ${hiddenCount ? `<article class="ranking-pending-more"><b>还有 ${hiddenCount} 个</b><span>在排行榜里继续往下看</span></article>` : ""}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderCityTop2TimeRecommendationBoard(rows) {
  const sourceRows = (rows || []).slice(0, CITY_RANKING_TIME_RECOMMENDATION_LIMIT);
  const dates = recommendationDates(state.data?.probabilityCandidates || []);
  const entries = rankingWindowRecommendationEntries(sourceRows);
  const byDate = dates
    .map((date, index) => {
      const availability = windowAvailabilityForDate(date);
      const dateEntries = entries.filter((entry) => entry.item.date === date);
      return {
        date,
        label: index === 0 ? "今天" : index === 1 ? "明天" : date,
        availability,
        entries: dateEntries,
        pendingGroups: rankingWindowPendingGroups(sourceRows, date),
      };
    })
    .filter((group) => group.entries.length || group.pendingGroups.length);
  if (!byDate.length) return "";
  return `
    <div class="ranking-time-board">
      <div class="ranking-time-board-head">
        <strong>时间窗口推荐</strong>
        <span>只取排行榜前 ${CITY_RANKING_TIME_RECOMMENDATION_LIMIT} 的城市窗口，且历史 Top2 ≥ ${CITY_RANKING_TEMPERATURE_REMINDER_TOP2_MIN}%、近半 Top2 ≥ ${CITY_RANKING_TEMPERATURE_REMINDER_RECENT_TOP2_MIN}%、最近10次 Top2 ≥ ${CITY_RANKING_TEMPERATURE_REMINDER_RECENT_10_DAY_TOP2_MIN}%；窗口出来就显示该看的 Top2 温度。</span>
      </div>
      ${byDate.map((group) => {
        return `
          <section class="ranking-time-date">
            <div class="ranking-time-date-title">
              <strong>${group.label}推荐</strong>
              <span>${group.date}</span>
              <span class="window-summary">${windowAvailabilitySummaryText(group.availability)}</span>
              <span class="window-summary strong-count">${group.entries.length} Top2</span>
            </div>
            ${renderRankingWindowRecommendationGroups(group.entries)}
            ${renderRankingPendingWindowGroups(group.pendingGroups)}
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderCityTop2RankingSummary(rows) {
  const summaryGrid = $("#summaryGrid");
  if (!summaryGrid) return;
  const cities = new Set(rows.map((row) => row.cityLabel));
  const bestRow = rows[0] || null;
  const bestTop2VoteScore = bestRow ? rankingTop2VoteScore(bestRow.window) : null;
  const generatedAt = state.data?.cityTop2Winrates?.generatedAt
    ? new Date(state.data.cityTop2Winrates.generatedAt)
    : null;
  const generatedText = generatedAt && !Number.isNaN(generatedAt.getTime())
    ? generatedAt.toLocaleString("zh-CN", { hour12: false })
    : "-";
  summaryGrid.innerHTML = `
    <div class="summary-card">
      <span class="label">入选城市</span>
      <strong>${cities.size}</strong>
      <small>默认每城最多 ${CITY_RANKING_WINDOWS_PER_CITY} 个窗口，Tel Aviv 和 Madrid 6 个，Wellington 5 个，Miami 3 个</small>
    </div>
    <div class="summary-card">
      <span class="label">入选窗口</span>
      <strong>${rows.length}</strong>
      <small>有开单机会优先，再按三项 Top2 总分排序</small>
    </div>
    <div class="summary-card">
      <span class="label">Top2总分</span>
      <strong>${bestRow ? formatRankingPercent(bestTop2VoteScore) : "-"}</strong>
      <small>${bestRow?.cityLabel || "-"} ${bestRow?.window?.timeNode || ""} · 10天+近半+全部</small>
    </div>
    <div class="summary-card">
      <span class="label">数据更新时间</span>
      <strong class="summary-small-value">${generatedText}</strong>
      <small>来源 city-top2-winrates-latest.json</small>
    </div>
  `;
}

function formatFixedStakeAmount(value, { signed = false } = {}) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";
  const rounded = Math.round(amount * 100) / 100;
  const prefix = signed && rounded > 0 ? "+" : "";
  return `${prefix}${rounded.toLocaleString("zh-CN", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function fixedStakeProfit(hits, sampleSize, stake, winRate) {
  const settledHits = Math.max(0, Number(hits || 0));
  const settledN = Math.max(settledHits, Number(sampleSize || 0));
  const misses = Math.max(0, settledN - settledHits);
  return settledHits * stake * winRate - misses * stake;
}

function renderFixedStakeBoard() {
  const container = $("#fixedStakeBoard");
  if (!container) return;
  const sourceRows = state.data?.cityTop2Winrates?.rows || [];
  const row = sourceRows.find((item) =>
    cityKey(item?.expectedField || item?.city) === "telaviv" &&
    item?.timeNode === "昨6点到7点"
  );
  if (!row) {
    container.innerHTML = `
      <div class="fixed-stake-empty">
        <strong>昨6点固定投入收益</strong>
        <span>当前数据中没有找到 Tel Aviv 昨6点到7点窗口。</span>
      </div>
    `;
    return;
  }

  const stake = 500;
  const allN = Number(row.n || 0);
  const allHits = Number(row.top2Hits || 0);
  const recentN = Number(row.recentHalfN || 0);
  const recentHits = Number(row.recentHalfTop2Hits || 0);
  const allMisses = Math.max(0, allN - allHits);
  const recentMisses = Math.max(0, recentN - recentHits);
  const rates = [13, 14, 15, 16, 17, 18];
  const dateRange = rankingDateRangeText(row.recentHalfStartDate, row.recentHalfEndDate);

  container.innerHTML = `
    <div class="fixed-stake-head">
      <div>
        <span class="fixed-stake-eyebrow">固定投入测算</span>
        <h2>Tel Aviv 昨6点 Top2 收益</h2>
      </div>
      <div class="fixed-stake-rule">
        <strong>每次投入 ${formatFixedStakeAmount(stake)}</strong>
        <span>不复投 · 命中按档位净赚 · 未命中损失 ${formatFixedStakeAmount(stake)}</span>
      </div>
    </div>
    <div class="fixed-stake-samples">
      <div>
        <span>近半样本</span>
        <strong>${recentHits}/${recentN}</strong>
        <small>${formatRankingPercent(row.recentHalfTop2Accuracy)} · 错 ${recentMisses} 次${dateRange ? ` · ${dateRange}` : ""}</small>
      </div>
      <div>
        <span>全部历史</span>
        <strong>${allHits}/${allN}</strong>
        <small>${formatRankingPercent(row.top2Accuracy)} · 错 ${allMisses} 次</small>
      </div>
      <div>
        <span>保本所需命中盈利</span>
        <strong>${allHits ? formatRankingPercent((allMisses / allHits) * 100) : "-"}</strong>
        <small>按全部历史命中/错误次数计算</small>
      </div>
    </div>
    <div class="fixed-stake-table-wrap">
      <table class="fixed-stake-table">
        <thead>
          <tr>
            <th>命中盈利率</th>
            <th>每次命中赚</th>
            <th>近半累计净盈利</th>
            <th>全部历史累计净盈利</th>
          </tr>
        </thead>
        <tbody>
          ${rates.map((rate) => {
            const winRate = rate / 100;
            const recentProfit = fixedStakeProfit(recentHits, recentN, stake, winRate);
            const allProfit = fixedStakeProfit(allHits, allN, stake, winRate);
            return `
              <tr class="${rate === 15 ? "fixed-stake-reference" : ""}">
                <td><strong>${rate}%</strong>${rate === 15 ? `<small>常用档</small>` : ""}</td>
                <td>${formatFixedStakeAmount(stake * winRate, { signed: true })}</td>
                <td class="fixed-stake-positive">${formatFixedStakeAmount(recentProfit, { signed: true })}</td>
                <td class="fixed-stake-positive">${formatFixedStakeAmount(allProfit, { signed: true })}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
    <p class="fixed-stake-footnote">累计净盈利 = 命中次数 × 每次命中盈利 − 错误次数 × 500；未计手续费、点差和滑点。</p>
  `;
}

function renderCityTop2RankingPage() {
  const rows = cityTop2RankingRows();
  renderFixedStakeBoard();
  renderCityTop2RankingSummary(rows);
  const container = $("#profitPicks");
  if (!container) return;
  if (!rows.length) {
    container.innerHTML = `<div class="profit-empty">还没有可展示的城市窗口胜率数据。</div>`;
    return;
  }
  container.innerHTML = `
    <div class="ranking-note">
      <strong>城市窗口 Top2 排行榜</strong>
      <span>默认每个城市只取历史 Top2 命中率最高的 ${CITY_RANKING_WINDOWS_PER_CITY} 个窗口，Tel Aviv 和 Madrid 展示 6 个窗口，Wellington 展示 5 个窗口，Miami 展示 3 个窗口；有提示窗口排前面，胜率太差或暂停更新的城市保留在榜尾，每城只展示样本足够的历史最强 1 个窗口。</span>
    </div>
    <div class="ranking-list">
      ${rows.map((row, index) => {
        const rankWindow = row.window;
        const pausedNote = pausedRegistrationNoteForCity(row.city);
        const compoundPosition = isRankingCompoundPosition(row);
        return `
          <article class="ranking-row ${compoundPosition ? "ranking-row-compound" : ""} ${row.retiredReason ? "ranking-row-retired" : ""}">
            <div class="ranking-rank">#${index + 1}</div>
            <div class="ranking-city">
              <strong>${row.cityLabel}</strong>
              ${compoundPosition ? `<span class="ranking-compound-badge">极大仓位复利</span>` : ""}
              ${pausedNote ? `<span class="ranking-city-pause">${pausedNote}</span>` : ""}
              <span>${row.retiredPlaceholder ? "\u5df2\u505c\u6b62\u7edf\u8ba1 \u00b7 \u5386\u53f2\u6700\u5f3a\u7a97\u53e3" : `城市第 ${row.cityWindowRank} 窗口`}</span>
            </div>
            <div class="ranking-window">
              <strong>${rankWindow.timeNode || "-"}</strong>
              <span>${rankWindow.ruleLabel || rankWindow.source || "全窗口"}</span>
            </div>
            ${rankingTemperatureReminder(row)}
            <div class="ranking-metrics">
              <span><b>历史Top2命中</b>${formatRankingPercent(rankWindow.top2Accuracy)}</span>
              ${rankingRecent10DayMetric(rankWindow)}
              ${rankingRecentHalfMetric(rankWindow)}
              ${rankingRecentHalfTop1Metric(rankWindow)}
              ${rankingRecentHalfSecondMetric(rankWindow)}
              <span><b>历史Top1命中</b>${formatRankingPercent(rankWindow.top1Accuracy)}</span>
              <span><b>历史第二名命中</b>${formatRankingPercent(historicalSecondHitAccuracy(rankWindow))}</span>
              <span><b>回测样本</b>${rankWindow.n || 0}</span>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderProfitPicks() {
  const container = $("#profitPicks");
  if (!container) return;
  const modeText = recommendationModeText();
  const dates = recommendationDates(state.data?.probabilityCandidates || []);
  const picks = currentRecommendationScores();
  const grouped = dates
    .map((date, index) => {
      const availability = windowAvailabilityForDate(date);
      const allDatePicks = picks
        .filter((pick) => pick.item.date === date)
        .sort((a, b) =>
          earlierTimeRank(a.item.timeNode) - earlierTimeRank(b.item.timeNode) ||
          b.top2Accuracy - a.top2Accuracy ||
          (b.n || 0) - (a.n || 0) ||
          displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
        );
      return {
        date,
        label: index === 0 ? "今天" : index === 1 ? "明天" : date,
        availability,
        picks: allDatePicks,
        watchlist: [],
      };
    })
    .filter((group) => group.picks.length);
  if (!grouped.length) {
    container.innerHTML = `<div class="profit-empty">当前两天没有历史 Top2 命中率 >= ${HISTORY_TOP2_THRESHOLD}% 且回测样本 >= ${HISTORY_MIN_SAMPLE} 的窗口。</div>`;
    return;
  }
  container.innerHTML = grouped
    .map((group) => `
      <section class="profit-date-group">
        <div class="profit-date-title">
          <strong>${group.label}推荐</strong>
          <span>${group.date}</span>
          <span class="window-summary">${windowAvailabilitySummaryText(group.availability)}</span>
          <span class="window-summary strong-count">${group.picks.length} 强推</span>
        </div>
        <div class="profit-window-groups">
          ${renderProfitPickWindowGroups(group.picks, "个信号")}
        </div>
        ${group.watchlist.length ? `
          <div class="missing-watchlist">
            <strong>${group.label}待出强推（计入推荐）</strong>
            <span class="watchlist-note">下面这些也是当前版本强推，会计入推荐总数和后续命中率；等该窗口数据出来后，按当时页面 Top2 买入并复盘。规则：历史Top2不低于 ${HISTORY_TOP2_THRESHOLD}%，当前Top2合计不低于 ${STRONG_RECOMMENDATION_CURRENT_TOP2_THRESHOLD}%，满足历史稳定筛选；样本 ≥ ${STRONG_RECOMMENDATION_MIN_SAMPLE}，同窗口和同城稳定，每城每天最多 ${MAX_RECOMMENDATION_WINDOWS_PER_CITY_DAY} 个窗口。</span>
            <div class="watch-window-groups">
              ${groupedWatchlist(group.watchlist).map((windowGroup) => `
                <section class="watch-window-group">
                  <div class="watch-window-title">
                    <b>${windowGroup.timeNode}</b>
                    <span>${windowGroup.rows.length} 个待出强推</span>
                  </div>
                  <div class="watch-city-list">
                    ${windowGroup.rows.map((item) => `
                      <article>
                        <b>${displayCity(item.expectedField)}</b>
                        <span>待出强推 · ${item.optimizedRuleLabel || "全窗口"} · Top2 ${item.top2Accuracy}% · n=${item.n}</span>
                      </article>
                    `).join("")}
                  </div>
                </section>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </section>
    `)
    .join("");
  if (isMidRangePage()) {
    container.querySelectorAll(".strong-count").forEach((node) => {
      const count = String(node.textContent || "").match(/\d+/)?.[0] || "0";
      node.textContent = `${count} ${modeText}`;
    });
  }
}

function recommendationScoreFromItem(item) {
  if ((item.optimizedWindowN || 0) > 0 && item.optimizedWindowTop2Accuracy != null) {
    return {
      n: item.optimizedRuleN || item.optimizedWindowN || 0,
      sample: item.modelSampleSize || 0,
      top1Hits: item.optimizedRuleTop1Hits || item.optimizedWindowTop1Hits || 0,
      top2Hits: item.optimizedRuleTop2Hits || item.optimizedWindowTop2Hits || 0,
      top1Accuracy: item.optimizedRuleTop1Accuracy ?? item.optimizedWindowTop1Accuracy ?? 0,
      top2Accuracy: item.optimizedRuleTop2Accuracy ?? item.optimizedWindowTop2Accuracy ?? 0,
    };
  }
  const top2Window = cityTop2WindowForItem(item);
  if (top2Window) {
    return {
      n: top2Window.n || 0,
      sample: item.modelSampleSize || 0,
      top1Hits: top2Window.top1Hits || 0,
      top2Hits: top2Window.top2Hits || 0,
      top1Accuracy: top2Window.top1Accuracy ?? 0,
      top2Accuracy: top2Window.top2Accuracy ?? 0,
    };
  }
  return {
    n: 0,
    sample: item.modelSampleSize || 0,
    top1Hits: 0,
    top2Hits: 0,
    top1Accuracy: 0,
    top2Accuracy: 0,
  };
}

function historicalSecondHitAccuracy(row) {
  if (!row || (row.n == null && row.top2Accuracy == null && row.top1Accuracy == null)) return null;
  const n = Number(row?.n || 0);
  const top1Hits = Number(row?.top1Hits || 0);
  const top2Hits = Number(row?.top2Hits || 0);
  if (n > 0 && top2Hits >= top1Hits && (top2Hits > 0 || top1Hits > 0)) {
    return round(((top2Hits - top1Hits) / n) * 100, 2);
  }
  return round(Math.max(0, Number(row?.top2Accuracy || 0) - Number(row?.top1Accuracy || 0)), 2);
}

function isMediumClusterProbability(value) {
  return (
    value >= MEDIUM_CLUSTER_RECOMMENDATION_CURRENT_TOP2_MIN &&
    value < MEDIUM_CLUSTER_RECOMMENDATION_CURRENT_TOP2_MAX
  );
}

function strongCoreHistoryEligible(row) {
  return Boolean(
    row &&
    (row.n || 0) >= STRONG_RECOMMENDATION_MIN_SAMPLE &&
    (row.top2Accuracy || 0) > STRONG_RECOMMENDATION_TOP2_THRESHOLD &&
    historicalSecondHitAccuracy(row) >= STRONG_RECOMMENDATION_SECOND_HIT_THRESHOLD
  );
}

function strongRecommendationHistoryFloorEligible(row) {
  return Boolean(
    row &&
    (row.n || 0) >= STRONG_RECOMMENDATION_MIN_SAMPLE &&
    (row.top2Accuracy || 0) >= STRONG_RECOMMENDATION_TOP2_THRESHOLD
  );
}

function strongRecommendationEdgeEligible(row, currentSecondProbability) {
  return Boolean(
    (row?.top1Accuracy || 0) >= STRONG_RECOMMENDATION_TOP1_THRESHOLD ||
    currentSecondProbability >= STRONG_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD
  );
}

function strongHistoryWatchEligible(row) {
  return Boolean(
    strongCoreHistoryEligible(row) &&
    (
      (row?.top1Accuracy || 0) >= STRONG_RECOMMENDATION_TOP1_THRESHOLD ||
      historicalSecondHitAccuracy(row) >= STRONG_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD
    )
  );
}

function balancedExpansionHistoryEligible(row) {
  return Boolean(
    row &&
    (row.n || 0) >= STRONG_RECOMMENDATION_MIN_SAMPLE &&
    (row.top2Accuracy || 0) >= BALANCED_EXPANSION_RECOMMENDATION_TOP2_THRESHOLD &&
    (row.top1Accuracy || 0) >= BALANCED_EXPANSION_RECOMMENDATION_TOP1_THRESHOLD &&
    historicalSecondHitAccuracy(row) >= STRONG_RECOMMENDATION_SECOND_HIT_THRESHOLD
  );
}

function mediumClusterHistoryEligible(row) {
  return Boolean(
    row &&
    (row.n || 0) >= STRONG_RECOMMENDATION_MIN_SAMPLE &&
    (row.top2Accuracy || 0) >= MEDIUM_CLUSTER_RECOMMENDATION_TOP2_THRESHOLD &&
    (row.top1Accuracy || 0) >= STRONG_RECOMMENDATION_TOP1_THRESHOLD &&
    historicalSecondHitAccuracy(row) >= STRONG_RECOMMENDATION_SECOND_HIT_THRESHOLD
  );
}

function mediumClusterStabilityEligible(row) {
  return Boolean(
    recommendationWindowStabilityEligible(row) &&
    recommendationCityStabilityEligible(row)
  );
}

function strongRecommendationCoreEligible(item, score) {
  const row = score || recommendationScoreFromItem(item);
  const currentTop2Probability = itemTop2ProbabilitySum(item);
  const currentSecondProbability = itemTopRankProbability(item, 2);
  return Boolean(
    strongCoreHistoryEligible(row) &&
    currentTop2Probability >= STRONG_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    strongRecommendationEdgeEligible(row, currentSecondProbability) &&
    recommendationStabilityEligible(item) &&
    weatherPredictionSanityEligible(item) &&
    recommendationBucketsNearPredictionEligible(item) &&
    topProbabilities(item, 2).length >= 2
  );
}

function balancedExpansionRecommendationEligible(item, score) {
  const row = score || recommendationScoreFromItem(item);
  const currentTop2Probability = itemTop2ProbabilitySum(item);
  const currentSecondProbability = itemTopRankProbability(item, 2);
  return Boolean(
    balancedExpansionHistoryEligible(row) &&
    currentTop2Probability >= BALANCED_EXPANSION_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    currentSecondProbability >= BALANCED_EXPANSION_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    recommendationStabilityEligible(item) &&
    weatherPredictionSanityEligible(item) &&
    recommendationBucketsNearPredictionEligible(item) &&
    topProbabilities(item, 2).length >= 2
  );
}

function mediumClusterRecommendationEligible(item, score) {
  const row = score || recommendationScoreFromItem(item);
  const currentTop2Probability = itemTop2ProbabilitySum(item);
  const currentSecondProbability = itemTopRankProbability(item, 2);
  return Boolean(
    mediumClusterHistoryEligible(row) &&
    isMediumClusterProbability(currentTop2Probability) &&
    currentSecondProbability >= MEDIUM_CLUSTER_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    mediumClusterStabilityEligible(item) &&
    weatherPredictionSanityEligible(item) &&
    recommendationBucketsNearPredictionEligible(item) &&
    topProbabilities(item, 2).length >= 2
  );
}

function strongRecommendationEligible(item, score) {
  const row = score || recommendationScoreFromItem(item);
  return Boolean(
    strongRecommendationHistoryFloorEligible(row) &&
    (
      strongRecommendationCoreEligible(item, row) ||
      balancedExpansionRecommendationEligible(item, row)
    )
  );
}

function extendedRecommendationEligible(item, score) {
  const row = score || recommendationScoreFromItem(item);
  return Boolean(
    row &&
    !strongRecommendationEligible(item, row) &&
    (row.n || 0) >= EXTENDED_RECOMMENDATION_MIN_SAMPLE &&
    (row.top2Accuracy || 0) >= EXTENDED_RECOMMENDATION_TOP2_THRESHOLD &&
    historicalSecondHitAccuracy(row) >= EXTENDED_RECOMMENDATION_SECOND_HIT_THRESHOLD &&
    itemTop2ProbabilitySum(item) >= EXTENDED_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    itemTopRankProbability(item, 2) >= EXTENDED_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    recommendationBucketsNearPredictionEligible(item) &&
    topProbabilities(item, 2).length >= 2
  );
}

function midRangeRecommendationEligible(item, score) {
  const row = score || recommendationScoreFromItem(item);
  const top2Accuracy = Number(row?.top2Accuracy || 0);
  return Boolean(
    row &&
    !strongRecommendationEligible(item, row) &&
    (row.n || 0) >= MID_RECOMMENDATION_MIN_SAMPLE &&
    top2Accuracy >= MID_RECOMMENDATION_TOP2_MIN &&
    top2Accuracy < MID_RECOMMENDATION_TOP2_MAX &&
    itemTop2ProbabilitySum(item) >= MID_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    itemTopRankProbability(item, 2) >= MID_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    recommendationWindowStabilityEligible(item) &&
    weatherPredictionSanityEligible(item) &&
    recommendationBucketsNearPredictionEligible(item) &&
    topProbabilities(item, 2).length >= 2
  );
}

function recommendationOpportunityTier(item, score) {
  if (isMidRangePage()) return midRangeRecommendationEligible(item, score) ? "mid" : "";
  if (strongRecommendationEligible(item, score)) return "strong";
  return "";
}

function extendedRecommendationNotes(item, score) {
  const row = score || recommendationScoreFromItem(item);
  const notes = [];
  if (!recommendationWindowStabilityEligible(item)) notes.push("\u540c\u7a97\u53e3\u7a33\u5b9a\u672a\u8fc7");
  if (recommendationWindowStabilityEligible(item) && !recommendationRecentAddedPoolEligible(item)) notes.push("\u65b0\u589e\u6c60\u672a\u8fc7");
  if ((row?.top1Accuracy || 0) < STRONG_RECOMMENDATION_TOP1_THRESHOLD) {
    notes.push(`Top1 ${row.top1Accuracy}%`);
  }
  return notes.join("\u3001") || "\u653e\u5bbd\u673a\u4f1a";
}

function recommendationStabilityEligible(row) {
  return Boolean(
    recommendationWindowStabilityEligible(row) &&
    recommendationRecentAddedPoolEligible(row) &&
    recommendationCityRecentNonzeroEligible(row)
  );
}

function recommendationCityRecentNonzeroEligible(row) {
  const cityN = Number(row?.recommendationStabilityCityN || 0);
  const cityHits = Number(row?.recommendationStabilityCityHits || 0);
  return cityN < RECOMMENDATION_STABILITY_LOOKBACK || cityHits > 0;
}

function recommendationCityStabilityEligible(row) {
  const cityN = Number(row?.recommendationStabilityCityN || 0);
  const cityHits = Number(row?.recommendationStabilityCityHits || 0);
  return cityN < RECOMMENDATION_STABILITY_LOOKBACK || cityHits >= RECOMMENDATION_STABILITY_MIN_HITS;
}

function recommendationWindowStabilityEligible(row) {
  const windowN = Number(row?.recommendationStabilityWindowN || 0);
  const windowHits = Number(row?.recommendationStabilityWindowHits || 0);
  return windowN < RECOMMENDATION_STABILITY_LOOKBACK || windowHits >= RECOMMENDATION_STABILITY_MIN_HITS;
}

function recommendationRecentAddedPoolEligible(row) {
  if (recommendationCityStabilityEligible(row)) return true;
  const n = Number(row?.recommendationRecentAddedPoolN || 0);
  const hitRate = Number(row?.recommendationRecentAddedPoolHitRate);
  return Boolean(
    n >= RECOMMENDATION_RECENT_ADDED_POOL_MIN_SAMPLE &&
    Number.isFinite(hitRate) &&
    hitRate >= RECOMMENDATION_RECENT_ADDED_POOL_TOP2_THRESHOLD
  );
}

function strongRecommendationRowEligible(row) {
  return buyRuleRecommendationRowEligible(row);
}

function buyRuleRecommendationRowEligible(row) {
  return Boolean(
    strongRecommendationHistoryFloorEligible(row) &&
    (
      strongRecommendationCoreRowEligible(row) ||
      balancedExpansionRecommendationRowEligible(row)
    )
  );
}

function recommendationRowAsItem(row) {
  return {
    date: row?.date,
    expectedField: row?.expectedField,
    predicted: row?.predicted,
    unit: row?.unit || "",
    probabilities: row?.topProbabilities || [],
  };
}

function recommendationRowWeatherPredictionSanityEligible(row) {
  return weatherPredictionSanityEligible(recommendationRowAsItem(row));
}

function recommendationRowBucketsNearPredictionEligible(row) {
  return recommendationBucketsNearPredictionEligible(recommendationRowAsItem(row));
}

function strongRecommendationCoreRowEligible(row) {
  const currentTop2Probability = recommendationTopProbabilitySum(row);
  const currentSecondProbability = recommendationTopRankProbability(row, 2);
  return Boolean(
    strongCoreHistoryEligible(row) &&
    currentTop2Probability >= STRONG_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    strongRecommendationEdgeEligible(row, currentSecondProbability) &&
    recommendationStabilityEligible(row) &&
    recommendationRowWeatherPredictionSanityEligible(row) &&
    recommendationRowBucketsNearPredictionEligible(row) &&
    (row.topBuckets?.length || recommendationTopBucketsFromText(row.topText).length) >= 2
  );
}

function balancedExpansionRecommendationRowEligible(row) {
  const currentTop2Probability = recommendationTopProbabilitySum(row);
  const currentSecondProbability = recommendationTopRankProbability(row, 2);
  return Boolean(
    balancedExpansionHistoryEligible(row) &&
    currentTop2Probability >= BALANCED_EXPANSION_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    currentSecondProbability >= BALANCED_EXPANSION_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    recommendationStabilityEligible(row) &&
    recommendationRowWeatherPredictionSanityEligible(row) &&
    recommendationRowBucketsNearPredictionEligible(row) &&
    (row.topBuckets?.length || recommendationTopBucketsFromText(row.topText).length) >= 2
  );
}

function mediumClusterRecommendationRowEligible(row) {
  const currentTop2Probability = recommendationTopProbabilitySum(row);
  const currentSecondProbability = recommendationTopRankProbability(row, 2);
  return Boolean(
    mediumClusterHistoryEligible(row) &&
    isMediumClusterProbability(currentTop2Probability) &&
    currentSecondProbability >= MEDIUM_CLUSTER_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    mediumClusterStabilityEligible(row) &&
    recommendationRowWeatherPredictionSanityEligible(row) &&
    recommendationRowBucketsNearPredictionEligible(row) &&
    (row.topBuckets?.length || recommendationTopBucketsFromText(row.topText).length) >= 2
  );
}

function extendedRecommendationRowEligible(row) {
  return Boolean(
    row &&
    !strongRecommendationRowEligible(row) &&
    (row.n || 0) >= EXTENDED_RECOMMENDATION_MIN_SAMPLE &&
    (row.top2Accuracy || 0) >= EXTENDED_RECOMMENDATION_TOP2_THRESHOLD &&
    historicalSecondHitAccuracy(row) >= EXTENDED_RECOMMENDATION_SECOND_HIT_THRESHOLD &&
    recommendationTopProbabilitySum(row) >= EXTENDED_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    recommendationTopRankProbability(row, 2) >= EXTENDED_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    (row.topBuckets?.length || recommendationTopBucketsFromText(row.topText).length) >= 2
  );
}

function midRangeRecommendationRowEligible(row) {
  const top2Accuracy = Number(row?.top2Accuracy || 0);
  return Boolean(
    row &&
    !strongRecommendationRowEligible(row) &&
    (row.n || 0) >= MID_RECOMMENDATION_MIN_SAMPLE &&
    top2Accuracy >= MID_RECOMMENDATION_TOP2_MIN &&
    top2Accuracy < MID_RECOMMENDATION_TOP2_MAX &&
    recommendationTopProbabilitySum(row) >= MID_RECOMMENDATION_CURRENT_TOP2_THRESHOLD &&
    recommendationTopRankProbability(row, 2) >= MID_RECOMMENDATION_SECOND_PROBABILITY_THRESHOLD &&
    recommendationWindowStabilityEligible(row) &&
    recommendationRowWeatherPredictionSanityEligible(row) &&
    recommendationRowBucketsNearPredictionEligible(row) &&
    (row.topBuckets?.length || recommendationTopBucketsFromText(row.topText).length) >= 2
  );
}

function activeRecommendationRowEligible(row) {
  return isMidRangePage()
    ? midRangeRecommendationRowEligible(row)
    : buyRuleRecommendationRowEligible(row);
}

function recommendationEligible(item) {
  const score = recommendationScoreFromItem(item);
  return Boolean(
    isRecommendationCandidateWindow(item) &&
    strongRecommendationEligible(item, score)
  );
}

function recommendationTopText(item) {
  return topProbabilities(item, 2)
    .map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
    .join(" / ");
}

function recommendationTopBucketsFromText(text) {
  return String(text || "")
    .split("/")
    .map((part) => part.trim().replace(/\s+\d+%$/, "").trim())
    .filter(Boolean);
}

function itemTop2ProbabilitySum(item) {
  return Math.round(
    topProbabilities(item, 2)
      .reduce((sum, probability) => sum + Number(probability.probability || 0), 0) * 100
  );
}

function itemTopRankProbability(item, rank) {
  const probability = topProbabilities(item, 2)[rank - 1];
  return Math.round(Number(probability?.probability || 0) * 100);
}

function recommendationProbabilityPercents(row) {
  const probabilities = row.topProbabilities || [];
  if (probabilities.length) {
    return probabilities
      .slice(0, 2)
      .map((probability) => Math.round(Number(probability.probability || 0) * 100));
  }
  return (String(row.topText || "").match(/\d+%/g) || [])
    .slice(0, 2)
    .map((text) => Number(text.replace("%", "")));
}

function recommendationTopRankProbability(row, rank) {
  return recommendationProbabilityPercents(row)[rank - 1] || 0;
}

function recommendationTopProbabilitySum(row) {
  return recommendationProbabilityPercents(row)
    .reduce((sum, probability) => sum + probability, 0);
}

function recommendationMissDirection(row) {
  if (row.pending || row.hit || !row.actualBucket) return null;
  const topBuckets = row.topBuckets?.length ? row.topBuckets : recommendationTopBucketsFromText(row.topText);
  if (!topBuckets.length) return "unknown";
  const actual = bucketSpan({ bucket: row.actualBucket });
  if (!actual) return "unknown";
  const spans = topBuckets.map((bucket) => bucketSpan({ bucket })).filter(Boolean);
  if (!spans.length) return "unknown";
  const topMin = Math.min(...spans.map((span) => span.min));
  const topMax = Math.max(...spans.map((span) => span.max));
  const actualMid = (actual.min + actual.max) / 2;
  if (actualMid > topMax) return "high";
  if (actualMid < topMin) return "low";
  return "near";
}

function recommendationDirectionText(direction) {
  if (direction === "high") return "实际高于推荐Top2";
  if (direction === "low") return "实际低于推荐Top2";
  if (direction === "near") return "实际贴近但不在Top2";
  return "方向不明";
}

function recommendationTrackRow(item, pending = false) {
  const top = topProbabilities(item, 2);
  const score = recommendationScoreFromItem(item);
  return {
    key: `${item.date}|${cityKey(item.expectedField)}|${item.timeNode || ""}`,
    date: item.date,
    expectedField: item.expectedField,
    city: displayCity(item.expectedField),
    timeNode: item.timeNode,
    topText: top
      .map((probability) => `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
      .join(" / "),
    topBuckets: top.map((probability) => probability.bucket),
    topProbabilities: top.map((probability) => ({
      bucket: probability.bucket,
      probability: probability.probability || 0,
    })),
    actualBucket: item.actualBucket || "",
    hit: item.top2Hit === true,
    pending,
    fromSnapshot: false,
    top1Hits: score.top1Hits || 0,
    top2Hits: score.top2Hits || 0,
    top1Accuracy: score.top1Accuracy,
    top2Accuracy: score.top2Accuracy,
    n: score.n,
    sample: score.sample,
    predicted: item.predicted,
    unit: item.unit || "",
    recommendationStabilityCityN: item.recommendationStabilityCityN || 0,
    recommendationStabilityCityHits: item.recommendationStabilityCityHits || 0,
    recommendationStabilityCityHitRate: item.recommendationStabilityCityHitRate ?? null,
    recommendationStabilityWindowN: item.recommendationStabilityWindowN || 0,
    recommendationStabilityWindowHits: item.recommendationStabilityWindowHits || 0,
    recommendationStabilityWindowHitRate: item.recommendationStabilityWindowHitRate ?? null,
    recommendationCityStabilityPassed: item.recommendationCityStabilityPassed !== false,
    recommendationWindowStabilityPassed: item.recommendationWindowStabilityPassed !== false,
    recommendationRecentAddedPoolN: item.recommendationRecentAddedPoolN || 0,
    recommendationRecentAddedPoolHits: item.recommendationRecentAddedPoolHits || 0,
    recommendationRecentAddedPoolHitRate: item.recommendationRecentAddedPoolHitRate ?? null,
    recommendationRecentAddedPoolPassed: item.recommendationRecentAddedPoolPassed !== false,
    recommendationStabilityPassed: item.recommendationStabilityPassed !== false,
  };
}

function currentRecommendationTrackRowsByKey() {
  const rows = new Map();
  for (const score of currentRecommendationScores()) {
    const row = recommendationTrackRow(score.item, score.item.actual == null);
    row.sourceItem = score.item;
    rows.set(row.key, row);
  }
  return rows;
}

function recommendationTrackRowFromWatchlist(item, date) {
  return {
    key: `${date}|${cityKey(item.expectedField)}|${item.timeNode || ""}`,
    date,
    expectedField: item.expectedField,
    city: displayCity(item.expectedField),
    timeNode: item.timeNode,
    topText: "待该窗口数据",
    topBuckets: [],
    topProbabilities: [],
    actualBucket: "",
    hit: false,
    pending: true,
    fromSnapshot: false,
    fromWatchlist: true,
    top1Hits: item.top1Hits || 0,
    top2Hits: item.top2Hits || 0,
    top1Accuracy: item.top1Accuracy || 0,
    top2Accuracy: item.top2Accuracy || 0,
    n: item.n || 0,
    sample: item.n || 0,
    optimizedRuleLabel: item.optimizedRuleLabel || "全窗口",
    recommendationCityStabilityPassed: true,
    recommendationWindowStabilityPassed: true,
    recommendationRecentAddedPoolPassed: true,
    recommendationStabilityPassed: true,
  };
}

function currentWatchlistTrackRowsByKey() {
  const rows = new Map();
  for (const date of recommendationDates(state.data?.probabilityCandidates || [])) {
    const availability = windowAvailabilityForDate(date);
    for (const item of missingWindowWatchlist(date, availability)) {
      const row = recommendationTrackRowFromWatchlist(item, date);
      rows.set(row.key, row);
    }
  }
  return rows;
}

function snapshotTopText(snapshot) {
  if (snapshot.topText) return snapshot.topText;
  const probabilities = snapshot.topProbabilities || [];
  if (probabilities.length) {
    return probabilities
      .map((probability) => probability.probability == null
        ? probability.bucket
        : `${probability.bucket} ${Math.round((probability.probability || 0) * 100)}%`)
      .join(" / ");
  }
  return (snapshot.topBuckets || []).join(" / ");
}

function recommendationTrackRowFromSnapshot(snapshot) {
  return {
    key: `${snapshot.date}|${cityKey(snapshot.expectedField)}|${snapshot.timeNode || ""}`,
    date: snapshot.date,
    expectedField: snapshot.expectedField,
    city: displayCity(snapshot.expectedField),
    timeNode: snapshot.timeNode,
    topText: snapshotTopText(snapshot),
    topBuckets: snapshot.topBuckets || recommendationTopBucketsFromText(snapshotTopText(snapshot)),
    topProbabilities: snapshot.topProbabilities || [],
    actualBucket: snapshot.actualBucket || "",
    hit: snapshot.top2Hit === true,
    pending: !snapshot.settled,
    fromSnapshot: true,
    recommendationRuleEligible: snapshot.recommendationRuleEligible === true,
    snapshotSource: snapshot.source || "",
    top1Hits: snapshot.optimizedRuleTop1Hits || snapshot.optimizedWindowTop1Hits || 0,
    top2Hits: snapshot.optimizedRuleTop2Hits || snapshot.optimizedWindowTop2Hits || 0,
    top1Accuracy: snapshot.optimizedRuleTop1Accuracy ?? snapshot.optimizedWindowTop1Accuracy ?? 0,
    top2Accuracy: snapshot.optimizedRuleTop2Accuracy ?? snapshot.optimizedWindowTop2Accuracy ?? 0,
    n: snapshot.optimizedRuleN || snapshot.optimizedWindowN || 0,
    sample: snapshot.modelSampleSize || 0,
    snapshotAt: snapshot.snapshotAt || "",
    predicted: snapshot.predicted,
    unit: snapshot.unit || "",
    recommendationStabilityCityN: snapshot.recommendationStabilityCityN || 0,
    recommendationStabilityCityHits: snapshot.recommendationStabilityCityHits || 0,
    recommendationStabilityCityHitRate: snapshot.recommendationStabilityCityHitRate ?? null,
    recommendationStabilityWindowN: snapshot.recommendationStabilityWindowN || 0,
    recommendationStabilityWindowHits: snapshot.recommendationStabilityWindowHits || 0,
    recommendationStabilityWindowHitRate: snapshot.recommendationStabilityWindowHitRate ?? null,
    recommendationCityStabilityPassed: snapshot.recommendationCityStabilityPassed !== false,
    recommendationWindowStabilityPassed: snapshot.recommendationWindowStabilityPassed !== false,
    recommendationRecentAddedPoolN: snapshot.recommendationRecentAddedPoolN || 0,
    recommendationRecentAddedPoolHits: snapshot.recommendationRecentAddedPoolHits || 0,
    recommendationRecentAddedPoolHitRate: snapshot.recommendationRecentAddedPoolHitRate ?? null,
    recommendationRecentAddedPoolPassed: snapshot.recommendationRecentAddedPoolPassed !== false,
    recommendationStabilityPassed: snapshot.recommendationStabilityPassed !== false,
  };
}

function displaySnapshotExpectedField(snapshot) {
  if (snapshot?.expectedField) return snapshot.expectedField;
  if (snapshot?.cityKey) return `${snapshot.cityKey}\u9884\u8ba1`;
  return "";
}

function displaySnapshotTrackKey(snapshot) {
  if (snapshot?.key) return snapshot.key;
  const expectedField = displaySnapshotExpectedField(snapshot);
  return `${snapshot.date}|${cityKey(expectedField)}|${snapshot.timeNode || ""}`;
}

function displaySnapshotReferenceRowsByKey() {
  const rows = new Map();
  for (const snapshot of state.data?.recommendationSnapshots || []) {
    if (!snapshot?.date || !snapshot?.expectedField || !snapshot?.timeNode) continue;
    const row = recommendationTrackRowFromSnapshot(snapshot);
    rows.set(row.key, row);
  }
  for (const item of state.data?.recommendationResults || []) {
    if (!item?.date || !item?.expectedField || !item?.timeNode) continue;
    const row = recommendationTrackRow(item, item.actual == null);
    const current = rows.get(row.key);
    if (!current || (current.pending && !row.pending)) rows.set(row.key, row);
  }
  return rows;
}

function recommendationTrackRowFromDisplaySnapshot(snapshot, referenceRows) {
  const expectedField = displaySnapshotExpectedField(snapshot);
  const key = displaySnapshotTrackKey(snapshot);
  const reference = referenceRows.get(key);
  const row = reference ? { ...reference } : {
    key,
    date: snapshot.date,
    expectedField,
    city: snapshot.city || displayCity(expectedField),
    timeNode: snapshot.timeNode,
    topText: snapshot.topText || "",
    topBuckets: recommendationTopBucketsFromText(snapshot.topText || ""),
    topProbabilities: [],
    actualBucket: snapshot.actualBucket || "",
    hit: snapshot.top2Hit === true,
    pending: snapshot.settled === true ? false : true,
    fromSnapshot: false,
    top1Hits: snapshot.top1Hits || 0,
    top2Hits: snapshot.top2Hits || 0,
    top1Accuracy: snapshot.top1Accuracy || 0,
    top2Accuracy: snapshot.top2Accuracy || 0,
    n: snapshot.n || 0,
    sample: snapshot.sample || snapshot.n || 0,
    snapshotAt: snapshot.snapshotAt || snapshot.displayedAt || "",
    predicted: snapshot.predicted,
    unit: snapshot.unit || "",
    recommendationCityStabilityPassed: true,
    recommendationWindowStabilityPassed: true,
    recommendationRecentAddedPoolPassed: true,
    recommendationStabilityPassed: true,
  };
  row.key = key;
  row.date = snapshot.date || row.date;
  row.expectedField = expectedField || row.expectedField;
  row.city = snapshot.city || row.city || displayCity(row.expectedField);
  row.timeNode = snapshot.timeNode || row.timeNode;
  row.fromDisplaySnapshot = true;
  row.fromWatchlist = row.fromWatchlist || snapshot.fromWatchlist === true;
  row.snapshotAt = row.snapshotAt || snapshot.snapshotAt || snapshot.displayedAt || "";
  row.displaySnapshotSource = snapshot.source || "";
  if (snapshot.topText) {
    row.topText = snapshot.topText;
    row.topBuckets = snapshot.topBuckets || recommendationTopBucketsFromText(snapshot.topText);
  }
  if (snapshot.topProbabilities?.length) {
    row.topProbabilities = snapshot.topProbabilities;
  }
  if (snapshot.actualBucket != null) row.actualBucket = snapshot.actualBucket;
  if (snapshot.top2Hit != null) row.hit = snapshot.top2Hit === true;
  if (snapshot.settled === true) row.pending = false;
  if (snapshot.top1Accuracy != null) row.top1Accuracy = snapshot.top1Accuracy;
  if (snapshot.top2Accuracy != null) row.top2Accuracy = snapshot.top2Accuracy;
  if (snapshot.n != null) row.n = snapshot.n;
  if (!reference && snapshot.pending != null) row.pending = Boolean(snapshot.pending);
  return row;
}

function buildDisplaySnapshotGroupList() {
  const referenceRows = displaySnapshotReferenceRowsByKey();
  const byKey = new Map();
  for (const snapshot of state.data?.recommendationDisplaySnapshots || []) {
    if (!snapshot?.date || !snapshot?.timeNode) continue;
    const row = recommendationTrackRowFromDisplaySnapshot(snapshot, referenceRows);
    byKey.set(row.key, row);
  }
  const groups = new Map();
  for (const row of byKey.values()) {
    if (!groups.has(row.date)) groups.set(row.date, []);
    groups.get(row.date).push(row);
  }
  return [...groups.entries()]
    .map(([date, rows]) => ({
      date,
      fromDisplaySnapshots: true,
      rows: rows.sort((a, b) =>
        earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
        b.top2Accuracy - a.top2Accuracy ||
        b.n - a.n ||
        a.city.localeCompare(b.city)
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function limitRecommendationTrackRowsPerCityDate(rows, limit = MAX_RECOMMENDATION_WINDOWS_PER_CITY_DAY) {
  const groups = new Map();
  for (const row of rows) {
    const key = String(row.key || "").split("|").slice(0, 2).join("|") || `${row.date}|${row.city}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.values()]
    .flatMap((items) => items.sort(compareHistoricalWindow).slice(0, limit));
}

function buildRecommendationTrackGroupList() {
  const byKey = new Map();
  for (const score of recommendationScoresForItems(state.data?.recommendationResults || [])) {
    const row = recommendationTrackRow(score.item, score.item.actual == null);
    row.sourceItem = score.item;
    byKey.set(row.key, row);
  }
  for (const score of currentRecommendationScores()) {
    const row = recommendationTrackRow(score.item, score.item.actual == null);
    row.sourceItem = score.item;
    byKey.set(row.key, row);
  }
  const groups = new Map();
  for (const row of limitRecommendationTrackRowsPerCityDate([...byKey.values()])) {
    if (!groups.has(row.date)) groups.set(row.date, []);
    groups.get(row.date).push(row);
  }
  return [...groups.entries()]
    .map(([date, rows]) => ({
      date,
      rows: rows.sort((a, b) =>
        earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
        b.top2Accuracy - a.top2Accuracy ||
        b.n - a.n ||
        a.city.localeCompare(b.city)
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function buildActiveRuleHistoryGroupList() {
  const rows = recommendationScoresForItems(state.data?.probabilityCandidates || [])
    .map((score) => {
      const row = recommendationTrackRow(score.item, score.item.actual == null);
      row.sourceItem = score.item;
      row.recommendationTier = score.recommendationTier;
      return row;
    });
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.date)) groups.set(row.date, []);
    groups.get(row.date).push(row);
  }
  return [...groups.entries()]
    .map(([date, groupRows]) => ({
      date,
      fromActiveRuleHistory: true,
      rows: groupRows.sort((a, b) =>
        earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
        b.top2Accuracy - a.top2Accuracy ||
        b.n - a.n ||
        a.city.localeCompare(b.city)
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function buildMidRangeHistoryGroupList() {
  const byKey = new Map();
  const addGroups = (groups) => {
    for (const group of groups || []) {
      for (const row of group.rows || []) {
        if (!row?.key) continue;
        const current = byKey.get(row.key);
        if (!current || (!row.pending && current.pending)) byKey.set(row.key, row);
      }
    }
  };

  addGroups(buildBalanceHistoryGroupList());
  addGroups(buildActiveRuleHistoryGroupList());

  const groups = new Map();
  for (const row of byKey.values()) {
    if (!groups.has(row.date)) groups.set(row.date, []);
    groups.get(row.date).push(row);
  }
  return [...groups.entries()]
    .map(([date, rows]) => ({
      date,
      fromMidRangeHistory: true,
      rows: rows.sort((a, b) =>
        earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
        b.top2Accuracy - a.top2Accuracy ||
        b.n - a.n ||
        a.city.localeCompare(b.city)
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function buildRecordedBalanceRecommendationGroupList() {
  const byKey = new Map();
  for (const snapshot of state.data?.recommendationSnapshots || []) {
    if (!snapshot?.date || !snapshot?.expectedField || !snapshot?.timeNode) continue;
    const row = recommendationTrackRowFromSnapshot(snapshot);
    const current = byKey.get(row.key);
    const rowTime = String(row.snapshotAt || "");
    const currentTime = String(current?.snapshotAt || "");
    if (
      !current ||
      (current.pending && !row.pending) ||
      (rowTime && currentTime && rowTime.localeCompare(currentTime) < 0)
    ) {
      byKey.set(row.key, row);
    }
  }

  const groups = new Map();
  for (const row of byKey.values()) {
    if (!groups.has(row.date)) groups.set(row.date, []);
    groups.get(row.date).push(row);
  }
  return [...groups.entries()]
    .map(([date, rows]) => ({
      date,
      fromRecordedSnapshots: true,
      rows: rows.sort((a, b) =>
        earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
        b.top2Accuracy - a.top2Accuracy ||
        b.n - a.n ||
        a.city.localeCompare(b.city)
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function mergeRecommendationTrackGroups(existing, incoming) {
  if (!existing) return incoming;
  const byKey = new Map((existing.rows || []).map((row) => [row.key, row]));
  for (const row of incoming.rows || []) {
    const current = byKey.get(row.key);
    if (
      !current ||
      (current.pending && !row.pending) ||
      (row.fromDisplaySnapshot && !current.fromDisplaySnapshot)
    ) {
      byKey.set(row.key, row);
    }
  }
  return {
    ...existing,
    fromRecordedSnapshots: existing.fromRecordedSnapshots || incoming.fromRecordedSnapshots,
    fromDisplaySnapshots: existing.fromDisplaySnapshots || incoming.fromDisplaySnapshots,
    rows: [...byKey.values()].sort((a, b) =>
      earlierTimeRank(a.timeNode) - earlierTimeRank(b.timeNode) ||
      b.top2Accuracy - a.top2Accuracy ||
      b.n - a.n ||
      a.city.localeCompare(b.city)
    ),
  };
}

function buildBalanceHistoryGroupList() {
  const currentGroups = buildRecommendationTrackGroupList();
  const recordedGroups = buildRecordedBalanceRecommendationGroupList();
  const displayGroups = buildDisplaySnapshotGroupList();
  if (!recordedGroups.length && !displayGroups.length) return currentGroups;

  const today = localDateText();
  const byDate = new Map(currentGroups.map((group) => [group.date, group]));
  for (const group of recordedGroups) {
    if (String(group.date || "") < today) {
      byDate.set(group.date, mergeRecommendationTrackGroups(byDate.get(group.date), group));
    }
  }
  for (const group of displayGroups) {
    if (String(group.date || "") < today) {
      byDate.set(group.date, mergeRecommendationTrackGroups(byDate.get(group.date), group));
    }
  }
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

function buildRecommendationTrackGroups(limit = 8) {
  const groups = buildRecommendationTrackGroupList();
  return limit == null ? groups : groups.slice(0, limit);
}

function strongRecommendationTrackGroups(groups) {
  return groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter(strongRecommendationRowEligible),
    }))
    .filter((group) => group.rows.length);
}

function recommendationTrackGroupsWithTiers(groups, options = {}) {
  const preserveSnapshotRows = options.preserveSnapshotRows === true;
  return groups
    .map((group) => {
      if (preserveSnapshotRows && (group.fromRecordedSnapshots || group.fromDisplaySnapshots)) {
        return {
          ...group,
          strongRows: group.rows,
          rows: group.rows,
        };
      }
      const strongRows = limitRecommendationTrackRowsPerCityDate(
        group.rows.filter(activeRecommendationRowEligible)
      );
      return {
        ...group,
        strongRows,
        rows: strongRows,
      };
    })
    .filter((group) => group.rows.length);
}

function recommendationDailyReview(group) {
  const settled = group.rows.filter((row) => !row.pending);
  const misses = settled.filter((row) => !row.hit);
  if (!settled.length) {
    return {
      status: "pending",
      summary: "等待实际温度，暂时不能复盘。",
      misses,
      conclusions: ["等飞书填入实际温度后，再看推荐是否需要收紧。"],
    };
  }
  if (!misses.length) {
    return {
      status: "good",
      summary: "这一天已结算推荐全部命中，当前规则暂时不用收紧。",
      misses,
      conclusions: ["保留当天入选条件，后续重点观察是否连续稳定。"],
    };
  }

  const directionCounts = misses.reduce((counts, row) => {
    const direction = recommendationMissDirection(row);
    counts[direction || "unknown"] = (counts[direction || "unknown"] || 0) + 1;
    return counts;
  }, {});
  const marginal = misses.filter((row) => (row.top2Accuracy || 0) < 90).length;
  const smallSample = misses.filter((row) => (row.n || 0) <= 10).length;
  const lowCurrentConfidence = misses.filter((row) => recommendationTopProbabilitySum(row) < STRONG_RECOMMENDATION_CURRENT_TOP2_THRESHOLD).length;
  const high = directionCounts.high || 0;
  const low = directionCounts.low || 0;
  const conclusions = [];

  if (high >= Math.max(1, Math.ceil(misses.length / 2))) {
    conclusions.push("未中主要是实际温度高于推荐Top2，说明这类窗口低估升温，后续要给更高一档更多保护。");
  }
  if (low >= Math.max(1, Math.ceil(misses.length / 2))) {
    conclusions.push("未中主要是实际温度低于推荐Top2，说明这类窗口高温修正偏强，后续要降低高温加权或保留低一档。");
  }
  if (marginal >= Math.max(1, Math.ceil(misses.length / 2))) {
    conclusions.push(`低于 ${HISTORY_TOP2_THRESHOLD}% 的边缘历史胜率失败较多，建议继续挡在强推之外。`);
  }
  if (smallSample >= Math.max(1, Math.ceil(misses.length / 2))) {
    conclusions.push("失败集中在回测样本10个以内，样本虽然达标但稳定性弱，建议标记为谨慎。");
  }
  if (lowCurrentConfidence >= Math.max(1, Math.ceil(misses.length / 2))) {
    conclusions.push(`失败时当前前二合计概率不够集中，建议前二合计低于${STRONG_RECOMMENDATION_CURRENT_TOP2_THRESHOLD}%时降低推荐等级。`);
  }
  if (!conclusions.length) {
    conclusions.push("失败没有明显单一共性，先保留规则，但继续观察同城市和同窗口是否重复出错。");
  }

  return {
    status: "miss",
    summary: `未中 ${misses.length} 个：实际偏高 ${high} 个，实际偏低 ${low} 个，边缘胜率 ${marginal} 个，样本偏少 ${smallSample} 个。`,
    misses,
    conclusions,
  };
}

function renderRecommendationReview(group, title = "每日复盘") {
  const review = recommendationDailyReview(group);
  return `
    <div class="recommendation-review ${review.status}">
      <div class="review-head">
        <strong>${title}</strong>
        <span>${review.summary}</span>
      </div>
      ${review.misses.length ? `
        <div class="review-misses">
          ${review.misses.map((row) => `
            <article>
              <b>${row.city} · ${row.timeNode}</b>
              <span>推荐 ${row.topText}；实际 ${row.actualBucket || "-"}；${recommendationDirectionText(recommendationMissDirection(row))}</span>
              <small>历史Top2命中 ${row.top2Accuracy}% · 历史Top1命中 ${row.top1Accuracy}% · 历史第二名命中 ${historicalSecondHitAccuracy(row)}% · 回测样本 ${row.n}</small>
            </article>
          `).join("")}
        </div>
      ` : ""}
      <div class="review-conclusions">
        ${review.conclusions.map((text) => `<p>${text}</p>`).join("")}
      </div>
    </div>
  `;
}

function recommendationRowsStat(rows) {
  const settled = rows.filter((row) => !row.pending);
  const pending = rows.length - settled.length;
  const hits = settled.filter((row) => row.hit).length;
  return {
    total: rows.length,
    settled: settled.length,
    pending,
    hits,
    rate: settled.length ? Math.round((hits / settled.length) * 100) : null,
  };
}

function recommendationTierSummary(label, rows) {
  const stat = recommendationRowsStat(rows);
  if (!stat.total) return `${label} 0`;
  if (!stat.settled) return `${label} ${stat.total} · 待实际温度`;
  if (stat.pending) return `${label} ${stat.total} · 已结 ${stat.settled} · 命中 ${stat.hits} · ${stat.rate}% · 待 ${stat.pending}`;
  return `${label} ${stat.settled} · 命中 ${stat.hits} · ${stat.rate}%`;
}

function formatSnapshotTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function renderRecommendationRows(rows, tierClass = "") {
  return rows.map((row) => {
    const snapshotTime = formatSnapshotTime(row.snapshotAt);
    return `
    <article class="recommendation-result ${tierClass} ${row.pending ? "pending" : row.hit ? "hit" : "miss"}">
      <strong>${row.city} · ${row.timeNode}</strong>
      <b>${row.topText}</b>
      <span>${row.pending ? "待实际温度" : `实际 ${row.actualBucket || "-"} · ${row.hit ? "命中" : "未中"}`}</span>
      <span>历史Top2命中 ${row.top2Accuracy}% · 历史Top1命中 ${row.top1Accuracy}% · 历史第二名命中 ${historicalSecondHitAccuracy(row)}% · 回测样本 ${row.n}</span>
      ${snapshotTime ? `<span class="recommendation-snapshot-at">首次推荐 ${snapshotTime}</span>` : ""}
    </article>
  `;
  }).join("");
}

function renderRecommendationTierBlock(label, rows, tierClass) {
  if (!rows.length) return "";
  const stat = recommendationRowsStat(rows);
  return `
    <div class="recommendation-tier-block ${tierClass}">
      <div class="recommendation-tier-title">
        <b>${label}</b>
        <span>${stat.settled ? `总 ${stat.total} · 已结 ${stat.settled} · 命中 ${stat.hits} · ${stat.rate}%${stat.pending ? ` · 待 ${stat.pending}` : ""}` : `总 ${stat.total} · 待结算 ${stat.pending} 个`}</span>
      </div>
      <div class="recommendation-list">
        ${renderRecommendationRows(rows, tierClass)}
      </div>
    </div>
  `;
}

function recommendationHistoryStats(group, predicate = null) {
  const rows = predicate ? group.rows.filter(predicate) : group.rows;
  const settled = rows.filter((row) => !row.pending);
  const pending = rows.length - settled.length;
  const hits = settled.filter((row) => row.hit).length;
  const misses = settled.length - hits;
  return {
    date: group.date,
    total: rows.length,
    settled: settled.length,
    pending,
    hits,
    misses,
    rate: settled.length ? Math.round((hits / settled.length) * 100) : null,
  };
}

function recommendationRateClass(rate) {
  if (rate == null) return "pending";
  if (rate >= HISTORY_TOP2_THRESHOLD) return "good";
  if (rate >= 70) return "watch";
  return "bad";
}

function recommendationStatsTotal(stats) {
  const settledStats = stats.filter((item) => item.settled);
  return settledStats.reduce((sum, item) => ({
    settled: sum.settled + item.settled,
    hits: sum.hits + item.hits,
    misses: sum.misses + item.misses,
  }), { settled: 0, hits: 0, misses: 0 });
}

function recommendationStatsRecent(stats, limit = 7) {
  return stats
    .filter((item) => item.settled)
    .slice(0, limit)
    .reduce((sum, item) => ({
      settled: sum.settled + item.settled,
      hits: sum.hits + item.hits,
      misses: sum.misses + item.misses,
    }), { settled: 0, hits: 0, misses: 0 });
}

function recommendationStatsRate(stat) {
  return stat.settled ? Math.round((stat.hits / stat.settled) * 100) : null;
}

function recommendationSummaryCard(label, stat, extraText = "") {
  const rate = recommendationStatsRate(stat);
  return `
    <article>
      <span>${label}</span>
      <b>${stat.settled ? `${stat.hits}/${stat.settled}` : "-"}</b>
      <small>${rate == null ? "暂无命中率" : `命中率 ${rate}%`}${extraText ? ` · ${extraText}` : ""}</small>
    </article>
  `;
}

function recommendationDailyLine(label, item) {
  if (!item.total) {
    return `
    <span>${label} 无推荐</span>
    <b class="pending">-</b>
  `;
  }
  return `
    <span>${label} ${item.settled ? `命中 ${item.hits}/${item.settled}` : "待实际温度"}</span>
    <b class="${recommendationRateClass(item.rate)}">${item.rate == null ? "-" : `${item.rate}%`}</b>
  `;
}

function renderRecommendationHistorySummary(groups, options = {}) {
  const title = options.title || "强推 Top2 历史推荐";
  const note = options.note || "历史按当前买入口径回放；今天和未来按同一规则筛选。规则：历史Top2不低于90%，当前Top2合计不低于88%，满足历史稳定筛选；样本 >= 12、同窗口和同城稳定、每城每天最多 2 个窗口。";
  const label = options.label || "强推";
  const totalCardTitle = options.totalCardTitle || "全部已结推荐";
  const recentCardTitle = options.recentCardTitle || "最近7个已结算日";
  const pendingCardTitle = options.pendingCardTitle || "待结推荐";
  const pendingCardNote = options.pendingCardNote || "已计入推荐总池，等实际温度结算";
  const strongStats = groups.map((group) => recommendationHistoryStats(group));
  const strongTotals = recommendationStatsTotal(strongStats);
  const strongRecentSettled = recommendationStatsRecent(strongStats);
  const strongPendingCount = strongStats.reduce((sum, item) => sum + item.pending, 0);

  return `
    <section class="recommendation-history">
      <div class="recommendation-history-head">
        <strong>${title}</strong>
        <span>${note}</span>
      </div>
      <div class="recommendation-history-stats">
        ${recommendationSummaryCard(totalCardTitle, strongTotals, `待结 ${strongPendingCount}，总推荐 ${strongTotals.settled + strongPendingCount}`)}
        ${recommendationSummaryCard(recentCardTitle, strongRecentSettled)}
        <article>
          <span>${pendingCardTitle}</span>
          <b>${strongPendingCount}</b>
          <small>${pendingCardNote}</small>
        </article>
      </div>
      <div class="recommendation-history-list">
        ${strongStats.map((strongItem) => `
          <article class="recommendation-history-row">
            <strong>${strongItem.date}</strong>
            <div class="recommendation-history-row-lines">
              ${recommendationDailyLine(label, strongItem)}
            </div>
            <small>${label}待 ${strongItem.pending}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderRecommendationPerformanceContent() {
  const strictSourceGroups = isMidRangePage()
    ? buildMidRangeHistoryGroupList()
    : buildRecommendationTrackGroupList();
  const strictGroupsAll = recommendationTrackGroupsWithTiers(strictSourceGroups);
  const strictGroups = strictGroupsAll.slice(0, 8);
  const snapshotGroupsAll = isMidRangePage()
    ? []
    : recommendationTrackGroupsWithTiers(buildDisplaySnapshotGroupList(), {
        preserveSnapshotRows: true,
      });
  const snapshotGroups = snapshotGroupsAll.slice(0, 5);

  if (!strictGroups.length && !snapshotGroups.length) {
    return `<div class="recommendation-empty">还没有可统计的推荐。后续飞书填入实际温度后，这里会显示每天推荐几个、命中几个。</div>`;
  }

  const activeLabel = isMidRangePage() ? "中档机会" : "强推";
  const activeSummaryTitle = isMidRangePage() ? "85-95中档机会历史回测（收紧）" : "当前强推策略历史回测";
  const activeSummaryNote = isMidRangePage()
    ? "按85-95页面收紧口径回放历史：不含主页已入选强推，历史Top2 85%-95%，样本 >= 18，当前Top2 >= 70%，第二档 >= 30%，同窗口稳定。这个区域只代表中档机会池胜率。"
    : "按现在这套买入口径回放历史：当前版本强推必须历史Top2不低于90%，当前Top2合计不低于88%，并满足历史稳定筛选；样本 >= 12、同窗口和同城稳定、每城每天最多 2 个窗口。这个区域才代表以后要执行的策略胜率。";

  const strictContent = strictGroups.length ? `${renderRecommendationHistorySummary(strictGroupsAll, {
    title: activeSummaryTitle,
    note: activeSummaryNote,
    label: activeLabel,
    totalCardTitle: `${activeLabel}全部已结`,
    recentCardTitle: `${activeLabel}最近7个已结算日`,
    pendingCardTitle: `${activeLabel}待结`,
  })}${strictGroups.map((balanceGroup) => {
    const balancePending = balanceGroup.rows.filter((row) => row.pending);
    const balanceLabel = balanceGroup.rows.length ? recommendationTierSummary(activeLabel, balanceGroup.strongRows || balanceGroup.rows) : `${activeLabel} 0`;
    return `
      <section class="recommendation-date">
        <div class="recommendation-date-head">
          <strong>${balanceGroup.date}</strong>
          <b>${balanceLabel}</b>
          <span>${balancePending.length ? `${activeLabel}待 ${balancePending.length}` : "已结算"}</span>
        </div>
        ${renderRecommendationTierBlock(`${activeLabel} Top2 历史推荐`, balanceGroup.strongRows || balanceGroup.rows, "strong-tier")}
      </section>
    `;
  }).join("")}` : "";

  const snapshotContent = snapshotGroups.length ? `${renderRecommendationHistorySummary(snapshotGroupsAll, {
    title: "真实推荐快照（含城市Top2窗口）",
    note: "这里按当时页面真实出现过的强推和城市Top2窗口提示结算，主要用来追责和排查历史错误；它包含旧规则，所以不代表当前强推策略的胜率。",
    label: "快照",
    totalCardTitle: "快照全部已结",
    recentCardTitle: "快照最近7个已结算日",
    pendingCardTitle: "快照待结",
    pendingCardNote: "真实发出过但还没填实际温度",
  })}${snapshotGroups.map((snapshotGroup) => {
    const pending = snapshotGroup.rows.filter((row) => row.pending);
    const label = snapshotGroup.rows.length ? recommendationTierSummary("快照", snapshotGroup.rows) : "快照 0";
    return `
      <section class="recommendation-date">
        <div class="recommendation-date-head">
          <strong>${snapshotGroup.date}</strong>
          <b>${label}</b>
          <span>${pending.length ? `快照待 ${pending.length}` : "已结算"}</span>
        </div>
        ${renderRecommendationTierBlock("真实推荐快照", snapshotGroup.rows, "strong-tier")}
      </section>
    `;
  }).join("")}` : "";

  return `${snapshotContent}${strictContent}`;
}

function renderRecommendationPerformance() {
  const container = $("#recommendationPerformance");
  if (!container) return;
  container.innerHTML = renderRecommendationPerformanceContent();
}

function applyRecommendationModeLabels() {
  if (!isMidRangePage()) return;
  document.querySelectorAll(".recommendation-history-head strong").forEach((node) => {
    if ((node.textContent || "").includes("\u5feb\u7167")) return;
    node.textContent = "85-95\u4e2d\u6863\u673a\u4f1a\u5386\u53f2\u56de\u6d4b\uff08\u6536\u7d27\uff09";
  });
  document.querySelectorAll(".recommendation-history-head span").forEach((node) => {
    if ((node.textContent || "").includes("\u5feb\u7167")) return;
    node.textContent = "\u630985-95\u9875\u9762\u6536\u7d27\u53e3\u5f84\u56de\u653e\u5386\u53f2\uff1a\u4e0d\u542b\u4e3b\u9875\u5df2\u5165\u9009\u5f3a\u63a8\uff0c\u5386\u53f2Top2 85%-95%\uff0c\u6837\u672c >= 18\uff0c\u5f53\u524dTop2 >= 70%\uff0c\u7b2c\u4e8c\u6863 >= 30%\uff0c\u540c\u7a97\u53e3\u7a33\u5b9a\u3002";
  });
  document.querySelectorAll(".recommendation-tier-title b").forEach((node) => {
    if ((node.textContent || "").includes("\u5feb\u7167")) return;
    node.textContent = "85-95\u4e2d\u6863\u673a\u4f1a";
  });
}

function opportunityPicks(items) {
  const picks = [];
  for (const item of items) {
    if ((item.modelSampleSize || 0) < HISTORY_MIN_SAMPLE) continue;
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
        <small>${pick.item.modelLevel}</small>
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
  template.querySelector(".samples").textContent = `${sampleText}${droppedText}`;
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
        <b>Top2 ${currentHistory.top2Accuracy}% · 回测样本 ${currentHistory.n}</b>
      </div>
      <div>
        <span>同城同日期最佳历史窗口</span>
        <b>${bestHistory ? `${bestHistory.item.timeNode} · Top2 ${bestHistory.top2Accuracy}% · 回测样本 ${bestHistory.n}` : `暂无回测样本>=${HISTORY_MIN_SAMPLE}窗口`}</b>
      </div>
      <em>${bestIsCurrent ? "当前就是该城市历史命中率最高窗口" : "当前不是该城市历史命中率最高窗口，可考虑等最佳窗口"}</em>
    `;
    const modelLine = document.createElement("div");
    modelLine.innerHTML = `<span>城市专属模型</span><b>${item.optimizedModelLabel || "-"} · 最强可交易窗口 ${item.optimizedBestTimeNode || "-"}</b>`;
    profitBox.insertBefore(modelLine, profitBox.querySelector("em"));
    template.querySelector(".signal-row").after(profitBox);
  }
  if ((item.temperatureBandWeight || 0) > 0) {
    const hint = document.createElement("div");
    hint.className = "temperature-band-hint";
    const meanText = item.temperatureBandMeanResidual == null ? "-" : signedNumber(item.temperatureBandMeanResidual);
    const medianText = item.temperatureBandMedianResidual == null ? "-" : signedNumber(item.temperatureBandMedianResidual);
    hint.textContent = `温度段修正：${item.temperatureBand} · ${item.temperatureBandLevel} · n=${item.temperatureBandSampleSize || 0} · 平均${meanText} · 中位${medianText} · 权重${Math.round((item.temperatureBandWeight || 0) * 100)}%`;
    template.querySelector(".signal-row").after(hint);
  }
  if (item.weatherPredictionEnabled && item.weatherCategory && ((item.weatherWeight || 0) > 0 || Math.abs(item.weatherCorrection || 0) >= 0.05)) {
    const hint = document.createElement("div");
    hint.className = "weather-hint";
    const deltaText = item.weatherDelta == null ? "-" : signedNumber(item.weatherDelta);
    const correctionText = item.weatherCorrection == null ? "-" : signedNumber(item.weatherCorrection);
    hint.textContent = `天气修正：${item.weatherCategory} · ${item.weatherLevel} · n=${item.weatherSampleSize || 0} · 相比当前样本${deltaText} · 整体修正${correctionText}`;
    template.querySelector(".signal-row").after(hint);
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
    warning.textContent = `旧数据提示：曾剔除 ${item.outlierDropped} 个异常历史样本，当前新规则已改为不剔除真实偏差。旧阈值 ${thresholdText}`;
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
      else {
        const holding = parseHoldingKey(key);
        const item = findDashboardItem(holding.date, holding.timeNode, holding.expectedField);
        state.holdings[key] = item ? createHoldingSnapshot(item, holding.bucket) : true;
      }
      saveHoldings();
      render();
    });
  });
}

function removeWinrateUpdateBoard() {
  document.querySelector("#winrateUpdateBoard")?.remove();
}

function render() {
  const items = filteredItems();
  if (isMidRangePage()) {
    removeWinrateUpdateBoard();
    renderCityTop2RankingPage();
    return;
  }
  renderSummary(items);
  removeWinrateUpdateBoard();
  renderHoldingBoard(items);
  renderProfitPicks();
  renderRecommendationPerformance();
  applyRecommendationModeLabels();
  renderEdgePicks(items);
  renderCards(items);
}

function setupPageModeUi() {
  const mode = dashboardPageMode();
  document.body.dataset.dashboardMode = mode;
  const topbarTitle = document.querySelector(".topbar > div");
  if (topbarTitle && !topbarTitle.querySelector(".page-switch")) {
    const nav = document.createElement("nav");
    nav.className = "page-switch";
    nav.setAttribute("aria-label", "dashboard pages");
    nav.innerHTML = `
      <a href="./dashboard.html" data-page-link="mid">\u57ce\u5e02Top2\u6392\u884c\u699c</a>
    `;
    topbarTitle.appendChild(nav);
  }
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === mode);
  });
  const boardTitle = document.querySelector(".profit-board-head h2");
  const boardNote = document.querySelector(".profit-board-head span");
  document.title = "\u57ce\u5e02Top2\u6392\u884c\u699c - \u6e29\u5ea6\u4ea4\u6613\u770b\u677f";
  if (boardTitle) boardTitle.textContent = "\u57ce\u5e02Top2\u5386\u53f2\u547d\u4e2d\u7387\u6392\u884c\u699c";
  if (boardNote) {
    boardNote.textContent = "\u6709\u5f00\u5355\u673a\u4f1a\u7684\u57ce\u5e02\u7a97\u53e3\u4f18\u5148\uff0c\u518d\u6309\u6700\u8fd110\u5929Top2\u3001\u8fd1\u534aTop2\u3001\u5168\u90e8Top2\u4e09\u9879\u80dc\u7387\u603b\u5206\u6392\u5e8f\u3002";
  }
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
    ["概率参考", `${item.modelSampleSize >= 10 ? "强参考" : item.modelSampleSize >= 5 ? "一般参考" : "弱参考"}`],
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
    state.data = withoutHiddenCities(data);
    state.polyPriceMap = buildPolyPriceMap();
    const items = state.data.probabilityCandidates || [];
    setupFilters(items);
    setupExportButton();
    setupPageModeUi();
    const polyCount = state.polyPriceMap.size;
    $("#dataStatus").textContent = `已加载 ${items.length} 条概率候选，${polyCount} 个 Poly 自动价格。价格输入会保存在本机浏览器。`;
    render();
  })
  .catch((error) => {
    $("#dataStatus").textContent = `读取失败：${error.message}`;
    $("#cards").innerHTML = `<div class="empty">请用本地服务器打开页面，确保 feishu-analysis-output.json 在同一目录。</div>`;
  });
