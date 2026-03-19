import { View } from "react-native";
import React, { useEffect, useState } from "react";
// import MonthModal from "../headers/MonthModal";
import useHelloesManips from "@/src/hooks/HelloesFunctions/useHelloesManips";

import CalendarLights from "../foranimations/CalendarLights";
import LoadingPage from "../appwide/spinner/LoadingPage";
import AppCustomSpinner from "../appwide/format/AppCustomSpinner";
import AppCustomSpinnerMini from "../appwide/format/AppCustomSpinnerMini";
import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  helloesList: any;
  friendId: string;
  themeColors: any;
  lightDarkTheme: any;
  useBackgroundOverlay?: boolean;
};

const CalendarChart = ({
  helloesList,
  friendId,
  useBackgroundOverlay = true,
  themeColors,
  lightDarkTheme,
}: Props) => {
  const reversedHelloesList = Array.isArray(helloesList)
    ? [...helloesList].reverse()
    : [];

  const { combinedData } = useHelloesManips({
    helloesData: reversedHelloesList,
    //  helloesData: helloesList,
  });

  // useEffect(() => {
  //   if (helloesList) { 
  //         console.log(helloesList);
  //   }
  // }, [helloesList]);

  const primaryColor = lightDarkTheme.primaryText;

  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [monthData, setMonthData] = useState<any>(null);

  // Slightly taller to support bigger dots
  const CALENDAR_HEIGHT = 140;

  const MONTH_BUTTON_BOTTOM_MARGIN = 0;
  const COMBINED_HEIGHT = CALENDAR_HEIGHT + MONTH_BUTTON_BOTTOM_MARGIN;

  const handleMonthPress = (data: any) => {
    setMonthData(data);
    console.log(data);
    // setMonthModalVisible(true);
  };

  return (
    <View>
      <View
        style={{
          overflow: "hidden",

          // padding: PADDING,
          backgroundColor: useBackgroundOverlay
            ? lightDarkTheme.overlayBackground
            : "transparent",
          borderRadius: 20,
          // backgroundColor: 'pink',
        }}
      >
        <View style={{ height: 120, width: "100%" }}>
          {combinedData && helloesList && (
            <CalendarLights
              themeColors={themeColors}
              onMonthPress={handleMonthPress}
              combinedData={combinedData}
              daySquareBorderColor={primaryColor}
              height={COMBINED_HEIGHT}
            />
          )}

          {!combinedData && (
            <AppCustomSpinnerMini
              color1={manualGradientColors.lightColor}
              color2={manualGradientColors.darkColor}
            />
          )}
        </View>
      </View>

      {/* {monthModalVisible && (
        <MonthModal
          friendId={friendId}
          helloesList={helloesList}
          manualGradientColors={manualGradientColors}
          primaryColor={primaryColor}
          themeColors={themeColors}
          isVisible={monthModalVisible}
          monthData={monthData}
          closeModal={() => setMonthModalVisible(false)}
        />
      )} */}
    </View>
  );
};

export default CalendarChart;
