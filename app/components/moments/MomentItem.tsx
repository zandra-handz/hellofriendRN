 



import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
  withSequence,
  withRepeat,
  useSharedValue,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { Moment } from "@/src/types/MomentContextTypes";
import manualGradientColors from "@/app/styles/StaticColors";
import CategoryTooltip from "../headers/CategoryTooltip";
import SvgIcon from "@/app/styles/SvgIcons";

const HOLD_DURATION = 600;

interface MomentItemsProps {
  index: number;
  momentData: Moment;
  momentDate: Date;
  itemHeight: number;
  combinedHeight: number;
  visibilityValue: SharedValue<number>;
  scrollYValue: SharedValue<number>;
  pressedIndexValue: SharedValue<number | null>;
  pulseValue: SharedValue<number>;
  onSend: (moment: Moment) => void;
  categoryColorsMap: Record<string, string>;
}

const MomentItem: React.FC<MomentItemsProps> = ({
  friendColor,
  index,
  momentData,
  categorySide,
  momentDate,
  itemHeight,
  combinedHeight,
  visibilityValue,
  scrollYValue,
  pressedIndexValue,
  pulseValue,
  onSend,
  categoryColorsMap,
  primaryColor,
  primaryBackgroundColor,
  darkerOverlayColor,
  lighterOverlayColor,
}) => {
  const startingPosition = index * combinedHeight;
  const { height } = useWindowDimensions();
  const containerHeight = height - 410;
  const sendButtonWidth = 44;

  if (!momentData || !categoryColorsMap || !momentData.user_category) {
    return null;
  }

  const categoryColor = momentData?.user_category
    ? (categoryColorsMap[String(momentData.user_category)] ?? "#ccc")
    : "#ccc";

  // ── Hold-to-confirm state ──────────────────────────────────
  // fillProgress: 0 → 1 during hold sweep
  // fillOpacity:  separately controlled so completion can go solid + pulse
  const fillProgress = useSharedValue(0);
  const fillOpacity = useSharedValue(0);
  const completed = useSharedValue(false);

  const handleSave = () => onSend(momentData);

  const handlePressIn = () => {
    completed.value = false;

    // Sweep fill left→right
    fillProgress.value = withTiming(1, { duration: HOLD_DURATION }, (finished) => {
      if (finished) {
        completed.value = true;
        runOnJS(handleSave)();

        // Go fully solid, then do 2 quick pulses, then stay solid
        fillOpacity.value = withSequence(
          withTiming(0.7, { duration: 80 }),
          withRepeat(
            withSequence(
              withTiming(0.45, { duration: 120 }),
              withTiming(0.7, { duration: 120 }),
            ),
            2,   // 2 pulses
            false,
          ),
          withTiming(0.6, { duration: 150 }), // settle at solid
        );
      }
    });

    // Opacity ramps up during the sweep
    fillOpacity.value = withTiming(0.18, { duration: HOLD_DURATION });
  };

  const handlePressOut = () => {
    if (!completed.value) {
      // Released early — cancel everything and reset
      cancelAnimation(fillProgress);
      cancelAnimation(fillOpacity);
      fillProgress.value = withTiming(0, { duration: 180 });
      fillOpacity.value = withTiming(0, { duration: 180 });
    }
    // If completed, leave fill solid — don't reset
  };

  // ── Fill overlay ───────────────────────────────────────────
  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: fillProgress.value }],
    opacity: fillOpacity.value,
  }));

  // ── Icon brightens during hold ─────────────────────────────
  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(fillProgress.value, [0, 1], [0.35, 1]),
    transform: [
      { scale: interpolate(fillProgress.value, [0, 0.5, 1], [1, 1.2, 1]) },
    ],
  }));

  // ── Scroll entrance (unchanged) ────────────────────────────
  const visibilityStyle = useAnimatedStyle(() => {
    const pos1 = startingPosition - containerHeight;
    const pos2 = startingPosition + combinedHeight - containerHeight;

    if (visibilityValue.value >= 1) {
      return {
        transform: [
          {
            translateY: interpolate(
              scrollYValue.value,
              [pos1, pos2],
              [-itemHeight / 2, 0],
              Extrapolation.CLAMP,
            ),
          },
          {
            scale: interpolate(
              scrollYValue.value,
              [pos1, pos2],
              [0.8, 1],
              Extrapolation.CLAMP,
            ),
          },
        ],
        opacity: interpolate(scrollYValue.value, [pos1, pos2], [0, 1]),
      };
    } else {
      return {
        transform: [
          {
            translateY: interpolate(
              visibilityValue.value,
              [0, 1],
              [1000 - startingPosition, 0],
              Extrapolation.CLAMP,
            ),
          },
          {
            scale: interpolate(visibilityValue.value, [0, 1], [0.8, 1]),
          },
        ],
        opacity: visibilityValue.value,
      };
    }
  });

  const original = momentData?.user_category_name || "No category";
  const truncated = original.length > 26 ? original.slice(0, 26) + "..." : original;

  return (
    <Animated.View
      style={[
        styles.rowContainer,
        { height: itemHeight, borderBottomColor: `${categoryColor}22` },
        visibilityStyle,
      ]}
    >
      {/* Progress fill */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fillOverlay,
          { backgroundColor: categoryColor },
          fillStyle,
        ]}
      />

      {/* Dot */}
      <View
        style={[
          styles.dot,
          { backgroundColor: categoryColor, shadowColor: categoryColor },
        ]}
      />

      {/* Text block */}
      <View style={styles.textBlock}>
        <CategoryTooltip
          label={truncated}
          color={primaryColor}
          borderColor={categoryColor}
          backgroundColor={darkerOverlayColor}
          containerStyle={{
            zIndex: 5,
            alignSelf: categorySide === "right" ? "flex-end" : "flex-start",
            marginBottom: 6,
          }}
          labelStyle={{
            fontSize: 12,
            fontWeight: "bold",
            textShadowColor: categoryColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 2,
          }}
        />

        <Text
          numberOfLines={2}
          style={[
            AppFontStyles.subWelcomeText,
            {
              color: primaryColor,
              fontSize: 14,
              lineHeight: 20,
              fontFamily: "Poppins-Regular",
              opacity: 0.9,
              paddingRight: sendButtonWidth + 8,
            },
          ]}
        >
          {momentData?.capsule?.replace(/\s*\n\s*/g, " ")}
        </Text>
      </View>

      {/* Hold-to-save button */}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={12}
        style={styles.saveButton}
      >
        <Animated.View style={iconStyle}>
          <SvgIcon
            name={"plus_circle"}
            size={22}
            color={categoryColor}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  fillOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin: "left center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
    marginRight: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  },
  textBlock: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
  },
  saveButton: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MomentItem;