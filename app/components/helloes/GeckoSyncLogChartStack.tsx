import React, { useCallback, useRef } from "react";
import { View, ScrollView } from "react-native";
import GeckoSyncLogLineChart, {
  SyncLogSeries,
} from "./GeckoSyncLogLineChart";
import GeckoSyncLogVarianceStrip from "./GeckoSyncLogVarianceStrip";

type SyncLogEntry = React.ComponentProps<
  typeof GeckoSyncLogLineChart
>["listData"][number];

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
    };

type Props = {
  listData: SyncLogEntry[];
  charts: GeckoSyncLogChartConfig[];
  pointWidth?: number;
  primaryColor?: string;
};

const GeckoSyncLogChartStack = ({
  listData,
  charts,
  pointWidth = 36,
  primaryColor = "orange",
}: Props) => {
  const scrollRefs = useRef<Array<ScrollView | null>>([]);
  const activeIdxRef = useRef<number | null>(null);

  const setRef = useCallback(
    (idx: number) => (ref: ScrollView | null) => {
      scrollRefs.current[idx] = ref;
    },
    [],
  );

  const handleScrollX = useCallback(
    (idx: number) => (x: number) => {
      if (activeIdxRef.current == null) activeIdxRef.current = idx;
      if (activeIdxRef.current !== idx) return;
      scrollRefs.current.forEach((ref, i) => {
        if (i !== idx && ref) {
          ref.scrollTo({ x, animated: false });
        }
      });
    },
    [],
  );

  const releaseActive = useCallback(() => {
    activeIdxRef.current = null;
  }, []);

  return (
    <View>
      {charts.map((cfg, i) => {
        if (cfg.kind === "strip") {
          return (
            <GeckoSyncLogVarianceStrip
              key={cfg.key}
              listData={listData}
              accessor={cfg.accessor}
              title={cfg.title}
              height={cfg.height}
              redThreshold={cfg.redThreshold}
              pointWidth={pointWidth}
              primaryColor={primaryColor}
              scrollRef={setRef(i)}
              onScrollX={handleScrollX(i)}
              onScrollRelease={releaseActive}
            />
          );
        }
        return (
          <GeckoSyncLogLineChart
            key={cfg.key}
            listData={listData}
            series={cfg.series}
            title={cfg.title}
            height={cfg.height}
            yMin={cfg.yMin}
            yMax={cfg.yMax}
            pointWidth={pointWidth}
            primaryColor={primaryColor}
            scrollRef={setRef(i)}
            onScrollX={handleScrollX(i)}
            onScrollRelease={releaseActive}
          />
        );
      })}
    </View>
  );
};

export default GeckoSyncLogChartStack;
