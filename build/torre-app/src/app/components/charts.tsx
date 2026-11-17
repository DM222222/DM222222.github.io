import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

/* ---------- tema ---------- */
type Tk = { dark: boolean; text: string; muted: string; grid: string; tipBg: string; tipBorder: string; card: string };

function readTheme(): Tk {
  const dark = document.documentElement.classList.contains("dark");
  return dark
    ? { dark, text: "#E8ECF6", muted: "#9AA3BC", grid: "rgba(255,255,255,.09)", tipBg: "#101030", tipBorder: "rgba(255,255,255,.18)", card: "#1a1a3e" }
    : { dark, text: "#1F2540", muted: "#6D758F", grid: "#E6E9F2", tipBg: "#FFFFFF", tipBorder: "#DDE1EC", card: "#FFFFFF" };
}

/** Resolve "var(--ramp-1)" (ou cor literal) para um valor que o canvas entende. */
export function cssColor(v: string): string {
  const m = /^var\((--[\w-]+)\)$/.exec(v.trim());
  if (!m) return v;
  const r = getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim();
  return r || "#0D417D";
}

function useTheme() {
  const [tk, setTk] = useState<Tk>(() => readTheme());
  useEffect(() => {
    const mo = new MutationObserver(() => setTk(readTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    return () => mo.disconnect();
  }, []);
  return tk;
}

/* ---------- base ---------- */
function EChart({ build, deps }: { build: (tk: Tk) => any; deps: unknown[] }) {
  const el = useRef<HTMLDivElement>(null);
  const inst = useRef<echarts.ECharts | null>(null);
  const tk = useTheme();

  useEffect(() => {
    if (!el.current) return;
    const c = echarts.init(el.current, undefined, { renderer: "canvas" });
    inst.current = c;
    const ro = new ResizeObserver(() => c.resize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      c.dispose();
      inst.current = null;
    };
  }, []);

  useEffect(() => {
    inst.current?.setOption(build(tk), { notMerge: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tk, ...deps]);

  return <div ref={el} className="w-full h-full min-h-[140px]" role="img" />;
}

const tooltipBase = (tk: Tk) => ({
  backgroundColor: tk.tipBg,
  borderColor: tk.tipBorder,
  borderWidth: 1,
  padding: [10, 12],
  appendToBody: true,
  confine: true,
  position: (pt: number[], _p: unknown, _d: unknown, _r: unknown, size: { contentSize: number[] }) => [pt[0] - size.contentSize[0] / 2, pt[1] - size.contentSize[1] - 16],
  transitionDuration: 0.15,
  extraCssText: "border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.22);z-index:99999;pointer-events:none;",
  textStyle: { color: tk.text, fontSize: 12, fontFamily: "inherit" },
});

const axisBase = (tk: Tk) => ({
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: tk.muted, fontSize: 11, fontFamily: "inherit" },
});

const dot = (c: string) =>
  `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${c};margin-right:8px"></span>`;

const legendBase = (tk: Tk, line = false) => ({
  bottom: 0,
  itemWidth: line ? 28 : 12,
  itemHeight: line ? 10 : 8,
  itemGap: 18,
  ...(line ? {} : { icon: "roundRect" }),
  textStyle: { color: tk.text, fontSize: 12, fontFamily: "inherit" },
  inactiveColor: tk.muted,
});

export type Serie = { key: string; name: string; color: string; dashed?: boolean };
type Row = Record<string, any>;

function tipFormatter(tk: Tk, fmt?: (v: number) => string) {
  return (ps: any) => {
    const list = Array.isArray(ps) ? ps : [ps];
    const head = `<div style="font-weight:600;margin-bottom:6px">${list[0].axisValueLabel ?? list[0].name}</div>`;
    const rows = list
      .map(
        (p: any) =>
          `<div style="display:flex;justify-content:space-between;gap:18px;line-height:1.7">` +
          `<span>${dot(p.color?.colorStops ? p.color.colorStops[0].color : p.color)}${p.seriesName}</span>` +
          `<b>${fmt ? fmt(p.value) : p.value}</b></div>`
      )
      .join("");
    return head + rows;
  };
}

/* ---------- linhas ---------- */
export function LineSeriesChart({
  data, xKey, series, legend = true, yFormat,
}: { data: Row[]; xKey: string; series: Serie[]; legend?: boolean; yFormat?: (v: number) => string }) {
  return (
    <EChart
      deps={[data, xKey, series, legend]}
      build={(tk) => ({
        animationDuration: 900,
        animationEasing: "cubicOut",
        grid: { left: 4, right: 14, top: 14, bottom: legend ? 34 : 6, containLabel: true },
        tooltip: { ...tooltipBase(tk), trigger: "axis", axisPointer: { type: "line", lineStyle: { color: tk.muted, type: "dashed" } }, formatter: tipFormatter(tk, yFormat) },
        legend: legend ? legendBase(tk, true) : { show: false },
        xAxis: { type: "category", boundaryGap: false, data: data.map((d) => d[xKey]), ...axisBase(tk) },
        yAxis: {
          type: "value", ...axisBase(tk),
          axisLabel: { ...axisBase(tk).axisLabel, formatter: yFormat ? (v: number) => yFormat(v) : undefined },
          splitLine: { lineStyle: { color: tk.grid, type: "dashed" } },
        },
        series: series.map((s) => {
          const c = cssColor(s.color);
          return {
            name: s.name,
            type: "line",
            smooth: 0.35,
            symbol: "circle",
            symbolSize: 7,
            showSymbol: false,
            data: data.map((d) => d[s.key]),
            lineStyle: { width: 3, color: c, type: s.dashed ? [7, 5] : "solid" },
            itemStyle: { color: c, borderColor: tk.card, borderWidth: 2 },
            emphasis: { focus: "series", scale: 1.5, lineStyle: { width: 4 } },
            areaStyle: s.dashed || series.length > 2
              ? undefined
              : { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: c + "55" }, { offset: 1, color: c + "00" }]) },
          };
        }),
      })}
    />
  );
}

/* ---------- barras ---------- */
export function BarSeriesChart({
  data, xKey, series, stacked = false, legend = true, yMax, yTicks, yFormat,
}: {
  data: Row[]; xKey: string; series: Serie[]; stacked?: boolean; legend?: boolean;
  yMax?: number; yTicks?: number; yFormat?: (v: number) => string;
}) {
  return (
    <EChart
      deps={[data, xKey, series, stacked, legend, yMax, yTicks]}
      build={(tk) => ({
        animationDuration: 800,
        animationEasing: "cubicOut",
        animationDelay: (i: number) => i * 60,
        grid: { left: 4, right: 10, top: 14, bottom: legend ? 34 : 6, containLabel: true },
        tooltip: { ...tooltipBase(tk), trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: tk.dark ? "rgba(255,255,255,.06)" : "rgba(13,65,125,.06)" } }, formatter: tipFormatter(tk, yFormat) },
        legend: legend ? legendBase(tk) : { show: false },
        xAxis: { type: "category", data: data.map((d) => d[xKey]), ...axisBase(tk) },
        yAxis: {
          type: "value", max: yMax, interval: yTicks, ...axisBase(tk),
          axisLabel: { ...axisBase(tk).axisLabel, formatter: yFormat ? (v: number) => yFormat(v) : undefined },
          splitLine: { lineStyle: { color: tk.grid, type: "dashed" } },
        },
        series: series.map((s, i) => {
          const c = cssColor(s.color);
          const last = i === series.length - 1;
          return {
            name: s.name,
            type: "bar",
            stack: stacked ? "t" : undefined,
            barMaxWidth: 38,
            barGap: "18%",
            data: data.map((d) => d[s.key]),
            itemStyle: {
              color: c,
              borderRadius: stacked ? (last ? [8, 8, 0, 0] : 0) : [8, 8, 0, 0],
              borderColor: stacked ? tk.card : undefined,
              borderWidth: stacked ? 1 : 0,
            },
            emphasis: { focus: "series", itemStyle: { shadowBlur: 14, shadowColor: c + "88" } },
          };
        }),
      })}
    />
  );
}

/* ---------- rosca ---------- */
export function DonutChart({ data, suffix = "%", radius = ["52%", "84%"] }: { data: { name: string; value: number; color: string }[]; suffix?: string; radius?: [string, string] }) {
  return (
    <EChart
      deps={[data, suffix]}
      build={(tk) => ({
        animationDuration: 900,
        animationEasing: "cubicOut",
        tooltip: {
          ...tooltipBase(tk),
          trigger: "item",
          formatter: (p: any) => `<div style="font-weight:600;margin-bottom:4px">${dot(p.color)}${p.name}</div><b style="font-size:15px">${p.value}${suffix}</b>`,
        },
        series: [
          {
            type: "pie",
            radius,
            center: ["50%", "50%"],
            padAngle: 3,
            itemStyle: { borderRadius: 8, borderColor: tk.card, borderWidth: 2 },
            label: { show: false, position: "center", fontFamily: "inherit" },
            emphasis: {
              scaleSize: 7,
              label: { show: true, fontSize: 18, fontWeight: 700, color: tk.text, formatter: `{c}${suffix}\n{b}`, lineHeight: 22 },
              itemStyle: { shadowBlur: 16, shadowColor: "rgba(0,0,0,.25)" },
            },
            labelLine: { show: false },
            data: data.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: cssColor(d.color) } })),
          },
        ],
      })}
    />
  );
}

/* ---------- formatos pt-BR ---------- */
const nf = (v: number, d = 1) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtMi = (v: number) => `R$ ${nf(v)} mi`;
export const fmtMil = (v: number) => `R$ ${nf(v, 0)} mil`;
export const fmtQtd = (unidade: string) => (v: number) => `${nf(v, 0)} ${unidade}`;
export const fmtMilQtd = (unidade: string) => (v: number) => `${nf(v, 0)} mil ${unidade}`;
