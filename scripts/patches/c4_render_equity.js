function renderEquityChart(result) {
  const svg = byId("capital-equity-chart");
  const points = realizedEquityPoints(result);
  const values = points.map((point) => point.value);
  const width = 760;
  const height = 330;
  const margin = { left: 60, right: 18, top: 18, bottom: 42 };
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max(4, (maximum - minimum) * 0.18);
  const low = minimum - padding;
  const high = maximum + padding;
  const lastIndex = Math.max(1, points.length - 1);
  const x = (index) => margin.left + index / lastIndex * (width - margin.left - margin.right);
  const y = (value) => margin.top + (high - value) / Math.max(1e-9, high - low) * (height - margin.top - margin.bottom);
  const horizontal = [0, .25, .5, .75, 1].map((ratio) => {
    const value = high - ratio * (high - low);
    const yValue = y(value);
    return `<line x1="${margin.left}" x2="${width - margin.right}" y1="${yValue}" y2="${yValue}" stroke="${COLORS.grid}" stroke-width="1"/>${svgText(margin.left - 9, yValue + 3, integerEuro.format(value), "end", COLORS.muted, 9)}`;
  }).join("");
  const area = `${linePath(points, x, y)} L${x(points.at(-1).index)},${height - margin.bottom} L${x(0)},${height - margin.bottom} Z`;
  const exitMarkers = points.slice(1).map((point) => `<circle cx="${x(point.index)}" cy="${y(point.value)}" r="4" fill="${point.pnlApplied >= 0 ? COLORS.lime : COLORS.pink}" stroke="#0d131c" stroke-width="2"><title>${escapeHtml(point.date || "Sortie")} · ${fmtCurrency(point.pnlApplied, true)} · ${escapeHtml(point.tradeIds.join(", "))}</title></circle>`).join("");
  const endLabel = points.at(-1).date || "Aucune sortie";
  svg.innerHTML = `
    <defs><linearGradient id="realized-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COLORS.lime}" stop-opacity=".14"/><stop offset="1" stop-color="${COLORS.lime}" stop-opacity="0"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${horizontal}
    <path d="${area}" fill="url(#realized-area)"/>
    <path d="${linePath(points, x, y)}" fill="none" stroke="${COLORS.lime}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow)"/>
    ${exitMarkers}
    ${svgText(margin.left, height - 12, "Capital initial", "start", COLORS.muted, 9)}
    ${svgText(width - margin.right, height - 12, endLabel, "end", COLORS.muted, 9)}
    <circle cx="${x(points.at(-1).index)}" cy="${y(points.at(-1).value)}" r="5" fill="${COLORS.lime}" stroke="#0d131c" stroke-width="2"/>
  `;
}
