import React, { useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedReaction,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";

import {
  Canvas,
  Text as SkText,
  Group,
} from "@shopify/react-native-skia";

import FooterButtonRowConditional from "./FooterButtonRowConditional";

const HORIZONTAL_PADDING = 60;
const CANVAS_HEIGHT = 30;
const HEADER_Y = 24;
const CAPSULE_START_Y = 58;
const LINE_HEIGHT = 24;
const MAX_LINES = 3;

const GlassPreviewBottom = ({
  fontSmall,
  readingMode = false,
  speedSetting = 1,
  autoPickUp = false,
  isPollMode = false,
  color = "red",
  highlightColor = "yellow",
  backgroundColor = "orange",
  borderColor = "pink",
  momentSV,
  noContentText = "No content",
  onPressEdit,
  onPressNew,
  onPress_rescatterMoments,
  onPress_recenterMoments,
  onPress_saveAndExit,
  onPress_toggleReadMode,
  onPress_changeSpeed,
  onPress_geckoVoice,
  onPress_autoPickUpScreen,
  onPress_QRCodeScreen,
}) => {
  const translateY = useSharedValue(300);
  const hasAnimated = useRef(false);

  // ----------------------------
  // SAFE JS MIRROR (NO STATE)
  // ----------------------------
  const momentIdRef = useRef(null);

  const updateMomentRef = (id) => {
    momentIdRef.current = id;
  };

  // ----------------------------
  // REACTIVE WORKLET MIRROR
  // ----------------------------
  const momentIdSV = useSharedValue(null);
  const categorySV = useSharedValue("");
  const capsuleSV = useSharedValue("");

  useAnimatedReaction(
    () => momentSV.value,
    (current, previous) => {
      "worklet";

      if (current?.id === previous?.id) return;

      momentIdSV.value = current?.id ?? null;
      categorySV.value = current?.category ?? "";
      capsuleSV.value = current?.capsule ?? "";

      runOnJS(updateMomentRef)(current?.id ?? null);
    }
  );

  const hasMoment = useDerivedValue(() => momentIdSV.value !== null);

  // ----------------------------
  // ANIMATION
  // ----------------------------
  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimated.current) {
        translateY.value = withSpring(100, {
          damping: 40,
          stiffness: 500,
        });
        hasAnimated.current = true;
      }

      return () => {
        translateY.value = 300;
        hasAnimated.current = false;
      };
    }, [])
  );

  const containerAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const { width: screenWidth } = useWindowDimensions();
  const canvasWidth = screenWidth - HORIZONTAL_PADDING;

  // ----------------------------
  // SKIA DERIVED VALUES
  // ----------------------------
  const categoryText = useDerivedValue(() => categorySV.value);

  const wrappedCapsule = useDerivedValue(() => {
    const result = ["", "", ""];
    if (!fontSmall) return result;

    const text = capsuleSV.value;
    if (!text) return result;

    const words = text.split(" ");
    let lineIdx = 0;
    let current = "";

    for (let i = 0; i < words.length && lineIdx < MAX_LINES; i++) {
      const word = words[i];
      const test = current ? current + " " + word : word;

      if (fontSmall.measureText(test).width <= canvasWidth) {
        current = test;
      } else {
        if (current) {
          result[lineIdx] = current;
          lineIdx++;
        }
        current = word;
      }
    }

    if (current && lineIdx < MAX_LINES) result[lineIdx] = current;
    return result;
  });

  const capsuleLine0 = useDerivedValue(() => wrappedCapsule.value[0]);
  const capsuleLine1 = useDerivedValue(() => wrappedCapsule.value[1]);
  const capsuleLine2 = useDerivedValue(() => wrappedCapsule.value[2]);

  // ----------------------------
  // LAYOUT
  // ----------------------------
  const categoryX = useDerivedValue(() => {
    if (!fontSmall) return 0;
    return (canvasWidth - fontSmall.measureText(categoryText.value).width) / 2;
  });

  const line0X = useDerivedValue(() => {
    if (!fontSmall) return 0;
    return (canvasWidth - fontSmall.measureText(capsuleLine0.value).width) / 2;
  });

  const line1X = useDerivedValue(() => {
    if (!fontSmall) return 0;
    return (canvasWidth - fontSmall.measureText(capsuleLine1.value).width) / 2;
  });

  const line2X = useDerivedValue(() => {
    if (!fontSmall) return 0;
    return (canvasWidth - fontSmall.measureText(capsuleLine2.value).width) / 2;
  });

  if (!fontSmall) return null;

  return (
    <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
      <View
        style={[
          styles.previewWrapper,
          { backgroundColor, borderColor },
        ]}
      >
        <View style={styles.momentContentWrapper}>

          {/* EDIT BUTTON — SAFE (NO SHARED VALUE IN RENDER) */}
          {momentIdRef.current && (
            <Pressable
              onPress={() =>
                onPressEdit({ id: momentIdRef.current })
              }
              style={styles.momentViewButton}
            />
          )}

          {/* ---------------- MOMENT CANVAS ---------------- */}
          <View style={styles.scrollViewContainer}>
            <Canvas style={{ width: canvasWidth, height: CANVAS_HEIGHT }}>
              <Group opacity={hasMoment}>

                <SkText
                  x={categoryX}
                  y={HEADER_Y}
                  text={categoryText}
                  font={fontSmall}
                  color={color}
                />

                <SkText
                  x={line0X}
                  y={CAPSULE_START_Y}
                  text={capsuleLine0}
                  font={fontSmall}
                  color={color}
                />

                <SkText
                  x={line1X}
                  y={CAPSULE_START_Y + LINE_HEIGHT}
                  text={capsuleLine1}
                  font={fontSmall}
                  color={color}
                />

                <SkText
                  x={line2X}
                  y={CAPSULE_START_Y + LINE_HEIGHT * 2}
                  text={capsuleLine2}
                  font={fontSmall}
                  color={color}
                />

              </Group>
            </Canvas>
          </View>

        </View>

        {/* FOOTER (UNCHANGED) */}
        <FooterButtonRowConditional
          backgroundColor="transparent"
          color={color}
          style={{ marginBottom: 0 }}
          iconSize={20}
          showSecondary={readingMode}
          centerButton={{
            iconName: "close",
            label: "Exit",
            onPress: onPress_saveAndExit,
          }}
          primaryButtons={[
            {
              iconName: "motion_play_outline",
              label: "Resting",
              onPress: onPress_toggleReadMode,
            },
            { iconName: "chat", label: "Ask", onPress: onPress_geckoVoice },
            {
              iconName: "close",
              label: "Exit",
              onPress: onPress_saveAndExit,
              confirmationRequired: true,
              confirmationMessage: "Save game and exit?",
            },
            {
              iconName: "image_filter_center_focus",
              label: "Reset",
              onPress: onPress_recenterMoments,
            },
            {
              iconName: "qrcode_scan",
              label: isPollMode ? "Polling..." : "Scan",
              color: isPollMode ? highlightColor : color,
              onPress: onPress_QRCodeScreen,
            },
          ]}
          secondaryButtons={[
            {
              iconName: "motion_pause_outline",
              label: "Reading...",
              onPress: onPress_toggleReadMode,
            },
            {
              iconName:
                speedSetting === 0
                  ? "speedometer_slow"
                  : speedSetting === 1
                  ? "speedometer_medium"
                  : "speedometer",
              label: "Speed",
              onPress: onPress_changeSpeed,
            },
            {
              iconName: "auto_mode",
              color: autoPickUp ? highlightColor : color,
              label: autoPickUp ? "Auto on" : "Auto off",
              onPress: onPress_autoPickUpScreen,
            },
            {
              iconName: "scatter_plot",
              label: "Scatter",
              onPress: onPress_rescatterMoments,
            },
            {
              iconName: "qrcode_scan",
              label: isPollMode ? "Polling..." : "Scan",
              color: isPollMode ? highlightColor : color,
              onPress: onPress_QRCodeScreen,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    width: "100%",
    height: 220,
    paddingBottom: 300,
  },
  previewWrapper: {
    width: "100%",
    height: 280,
    borderRadius: 70,
    padding: 30,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  momentContentWrapper: {
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    height: 110,
    width: "100%",
  },
  momentViewButton: {
    padding: 20,
    width: "100%",
    height: 50,
    right: 10,
    position: "absolute",
    zIndex: 9000,
  },
});

export default React.memo(GlassPreviewBottom);