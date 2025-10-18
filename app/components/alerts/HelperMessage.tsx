import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import PlainSafeView from "../appwide/format/PlainSafeView";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SvgIcon from "@/app/styles/SvgIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HelperMessage = ({
  message,
  isInsideModal = false,
  topBarText = `Help mode`,
  update = false,
  onClose,
}: {
  message?: string;
  isInsideModal?: boolean;
  update?: boolean; // is this supposed to be error? unsure but changed anyway, if this component goes funky look here first
  duration?: number;
  onClose: () => void;
  topBarText?: string;
}) => {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(-600);
  const { lightDarkTheme } = useLDTheme();
  const fade = useSharedValue(1);

  useEffect(() => {
    fade.value = 1;
    scale.value = withTiming(1, { duration: 300 });
    translateX.value = withDelay(100, withTiming(1, { duration: 200 }));
  }, [update]);

  const handleManualClose = () => {
    translateX.value = withTiming(-600, { duration: 40 });
    scale.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
  }));

  const topBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const insets = useSafeAreaInsets();

  return (
    <PlainSafeView
      turnSafeOff={isInsideModal}
      style={[StyleSheet.absoluteFillObject, styles.overlay]}
    >
      <>
        <Animated.View
          style={[
            topBarStyle,
            styles.container,
            {
              top: isInsideModal ? 0 : insets.top,
            },
          ]}
        >
          <View
            style={[
              styles.topBarContainer,
              {
                backgroundColor: lightDarkTheme.overlayBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.topBarText,
                {
                  color: lightDarkTheme.primaryText,
                },
              ]}
            >
              {topBarText}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.messageContainer,
            animatedStyle,

            {
              backgroundColor: lightDarkTheme.primaryBackground,
            },
          ]}
        >
          {!update && (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <Text
                style={[
                  AppFontStyles.subWelcomeText,
                  { color: lightDarkTheme.primaryText, lineHeight: 24 },
                ]}
              >
                {" "}
                {message}
              </Text>
            </ScrollView>
          )}
          {update && (
            <Text
              style={[
                AppFontStyles.subWelcomeText,
                { color: lightDarkTheme.primaryText },
              ]}
            >
              update
            </Text>
          )}
          <Pressable
            onPress={handleManualClose}
            hitSlop={30}
            style={styles.closeButton}
          >
            <Text
              style={[
                styles.closeButtonLabel,
                {
                  color: lightDarkTheme.primaryText,
                },
              ]}
            >
              Got it!
            </Text>
            <SvgIcon
              name={"check_circle"}
              size={24}
              color={manualGradientColors.lightColor}
            />
          </Pressable>
        </Animated.View>
      </>
    </PlainSafeView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexDirection: "column",

    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 99999,
    elevation: 99999,
    // backgroundColor: "rgba(0, 0, 0, 0.84)",
    backgroundColor: "rgba(128, 128, 128, 0.8)", //neutral gray
  },
  container: {
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "hotpink",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: "hotpink",
    left: 0,
    width: "100%",
    height: "auto",
  },
  topBarContainer: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  topBarText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  messageContainer: {
    padding: 20,
    minHeight: 200,
    width: "98%",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    bottom: 80,
    maxHeight: 400,
    borderRadius: 20,
    marginTop: 0,
  },
  scrollViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  closeButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 999,
  },
  closeButtonLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    marginRight: 5,
  },
});

// export default HelperMessage;
export default React.memo(HelperMessage, (prevProps, nextProps) => {
  // Only re-render if relevant props change
  return (
    prevProps.message === nextProps.message &&
    prevProps.isInsideModal === nextProps.isInsideModal &&
    prevProps.update === nextProps.update &&
    prevProps.topBarText === nextProps.topBarText &&
    prevProps.duration === nextProps.duration &&
    prevProps.onClose === nextProps.onClose
  );
});
