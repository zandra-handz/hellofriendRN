import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import Svg, { Rect, G, Text as SvgText } from "react-native-svg";
import { useLDTheme } from "@/src/context/LDThemeContext";

type SyncLogEntry = {
  id: number;
  created_at: string;
  trigger: string;

  client_energy: number | null;
  client_surplus: number | null;
  client_multiplier: number | null;
  client_computed_at: string | null;
  client_steps_in_payload: number | null;
  client_distance_in_payload: number | null;
  client_started_on: string | null;
  client_ended_on: string | null;
  client_fatigue: number | null;
  client_recharge: number | null;

  server_energy_before: number | null;
  server_energy_after: number | null;
  server_surplus_before: number | null;
  server_surplus_after: number | null;
  server_updated_at_before: string | null;
  server_updated_at_after: string | null;

  recompute_window_seconds: number | null;
  recompute_active_seconds: number | null;
  recompute_new_steps: number | null;
  recompute_fatigue: number | null;
  recompute_recharge: number | null;
  recompute_net: number | null;

  pending_entries_count: number | null;
  pending_entries_in_window: number | null;
  pending_entries_stale: number | null;
  pending_total_steps_all: number | null;
  pending_total_steps_in_window: number | null;

  energy_delta: number | null;
  phantom_steps: number | null;

  multiplier_active: boolean | null;
  streak_expires_at: string | null;
  total_steps_all_time: number | null;
};

type Props = {
  listData: SyncLogEntry[];
  accessor: (entry: SyncLogEntry) => number | null;
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

const colorForValue = (v: number, threshold: number) => {
  return Math.abs(v) > threshold ? "#E53935" : "#43A047";
};

const GeckoSyncLogVarianceStrip = ({
  listData,
  accessor,
  title = "variance",
  height = 70,
  pointWidth = 36,
  primaryColor = "orange",
  redThreshold = DEFAULT_RED_THRESHOLD,
  scrollRef,
  onScrollX,
  onScrollRelease,
}: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const textColor = lightDarkTheme.primaryText;

  const [viewport, setViewport] = useState({ x: 0, w: 0 });

  const chronological = useMemo(() => {
    const copy = [...(listData ?? [])];
    copy.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    return copy;
  }, [listData]);

  const { innerWidth, innerHeight, totalWidth, xFor } = useMemo(() => {
    const n = chronological.length;
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
  }, [chronological, height, pointWidth]);


  const visibleRange = useMemo(() => {
    if (viewport.w === 0) return null;
    const left = viewport.x;
    const right = viewport.x + viewport.w;
    const vals: number[] = [];
    chronological.forEach((entry, i) => {
      const x = xFor(i);
      if (x >= left && x <= right) {
        const v = accessor(entry);
        if (v != null && Number.isFinite(v)) vals.push(v);
      }
    });
    if (!vals.length) return null;
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [viewport, chronological, accessor, xFor]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e?.nativeEvent?.contentOffset?.x;
      if (x == null) return;
      onScrollX?.(x);
      setViewport((v) => ({ ...v, x }));
    },
    [onScrollX],
  );

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setViewport((v) => ({ ...v, w }));
  }, []);

  const xTickIndices = useMemo(() => {
    const n = chronological.length;
    if (n === 0) return [];
    const maxLabels = Math.max(2, Math.floor(innerWidth / 80));
    const step = Math.max(1, Math.floor(n / maxLabels));
    const idxs: number[] = [];
    for (let i = 0; i < n; i += step) idxs.push(i);
    if (idxs[idxs.length - 1] !== n - 1) idxs.push(n - 1);
    return idxs;
  }, [chronological.length, innerWidth]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const mo = d.getMonth() + 1;
    const day = d.getDate();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${mo}/${day} ${hh}:${mm}`;
  };

  const formatVal = (v: number) => {
    const range = (visibleRange?.max ?? 1) - (visibleRange?.min ?? 0);
    const decimals =
      range >= 10 ? 0 : range >= 1 ? 1 : range >= 0.1 ? 2 : 3;
    const s = v.toFixed(decimals);
    return v > 0 ? `+${s}` : s;
  };

  const stripH = Math.max(10, Math.min(innerHeight, 16));
  const stripY = PADDING_TOP + (innerHeight - stripH) / 2;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>

      <View style={{ position: "relative" }} onLayout={handleLayout}>
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
              {chronological.map((entry, i) => {
                const v = accessor(entry);
                if (v == null || !Number.isFinite(v)) return null;
                const fill = colorForValue(v, redThreshold);
                const x1 = xFor(i);
                const x2 =
                  i < chronological.length - 1 ? xFor(i + 1) : x1 + pointWidth;
                return (
                  <Rect
                    key={`bar-${entry.id ?? i}`}
                    x={x1}
                    y={stripY}
                    width={Math.max(1, x2 - x1)}
                    height={stripH}
                    fill={fill}
                  />
                );
              })}

              {xTickIndices.map((i) => {
                const entry = chronological[i];
                if (!entry) return null;
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
                    {formatTime(entry.created_at)}
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
          {visibleRange ? (
            <>
              <Text style={[styles.rangeText, { color: textColor }]}>
                {formatVal(visibleRange.max)}
              </Text>
              <Text
                style={[
                  styles.rangeText,
                  { color: textColor, opacity: 0.6 },
                ]}
              >
                …
              </Text>
              <Text style={[styles.rangeText, { color: textColor }]}>
                {formatVal(visibleRange.min)}
              </Text>
            </>
          ) : (
            <Text style={[styles.rangeText, { color: textColor, opacity: 0.5 }]}>—</Text>
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
