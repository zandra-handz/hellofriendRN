import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
 import CalendarLights from "../foranimations/CalendarLights";

const HomeScrollCalendarLights = ({
  itemColor,
  onMonthPress,
  combinedData, 
  height,
  borderRadius = 20,
  borderColor = "transparent",
}) => { 
  const {   isLoading } = useUpcomingHelloes();
  const { friendDashboardData } = useSelectedFriend();
  const { friendList, themeAheadOfLoading } = useFriendList();

  const calendarButtonHeight = height / 0.6;

  const RenderCalendarLights = useCallback(
    () => (
      <CalendarLights 
      onMonthPress={onMonthPress}
        daySquareBorderRadius={20}
        daySquareBorderColor={itemColor}
        combinedData={combinedData}
        opacityMinusAnimation={0.2}
        animationColor={themeAheadOfLoading.lightColor}
      />
    ),
    [friendDashboardData, themeAheadOfLoading, itemColor]
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: 100, // not sure why I need to set this to control the height?
          backgroundColor: "transparent",
        },
      ]}
    > 
      {!isLoading && (
        <>
          <View style={styles.headerContainer}></View>

          {friendList?.length === 0 && (
            <View style={styles.noFriendsTextContainer}>
              <Text
                style={[
                  {
                    color: itemColor,
                    fontSize: 18,
                  },
                ]}
              >
                Suggested meet up dates will go here.
              </Text>
            </View>
          )}

          {friendList?.length > 0 && (
            <View
              style={[styles.buttonContainer, { height: calendarButtonHeight }]}
            >
           
              <RenderCalendarLights />
          
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    borderWidth: 0,
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  noFriendsTextContainer: {
    flex: 1,
    flexDirection: "row",
    zIndex: 1,

    paddingLeft: "2%",
    width: "100%",
  },
  loadingWrapper: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    flex: 1,
    borderRadius: 30,
  },
  button: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: ".6%",
    borderRightWidth: 0.8,
    paddingTop: 0,
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    color: "white",
  },
});

//export default HomeScrollCalendarLights;
export default React.memo(HomeScrollCalendarLights);
