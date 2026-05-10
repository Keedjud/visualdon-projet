// D3 charts: cumulative sales (top), tornado scores (right), lifespan (pokedex).
import * as d3 from "d3";

let _prevSalesLength = 0;

export function drawSales(games, activeIndex, direction = "forward") {
  const node = document.getElementById("sales-svg");
  if (!node) return;
  const svg = d3.select(node);
  svg.selectAll("*").remove();

  const data = games.slice(0, activeIndex + 1)
    .filter(g => g.sales > 0)
    .map(g => ({
      year: new Date(g.release_date).getFullYear(),
      v: g.sales,
      name: g.version_group,
    }));

  const w = 720, h = 100, m = { t: 8, r: 12, b: 22, l: 32 };
  svg.attr("viewBox", `0 0 ${w} ${h}`);

  const [minYear, maxYear] = d3.extent(data, d => d.year);
  const x = d3.scaleLinear()
  .domain([minYear - 1, maxYear + 2])
  .range([m.l, w - m.r]);
  
  const y = d3.scaleLinear().domain([0, 35]).range([h - m.b, m.t]);

  svg.append("g").attr("transform", `translate(0,${h - m.b})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(data.length))
    .call(g => g.select(".domain").attr("stroke", "currentColor").attr("stroke-opacity", .3))
    .selectAll("text").attr("fill", "currentColor").style("font-size", "9px");

  svg.append("g").attr("transform", `translate(${m.l},0)`)
    .call(d3.axisLeft(y).ticks(3).tickSize(-(w - m.l - m.r)))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line").attr("stroke", "currentColor").attr("stroke-opacity", .1))
    .selectAll("text").attr("fill", "currentColor").style("font-size", "9px");

  if (data.length <= 1) {
    _prevSalesLength = 0; 

    return;
  }

  if (data.length > 1) {
    const line = d3.line().x(d => x(d.year)).y(d => y(d.v)).curve(d3.curveMonotoneX);
    const path = svg.append("path").datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ff5057")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    if (direction === "forward") {
      path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength - _prevSalesLength)
        .transition().duration(800).ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0);
    } else {
      path.attr("stroke-dasharray", "none");
    }

    _prevSalesLength = totalLength;
  }

  svg.selectAll("circle").data(data).join("circle")
    .attr("cx", d => x(d.year)).attr("cy", d => y(d.v))
    .attr("r", d => d.v > 0 ? 4 : 0).attr("fill", "#ffc828").attr("stroke", "#ff5057").attr("stroke-width", 2);

  svg.selectAll("text.lbl").data(data).join("text")
    .attr("class", "lbl")
    .attr("x", d => x(d.year)).attr("y", d => y(d.v) - 8)
    .attr("text-anchor", "middle").attr("fill", "#ffc828")
    .style("font-size", "9px").style("font-weight", 600)
    .text(d => d.v > 0 ? `${d.v.toFixed(1)}M` : "");
}

export function drawScores(games, activeIndex, onGameClick) {
  const node = document.getElementById("scores-svg");
  if (!node) return;
  const svg = d3.select(node);
  svg.selectAll("*").remove();

  const data = games.slice(0, activeIndex + 1)
    .map((game, index) => ({ ...game, index }));
  const w = 280
  const h = Math.max(80, 20 + data.length * 22);
  const m = { t: 10, r: 8, b: 8, l: 8 };
  const cx = w / 2;
  const labelW = 40;
  const maxBar = (w / 2) - m.r - labelW / 2;
  svg.attr("viewBox", `0 0 ${w} ${h}`);

  const allScores = data.flatMap(d => [d.metascore, d.userscore * 10]);
  const minScore = Math.max(0, d3.min(allScores) - 5);
  const x = d3.scaleLinear().domain([minScore, 100]).range([0, maxBar]);

  const rowH = (h - m.t - m.b) / Math.max(data.length, 1);
  const barH = Math.min(18, rowH * 0.55);

  svg.append("line")
    .attr("x1", cx).attr("x2", cx)
    .attr("y1", m.t - 2).attr("y2", h - m.b + 2)
    .attr("stroke", "currentColor").attr("stroke-opacity", .3);

  const rows = svg.selectAll("g.row").data(data).join("g")
    .attr("class", "row")
    .attr("transform", (_, i) => `translate(0, ${m.t + i * rowH + rowH / 2})`);

  const label = svg.append("g")
    .attr("class", "scores-label")
    .attr("transform", `translate(${cx}, ${h / 2})`)
    .style("opacity", 0)
    .style("pointer-events", "none");

  const labelBg = label.append("rect")
    .attr("class", "scores-label-bg")
    .attr("rx", 6)
    .attr("ry", 6);

  const labelText = label.append("text")
    .attr("class", "scores-label-text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em");

  const showLabel = (row, d) => {
    rows.classed("is-active", false);
    row.classed("is-active", true);

    label.attr("transform", `translate(${cx}, ${m.t + d.index * rowH + rowH / 2})`);
    labelText.text(`Gen ${d.generation} - ${d.version_group}`);
    label.style("opacity", 1);

    const textNode = labelText.node();
    if (textNode) {
      const box = textNode.getBBox();
      labelBg
        .attr("x", box.x - 8)
        .attr("y", box.y - 6)
        .attr("width", box.width + 16)
        .attr("height", box.height + 12);
    }
  };

  const hideLabel = row => {
    row.classed("is-active", false);
    label.style("opacity", 0);
  };

  // Meta (left, blue)
  rows.append("rect")
    .attr("class", "scores-bar scores-bar--meta")
    .style("cursor", "pointer")
    .attr("x", d => cx - labelW / 2 - x(d.metascore))
    .attr("y", -barH / 2)
    .attr("width", d => x(d.metascore))
    .attr("height", barH)
    .attr("fill", "#4a8cff").attr("rx", 2)
    .on("click", (event, d) => {
      onGameClick && onGameClick(d);
    });
  rows.append("text")
    .attr("x", d => cx - labelW / 2 - x(d.metascore) - 4).attr("y", 3)
    .attr("text-anchor", "end").attr("fill", "#7aa9ff")
    .style("font-size", "10px").style("font-weight", 600)
    .text(d => d.metascore);

  // User (right, red)
  rows.append("rect")
    .attr("class", "scores-bar scores-bar--user")
    .style("cursor", "pointer")
    .on("click", (_, d) => onGameClick && onGameClick(d))
    .attr("x", cx + labelW / 2).attr("y", -barH / 2)
    .attr("width", d => x(d.userscore * 10))
    .attr("height", barH).attr("fill", "#ff5057").attr("rx", 2);
  rows.append("text")
    .attr("x", d => cx + labelW / 2 + x(d.userscore * 10) + 4).attr("y", 3)
    .attr("text-anchor", "start").attr("fill", "#ff7a80")
    .style("font-size", "10px").style("font-weight", 600)
    .text(d => d.userscore.toFixed(1));

  rows.on("mouseover", function (event, d) {
    if (this.contains(event.relatedTarget)) return;
    showLabel(d3.select(this), d);
  });

  rows.on("mouseout", function (event) {
    if (this.contains(event.relatedTarget)) return;
    hideLabel(d3.select(this));
  });
}

export function drawLifespan(games, activeIndex) {
  const node = document.getElementById("lifespan-svg");
  if (!node) return;
  const svg = d3.select(node);
  svg.selectAll("*").remove();

  const data = games.slice(0, activeIndex + 1).map((g, i) => {
    const main = Number(g.playtime?.main) || 0;
    const extra = Number(g.playtime?.extra) || 0;
    const completion = Number(g.playtime?.completion) || 0;
      const safeCompletion = Math.max(0, completion);
      const safeExtra = Math.min(Math.max(0, extra), safeCompletion);
      const safeMain = Math.min(Math.max(0, main), safeExtra);
    return {
      index: i,
      name: g.version_group,
      main: safeMain,
      extra: safeExtra,
      completion: safeCompletion,
    };
  });

  const w = 280, h = 180;
  const cx = w / 2;
  const cy = h / 2;
  const outerR = Math.min(w, h) / 2 - 6;
  const innerR = 12;
  const maxValue = d3.max(data, d => d.completion) || 1;

  const radius = d3.scaleLinear()
    .domain([0, maxValue])
    .range([innerR, outerR]);

  const angle = d3.scaleBand()
    .domain(data.map(d => d.index))
    .range([0, Math.PI * 2])
    .padding(0.08);

  svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", "100%");

  const root = svg.append("g")
    .attr("class", "lifespan-radial")
    .attr("transform", `translate(${cx},${cy})`);

  const scaleTicks = d3.ticks(0, maxValue, 3);
  const scale = root.append("g")
    .attr("class", "lifespan-scale");

  scale.append("line")
    .attr("class", "lifespan-scale-line")
    .attr("x1", 0)
    .attr("y1", -innerR)
    .attr("x2", 0)
    .attr("y2", -outerR);

  const ticks = scale.selectAll("g.lifespan-scale-tick").data(scaleTicks).join("g")
    .attr("class", "lifespan-scale-tick")
    .attr("transform", d => `translate(0, ${-radius(d)})`);

  ticks.append("line")
    .attr("x1", -4)
    .attr("x2", 4)
    .attr("y1", 0)
    .attr("y2", 0);

  ticks.append("text")
    .attr("x", 8)
    .attr("y", 2)
    .text(d => d);

  const arc = d3.arc();
  const arcPath = (d, r0, r1) => {
    const start = angle(d.index) ?? 0;
    const end = start + angle.bandwidth();
    return arc({ startAngle: start, endAngle: end, innerRadius: r0, outerRadius: r1 });
  };

  const bars = root.selectAll("g.lifespan-bar").data(data).join("g")
    .attr("class", "lifespan-bar")
    .classed("is-current", d => d.index === activeIndex);

  bars.append("path")
    .attr("class", "lifespan-segment segment--main")
    .attr("fill", "var(--poke-yellow)")
    .attr("d", d => arcPath(d, innerR, radius(d.main)));

  bars.append("path")
    .attr("class", "lifespan-segment segment--extra")
    .attr("fill", "var(--poke-blue)")
    .attr("d", d => arcPath(d, radius(d.main), radius(d.extra)));

  bars.append("path")
    .attr("class", "lifespan-segment segment--completion")
    .attr("fill", "var(--poke-red)")
    .attr("d", d => arcPath(d, radius(d.extra), radius(d.completion)));

  bars.append("path")
    .attr("class", "lifespan-hit")
    .attr("fill", "transparent")
    .attr("d", d => arcPath(d, innerR, Math.max(radius(d.completion), innerR + 1)));

  const label = root.append("g")
    .attr("class", "lifespan-label")
    .style("opacity", 0)
    .style("pointer-events", "none");

  const labelBg = label.append("rect")
    .attr("class", "lifespan-label-bg")
    .attr("rx", 6)
    .attr("ry", 6);

  const labelText = label.append("text")
    .attr("class", "lifespan-label-text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em");

  bars.on("mouseenter", function (event, d) {
    bars.classed("is-active", false);
    d3.select(this).classed("is-active", true);

    label.attr("transform", "translate(0,0)").style("opacity", 1);
    labelText.text(d.name);

    const textNode = labelText.node();
    if (textNode) {
      const box = textNode.getBBox();
      labelBg
        .attr("x", box.x - 6)
        .attr("y", box.y - 4)
        .attr("width", box.width + 12)
        .attr("height", box.height + 8);
    }
  });

  bars.on("mouseleave", function () {
    d3.select(this).classed("is-active", false);
    label.style("opacity", 0);
  });
}

export function highlightChart(which) {
  const sales = document.getElementById("sales-chart");
  const scores = document.getElementById("scores-chart");
  const name = document.getElementById("game-banner");
  const pokedex = document.getElementById("pokedex-icon");
  sales.classList.toggle("highlight", which === "sales");
  scores.classList.toggle("highlight", which === "scores");
  name.classList.toggle("highlight", which === "name");
  pokedex.classList.toggle("highlight", which === "pokedex");
}
