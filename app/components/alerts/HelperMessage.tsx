import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import PlainSafeView from "../appwide/format/PlainSafeView";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const HelperMessage = ({
  message,
  iconName = "playlist-add-check-circle",
  error = true,
  duration = 2000,
  onClose,
}: {
  message: string;
  error?: boolean;
  duration?: number;
  onClose: () => void;
}) => {
  const scale = useSharedValue(0);
  const fade = useSharedValue(1);
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();

  useEffect(() => {
    fade.value = 1;
    scale.value = withTiming(1, { duration: 300 });
    //    fade.value = withTiming(0, { duration: 1200});
  }, [error]);

  const handleManualClose = () => {
    scale.value = withTiming(0, { duration: 300 });
    const timeout = setTimeout(() => {
      setTimeout(onClose, 100);
    }, duration);
    return () => clearTimeout(timeout);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    console.log("change in error in flashmessage:", error);
  }, [error]);

  return (
    <PlainSafeView style={[StyleSheet.absoluteFillObject, styles.overlay]}>
      <Animated.View
        style={[
          styles.messageContainer,
          animatedStyle,
          themeStyles.primaryBackground,
          { borderRadius: 20, marginTop: 0 },
        ]}
      >
        {/* {!updateFriendDefaultCategoryMutation.isError && <Text style={styles.messageText}>{message}</Text>}
        {updateFriendDefaultCategoryMutation.isError && <Text style={styles.messageText}>Error</Text>} */}

        {!error && (
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Text
              style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}
            >
              {" "}
              {message}
            </Text>
            {/* <MaterialIcons
              name={iconName}
              style={{ marginLeft: 10 }}
              size={24}
              color={manualGradientColors.lightColor}
            /> */}
          </View>
        )}
        {error && (
          <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
            Error
          </Text>
        )}
        <Pressable
          onPress={handleManualClose}
          hitSlop={30}
          style={{
            borderRadius: 999,
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "blue",
          }}
        >
          <MaterialCommunityIcons
            name={"check-circle"}
            size={24}
            color={themeStyles.primaryText.color}
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
  },
  messageContainer: {
    padding: 20,
    maxWidth: "98%",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default HelperMessage;
