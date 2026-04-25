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

const HORIZONTAL_PADDING = 60;
const CANVAS_HEIGHT = 40;
const MAX_LINES = 4; // 1 category + 3 capsule lines

const GlassPreviewBottom = ({
  fontSmall,
  readingMode = false,
  speedSetting = 1,
  autoPickUp = false, 
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
  // onPress_autoPickUpScreen,
  // onPress_QRCodeScreen,
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
      // capsuleSV.value = current?.capsule ?? "";

          const val = current?.geckoGameType;
       

const isValidType =
  typeof val === "number" &&
  // Number.isFinite(val) &&
  val > 1;

capsuleSV.value = isValidType
  ? "???"
  : current?.capsule ?? "";
      runOnJS(updateMomentRef)(current?.id ?? null);
    }
  );

  const hasMoment = useDerivedValue(() => momentIdSV.value !== null);

  // ----------------------------
  // FONT MANAGER (for emoji fallback)
  // ----------------------------
  // Using System fontMgr so the OS emoji font is used as per-glyph fallback.
  // Trade-off: the custom `fontSmall` typeface is NOT used here — only its size.
  //
  // To render with the custom font AND keep emoji fallback:
  //   1. Bundle an emoji font with the app (e.g. assets/fonts/NotoColorEmoji.ttf).
  //   2. Load both typefaces (e.g. via useFonts or Skia.Typeface.MakeFreeTypeFaceFromData).
  //   3. Build a TypefaceFontProvider and register both:
  //        const provider = Skia.TypefaceFontProvider.Make();
  //        provider.registerFont(customTypeface, "AppFont");
  //        provider.registerFont(emojiTypeface,  "EmojiFont");
  //      Use `provider` as the fontMgr below.
  //   4. In the textStyle, set fontFamilies: ["AppFont", "EmojiFont"] so
  //      glyphs missing from AppFont fall back to EmojiFont.
  const fontSize = useMemo(() => fontSmall?.getSize() ?? 14, [fontSmall]);
  const fontMgr = useMemo(() => Skia.FontMgr.System(), []);

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
  // PARAGRAPH (supports emoji fallback via system fontMgr)
  // ----------------------------
  const paragraph = useDerivedValue(() => {
    const cat = categorySV.value;
    const cap = capsuleSV.value;

    const textStyle = {
      color: Skia.Color(color),
      fontSize,
    };

    const paraStyle = {
      textAlign: TextAlign.Center,
      maxLines: MAX_LINES,
    };

    const builder = Skia.ParagraphBuilder.Make(paraStyle, fontMgr);
    builder.pushStyle(textStyle);
    if (cat) builder.addText(cat + "\n");
    if (cap) builder.addText(cap);
    builder.pop();
    const p = builder.build();
    p.layout(canvasWidth);
    return p;
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
            // {
            //   iconName: "qrcode_scan",
            //   label: isPollMode ? "Polling..." : "Scan",
            //   color: isPollMode ? highlightColor : color,
            //   onPress: onPress_QRCodeScreen,
            // },
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
            // {
            //   iconName: "auto_mode",
            //   color: autoPickUp ? highlightColor : color,
            //   label: autoPickUp ? "Auto on" : "Auto off",
            //   onPress: onPress_autoPickUpScreen,
            // },
            {
              iconName: "scatter_plot",
              label: "Scatter",
              onPress: onPress_rescatterMoments,
            },
            // {
            //   iconName: "qrcode_scan",
            //   label: isPollMode ? "Polling..." : "Scan",
            //   color: isPollMode ? highlightColor : color,
            //   onPress: onPress_QRCodeScreen,
            // },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    width: "100%",
    height: 120,
    paddingBottom: 230,
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
    height: 40,
 
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