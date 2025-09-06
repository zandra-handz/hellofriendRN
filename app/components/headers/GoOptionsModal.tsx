import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View, Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HalfScreenModal from "../alerts/HalfScreenModal"; 
import useAppNavigations from "@/src/hooks/useAppNavigations";
 
import GlobalPressable from "../appwide/button/GlobalPressable";
import BouncyEntrance from "./BouncyEntrance";
type Props = {
  isVisible: boolean;
  closeModal: () => void;
};

const GoOptionsModal = ({
  isVisible,
  primaryColor,
  backgroundColor,
  modalBackgroundColor,
  manualGradientColors,
  subWelcomeTextStyle,
  closeModal,
}: Props) => {
  const {
    navigateToMoments,
    navigateToLocationSearch,
    navigateToFinalize,
    navigateToFidget,
  } = useAppNavigations();
 

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

  const handleNavToFidget = () => {
    closeModal();
    navigateToFidget();
  };

  const count = 6; // or however many animated items you have
  const speed = 100; // milliseconds between each item

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
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                      height: "auto",
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: manualGradientColors.darkColor,
                    }}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                          borderRadius: 6,
                          padding: 10,
                        },
                      ]}
                    >
                      Send a meetup location
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
                    style={{
                      flexDirection: "row",

                      width: "100%",
                      justifyContent: "center",
                      height: "auto",
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: manualGradientColors.darkColor,
                    }}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                          borderRadius: 6,
                          padding: 10,
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
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                      height: "auto",
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: manualGradientColors.darkColor,
                    }}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                          borderRadius: 6,
                          padding: 10,
                        },
                      ]}
                    >
                      Skip to save hello
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
                    onPress={handleNavToFidget}
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                      height: "auto",
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: manualGradientColors.darkColor,
                    }}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                          borderRadius: 6,
                          padding: 10,
                        },
                      ]}
                    >
                      Fidget spinner
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
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                      height: "auto",
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: manualGradientColors.darkColor,
                    }}
                  >
                    <Text
                      style={[
                        subWelcomeTextStyle,
                        {
                          color: primaryColor,
                          backgroundColor: backgroundColor,
                          borderRadius: 6,
                          padding: 10,
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
  bodyContainer: {},
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",

    flexWrap: "wrap",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text: {
    lineHeight: 21,
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default GoOptionsModal;
