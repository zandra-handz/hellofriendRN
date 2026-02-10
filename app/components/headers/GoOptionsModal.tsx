import React, { useMemo } from "react";
import {   StyleSheet, View,   Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HalfScreenModal from "../alerts/HalfScreenModal";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import GlobalPressable from "../appwide/button/GlobalPressable";
import BouncyEntrance from "./BouncyEntrance";
type Props = {
  isVisible: boolean;
  closeModal: () => void;
  primaryColor: string;
  backgroundColor: string;
  modalBackgroundColor: string;
};

const GoOptionsModal = ({
  isVisible,
  primaryColor,
  backgroundColor,
  modalBackgroundColor,
  closeModal,
}: Props) => {
  const {
    navigateToMoments,
    navigateToLocationSearch,
    navigateToFinalize, 
    navigateToFidget
  } = useAppNavigations();

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const BUTTON_PADDING = 4;
  const BUTTON_COLOR = manualGradientColors.lightColor;
  // const backgroundColor = manualGradientColors.homeDarkColor;

  const handleNavToMoments = () => {
    closeModal();
    navigateToMoments({ scrollTo: null });
  };

  const handleNavToLocationSearch = () => {
    closeModal();
    navigateToLocationSearch();
  };

  const handleNavToFinalize = () => {
    closeModal();
    navigateToFinalize();
  };


    const handleNavToSpiners = () => {
    closeModal();
    navigateToFidget();
  };


  const count = 5; // number of items
  const speed = 20; // milliseconds between each item

  const staggeredDelays = useMemo(() => {
    const getStaggeredDelays = (count: number, speed: number): number[] => {
      return Array.from({ length: count }, (_, i) => i * speed);
    };

    return getStaggeredDelays(count, speed);
  }, [count, speed]);
  return (
    <HalfScreenModal
      primaryColor={primaryColor}
      backgroundColor={modalBackgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"storefront-outline"}
          size={30}
          color={primaryColor}
        />
      }
      questionText="What would you like to do?"
      children={
        <View style={{ flex: 1 }}>
          {staggeredDelays && staggeredDelays.length > 0 && (
            <>
              <View style={styles.sectionContainer}>
                <BouncyEntrance
                  delay={staggeredDelays[0]}
                  style={{ width: "100%" }}
                >
                  <GlobalPressable
                    onPress={handleNavToLocationSearch}
                    style={[
                      styles.button,
                      {
                        padding: BUTTON_PADDING,
                        backgroundColor: BUTTON_COLOR,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        styles.text,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                        },
                      ]}
                    >
                      Find a meetup
                    </Text>
                  </GlobalPressable>
                </BouncyEntrance>
              </View>
              <View style={[styles.sectionContainer]}>
                <BouncyEntrance
                  delay={staggeredDelays[1]}
                  style={{ width: "100%" }}
                >
                  <GlobalPressable
                    onPress={handleNavToMoments}
         style={[
                      styles.button,
                      {
                        padding: BUTTON_PADDING,
                        backgroundColor: BUTTON_COLOR,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        styles.text,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                        },
                      ]}
                    >
                      Share my ideas
                    </Text>
                  </GlobalPressable>
                </BouncyEntrance>
              </View>
              <View style={styles.sectionContainer}>
                <BouncyEntrance
                  delay={staggeredDelays[2]}
                  style={{ width: "100%" }}
                >
                  <GlobalPressable
                    onPress={handleNavToFinalize}
                    style={[
                      styles.button,
                      {
                        padding: BUTTON_PADDING,
                        backgroundColor: BUTTON_COLOR,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        styles.text,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                        },
                      ]}
                    >
                      Save hello
                    </Text>
                  </GlobalPressable>
                </BouncyEntrance>
              </View>


                            <View style={styles.sectionContainer}>
                <BouncyEntrance
                  delay={staggeredDelays[2]}
                  style={{ width: "100%" }}
                >
                  <GlobalPressable
                    onPress={handleNavToSpiners}
                    style={[
                      styles.button,
                      {
                        padding: BUTTON_PADDING,
                        backgroundColor: BUTTON_COLOR,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        styles.text,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                        },
                      ]}
                    >
                      Spinner gallery
                    </Text>
                  </GlobalPressable>
                </BouncyEntrance>
              </View>

              <View style={styles.sectionContainer}>
                <BouncyEntrance
                  delay={staggeredDelays[3]}
                  style={{ width: "100%" }}
                >
                  <GlobalPressable
                    onPress={closeModal}
                    style={[
                      styles.button,
                      {
                        padding: BUTTON_PADDING,

                        backgroundColor: manualGradientColors.darkColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        styles.text,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                        },
                      ]}
                    >
                      Close
                    </Text>
                  </GlobalPressable>
                </BouncyEntrance>
              </View>
            </>
          )}
        </View>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
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
  },
});

export default GoOptionsModal;
