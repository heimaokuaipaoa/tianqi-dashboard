(function () {
  const VERSION = "20260516-auto-hold";
  let observer = null;
  let pending = false;

  function safe(fn, fallback) {
    try { return fn(); } catch (error) { console.warn(`[auto-hold ${VERSION}]`, error); return fallback; }
  }

  function recommendationPickScores(limitPerDate = 16) {
    return safe(() => {
      const dates = recommendationDates(state.data?.probabilityCandidates || []);
      const dateSet = new Set(dates);
      const bestByCityDate = new Map();
      for (const item of state.data?.probabilityCandidates || []) {
        if (!dateSet.has(item.date)) continue;
        if (!isOptimizedBestWindowItem(item)) continue;
        if (!item.optimizedRecommended) continue;
        const score = historicalScore(item);
        if (!score || (score.n || 0) < HISTORY_MIN_SAMPLE || score.tradableBestWindow === false || (score.top2Accuracy || 0) < HISTORY_TOP2_THRESHOLD) continue;
        const key = `${score.item.date}|${cityKey(score.item.expectedField)}`;
        const current = bestByCityDate.get(key);
        if (!current || compareHistoricalWindow(score, current) < 0) bestByCityDate.set(key, score);
      }
      const picks = [...bestByCityDate.values()];
      return dates.flatMap((date) => picks
        .filter((pick) => pick.item.date === date)
        .sort((a, b) =>
          earlierTimeRank(a.item.timeNode) - earlierTimeRank(b.item.timeNode) ||
          b.top2Accuracy - a.top2Accuracy ||
          (b.n || 0) - (a.n || 0) ||
          displayCity(a.item.expectedField).localeCompare(displayCity(b.item.expectedField))
        )
        .slice(0, limitPerDate)
      );
    }, []);
  }

  function recommendationHoldings() {
    return recommendationPickScores().flatMap((score) =>
      topProbabilities(score.item, 2).map((probability) => ({
        key: holdingKey(score.item, probability.bucket),
        date: score.item.date,
        timeNode: score.item.timeNode,
        expectedField: score.item.expectedField,
        bucket: probability.bucket,
        snapshot: createHoldingSnapshot(score.item, probability.bucket),
        sourceLabel: "默认推荐Top2",
      }))
    );
  }

  function combinedHoldings() {
    const manual = safe(() => activeHoldings(), []).map((holding) => ({ ...holding, sourceLabel: "手动持仓" }));
    const seen = new Set(manual.map((holding) => holding.key));
    const automatic = recommendationHoldings().filter((holding) => {
      if (seen.has(holding.key)) return false;
      seen.add(holding.key);
      return true;
    });
    return [...manual, ...automatic];
  }

  function ensureBoard() {
    let board = document.querySelector("#winrateUpdateBoard");
    const topbar = document.querySelector(".topbar");
    if (!topbar) return null;
    if (!board) {
      board = document.createElement("section");
      board.id = "winrateUpdateBoard";
      board.className = "winrate-board";
      board.innerHTML = `
        <div class="winrate-board-head">
          <h2>置顶持仓风险提醒</h2>
          <span>默认跟踪今天/明天推荐Top2；后续窗口显示大概率不中时才出现</span>
        </div>
        <div id="winrateAlerts" class="winrate-alerts"></div>
      `;
    } else {
      const title = board.querySelector(".winrate-board-head h2");
      const note = board.querySelector(".winrate-board-head span");
      if (title) title.textContent = "置顶持仓风险提醒";
      if (note) note.textContent = "默认跟踪今天/明天推荐Top2；后续窗口显示大概率不中时才出现";
    }
    if (topbar.nextElementSibling !== board) topbar.after(board);
    return board;
  }

  function buildAlerts() {
    return combinedHoldings().map((holding) => {
      const item = findDashboardItem(holding.date, holding.timeNode, holding.expectedField);
      if (!item) {
        return { holding, status: "danger", title: "数据已找不到", reason: "当前看板数据里没有这个城市/日期/窗口，先人工确认是否已结算或字段变化。" };
      }
      const check = holdingCurrentCheck(item, holding.bucket);
      const peakRisk = peakHoldingRisk(item, { ...holding, purchaseItem: item });
      if (!peakRisk && check.buyable) return null;
      let status = check.buyable ? "hold" : "danger";
      let title = check.buyable ? "仍可继续观察" : "不再满足买入条件";
      if (peakRisk?.status === "danger") {
        status = "danger";
        title = peakRisk.action || "高点窗口止损提醒";
      } else if (peakRisk?.status === "observe") {
        status = "observe";
        title = peakRisk.action || "高点窗口需要观察";
      }
      const baseReason = check.buyable ? "仍满足：最优窗口、历史胜率、样本、Top2 温度都达标。" : check.reasons.join("；");
      const reason = peakRisk ? `${peakRisk.reason}${baseReason ? `；当前买入条件：${baseReason}` : ""}` : baseReason;
      return { holding, item, check, status, title, reason };
    }).filter(Boolean).sort((a, b) =>
      (a.status === "danger" ? -1 : 1) - (b.status === "danger" ? -1 : 1) ||
      String(a.holding.date).localeCompare(String(b.holding.date)) ||
      itemTimeIndex({ timeNode: a.holding.timeNode }) - itemTimeIndex({ timeNode: b.holding.timeNode }) ||
      displayCity(a.holding.expectedField).localeCompare(displayCity(b.holding.expectedField))
    );
  }

  function removeScatteredPeakChecks() {
    document.querySelectorAll(".profit-pick .peak-check, .city-card .peak-check").forEach((element) => element.remove());
  }

  function renderBoard() {
    if (observer) observer.disconnect();
    removeScatteredPeakChecks();
    const board = ensureBoard();
    const container = document.querySelector("#winrateAlerts");
    if (!board || !container) { attachObserver(); return; }
    const alerts = buildAlerts();
    if (!alerts.length) {
      board.hidden = true;
      container.innerHTML = "";
      attachObserver();
      return;
    }
    board.hidden = false;
    container.innerHTML = alerts.map((alert) => {
      const snapshot = alert.holding.snapshot;
      const check = alert.check;
      const nowText = check ? `现在 ${Math.round((check.probability || 0) * 100)}% · 排名${check.rank || "-"} · Top2胜率${check.history?.top2Accuracy ?? "-"}% · n=${check.history?.n ?? "-"}` : "";
      const thenText = snapshot ? `买入时 ${Math.round((snapshot.purchaseProbability || 0) * 100)}% · 排名${snapshot.purchaseRank || "-"} · Top2胜率${snapshot.purchaseTop2Accuracy ?? "-"}% · n=${snapshot.purchaseHistoryN ?? "-"}` : "旧持仓未记录买入快照，只判断当前状态";
      return `
        <article class="winrate-card winrate-${alert.status}">
          <div>
            <strong>${displayCity(alert.holding.expectedField)} ${alert.holding.bucket}</strong>
            <span>${alert.holding.sourceLabel || "持仓"} · ${alert.holding.date} · ${alert.holding.timeNode}</span>
          </div>
          <div>
            <b>${alert.title}</b>
            <span>${thenText}</span>
            <span>${nowText}</span>
          </div>
          <p>${alert.reason}</p>
        </article>
      `;
    }).join("");
    attachObserver();
  }

  function scheduleRender() {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; renderBoard(); }, 80);
  }

  function attachObserver() {
    observer = new MutationObserver(scheduleRender);
    ["#profitPicks", "#cards"].forEach((selector) => {
      const target = document.querySelector(selector);
      if (target) observer.observe(target, { childList: true, subtree: true });
    });
  }

  window.renderAutoHoldRiskBoard = renderBoard;
  document.addEventListener("DOMContentLoaded", scheduleRender);
  scheduleRender();
})();
