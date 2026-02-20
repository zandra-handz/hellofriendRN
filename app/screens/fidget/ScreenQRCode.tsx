import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { SafeAreaView } from "react-native-safe-area-context";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";

import SvgIcon from "@/app/styles/SvgIcons";
import QRCode from "react-native-qrcode-skia";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

type Props = {};

const ScreenQRCode = (props: Props) => {
  const route = useRoute();
  const { lightDarkTheme } = useLDTheme();
  const { navigateToGecko } = useAppNavigations();

  const [acceptPawClear, setAcceptPawClear] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const initialSelection = route.params?.selection ?? 0;
  const friendName = route.params?.friendName ?? null;
  const [selected, setSelected] = useState<number>(initialSelection);

  // Animation values
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  // Animate in on mount
  React.useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 90,
      stiffness: 1000,
    });
    opacity.value = withTiming(1, { duration: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleNavToGecko = useCallback(
    (index = 0) => {
      // console.log(`values in gecko select setting screen: `, selected, acceptPawClear);
      const timestamp = Date.now(); // Create timestamp before setTimeout
      // console.log('timestamp being sent:', timestamp);

      opacity.value = withTiming(0, { duration: 100 });
      setTimeout(() => {
        navigateToGecko({
          selection: index,
          autoPick: acceptPawClear,
          timestamp: timestamp, // Use the captured timestamp
        });
      }, 100);
    },
    [selected, acceptPawClear, navigateToGecko, opacity],
  );
  const handleAccept = () => {
    translateY.value = withSpring(-1000, { damping: 20, stiffness: 90 });
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setAcceptPawClear(true);
      setShowSelectionModal(true);
    }, 100);
  };

  const handleCancel = () => {
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      navigateToGecko({ selection: initialSelection });
    }, 300);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaStyle,
        { backgroundColor: lightDarkTheme.primaryBackground },
      ]}
    >
      {friendName && (
        <Animated.View style={[styles.firstContainer, animatedStyle]}>
          <View style={styles.headerWrapper}>
            <Text
              style={[styles.headerText, { color: lightDarkTheme.primaryText }]}
            >
              Let {friendName} pick
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              height: 300,
              justifyContent: "center",
              alignItems: "center",
             // backgroundColor: "teal",
            }}
          >
            <QRCode color={lightDarkTheme.primaryText} size={150} value="https://badrainbowz.com/friends/" />
          </View>

          <View style={styles.questionWrapper}>
            <Text
              style={[
                styles.cancelAcceptText,
                { color: lightDarkTheme.primaryText },
              ]}
            >
    Let Gracie scan the QR code above, or{' '}
    <Text
      onPress={() => {
        // handle send link
      }}
      style={{ textDecorationLine: 'underline' }}
    >
      send a link instead
    </Text>
    . When you are ready, press the checkmark to start!
  </Text>
          </View>

          <View style={styles.cancelAcceptRow}>
            <Pressable
              onPress={handleCancel}
              style={[
                styles.acceptButton,
                { backgroundColor: lightDarkTheme.lighterOverlayBackground },
              ]}
            >
              <SvgIcon
                name={`close`}
                size={40}
                color={lightDarkTheme.primaryText}
              />
            </Pressable>
            <Pressable
              onPress={handleAccept}
              style={[
                styles.acceptButton,
                { backgroundColor: lightDarkTheme.lighterOverlayBackground },
              ]}
            >
              <SvgIcon
                name={`check`}
                size={40}
                color={lightDarkTheme.primaryText}
              />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "teal",
  },
  headerWrapper: {
    width: "100%",
    textAlign: "center",
    paddingVertical: 20,
    alignItems: "center",
  },
  firstContainer: {
    width: "100%",
    height: "auto",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
  },
  cancelAcceptRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
  },
  headerText: {
    fontSize: 34,
  },
  questionWrapper: {
    height: "auto",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  cancelAcceptText: {
    fontSize: 18,
    lineHeight: 30,
    // fontWeight: "bold",
  },
  acceptButton: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  button: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    height: "auto",
    borderRadius: 10,
  },
  text: {
    borderRadius: 6,
    padding: 10,
    textAlign: "center",
  },
  infoBox: {
    marginTop: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ScreenQRCode;
