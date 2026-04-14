import React, { useDeferredValue, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Svg, { Path, Rect, G, Text as SvgText, Line } from "react-native-svg";
import { useLDTheme } from "@/src/context/LDThemeContext";

type SyncLogEntry = {
  id: number;
  created_at: string;
  [k: string]: any;
};

export type SyncLogSeries = {
  key: string;
  label: string;
  color: string;
  accessor: (entry: SyncLogEntry) => number | null;
};

export type GeckoSyncLogChartConfig =
  | {
      kind?: "line";
      key: string;
      title?: string;
      series: SyncLogSeries[];
      height?: number;
      yMin?: number;
      yMax?: number;
    }
  | {
      kind: "strip";
      key: string;
      title?: string;
      accessor: (e: SyncLogEntry) => number | null;
      height?: number;
      redThreshold?: number;
      okColor?: string;
      alertColor?: string;
    }
  | {
      kind: "dualRange";
      key: string;
      title?: string;
      height?: number;
      topLabel: string;
      topColor: string;
      topRange: (e: SyncLogEntry) => { start: string | null; end: string | null } | null;
      bottomLabel: string;
      bottomColor: string;
      bottomRange: (e: SyncLogEntry) => { start: string | null; end: string | null } | null;
    };

type Props = {
  listData: SyncLogEntry[];
  charts: GeckoSyncLogChartConfig[];
  pointWidth?: number;
  primaryColor?: string;
  maxPoints?: number;
};

const PADDING_LEFT = 8;
const PADDING_RIGHT = 12;
const ROW_GAP = 18;
const TITLE_H = 14;
const DEFAULT_LINE_H = 120;
const DEFAULT_STRIP_H = 40;
const MAX_POINTS_DEFAULT = 500;
const RED_THRESHOLD_DEFAULT = 0.003;

const buildSmoothPath = (pts: Array<{ x: number; y: number }>) => {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${mo}/${day} ${hh}:${mm}`;
};

const GeckoSyncLogChartStack = ({
  listData,
  charts,
  pointWidth = 36,
  primaryColor = "orange",
  maxPoints = MAX_POINTS_DEFAULT,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const textColor = lightDarkTheme.primaryText;

  const deferredListData = useDeferredValue(listData);

  const chronological = useMemo(() => {
    const src = deferredListData ?? [];
    if (!src.length) return src;
    const first = new Date(src[0].created_at).getTime();
    const last = new Date(src[src.length - 1].created_at).getTime();
    const newestFirst = first >= last;
    const take = Math.min(maxPoints, src.length);
    if (newestFirst) {
      const out = new Array(take);
      for (let i = 0; i < take; i++) out[i] = src[take - 1 - i];
      return out;
    }
    return src.slice(src.length - take);
  }, [deferredListData, maxPoints]);

  const n = chronological.length;
  const MAX_SVG_WIDTH = 2400;
  const effectivePointWidth = Math.max(
    2,
    Math.min(pointWidth, n > 1 ? (MAX_SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT) / (n - 1) : pointWidth),
  );
  const innerW = Math.max((n - 1) * effectivePointWidth, effectivePointWidth);
  const totalWidth = innerW + PADDING_LEFT + PADDING_RIGHT;

  const xFor = (i: number) =>
    PADDING_LEFT + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);

  const rows = useMemo(() => {
    let cursorY = 0;
    return charts.map((cfg) => {
      const rowH =
        cfg.kind === "strip"
          ? cfg.height ?? DEFAULT_STRIP_H
          : cfg.kind === "dualRange"
          ? cfg.height ?? 70
          : cfg.height ?? DEFAULT_LINE_H;
      const top = cursorY;
      cursorY += TITLE_H + rowH + ROW_GAP;

      if (cfg.kind === "dualRange") {
        const parse = (s: string | null) => {
          if (!s) return null;
          const t = new Date(s).getTime();
          return Number.isFinite(t) ? t : null;
        };
        const tops: Array<{ start: number; end: number } | null> = new Array(n);
        const bottoms: Array<{ start: number; end: number } | null> = new Array(n);
        let minT = Infinity;
        let maxT = -Infinity;
        for (let i = 0; i < n; i++) {
          const tr = cfg.topRange(chronological[i]);
          const br = cfg.bottomRange(chronological[i]);
          const ts = parse(tr?.start ?? null);
          const te = parse(tr?.end ?? null);
          const bs = parse(br?.start ?? null);
          const be = parse(br?.end ?? null);
          if (ts != null && te != null && te >= ts) {
            tops[i] = { start: ts, end: te };
            if (ts < minT) minT = ts;
            if (te > maxT) maxT = te;
          } else tops[i] = null;
          if (bs != null && be != null && be >= bs) {
            bottoms[i] = { start: bs, end: be };
            if (bs < minT) minT = bs;
            if (be > maxT) maxT = be;
          } else bottoms[i] = null;
        }
        let maxDur = 0;
        for (let i = 0; i < n; i++) {
          if (tops[i]) maxDur = Math.max(maxDur, tops[i]!.end - tops[i]!.start);
          if (bottoms[i])
            maxDur = Math.max(maxDur, bottoms[i]!.end - bottoms[i]!.start);
        }
        return { cfg, top, rowH, tops, bottoms, maxDur };
      }

      if (cfg.kind === "strip") {
        const values: Array<number | null> = new Array(n);
        let min = Infinity;
        let max = -Infinity;
        for (let i = 0; i < n; i++) {
          const v = cfg.accessor(chronological[i]);
          if (v != null && Number.isFinite(v)) {
            values[i] = v;
            if (v < min) min = v;
            if (v > max) max = v;
          } else {
            values[i] = null;
          }
        }
        return {
          cfg,
          top,
          rowH,
          values,
          min: min === Infinity ? 0 : min,
          max: max === -Infinity ? 1 : max,
        };
      }

      const seriesValues: Array<Array<number | null>> = cfg.series.map(
        () => new Array(n),
      );
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < n; i++) {
        const entry = chronological[i];
        for (let s = 0; s < cfg.series.length; s++) {
          const v = cfg.series[s].accessor(entry);
          if (v != null && Number.isFinite(v)) {
            seriesValues[s][i] = v;
            if (v < min) min = v;
            if (v > max) max = v;
          } else {
            seriesValues[s][i] = null;
          }
        }
      }
      let lo = cfg.yMin ?? (min === Infinity ? 0 : min);
      let hi = cfg.yMax ?? (max === -Infinity ? 1 : max);
      if (lo === hi) {
        lo -= 1;
        hi += 1;
      }
      return { cfg, top, rowH, seriesValues, min: lo, max: hi };
    });
  }, [charts, chronological, n]);

  const totalHeight =
    rows.reduce((acc, r) => acc + TITLE_H + r.rowH + ROW_GAP, 0) + 24;

  const xTickIndices = useMemo(() => {
    if (n === 0) return [];
    const maxLabels = Math.max(2, Math.floor(innerW / 80));
    const step = Math.max(1, Math.floor(n / maxLabels));
    const idxs: number[] = [];
    for (let i = 0; i < n; i += step) idxs.push(i);
    if (idxs[idxs.length - 1] !== n - 1) idxs.push(n - 1);
    return idxs;
  }, [n, innerW]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        scrollEventThrottle={32}
      >
        <Svg width={totalWidth} height={totalHeight}>
          {rows.map((row) => {
            const cfg = row.cfg;
            const titleY = row.top + 10;
            const plotTop = row.top + TITLE_H;
            const plotBottom = plotTop + row.rowH;

            if (cfg.kind === "dualRange") {
              const tops = (row as any).tops as Array<{ start: number; end: number } | null>;
              const bottoms = (row as any).bottoms as Array<{ start: number; end: number } | null>;
              const discH = Math.max(6, Math.min(12, (row.rowH - 10) / 2 - 2));
              const topY = plotTop + 4;
              const bottomY = plotTop + row.rowH - discH - 4;
              // Per-entry shared time axis: map [minEntry, maxEntry] -> [cx - half, cx + half]
              const halfSlot = effectivePointWidth * 0.45;
              return (
                <G key={cfg.key}>
                  <SvgText
                    x={PADDING_LEFT}
                    y={titleY}
                    fontSize={10}
                    fontWeight="700"
                    fill={textColor as string}
                  >
                    {cfg.title ?? ""}
                  </SvgText>
                  {tops.map((r, i) => {
                    const b = bottoms[i];
                    if (!r && !b) return null;
                    const lo = Math.min(r?.start ?? Infinity, b?.start ?? Infinity);
                    const hi = Math.max(r?.end ?? -Infinity, b?.end ?? -Infinity);
                    const span = hi - lo;
                    const cx = xFor(i);
                    const mapX = (t: number) =>
                      span <= 0 ? cx : cx - halfSlot + ((t - lo) / span) * halfSlot * 2;
                    const nodes: any[] = [];
                    if (r) {
                      const sx = mapX(r.start);
                      const ex = mapX(r.end);
                      // two discs at start and end
                      nodes.push(
                        <Rect
                          key={`${cfg.key}-ts-${i}`}
                          x={sx - discH / 2}
                          y={topY}
                          width={discH}
                          height={discH}
                          rx={discH / 2}
                          ry={discH / 2}
                          fill={cfg.topColor}
                        />,
                        <Rect
                          key={`${cfg.key}-te-${i}`}
                          x={ex - discH / 2}
                          y={topY}
                          width={discH}
                          height={discH}
                          rx={discH / 2}
                          ry={discH / 2}
                          fill={cfg.topColor}
                        />,
                        <Line
                          key={`${cfg.key}-tl-${i}`}
                          x1={sx}
                          x2={ex}
                          y1={topY + discH / 2}
                          y2={topY + discH / 2}
                          stroke={cfg.topColor}
                          strokeOpacity={0.4}
                          strokeWidth={1}
                        />,
                      );
                    }
                    if (b) {
                      const sx = mapX(b.start);
                      const ex = mapX(b.end);
                      nodes.push(
                        <Rect
                          key={`${cfg.key}-bs-${i}`}
                          x={sx - discH / 2}
                          y={bottomY}
                          width={discH}
                          height={discH}
                          rx={discH / 2}
                          ry={discH / 2}
                          fill={cfg.bottomColor}
                        />,
                        <Rect
                          key={`${cfg.key}-be-${i}`}
                          x={ex - discH / 2}
                          y={bottomY}
                          width={discH}
                          height={discH}
                          rx={discH / 2}
                          ry={discH / 2}
                          fill={cfg.bottomColor}
                        />,
                        <Line
                          key={`${cfg.key}-bl-${i}`}
                          x1={sx}
                          x2={ex}
                          y1={bottomY + discH / 2}
                          y2={bottomY + discH / 2}
                          stroke={cfg.bottomColor}
                          strokeOpacity={0.4}
                          strokeWidth={1}
                        />,
                      );
                    }
                    return <G key={`${cfg.key}-g-${i}`}>{nodes}</G>;
                  })}
                  <SvgText
                    x={PADDING_LEFT}
                    y={topY + discH - 1}
                    fontSize={8}
                    fill={textColor as string}
                    opacity={0.7}
                  >
                    {cfg.topLabel}
                  </SvgText>
                  <SvgText
                    x={PADDING_LEFT}
                    y={bottomY + discH - 1}
                    fontSize={8}
                    fill={textColor as string}
                    opacity={0.7}
                  >
                    {cfg.bottomLabel}
                  </SvgText>
                </G>
              );
            }

            if (cfg.kind === "strip") {
              const redThreshold = cfg.redThreshold ?? RED_THRESHOLD_DEFAULT;
              const okColor = cfg.okColor ?? "#43A047";
              const alertColor = cfg.alertColor ?? "#E53935";
              const stripH = Math.max(10, Math.min(row.rowH, 16));
              const stripY = plotTop + (row.rowH - stripH) / 2;
              const vals = (row as any).values as Array<number | null>;
              return (
                <G key={cfg.key}>
                  <SvgText
                    x={PADDING_LEFT}
                    y={titleY}
                    fontSize={10}
                    fontWeight="700"
                    fill={textColor as string}
                  >
                    {cfg.title ?? "variance"}
                  </SvgText>
                  {vals.map((v, i) => {
                    if (v == null) return null;
                    const fill =
                      Math.abs(v) > redThreshold ? alertColor : okColor;
                    const x1 = xFor(i);
                    const x2 =
                      i < vals.length - 1 ? xFor(i + 1) : x1 + effectivePointWidth;
                    return (
                      <Rect
                        key={`${cfg.key}-b-${i}`}
                        x={x1}
                        y={stripY}
                        width={Math.max(1, x2 - x1)}
                        height={stripH}
                        fill={fill}
                      />
                    );
                  })}
                </G>
              );
            }

            const lo = row.min;
            const hi = row.max;
            const yFor = (v: number) =>
              plotTop + (1 - (v - lo) / (hi - lo)) * row.rowH;

            const sv = (row as any).seriesValues as Array<Array<number | null>>;
            return (
              <G key={cfg.key}>
                <Line
                  x1={PADDING_LEFT}
                  x2={totalWidth - PADDING_RIGHT}
                  y1={plotBottom}
                  y2={plotBottom}
                  stroke={textColor as string}
                  strokeOpacity={0.1}
                  strokeWidth={1}
                />
                <SvgText
                  x={PADDING_LEFT}
                  y={titleY}
                  fontSize={10}
                  fontWeight="700"
                  fill={textColor as string}
                >
                  {(cfg.title ?? "").toUpperCase()}
                </SvgText>

                {cfg.series.map((s, sIdx) => {
                  const values = sv[sIdx];
                  const segments: Array<Array<{ x: number; y: number }>> = [];
                  let current: Array<{ x: number; y: number }> = [];
                  for (let i = 0; i < values.length; i++) {
                    const v = values[i];
                    if (v == null) {
                      if (current.length) segments.push(current);
                      current = [];
                      continue;
                    }
                    current.push({ x: xFor(i), y: yFor(v) });
                  }
                  if (current.length) segments.push(current);
                  const d = segments.map(buildSmoothPath).join(" ");
                  if (!d) return null;
                  return (
                    <Path
                      key={`${cfg.key}-${s.key}`}
                      d={d}
                      stroke={s.color}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  );
                })}

                <SvgText
                  x={totalWidth - PADDING_RIGHT}
                  y={plotTop + 10}
                  fontSize={9}
                  textAnchor="end"
                  fill={textColor as string}
                  opacity={0.6}
                >
                  {hi.toFixed(2)}
                </SvgText>
                <SvgText
                  x={totalWidth - PADDING_RIGHT}
                  y={plotBottom - 2}
                  fontSize={9}
                  textAnchor="end"
                  fill={textColor as string}
                  opacity={0.6}
                >
                  {lo.toFixed(2)}
                </SvgText>
              </G>
            );
          })}

          {xTickIndices.map((i) => {
            const ts = chronological[i]?.created_at;
            if (!ts) return null;
            return (
              <SvgText
                key={`xl-${i}`}
                x={xFor(i)}
                y={totalHeight - 6}
                fontSize={9}
                textAnchor="middle"
                fill={textColor as string}
                opacity={0.5}
              >
                {formatTime(ts)}
              </SvgText>
            );
          })}
        </Svg>
      </ScrollView>

      <View style={styles.legendWrap}>
        {rows.flatMap((r) =>
          r.cfg.kind === "strip" || r.cfg.kind === "dualRange"
            ? []
            : r.cfg.series.map((s) => (
                <View key={`${r.cfg.key}-${s.key}`} style={styles.legendItem}>
                  <View
                    style={[styles.legendSwatch, { backgroundColor: s.color }]}
                  />
                  <Text style={[styles.legendLabel, { color: textColor }]}>
                    {s.label}
                  </Text>
                </View>
              )),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  legendWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendSwatch: { width: 10, height: 10, borderRadius: 2 },
  legendLabel: { fontSize: 10 },
});

export default GeckoSyncLogChartStack;
