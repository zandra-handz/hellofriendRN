import React, { useRef, useMemo, useState } from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
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

import FooterButtonItem from "./FooterButtomItem";
import PawSetter from "./PawSetter";
import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";

const CAPSULE_BOX_WIDTH = 170; // right-side capsule text box
const CAPSULE_LEFT_PAD = 24; // gap between paw and capsule text
const CANVAS_HEIGHT = 60; // ~3 lines so the capsule text isn't clipped
const MAX_LINES = 3;

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

  // Capsule cell width is measured (it's a flex:1 cell), so the text always
  // lays out to whatever space is actually left next to buttons + paw.
  const [canvasWidth, setCanvasWidth] = useState(CAPSULE_BOX_WIDTH);
  // Drawable text width = cell width minus its left padding.
  const textWidth = Math.max(0, canvasWidth - CAPSULE_LEFT_PAD);

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
    p.layout(textWidth);
    return p;
  });

  if (!fontSmall) return null;

  return (
    <>
      <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
        <View style={[styles.previewWrapper, { backgroundColor, borderColor }]}>
          {/* LEFT: buttons. Icon-only and uniformly sized so they stay even.
              Labels intentionally omitted (commented inline) — re-add the
              <Text> lines if you want labels back. */}
          <View style={styles.leftButtons}>
            <GlobalPressable
              onPress={onPress_toggleReadMode}
              style={styles.buttonSlot}
              hitSlop={8}
            >
              <SvgIcon
                name={
                  readingMode ? "motion_pause_outline" : "motion_play_outline"
                }
                size={18}
                color={color}
              />
              {/* <Text style={{ color, fontSize: 9 }}>
                {readingMode ? "Reading..." : "Resting"}
              </Text> */}
            </GlobalPressable>

            <GlobalPressable
              onPress={onPress_rescatterMoments}
              style={styles.buttonSlot}
              hitSlop={8}
            >
              <SvgIcon name="scatter_plot" size={18} color={color} />
              {/* <Text style={{ color, fontSize: 9 }}>Scatter</Text> */}
            </GlobalPressable>

            <GlobalPressable
              onPress={() =>
                Alert.alert("Just to be sure", "Save game and exit?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Yes", onPress: onPress_saveAndExit },
                ])
              }
              style={styles.buttonSlot}
              hitSlop={8}
            >
              <SvgIcon name="close" size={18} color={color} />
              {/* <Text style={{ color, fontSize: 9 }}>Exit</Text> */}
            </GlobalPressable>

            {/* COMMENTED OUT — recenter ("Reset") button:
            <View style={styles.buttonSlot}>
              <FooterButtonItem
                iconName="image_filter_center_focus"
                label="Reset"
                onPress={onPress_recenterMoments}
                color={color}
                iconSize={20}
              />
            </View>
            */}

            {/* COMMENTED OUT — speed button:
            <View style={styles.buttonSlot}>
              <FooterButtonItem
                iconName={
                  speedSetting === 0
                    ? "speedometer_slow"
                    : speedSetting === 1
                    ? "speedometer_medium"
                    : "speedometer"
                }
                label="Speed"
                onPress={onPress_changeSpeed}
                color={color}
                iconSize={20}
              />
            </View>
            */}
          </View>

          {/* CENTER: PawSetter. Fixed 110x80 box (its real size) reserved
              in flow so it can't overlap the buttons or capsule text. */}
          <View style={styles.centerZone}>
            <PawSetter {...pawSetter} />
          </View>

          {/* RIGHT: capsule text box (keeps tap-to-edit overlay).
              flex:1 + onLayout so the text uses whatever width is left. */}
          <View
            style={styles.capsuleBox}
            onLayout={(e) => {
              const w = Math.floor(e.nativeEvent.layout.width);
              if (w > 0 && w !== canvasWidth) setCanvasWidth(w);
            }}
          >
            {momentIdRef.current && (
              <Pressable
                onPress={() => onPressEdit({ id: momentIdRef.current })}
                style={styles.momentViewButton}
              />
            )}

            {/* Ask button — small, icon-only, absolutely positioned in the
                top-right corner. Absolute => does NOT affect capsule text. */}
            <GlobalPressable
              onPress={onPress_geckoVoice}
              style={styles.askButton}
              hitSlop={8}
            >
              <SvgIcon name="chat" size={18} color={color} />
            </GlobalPressable>

            <Canvas style={{ width: textWidth, height: CANVAS_HEIGHT }}>
              <Group opacity={hasMoment}>
                <Paragraph
                  paragraph={paragraph}
                  x={0}
                  y={0}
                  width={textWidth}
                />
              </Group>
            </Canvas>
          </View>
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
  },
  previewWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 70,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: "row",
    // Every cell is the paw's height and vertically centered as a block, so
    // the buttons / paw / capsule text all share the SAME top edge and the
    // buttons can never sit higher than the paw.
    alignItems: "center",
  },
  // LEFT — equal flex with the capsule cell so the fixed-width paw stays
  // centered in the bar; buttons left-aligned, top-aligned within this cell.
  leftButtons: {
    flex: 1,
    height: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "flex-start",
  },
  buttonSlot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  // CENTER — PawSetter's real footprint (110x80) reserved IN FLOW, so it
  // physically can't overlap the buttons or the capsule text.
  centerZone: {
    width: 110,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  // RIGHT — takes all remaining width; capsule text measured to fit it.
  // Same height as the paw, top-aligned so its top matches the buttons/paw.
  capsuleBox: {
    flex: 1,
    height: 80,
    justifyContent: "flex-start",
    paddingLeft: CAPSULE_LEFT_PAD,
    // overflow visible so the Ask button can sit ABOVE the capsule text
    // (negative top) without being clipped. The text itself is still bounded
    // by the fixed-size Canvas + single-line paragraph.
    overflow: "visible",
  },
  // Ask button — absolutely positioned ABOVE the capsule text (negative top),
  // top-right of the capsule side.
  // zIndex above momentViewButton (9000) so the edit overlay can't eat taps.
  askButton: {
    position: "absolute",
    top: -28,
    right: 0,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9001,
  },
  momentViewButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9000,
  },
});

export default React.memo(GlassPreviewBottom);
