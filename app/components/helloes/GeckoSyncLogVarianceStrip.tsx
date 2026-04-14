import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Svg, { Rect, G, Text as SvgText } from "react-native-svg";
import { useLDTheme } from "@/src/context/LDThemeContext";

type Props = {
  timestamps: string[];
  values: Array<number | null>;
  globalMin: number;
  globalMax: number;
  title?: string;
  height?: number;
  pointWidth?: number;
  primaryColor?: string;
  redThreshold?: number;
  scrollRef?: (ref: ScrollView | null) => void;
  onScrollX?: (x: number) => void;
  onScrollRelease?: () => void;
};

const PADDING_LEFT = 60;
const PADDING_RIGHT = 12;
const PADDING_TOP = 14;
const PADDING_BOTTOM = 22;

const DEFAULT_RED_THRESHOLD = 0.003;

const colorForValue = (v: number, threshold: number) =>
  Math.abs(v) > threshold ? "#E53935" : "#43A047";

const GeckoSyncLogVarianceStrip = ({
  timestamps,
  values,
  globalMin,
  globalMax,
  title = "variance",
  height = 70,
  pointWidth = 36,
  redThreshold = DEFAULT_RED_THRESHOLD,
  scrollRef,
  onScrollX,
  onScrollRelease,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const textColor = lightDarkTheme.primaryText;

  const { innerWidth, innerHeight, totalWidth, xFor } = useMemo(() => {
    const n = timestamps.length;
    const innerH = height - PADDING_TOP - PADDING_BOTTOM;
    const innerW = Math.max((n - 1) * pointWidth, pointWidth);
    const totalW = innerW + PADDING_LEFT + PADDING_RIGHT;
    const x = (i: number) =>
      PADDING_LEFT + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    return {
      innerWidth: innerW,
      innerHeight: innerH,
      totalWidth: totalW,
      xFor: x,
    };
  }, [timestamps.length, height, pointWidth]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e?.nativeEvent?.contentOffset?.x;
    if (x == null) return;
    onScrollX?.(x);
  };

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

  const formatVal = (v: number) => {
    const range = globalMax - globalMin;
    const decimals =
      range >= 10 ? 0 : range >= 1 ? 1 : range >= 0.1 ? 2 : 3;
    const s = v.toFixed(decimals);
    return v > 0 ? `+${s}` : s;
  };

  const stripH = Math.max(10, Math.min(innerHeight, 16));
  const stripY = PADDING_TOP + (innerHeight - stripH) / 2;

  const hasValues = Number.isFinite(globalMin) && Number.isFinite(globalMax);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>

      <View style={{ position: "relative" }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ height }}
          scrollEventThrottle={32}
          onScroll={handleScroll}
          onScrollEndDrag={onScrollRelease}
          onMomentumScrollEnd={onScrollRelease}
        >
          <Svg width={totalWidth} height={height}>
            <G>
              {values.map((v, i) => {
                if (v == null) return null;
                const fill = colorForValue(v, redThreshold);
                const x1 = xFor(i);
                const x2 = i < values.length - 1 ? xFor(i + 1) : x1 + pointWidth;
                return (
                  <Rect
                    key={`bar-${i}`}
                    x={x1}
                    y={stripY}
                    width={Math.max(1, x2 - x1)}
                    height={stripH}
                    fill={fill}
                  />
                );
              })}

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
            </G>
          </Svg>
        </ScrollView>

        <View
          pointerEvents="none"
          style={[
            styles.stickyLabel,
            {
              width: PADDING_LEFT,
              height,
              backgroundColor: lightDarkTheme.primaryBackground,
            },
          ]}
        >
          {hasValues ? (
            <>
              <Text style={[styles.rangeText, { color: textColor }]}>
                {formatVal(globalMax)}
              </Text>
              <Text
                style={[styles.rangeText, { color: textColor, opacity: 0.6 }]}
              >
                …
              </Text>
              <Text style={[styles.rangeText, { color: textColor }]}>
                {formatVal(globalMin)}
              </Text>
            </>
          ) : (
            <Text
              style={[styles.rangeText, { color: textColor, opacity: 0.5 }]}
            >
              —
            </Text>
          )}
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
  stickyLabel: {
    position: "absolute",
    left: 0,
    top: 0,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 6,
    paddingVertical: 4,
  },
  rangeText: {
    fontSize: 9,
    fontVariant: ["tabular-nums"],
    lineHeight: 11,
  },
});

export default GeckoSyncLogVarianceStrip;
