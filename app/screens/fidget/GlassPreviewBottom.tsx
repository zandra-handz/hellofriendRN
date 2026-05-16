import React, { useRef, useMemo } from "react";
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
  Group,
  Paragraph,
  Skia,
  TextAlign,
} from "@shopify/react-native-skia";

import FooterButtonRowConditional from "./FooterButtonRowConditional";
import PawSetter from "./PawSetter";

const HORIZONTAL_PADDING = 100;
const CANVAS_HEIGHT = 20;
const MAX_LINES = 1;

const GlassPreviewBottom = ({
  fontSmall,
  readingMode = false,
  speedSetting = 1,
  color = "red",
  backgroundColor = "orange",
  borderColor = "pink",
  momentSV,
  onPressEdit,
  onPress_rescatterMoments,
  onPress_recenterMoments,
  onPress_saveAndExit,
  onPress_toggleReadMode,
  onPress_changeSpeed,
  onPress_geckoVoice,
  // Everything PawSetter needs from the moments engine, passed as one object
  // by MomentsSkia (which owns moments.current).
  pawSetter,
}) => {
  const translateY = useSharedValue(300);
  const hasAnimated = useRef(false);

  // JS mirror of the current moment id (no state -> no re-render)
  const momentIdRef = useRef(null);
  const updateMomentRef = (id) => {
    momentIdRef.current = id;
  };

  // Reactive worklet mirror of momentSV
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

      const val = current?.geckoGameType;
      const isValidType = typeof val === "number" && val > 1;
      capsuleSV.value = isValidType ? "???" : current?.capsule ?? "";

      runOnJS(updateMomentRef)(current?.id ?? null);
    }
  );

  const hasMoment = useDerivedValue(() => momentIdSV.value !== null);

  // System fontMgr so the OS emoji font is used as per-glyph fallback.
  // (Custom `fontSmall` typeface is not used here, only its size.)
  const fontSize = useMemo(() => fontSmall?.getSize() ?? 14, [fontSmall]);
  const fontMgr = useMemo(() => Skia.FontMgr.System(), []);

  useFocusEffect(
    React.useCallback(() => {
      if (!hasAnimated.current) {
        translateY.value = withSpring(100, { damping: 40, stiffness: 500 });
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

  const paragraph = useDerivedValue(() => {
    const cat = categorySV.value;
    const cap = capsuleSV.value;

    const textStyle = { color: Skia.Color(color), fontSize };
    const paraStyle = { textAlign: TextAlign.Left, maxLines: MAX_LINES };

    const builder = Skia.ParagraphBuilder.Make(paraStyle, fontMgr);
    builder.pushStyle(textStyle);
    if (cat && cap) builder.addText(cat + "  ·  " + cap);
    else if (cat) builder.addText(cat);
    else if (cap) builder.addText(cap);
    builder.pop();
    const p = builder.build();
    p.layout(canvasWidth);
    return p;
  });

  if (!fontSmall) return null;

  return (
    <>
      <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
        <View style={[styles.previewWrapper, { backgroundColor, borderColor }]}>
          <View style={styles.momentContentWrapper}>
            {momentIdRef.current && (
              <Pressable
                onPress={() => onPressEdit({ id: momentIdRef.current })}
                style={styles.momentViewButton}
              />
            )}

            <View style={styles.scrollViewContainer}>
              <Canvas style={{ width: canvasWidth, height: CANVAS_HEIGHT }}>
                <Group opacity={hasMoment}>
                  <Paragraph
                    paragraph={paragraph}
                    x={0}
                    y={0}
                    width={canvasWidth}
                  />
                </Group>
              </Canvas>
            </View>
          </View>

          <FooterButtonRowConditional
            backgroundColor="transparent"
            color={color}
            style={{ marginBottom: 0 }}
            iconSize={20}
            showSecondary={readingMode}
            centerContent={<PawSetter {...pawSetter} />}
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
                iconName: "scatter_plot",
                label: "Scatter",
                onPress: onPress_rescatterMoments,
              },
            ]}
          />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    width: "100%",
    height: 60,
    paddingBottom: 230,
    bottom: 0,
    backgroundColor: 'red'
  },
  previewWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 70,
    padding: 30,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  momentContentWrapper: {
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    height: 20,
    width: "100%",
    alignItems: "center",
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
