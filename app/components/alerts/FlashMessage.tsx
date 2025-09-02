// FlashMessage.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import PlainSafeView from "../appwide/format/PlainSafeView"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { appFontStyles } from "@/src/hooks/StaticFonts";
import { manualGradientColors } from "@/src/hooks/StaticColors";

const FlashMessage = ({

  message,
  isInsideModal = false,
  iconName = "playlist-add-check-circle",
  error = true,
  duration = 2000,
  onClose,
}: {
  message: string;
    isInsideModal?: boolean;
  error?: boolean;
  duration?: number;
  onClose: () => void;
}) => {
  const scale = useSharedValue(0);
  const fade = useSharedValue(1);
  const {lightDarkTheme } = useLDTheme(); 

  useEffect(() => {
    fade.value = 1;
    scale.value = withTiming(1, { duration: 300 });
    //    fade.value = withTiming(0, { duration: 1200});
    const timeout = setTimeout(() => {
      scale.value = withTiming(0, { duration: 300 });

      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timeout);
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    console.log("change in error in flashmessage:", error);
  }, [error]);

  return (
        <PlainSafeView
      turnSafeOff={isInsideModal}
      style={[StyleSheet.absoluteFillObject, styles.overlay]}
    > 
        
      <Animated.View
        style={[
          styles.messageContainer,
          animatedStyle,
          
          { backgroundColor: lightDarkTheme.primaryBackground, borderRadius: 10, marginTop: 0 },
        ]}
      >
        {/* {!updateFriendDefaultCategoryMutation.isError && <Text style={styles.messageText}>{message}</Text>}
        {updateFriendDefaultCategoryMutation.isError && <Text style={styles.messageText}>Error</Text>} */}

        {!error && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[ appFontStyles.subWelcomeText, {color: lightDarkTheme.primaryText}]}>
            {" "}
            {message}
          </Text>
          <MaterialIcons
          name={iconName}
          style={{marginLeft: 10}}
          size={24}
          color={manualGradientColors.lightColor}
          />
          
            </View>
        )}
        {error && (
          <Text style={[ appFontStyles.subWelcomeText, {color: lightDarkTheme.primaryText}]}>
            Error
          </Text>
        )}
      </Animated.View>
    </PlainSafeView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexDirection: "column",

    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 999999,
  },
  messageContainer: {
    padding: 20, 
    maxWidth: "80%",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default FlashMessage;
