import { StyleSheet, Text, View  } from "react-native";

import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
 
import { useFriendList } from "@/src/context/FriendListContext";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useHelloes } from "@/src/context/HelloesContext"; 

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import CalendarLightsDataPrepLayer from "../foranimations/CalendarLightsDataPrepLayer";

import LoadingPage from "../appwide/spinner/LoadingPage";

const HomeScrollCalendarLights = ({
  height,
  borderRadius = 20,
  borderColor = "transparent",
}) => { 
  const { themeStyles, themeStyleSpinners } = useGlobalStyle();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend,   friendDashboardData } =
    useSelectedFriend();
  const { 
    friendListLength,
    themeAheadOfLoading, 
  } = useFriendList();
  const { helloesList } = useHelloes(); //useHelloesData();

  const calendarButtonHeight = height / 0.6;
 

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: 100, // not sure why I need to set this to control the height?
        },
      ]}
    > 

      {isLoading && !upcomingHelloes && (
        <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={isLoading}
            includeLabel={false}
            label=""
            spinnerSize={70}
            color="#000002"
            spinnerType={themeStyleSpinners?.homeScreen}
          />
        </View>
      )}
      {!isLoading && (
        <>
          <View style={styles.headerContainer}></View>

          {friendListLength === 0 && (
            <View style={styles.noFriendsTextContainer}>
              <Text
                style={[
                  {
                    color: themeStyles.genericTextBackground.backgroundColor,
                    fontSize: 18,
                  },
                ]}
              >
                Suggested meet up dates will go here.
              </Text>
            </View>
          )}

          {friendListLength > 0 && (
            <View
              style={[styles.buttonContainer, { height: calendarButtonHeight }]}
            >
              {selectedFriend &&
                friendListLength > 0 &&
                helloesList &&
                friendDashboardData && (
                  <>
                    <CalendarLightsDataPrepLayer
                      daySquareBorderRadius={20}
                      daySquareBorderColor={themeStyles.genericText.color}
                      opacityMinusAnimation={0.2}
                      animationColor={themeAheadOfLoading.lightColor}
                    />
                  </>
                )}
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
    //flexGrow: 1,
   // height: 'auto',
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
    // paddingRight: '16%',
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
   // paddingHorizontal: "3%",
  },
  button: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: ".6%",
    borderRightWidth: 0.8,
    paddingTop: 0,
    backgroundColor: "transparent",
    backgroundColor: "rgba(41, 41, 41, 0.1)",
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    color: "white",
  },
});

export default HomeScrollCalendarLights;
