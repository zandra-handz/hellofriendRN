// AnimatedPieChart.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
// import GlobalPressable from "../appwide/button/GlobalPressable";
import Svg, { G, Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const getArcPath = (cx, cy, r, startAngle, endAngle) => {
  "worklet";

  const toRad = (angle) => (angle - 90) * (Math.PI / 180);
  const polarToCartesian = (cx, cy, r, angle) => {
    const a = toRad(angle);
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
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

const AnimatedPieSlice = ({
  startAngle,
  endAngle,
  radius,
  fill,
  progress,
  onPress,
}) => {
  const animatedProps = useAnimatedProps(() => {
    const currentAngle = interpolate(
      progress.value,
      [0, 1],
      [startAngle, endAngle]
    );
    const d = getArcPath(radius, radius, radius, startAngle, currentAngle);
    return { d };
  });

  return (
    <AnimatedPath animatedProps={animatedProps} fill={fill} onPress={onPress} />
  );
};

export default function AnimatedPieChart({
  darkerOverlayBackgroundColor,
  primaryColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryOverlayColor,
  data = [],
  size = 200,
  radius = 100,
  duration = 500,
  showPercentages = false,
  showLabels = true,
  onSectionPress = null,

  labelsSize = 9,
}) {
  const MAX_FONT_SIZE = 44;

  const progress = useSharedValue(0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    progress.value = withTiming(1, { duration });
  }, [data]);

  let cumulativeAngle = 0;

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: size,
          width: size,
          backgroundColor: "transparent",
          zIndex: 10,
        }}
      >
        {data.map((slice, index) => {
          // Calculate start angle by summing previous slices
          const startAngle = data
            .slice(0, index)
            .reduce((sum, s) => sum + (s.value / total) * 360, 0);
          const angle = (slice.value / total) * 360;
          const midAngle = startAngle + angle / 2;

          const toRad = (angle) => (angle - 90) * (Math.PI / 180);

          const labelDistanceFactor = 0.68;

          const x =
            radius + radius * labelDistanceFactor * Math.cos(toRad(midAngle));
          const y =
            radius + radius * labelDistanceFactor * Math.sin(toRad(midAngle));

          return (
            // after adding this still got error, so problem one might be one below, unless both were giving error
            <View key={`pieChartSlice-${index}`}>
              {onSectionPress && showLabels && (
                <Pressable
                  key={`pressable-${index}`}
                  onPress={() =>
                    onSectionPress?.(slice.user_category, slice.name)
                  }
                  // onLongPress={() => onLongSectionPress?.(slice.user_category)}

                  style={({ pressed }) => [
                    {
                      position: "absolute",
                      top: y - 35, //15
                      left: x - 45, //15
                      padding: 0,
                      height: "auto",
                      flex: 1,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: pressed ? "transparent" : "transparent", // example pressed bg
                      transform: pressed ? [{ scale: 0.75 }] : [{ scale: 1 }],
                    },
                  ]}
                >
                  {/* <Text style={[ appFontStyles.subWelcomeText, {fontSize: 20}]}>{slice.label.text.slice(0,1)}</Text> */}
                  {showPercentages && (
                    <Text
                      style={[
                        welcomeTextStyle,
                        {
                          backgroundColor: darkerOverlayBackgroundColor,
                          padding: 2,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                          borderRadius: 20,

                          fontSize: Math.min(
                            labelsSize * (1.2 + (slice.value / total) * 5.3), // current formula
                            MAX_FONT_SIZE
                          ),
                          // fontSize:
                          //   labelsSize * (1.2 + (slice.value / total) * 5.3), // scale from 1.2x upward

                          color: primaryColor,
                        },
                      ]}
                    >
                      {(slice.value / total) * 100 <= 5
                        ? "•"
                        : `${Math.round((slice.value / total) * 100)}%`}
                    </Text>
                  )}

                  <Text
                    style={[
                      subWelcomeTextStyle,
                      {
                        backgroundColor: primaryOverlayColor,
                        padding: 2,
                        paddingHorizontal: 6,
                        borderRadius: 6,
                        fontSize: labelsSize,
                        color: primaryColor,
                      },
                    ]}
                  >
                    {(slice.value / total) * 100 <= 5
                      ? ""
                      : `${slice.label.text}`}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* Center "All" Button */}
      {showLabels && (
        <Pressable
          onPress={() => onSectionPress?.('all', data[0].name)}
          style={{
            position: "absolute",
       
            top: size / 2 - 30, // center vertically (adjust half of button height)
            left: size / 2 - 30, // center horizontally (adjust half of button width)
            width: 60,
            height: 60,
            borderRadius: 999,
            backgroundColor: primaryOverlayColor,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <Text
            style={[welcomeTextStyle, { color: primaryColor, fontSize: 30 }]}
          >
            All
          </Text>
        </Pressable>
      )}

      <Svg width={size} height={size}>
        <G>
          {data.map((slice, index) => {
            const startAngle = cumulativeAngle;
            const angle = (slice.value / total) * 360;
            const endAngle = startAngle + angle;
            cumulativeAngle = endAngle;

            return (
              <View key={`${slice.id}-${slice.name}`}>
                <AnimatedPieSlice
                  key={slice.id || slice.name}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  radius={radius}
                  fill={slice.color}
                  progress={progress}
                  onPress={onSectionPress}
                />
              </View>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
