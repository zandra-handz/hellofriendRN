import { View } from "react-native";
import React, { useState } from "react";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import MonthModal from "../headers/MonthModal";
import useHelloesManips from "@/src/hooks/HelloesFunctions/useHelloesManips";
import manualGradientColors from "@/app/styles/StaticColors";
type Props = {
  outerPadding: DimensionValue;
  combinedData: any;
  showTopBar: boolean;
  useBackgroundOverlay: boolean;
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
  });
  const primaryColor = lightDarkTheme.primaryText;
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [monthData, setMonthData] = useState(null);

  const CALENDAR_HEIGHT = 100;
  const MONTH_BUTTON_BOTTOM_MARGIN = 0;
  const COMBINED_HEIGHT = CALENDAR_HEIGHT + MONTH_BUTTON_BOTTOM_MARGIN;

  const PADDING = 4;

  const HEIGHT = COMBINED_HEIGHT + PADDING * 2;

  const handleMonthPress = (data) => {
    setMonthData(data);
    console.log(data);
    setMonthModalVisible(true);
  };

  return (
    <View style={{ height: HEIGHT }}>
      <View
        style={[
          {
            overflow: "hidden",
            height: HEIGHT,
            padding: PADDING,
            backgroundColor: useBackgroundOverlay
              ? lightDarkTheme.overlayBackground
              : "transparent",

            borderRadius: 20,
          },
        ]}
      >
        {combinedData && (
          <HomeScrollCalendarLights
            helloesList={helloesList}
            friendId={friendId}
            primaryColor={primaryColor}
            themeColors={themeColors} 
            onMonthPress={handleMonthPress}
            combinedData={combinedData}
            itemColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.overlayBackground}
            // height={70}
            height={COMBINED_HEIGHT}
            monthButtonMargin={MONTH_BUTTON_BOTTOM_MARGIN}
            borderRadius={20}
          />
        )}
        <View style={{ width: "100%", height: 10 }}></View>
      </View>

      {monthModalVisible && (
        <MonthModal
          friendId={friendId}
          helloesList={helloesList}
          manualGradientColors={manualGradientColors}
          primaryColor={lightDarkTheme.primaryText}
          themeColors={themeColors} 
          isVisible={monthModalVisible}
          monthData={monthData}
          closeModal={() => setMonthModalVisible(false)}
        />
      )}
    </View>
  );
};

export default CalendarChart;
