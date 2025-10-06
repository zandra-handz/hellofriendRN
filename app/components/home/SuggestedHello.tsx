import { View, Text, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GoOptionsModal from "../headers/GoOptionsModal";
import GeckoGoButton from "./GeckoGoButton";
import manualGradientColors from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";

type Props = {
  friendId: number;
  padding: number;
  height: number;
  borderRadius: number;
};

const SuggestedHello = ({
  isLoading, // ( = loadingDash )
  friendId,
  primaryColor,
  primaryOverlayColor,
  primaryBackground,

  friendFutureDate,
  padding,
  height,
}: Props) => {
  const { navigateToFinalize } = useAppNavigations();

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const openModal = () => {
    setOptionsModalVisible(true);
  };

  const closeModal = () => {
    setOptionsModalVisible(false);
  };

  const renderSuggestedHello = useMemo(() => {
    return (
      <View>
        <>
          <Text
            style={[
              {
                fontFamily: "Poppins-Regular",
                fontSize: subWelcomeTextStyle.fontSize,
                fontWeight: "bold",
                lineHeight: 20,

                color: primaryColor,
                opacity: 0.9,
              },
            ]}
          >
            {friendId && friendFutureDate ? "Suggested hello" : "None"}
          </Text>
          <Text
            style={[
              {
                // alignSelf: 'center',
                color: primaryColor,
                lineHeight: 32,
                fontSize: welcomeTextStyle.fontSize - 12,

                opacity: 0.9,
                paddingRight: 8, // EYEBALL
              },
            ]}
          >
            {friendFutureDate}
          </Text>
        </>
      </View>
    );
  }, [
    friendId,
    friendFutureDate,
    welcomeTextStyle,
    subWelcomeTextStyle,
    primaryColor,
    manualGradientColors,
    styles,
  ]);

  return (
    <>
      <View
        style={[styles.container, { 
          maxHeight: height + 40,
          padding: padding,
          backgroundColor: isLoading ? "transparent" : primaryOverlayColor,
        }]}
      >
        {!isLoading && (
          <View style={{ flexDirection: "row" }}>
            <View style={styles.textContainer}>{renderSuggestedHello}</View>
            <View
              style={{ 
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                width: 60,
              }}
            >
              <GeckoGoButton
                size={60}
                onSinglePress={openModal}
                onDoublePress={navigateToFinalize}
              />
            </View>
          </View>
        )}

        <View
          style={{
            borderRadius: 20,
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
      </View>
      {optionsModalVisible && (
        <View>
          <GoOptionsModal
            primaryColor={primaryColor}
            backgroundColor={primaryOverlayColor}
            modalBackgroundColor={primaryBackground}
            manualGradientColors={manualGradientColors}
            subWelcomeTextStyle={subWelcomeTextStyle}
            isVisible={optionsModalVisible}
            closeModal={closeModal}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    minHeight: 96, // EYEBALL

    flexShrink: 1,
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 10,
  },
  textContainer: {
    zIndex: 5,
    width: "70%",
    flexGrow: 1,
    flexWrap: "wrap",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SuggestedHello;
