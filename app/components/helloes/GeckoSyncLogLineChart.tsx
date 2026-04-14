import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import { useLDTheme } from "@/src/context/LDThemeContext";

export type PreparedSeries = {
  key: string;
  label: string;
  color: string;
  values: Array<number | null>;
};

type Props = {
  timestamps: string[];
  series: PreparedSeries[];
  title?: string;
  height?: number;
  pointWidth?: number;
  yMin?: number;
  yMax?: number;
  primaryColor?: string;
  scrollRef?: (ref: ScrollView | null) => void;
  onScrollX?: (x: number) => void;
  onScrollRelease?: () => void;
};

const PADDING_TOP = 14;
const PADDING_BOTTOM = 22;
const PADDING_LEFT = 60;
const PADDING_RIGHT = 12;

const GeckoSyncLogLineChart = ({
  timestamps,
  series,
  title = "energy",
  height = 160,
  pointWidth = 36,
  yMin,
  yMax,
  scrollRef,
  onScrollX,
  onScrollRelease,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const textColor = lightDarkTheme.primaryText;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e?.nativeEvent?.contentOffset?.x;
    if (x == null) return;
    onScrollX?.(x);
  };

  const { innerWidth, totalWidth, yLo, yHi, xFor, yFor } = useMemo(() => {
    const n = timestamps.length;
    const innerH = height - PADDING_TOP - PADDING_BOTTOM;
    const innerW = Math.max((n - 1) * pointWidth, pointWidth);
    const totalW = innerW + PADDING_LEFT + PADDING_RIGHT;

    let lo = yMin ?? 0;
    let hi = yMax ?? 1;
    if (lo === hi) {
      lo -= 1;
      hi += 1;
    }

    const x = (i: number) =>
      PADDING_LEFT + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const y = (v: number) =>
      PADDING_TOP + (1 - (v - lo) / (hi - lo)) * innerH;

    return {
      innerWidth: innerW,
      totalWidth: totalW,
      yLo: lo,
      yHi: hi,
      xFor: x,
      yFor: y,
    };
  }, [timestamps.length, height, pointWidth, yMin, yMax]);

  const paths = useMemo(() => {
    const buildSmoothPath = (pts: Array<{ x: number; y: number }>) => {
      if (pts.length === 0) return "";
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      const tension = 0.5;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
        const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
        const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
        const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    };

    const offsetStep = 2.5;
    const centerIdx = (series.length - 1) / 2;

    return series.map((s, sIdx) => {
      const yOffset = (sIdx - centerIdx) * offsetStep;
      const segments: Array<Array<{ x: number; y: number }>> = [];
      let current: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < s.values.length; i++) {
        const v = s.values[i];
        if (v == null) {
          if (current.length) segments.push(current);
          current = [];
          continue;
        }
        current.push({ x: xFor(i), y: yFor(v) + yOffset });
      }
      if (current.length) segments.push(current);
      const d = segments.map(buildSmoothPath).join(" ");
      return { series: s, d };
    });
  }, [series, xFor, yFor]);

  const yTicks = useMemo(() => {
    const count = 4;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      ticks.push(yLo + ((yHi - yLo) * i) / count);
    }
    return ticks;
  }, [yLo, yHi]);

  const xTickIndices = useMemo(() => {
    const n = timestamps.length;
    if (n === 0) return [];
    const maxLabels = Math.max(2, Math.floor(innerWidth / 80));
    const step = Math.max(1, Math.floor(n / maxLabels));
    const idxs: number[] = [];
    for (let i = 0; i < n; i += step) idxs.push(i);
    if (idxs[idxs.length - 1] !== n - 1) idxs.push(n - 1);
    return idxs;
  }, [timestamps.length, innerWidth]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const mo = d.getMonth() + 1;
    const day = d.getDate();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${mo}/${day} ${hh}:${mm}`;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <View style={styles.legend}>
          {series.map((s) => (
            <View key={s.key} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: s.color }]} />
              <Text style={[styles.legendLabel, { color: textColor }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ position: "relative" }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ height }}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onScrollEndDrag={onScrollRelease}
          onMomentumScrollEnd={onScrollRelease}
        >
          <Svg width={totalWidth} height={height}>
            <G>
              {xTickIndices.map((i) => {
                const ts = timestamps[i];
                if (!ts) return null;
                return (
                  <SvgText
                    key={`xlabel-${i}`}
                    x={xFor(i)}
                    y={height - 6}
                    fontSize={9}
                    textAnchor="middle"
                    fill={textColor as string}
                    opacity={0.5}
                  >
                    {formatTime(ts)}
                  </SvgText>
                );
              })}

              {paths.map(({ series: s, d }) =>
                d ? (
                  <Path
                    key={`path-${s.key}`}
                    d={d}
                    stroke={s.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ) : null,
              )}
            </G>
          </Svg>
        </ScrollView>

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PADDING_LEFT,
            height,
            backgroundColor: lightDarkTheme.primaryBackground,
          }}
        >
          <Svg width={PADDING_LEFT} height={height}>
            {yTicks.map((t, i) => {
              const range = yHi - yLo;
              const decimals =
                range <= 0
                  ? 0
                  : Math.min(
                      6,
                      Math.max(0, 1 - Math.floor(Math.log10(range))),
                    );
              return (
                <SvgText
                  key={`ylabel-fixed-${i}`}
                  x={PADDING_LEFT - 4}
                  y={yFor(t) + 3}
                  fontSize={9}
                  textAnchor="end"
                  fill={textColor as string}
                  opacity={0.7}
                >
                  {t.toFixed(decimals)}
                </SvgText>
              );
            })}
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 10,
  },
});

export default GeckoSyncLogLineChart;
