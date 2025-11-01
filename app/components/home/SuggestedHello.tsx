import { View, Text, StyleSheet } from "react-native";
import React, { useMemo, useState } from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GoOptionsModal from "../headers/GoOptionsModal";
import GeckoGoButton from "./GeckoGoButton"; 
import { AppFontStyles } from "@/app/styles/AppFonts";
import { formatDayOfWeekAbbrevMonth } from "@/src/utils/DaysSince";

type Props = {
  padding: number;
 
  borderRadius: number;
  darkerGlassBackground: string;
  futureDate: string;
  primaryColor: string;
  primaryBackground: string;
  loadingDash: boolean;
};

const SuggestedHello = ({
  futureDate,
  primaryColor,
  primaryBackground,
  loadingDash,
  darkerGlassBackground,
  padding,
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

  const helloDate = useMemo(() => {
    return formatDayOfWeekAbbrevMonth(futureDate);
  }, [futureDate]);

  const renderSuggestedHello = useMemo(() => {
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <>
          <Text
            style={[
              styles.titleText,
              {
                color: primaryColor,
                fontFamily: "Poppins-Regular",
                fontSize: subWelcomeTextStyle.fontSize,
              },
            ]}
          >
            {helloDate ? "Say hi on" : "None"}
          </Text>
          <Text
            style={[
              styles.futureDateText,
              {
                color: primaryColor,

                fontSize: welcomeTextStyle.fontSize - 14,
              },
            ]}
          >
            {helloDate}
          </Text>
        </>
      </View>
    );
  }, [helloDate, primaryColor]);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: 86,
      }}
    >
      <View
        style={[
          styles.container,
          {
            // height: height - 10,
            padding: padding,
            backgroundColor: darkerGlassBackground,
          },
        ]}
      >
        {!loadingDash && (
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View style={styles.textContainer}>{renderSuggestedHello}</View>
            <View style={styles.geckoButtonWrapper}>
              <GeckoGoButton
                onSinglePress={openModal}
                onDoublePress={navigateToFinalize}
              />
            </View>
          </View>
        )}
      </View>
      {optionsModalVisible && (
        <View>
          <GoOptionsModal
            primaryColor={primaryColor}
            backgroundColor={"red"}
            modalBackgroundColor={primaryBackground}
            isVisible={optionsModalVisible}
            closeModal={closeModal}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "space-between",
    // width: "100%",
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 999,
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
  titleText: {
    fontWeight: "bold",
    lineHeight: 20,

    opacity: 0.9,
  },
  futureDateText: {
    lineHeight: 32,
    opacity: 0.9,
    paddingRight: 8, // EYEBALL
  },
  geckoButtonWrapper: {
    //   flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    height: "100%",

    right: 0,
    zIndex: 9000,
  },
});

export default SuggestedHello;
