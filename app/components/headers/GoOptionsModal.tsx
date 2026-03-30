import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import AppModal from "../alerts/AppModal";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import BouncyEntrance from "./BouncyEntrance";
import OptionButton from "./OptionButton";

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
    navigateToLocationSearch,
    navigateToFinalize,
    // navigateToFidget,
  } = useAppNavigations();

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const BUTTON_PADDING = 4;
  const BUTTON_COLOR = manualGradientColors.lightColor;

  const handleNavToLocationSearch = () => {
    closeModal();
    navigateToLocationSearch();
  };
  const handleNavToFinalize = () => {
    closeModal();
    navigateToFinalize();
  };
  //const handleNavToSpinners = () => { closeModal(); navigateToFidget(); };

  const count = 5;
  const speed = 20;

  const staggeredDelays = useMemo(() => {
    return Array.from({ length: count }, (_, i) => i * speed);
  }, [count, speed]);

  const sharedButtonProps = {
    primaryColor,
    backgroundColor,
    buttonColor: BUTTON_COLOR,
    textStyle: subWelcomeTextStyle,
    buttonPadding: BUTTON_PADDING,
  };

  return (
    <AppModal
      primaryColor={primaryColor}
      backgroundColor={modalBackgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      questionText="What would you like to do?"
      onClose={closeModal}
      useCloseButton={true}
      children={
        <View style={{ flex: 1 }}>
          {staggeredDelays.length > 0 && (
            <>
              {/* <View style={styles.sectionContainer}>
                <BouncyEntrance
                  delay={staggeredDelays[0]}
                  style={{ width: "100%" }}
                >
                  <OptionButton
                    {...sharedButtonProps}
                    onPress={handleNavToLocationSearch}
                    label="Find a meetup"
                  />
                </BouncyEntrance>
              </View> */}

              <View style={styles.sectionContainer}>
                <BouncyEntrance
                  delay={staggeredDelays[2]}
                  style={{ width: "100%" }}
                >
                  <OptionButton
                    {...sharedButtonProps}
                    onPress={handleNavToFinalize}
                    label="Save hello"
                  />
                </BouncyEntrance>
              </View>
              
              {/* <View style={styles.sectionContainer}>
                <BouncyEntrance delay={staggeredDelays[3]} style={{ width: "100%" }}>
                  <OptionButton {...sharedButtonProps} onPress={handleNavToSpinners} label="Spinner gallery" />
                </BouncyEntrance>
              </View> */}
            </>
          )}
        </View>
      }
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
});

export default GoOptionsModal;
