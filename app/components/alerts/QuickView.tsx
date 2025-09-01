import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import PlainSafeView from "../appwide/format/PlainSafeView";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLDTheme } from "@/src/context/LDThemeContext";

const QuickView = ({
  message,
  view,
  isInsideModal = false,
  topBarText = `Help mode`,
  update = false,
  duration = 2000,
  onClose,
}: {
  message: string;
  view?: React.ReactElement;
  isInsideModal?: boolean;
  update?: boolean;
  duration?: number;
  onClose: () => void;
  topBarText: string;
}) => {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(-600);

  const fade = useSharedValue(1);
  const { lightDarkTheme } = useLDTheme();
  const { appFontStyles, manualGradientColors } = useGlobalStyle();

  useEffect(() => {
    fade.value = 1;
    scale.value = withTiming(1, { duration: 200 });
    translateX.value = withDelay(100, withTiming(1, { duration: 100 }));
  }, [update]);

  const handleManualClose = () => {
    translateX.value = withTiming(-600, { duration: 40 });
    scale.value = withTiming(0, { duration: 200 }, (finished) => {
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
      <Animated.View
        style={[
          topBarStyle,
          {
            flexDirection: "row",
            position: "absolute",
            backgroundColor: "hotpink",
            borderBottomWidth: 2,
            borderTopWidth: 2,
            borderColor: "hotpink",
            top: isInsideModal ? 0 : insets.top,
            left: 0,
            width: "100%",
            height: "auto",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 6,
            paddingVertical: 2,
            backgroundColor: lightDarkTheme.overlayBackground,
          }}
        >
          <Text
            style={[
              {
                color: lightDarkTheme.primaryText,
                fontFamily: "Poppins-Bold",
                fontSize: 14,
                padding: 4,
                paddingHorizontal: 10,
                borderRadius: 999,
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
            borderRadius: 20,
            marginTop: 0,
          },
        ]}
      >
        {!update && (
          <View style={{ flex: 1, padding: 10 }}>
            {view != undefined && view}
          </View>
        )}
        {update && (
          <Text
            style={[
              appFontStyles.subWelcomeTex,
              { color: lightDarkTheme.primaryText },
            ]}
          >
            update
          </Text>
        )}
        <Pressable
          onPress={handleManualClose}
          hitSlop={30}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",

            flexDirection: "row",
            borderRadius: 999,
          }}
        >
          <Text
            style={[
              {
                color: lightDarkTheme.primaryText,
                fontFamily: "Poppins-Bold",
                fontSize: 13,
                marginRight: 5,
              },
            ]}
          >
            Got it!
          </Text>
          <MaterialCommunityIcons
            name={"check-circle"}
            size={24}
            color={manualGradientColors.lightColor}
          />
        </Pressable>
      </Animated.View>
    </PlainSafeView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexDirection: "column",

    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 99999,
    elevation: 99999,
    // backgroundColor: "rgba(0, 0, 0, 0.84)",
    backgroundColor: "rgba(128, 128, 128, 0.8)", //neutral gray
  },
  messageContainer: {
    padding: 20,
    width: "98%",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    top: 80,
    height: 600,
  },
});

// export default QuickView;
export default React.memo(QuickView, (prevProps, nextProps) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.view === nextProps.view &&
    prevProps.isInsideModal === nextProps.isInsideModal &&
    prevProps.update === nextProps.update &&
    prevProps.duration === nextProps.duration &&
    prevProps.topBarText === nextProps.topBarText &&
    prevProps.onClose === nextProps.onClose
  );
});
