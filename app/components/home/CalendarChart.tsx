import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MonthModal from "../headers/MonthModal";
import useHelloesManips from "@/src/hooks/useHelloesManips";
import manualGradientColors  from "@/src/hooks/StaticColors";
type Props = {
  outerPadding: DimensionValue;
  combinedData: any;
  showTopBar: boolean;
  useBackgroundOverlay: boolean;
};

    // "@expo/config-plugins": "~54.0.1",
    // "@expo/metro-config": "~54.0.2",
    // "@expo/prebuild-config": "~54.0.0",

const CalendarChart = ({
  helloesList,
  navigateToHelloes,
  friendId,
  showTopBar = true,
  useBackgroundOverlay = true,
  outerPadding = 10,
  themeAheadOfLoading,
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

    const HEIGHT = COMBINED_HEIGHT + (PADDING*2); 


  const handleMonthPress = (data) => {
    setMonthData(data);
    console.log(data);
    setMonthModalVisible(true);
  };

  return (
    <View style={{height: HEIGHT}}>
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
        {showTopBar && (
          <View
            style={{
              borderRadius: 20,
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",

              marginBottom: outerPadding,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="calendar-heart"
                size={20}
                color={lightDarkTheme.primaryText}
                style={{ marginBottom: 0 }}
              />
              <Text
                style={[
                  {
                    color: lightDarkTheme.primaryText,
                    marginLeft: 6,
                    marginRight: 12,
                    fontWeight: "bold",
                  },
                ]}
              >
                Past Helloes
              </Text>
            </View>

            <Pressable hitSlop={10} onPress={navigateToHelloes}>
              <Text
                style={[
                  {
                    color: lightDarkTheme.primaryText,
                    fontWeight: "bold",
                    fontSize: 13,
                  },
                ]}
              >
                Details
              </Text>
            </Pressable>
          </View>
        )}
        {combinedData && (
          <HomeScrollCalendarLights
            helloesList={helloesList}
            friendId={friendId} 
           primaryColor={primaryColor}
            themeAheadOfLoading={themeAheadOfLoading}
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
          themeAheadOfLoading={themeAheadOfLoading}
          isVisible={monthModalVisible}
          monthData={monthData}
          closeModal={() => setMonthModalVisible(false)}
        />
      )}
    </View>
  );
};

export default CalendarChart;
