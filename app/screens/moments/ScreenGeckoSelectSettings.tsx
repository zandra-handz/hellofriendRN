import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { SafeAreaView } from "react-native-safe-area-context";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SvgIcon from "@/app/styles/SvgIcons";
import BouncyEntrance from "@/app/components/headers/BouncyEntrance";
import GlobalPressable from "@/app/components/appwide/button/GlobalPressable";
import HalfScreenModal from "@/app/components/alerts/HalfScreenModal";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

type Props = {};

const ScreenGeckoSelectSettings = (props: Props) => {
  const route = useRoute();
  const { lightDarkTheme } = useLDTheme();
  const { navigateToGecko } = useAppNavigations();

  const [acceptPawClear, setAcceptPawClear] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const initialSelection = route.params?.selection ?? 0;
  const [selected, setSelected] = useState<number>(initialSelection);

  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const BUTTON_PADDING = 4;
  const BUTTON_COLOR = manualGradientColors.lightColor;

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

  const updateSelected = (update: number) => {
    console.log(update)
    setSelected(update);
  };

  const AUTO_SELECT_TYPES = [
    "Random",
    "Balanced",
    "Hard Mode",
    "Easy Mode",
    "Quick Shares",
    "Fill The Time",
    "More Specific To Friend",
    "More General",
    "Relevant To Their Interests",
    "Random My Interests",
  ];

  const handleNavToGecko = useCallback((index=0) => {
    console.log(`values in gecko select setting screen: `, selected, acceptPawClear);
    opacity.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      navigateToGecko({ selection: index, autoPick: acceptPawClear, timestamp: Date.now()  });
    }, 100);
  }, [selected, acceptPawClear, navigateToGecko, opacity]);

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

  const closeSelectionModal = () => {
    setShowSelectionModal(false);
  };

  const count = AUTO_SELECT_TYPES.length;
  const speed = 20;
  const staggeredDelays = useMemo(
    () => Array.from({ length: count }, (_, i) => i * speed),
    [count, speed]
  );

  return (
    <SafeAreaView
      style={[
        styles.safeAreaStyle,
        { backgroundColor: lightDarkTheme.primaryBackground },
      ]}
    >
      {!acceptPawClear && (
        <Animated.View style={[styles.firstContainer, animatedStyle]}>
          <View style={styles.headerWrapper}>
            <Text
              style={[styles.headerText, { color: lightDarkTheme.primaryText }]}
            >
              Let Gecko pick
            </Text>
          </View>
          <View style={styles.questionWrapper}>
            <Text
              style={[styles.cancelAcceptText, { color: lightDarkTheme.primaryText }]}
            >
              Currently held moments will be dropped. Continue?
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
              <SvgIcon name={`close`} size={40} color={lightDarkTheme.primaryText} />
            </Pressable>
            <Pressable
              onPress={handleAccept}
              style={[
                styles.acceptButton,
                { backgroundColor: lightDarkTheme.lighterOverlayBackground },
              ]}
            >
              <SvgIcon name={`check`} size={40} color={lightDarkTheme.primaryText} />
            </Pressable>
          </View>
        </Animated.View>
      )}

      {showSelectionModal && (
        <HalfScreenModal
          primaryColor={lightDarkTheme.primaryText}
          backgroundColor={lightDarkTheme.primaryBackground}
          isFullscreen={false}
          isVisible={showSelectionModal}
          headerIcon={
            <SvgIcon
              name={"cog-outline"}
              size={30}
              color={lightDarkTheme.primaryText}
            />
          }
          questionText="Choose selection mode"
          onClose={closeSelectionModal}
          modalIsTransparent={false}
        >
          <View style={{ flex: 1 }}>
            {AUTO_SELECT_TYPES.map((item, index) => {
              const isSelected = selected === index;
              const isLongPressed = longPressedIndex === index;

              return (
                <View key={index} style={styles.sectionContainer}>
                  <BouncyEntrance delay={staggeredDelays[index]} style={{ width: "100%" }}>
                    <View style={{ width: "100%" }}>
                      <GlobalPressable
                        onPress={() => {
                          updateSelected(index);
                          handleNavToGecko(index);
                        }}
                        onLongPress={() => setLongPressedIndex(index)}
                        onPressOut={() => setLongPressedIndex(null)}
                        style={[
                          styles.button,
                          { padding: BUTTON_PADDING, backgroundColor: BUTTON_COLOR },
                        ]}
                      >
                        <Text
                          style={[
                            subWelcomeTextStyle,
                            styles.text,
                            {
                              color: isSelected
                                ? lightDarkTheme.primaryBackground
                                : lightDarkTheme.primaryText,
                              backgroundColor: isSelected
                                ? lightDarkTheme.lighterOverlayBackground
                                : lightDarkTheme.primaryBackground,
                            },
                          ]}
                        >
                          {item}
                        </Text>
                      </GlobalPressable>

                      {/* Info box shown on long press */}
                      {isLongPressed && (
                        <View
                          style={[
                            styles.infoBox,
                            { backgroundColor: lightDarkTheme.lighterOverlayBackground },
                          ]}
                        >
                          <Text
                            style={{
                              color: lightDarkTheme.primaryText,
                              fontSize: 14,
                            }}
                          >
                            Info about "{item}" goes here.
                          </Text>
                        </View>
                      )}
                    </View>
                  </BouncyEntrance>
                </View>
              );
            })}
          </View>
        </HalfScreenModal>
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

export default ScreenGeckoSelectSettings;
