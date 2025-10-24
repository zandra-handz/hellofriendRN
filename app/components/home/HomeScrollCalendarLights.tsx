import { StyleSheet, View } from "react-native";
import React, { useCallback } from "react";

import CalendarLights from "../foranimations/CalendarLights";

const HomeScrollCalendarLights = ({
  friendId,
  primaryColor, 
  themeColors,
  itemColor,
  onMonthPress,
  combinedData,
  height,
  monthButtonMargin,
  borderRadius = 20,
  borderColor = "transparent",

  helloesList,
}) => {
  // const calendarButtonHeight = height / 0.6;

 
  const RenderCalendarLights = useCallback(
    () => (
      <CalendarLights
        helloesList={helloesList}
        friendId={friendId}
        primaryColor={primaryColor}
        themeColors={themeColors} 
        onMonthPress={onMonthPress}
        daySquareBorderRadius={20}
        daySquareBorderColor={itemColor}
        combinedData={combinedData}
        opacityMinusAnimation={0.2}
        animationColor={themeColors.lightColor}
        height={height}
        monthButtonMargin={monthButtonMargin}
      />
    ),
    [helloesList, themeColors, itemColor]
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
         // maxHeight: height, // not sure why I need to set this to control the height?
          backgroundColor: "transparent",
        },
      ]}
    >
      <>
        {/* <View
          style={[styles.buttonContainer, { height: '100%' }]}
        > */}
          <RenderCalendarLights />
        {/* </View> */}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden", 
  },

  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
    borderRadius: 30,
  },
});

//export default HomeScrollCalendarLights;
export default React.memo(HomeScrollCalendarLights);
