// AnimatedPieChartWithCallouts.tsx

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

const getArcPath = (cx, cy, r, startAngle, endAngle) => {
  "worklet";
  const toRad = (angle) => (angle - 90) * (Math.PI / 180);
  const polarToCartesian = (cx, cy, r, angle) => {
    const a = toRad(angle);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const safeEndAngle = Math.min(endAngle, startAngle + 359.99);
  const start = polarToCartesian(cx, cy, r, safeEndAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = safeEndAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${cx} ${cy}`,
    `Z`,
  ].join(" ");
};

const POP_DISTANCE = 12;

const AnimatedPieSlice = ({
  startAngle,
  endAngle,
  radius,
  fill,
  progress,
  onPress,
  isSelected,
}) => {
  const pop = useSharedValue(0);

  React.useEffect(() => {
    pop.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected]);

  const midAngleRad = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
  const tx = Math.cos(midAngleRad) * POP_DISTANCE;
  const ty = Math.sin(midAngleRad) * POP_DISTANCE;

  const animatedProps = useAnimatedProps(() => {
    const currentAngle = interpolate(progress.value, [0, 1], [startAngle, endAngle]);
    const d = getArcPath(radius, radius, radius, startAngle, currentAngle);
    return { d };
  });

  const groupAnimatedProps = useAnimatedProps(() => {
    const offset = pop.value;
    return {
      transform: [
        { translateX: tx * offset },
        { translateY: ty * offset },
      ],
    };
  });

  return (
    <AnimatedG animatedProps={groupAnimatedProps}>
      <AnimatedPath animatedProps={animatedProps} fill={fill} onPress={onPress} />
    </AnimatedG>
  );
};

const DEG_TO_RAD = (angle: number) => (angle - 90) * (Math.PI / 180);
const MAX_FONT_SIZE = 34;

const LABEL_FONT_SIZE = 12;
const LABEL_ROW_HEIGHT = 32;
const LABEL_GAP = 8;

const getDotSize = (pct: number) => Math.max(6, Math.min(18, 6 + (pct / 100) * 24));

export default function AnimatedPieChartWithCallouts({
  darkerOverlayBackgroundColor,
  primaryColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryOverlayColor,
  data = [],
  radius = 100,
  duration = 500,
  showPercentages = false,
  showLabels = true,
  onSectionPress = null,
  labelsSize = 12,
}) {
  const progress = useSharedValue(0);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = radius * 2 + POP_DISTANCE * 2;
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  useEffect(() => {
    progress.value = withTiming(1, { duration });
  }, [data]);

  const handleSectionPress = (categoryId: number | string, categoryName: string) => {
    if (categoryId === selectedId) {
      setSelectedId(null);
      onSectionPress?.(null, null);
    } else {
      setSelectedId(categoryId);
      onSectionPress?.(categoryId, categoryName);
    }
  };

  const sliceAngles = useMemo(() => {
    let cum = 0;
    return data.map((slice) => {
      const start = cum;
      const angle = (slice.value / total) * 360;
      cum += angle;
      return { start, end: cum, slice };
    });
  }, [data, total]);

  const sortedCallouts = useMemo(() => {
    if (!data.length || total === 0) return [];
    return [...data]
      .map((slice) => ({
        slice,
        pct: (slice.value / total) * 100,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [data, total]);

  const percentageOverlays = useMemo(() => {
    if (!showPercentages || !data.length || total === 0) return [];

    let cumAngle = 0;
    return data.map((slice) => {
      const startAngle = cumAngle;
      const angle = (slice.value / total) * 360;
      cumAngle += angle;
      const midAngle = startAngle + angle / 2;
      const pct = (slice.value / total) * 100;

      const distanceFactor = 0.68;
      const x = radius + POP_DISTANCE + radius * distanceFactor * Math.cos(DEG_TO_RAD(midAngle));
      const y = radius + POP_DISTANCE + radius * distanceFactor * Math.sin(DEG_TO_RAD(midAngle));

      return { x, y, pct, slice };
    });
  }, [data, total, radius, showPercentages]);

  const scaledLabelSize = Math.max(labelsSize, radius * 0.06);
  const isAllSelected = selectedId === "all";
  const hasSelection = selectedId !== null;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.pieContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`${-POP_DISTANCE} ${-POP_DISTANCE} ${size} ${size}`}>
          <G>
            {sliceAngles.map(({ start, end, slice }, index) => {
              const isSelected = selectedId === slice.user_category || isAllSelected;
              const isDimmed = hasSelection && !isSelected;

              return (
                <AnimatedPieSlice
                  key={slice.user_category || index}
                  startAngle={start}
                  endAngle={end}
                  radius={radius}
                  fill={isDimmed ? `${slice.color}40` : slice.color}
                  progress={progress}
                  isSelected={isSelected}
                  onPress={() => handleSectionPress(slice.user_category, slice.name)}
                />
              );
            })}
          </G>
        </Svg>

        {showPercentages &&
          !isAllSelected &&
          percentageOverlays.map((item, i) => {
            if (selectedId !== item.slice.user_category) return null;

            return (
              <Pressable
                key={`pct-${i}`}
                onPress={() =>
                  handleSectionPress(item.slice.user_category, item.slice.name)
                }
                style={{
                  position: "absolute",
                  top: item.y - 25,
                  left: item.x - 30,
                  minWidth: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    welcomeTextStyle,
                    {
                      backgroundColor: darkerOverlayBackgroundColor,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 20,
                      fontSize: MAX_FONT_SIZE,
                      color: primaryColor,
                    },
                  ]}
                >
                  {`${Math.round(item.pct)}%`}
                </Text>
              </Pressable>
            );
          })}

        <Pressable
          onPress={() => handleSectionPress("all", "All")}
          style={[
            styles.centerButton,
            {
              top: size / 2 - 30,
              left: size / 2 - 30,
              backgroundColor: isAllSelected
                ? `${primaryOverlayColor}FF`
                : primaryOverlayColor,
              borderWidth: isAllSelected ? 2 : 0,
              borderColor: primaryColor,
            },
          ]}
        />
      </View>

      {showLabels && (
        <ScrollView
          fadingEdgeLength={4}
          style={[styles.legendScroll, { maxHeight: size }]}
          contentContainerStyle={styles.legendContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {sortedCallouts.map((item, i) => {
            const isSelected = selectedId === item.slice.user_category || isAllSelected;
            const isDimmed = hasSelection && !isSelected;
            const dotSize = getDotSize(item.pct);

            return (
              <Pressable
                key={`label-${item.slice.user_category || i}`}
                onPress={() =>
                  handleSectionPress(item.slice.user_category, item.slice.name)
                }
                style={[
                  styles.legendRow,
                  {
                    backgroundColor: isSelected
                      ? `${primaryOverlayColor}FF`
                      : "transparent",
                    opacity: isDimmed ? 0.3 : 1,
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: isSelected ? item.slice.color : "transparent",
                  },
                ]}
              >
                <View style={styles.dotContainer}>
                  <View
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      backgroundColor: item.slice.color,
                    }}
                  />
                </View>
                <Text
                  style={[
                    subWelcomeTextStyle,
                    {
                      fontSize: LABEL_FONT_SIZE,
                      color: primaryColor,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.slice.name}
                </Text>
                {showPercentages && (
                  <Text
                    style={[
                      subWelcomeTextStyle,
                      {
                        fontSize: LABEL_FONT_SIZE - 1,
                        color: primaryColor,
                        opacity: 0.5,
                      },
                    ]}
                  >
                    {`${Math.round(item.pct)}%`}
                  </Text>
                )}
              </Pressable>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pieContainer: {
    flexShrink: 0,
  },
  dotContainer: {
    width: 18,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  legendScroll: {
    flex: 1,
  },
  legendContent: {
    gap: 4,
    paddingVertical: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
});