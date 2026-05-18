(function () {
  const VERSION = "20260516-auto-hold";

  function safeCall(fn, fallback) {
    try {
      return fn();
    } catch (error) {
      console.warn(`[auto-hold ${VERSION}]`, error);
      return fallback;
    }
  }

  function recommendationPickScores(limitPerDate = 16) {
    return safeCall(() => {
      const dates = recommendationDates(state.data?.probabilityCandidates || []);
      const dateSet = new Set(dates);
      const bestByCityDate = new Map();
      for (const item of state.data?.probabilityCandidates || []) {
        if (!dateSet.has(item.date)) continue;
        if (!isOptimizedBestWindowItem(item)) continue;
        if (!item.optimizedRecommended) continue;
        const score = historicalScore(item);
        if (
          !score ||
          (score.n || 0) < HISTORY_MIN_SAMPLE ||
          score.tradableBestWindow === false ||
          (score.top2Accuracy || 0) < HISTORY_TOP2_THRESHOLD
        ) continue;
        const key = `${score.item.date}|${cityKey(score.item.expectedField)}`;
        const current = bestByCityDate.get(key);
        if (!current || compareHistoricalWindow(score, current) < 0) {
          bestByCityDate.set(key, score);
        }
      }
      const picks = [...bestByCityDate.values()];
      return dates.flatMap((date) =>
        picks
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
    return recommendationPickScores()
      .flatMap((score) =>
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
    const manual = safeCall(() => activeHoldings(), []).map((holding) => ({
      ...holding,
      sourceLabel: "手动持仓",
    }));
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
    const profitBoard = document.querySelector(".profit-board");
    if (!profitBoard) return null;
    if (!board) {
      board = document.createElement("section");
      board.id = "winrateUpdateBoard";
      board.className = "winrate-board";
      board.innerHTML = `
        <div class="winrate-board-head">
          <h2>持仓风险提醒</h2>
          <span>只在后续窗口明显偏离原推荐 Top2 时出现</span>
        </div>
        <div id="winrateAlerts" class="winrate-alerts"></div>
      `;
    } else {
      board.querySelector(".winrate-board-head h2").textContent = "持仓风险提醒";
      board.querySelector(".winrate-board-head span").textContent =
        "只在后续窗口明显偏离原推荐 Top2 时出现";
    }
    if (profitBoard.previousElementSibling !== board) profitBoard.before(board);
    return board;
  }

  function percentText(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function predictedText(item) {
    return item?.predicted == null ? "-" : String(item.predicted);
  }

  function compactTopText(item) {
    const top = safeCall(() => topProbabilities(item, 2), []);
    return top.length
      ? top.map((probability) => `${probability.bucket} ${percentText(probability.probability)}`).join(" / ")
      : "-";
  }

  function buildAlerts() {
    return combinedHoldings()
      .map((holding) => {
        const item = findDashboardItem(holding.date, holding.timeNode, holding.expectedField);
        if (!item) {
          return {
            holding,
            status: "danger",
            title: "数据已找不到",
            reason: "当前看板数据里没有这个城市/日期/窗口，先人工确认是否已结算或字段变化。",
          };
        }
        const check = holdingCurrentCheck(item, holding.bucket);
        const peakRisk = peakHoldingRisk(item, { ...holding, purchaseItem: item });
        if (!peakRisk && check.buyable) return null;
        let status = check.buyable ? "hold" : "danger";
        let title = check.buyable ? "仍可继续观察" : "不再满足买入条件";
        if (peakRisk?.status === "danger") {
          status = "danger";
          title = peakRisk.action || "当地10点附近窗口止损提醒";
        } else if (peakRisk?.status === "observe") {
          status = "observe";
          title = peakRisk.action || "当地10点附近窗口需要观察";
        }
        const baseReason = check.buyable
          ? "仍满足：最优窗口、历史胜率、样本、Top2 温度都达标。"
          : check.reasons.join("；");
        const reason = peakRisk
          ? `${peakRisk.reason}${baseReason ? `；当前买入条件：${baseReason}` : ""}`
          : baseReason;
        return { holding, item, check, peakRisk, status, title, reason };
      })
      .filter(Boolean)
      .sort((a, b) =>
        (a.status === "danger" ? -1 : 1) - (b.status === "danger" ? -1 : 1) ||
        String(a.holding.date).localeCompare(String(b.holding.date)) ||
        itemTimeIndex({ timeNode: a.holding.timeNode }) - itemTimeIndex({ timeNode: b.holding.timeNode }) ||
        displayCity(a.holding.expectedField).localeCompare(displayCity(b.holding.expectedField))
      );
  }

  function renderBoard() {
    const board = ensureBoard();
    const container = document.querySelector("#winrateAlerts");
    if (!board || !container) return;
    document.querySelectorAll(".profit-pick .peak-check, .city-card .peak-check")
      .forEach((element) => element.remove());
    const alerts = buildAlerts();
    if (!alerts.length) {
      board.hidden = false;
      container.innerHTML = `
        <div class="winrate-empty">
          暂无持仓风险提醒。当前默认持仓的 Top2 还没有被后续关键窗口明显推翻。
        </div>
      `;
      return;
    }
    board.hidden = false;
    container.innerHTML = alerts.map((alert) => {
      const check = alert.check;
      const peakItem = alert.peakRisk?.peakItem;
      const beforeText = `之前买入：${alert.holding.bucket}，来自 ${alert.holding.timeNode} 推荐；原窗口预计 ${predictedText(alert.item)}，Top2 是 ${compactTopText(alert.item)}`;
      const nowText = peakItem
        ? `现在看：${peakItem.timeNode} 预计 ${predictedText(peakItem)}，Top2 已变成 ${compactTopText(peakItem)}`
        : check
          ? `现在看：${alert.holding.bucket} 还有 ${percentText(check.probability)}，排名第 ${check.rank || "-"}`
          : "现在看：没有找到这个温度的最新概率";
      const verdictText = alert.peakRisk
        ? `结论：${alert.holding.bucket} 已经不是后续窗口的核心温度，${alert.title}。`
        : `结论：${alert.title}。`;
      return `
        <article class="winrate-card winrate-${alert.status}">
          <div class="winrate-main">
            <strong>${displayCity(alert.holding.expectedField)} · 持仓 ${alert.holding.bucket}</strong>
            <span>${alert.holding.sourceLabel || "持仓"} · ${alert.holding.date}</span>
          </div>
          <div class="winrate-position">
            <span>${beforeText}</span>
            <b>${nowText}</b>
          </div>
          <p>${verdictText}<small>${alert.reason}</small></p>
        </article>
      `;
    }).join("");
  }

  let pending = false;
  function scheduleRender() {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      renderBoard();
    }, 50);
  }

  window.renderAutoHoldRiskBoard = renderBoard;
  document.addEventListener("DOMContentLoaded", scheduleRender);
  scheduleRender();
  new MutationObserver(scheduleRender).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
