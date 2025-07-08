import { useMemo, useRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  DimensionValue,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import LoadedMoments from "../buttons/moments/LoadedMoments";
import LoadedImages from "../buttons/images/LoadedImages";
import CalendarChart from "./CalendarChart";
import AllFriendCharts from "./AllFriendCharts";
import TalkingPointsChart from "./TalkingPointsChart";
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import Pics from "./Pics";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import HomeScrollSoon from "./HomeScrollSoon";

interface SelectedFriendHomeProps {
  borderRadius: DimensionValue;
  borderColor: string;
}

const SelectedFriendHome: React.FC<SelectedFriendHomeProps> = ({
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const navigation = useNavigation();
  const {
    themeStyleSpinners,
    manualGradientColors,
    themeStyles,
    appFontStyles,
  } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  const spacerAroundCalendar = 10;
  //friendLoaded = dashboard data retrieved successfully
  const {
    selectedFriend,
    friendLoaded,
    friendDashboardData,
    isPending,
    isLoading,
    loadingNewFriend,
  } = useSelectedFriend();

  const DOUBLE_PRESS_DELAY = 300;

  const lastPress = useRef(0);
  const pressTimeout = useRef(null);

  const SELECTED_FRIEND_CARD_HEIGHT = 120;
  // const SELECTED_FRIEND_CARD_MARGIN_TOP = 194;
  const SELECTED_FRIEND_CARD_MARGIN_TOP = 196;
  const SELECTED_FRIEND_CARD_PADDING = 20;

  const renderSuggestedHello = useMemo(() => {
    return (
      <Pressable style={{}} onPress={onPress}>
        <>
          <Text
            style={[
              {
                fontFamily: "Poppins-Regular",
                fontSize: appFontStyles.subWelcomeText.fontSize + 3,

                color: themeStyles.primaryText.color,
                opacity: 0.9,
                // color: manualGradientColors.homeDarkColor,
              },
            ]}
          >
            {selectedFriend && friendDashboardData ? "Suggested hello" : "None"}
          </Text>
          <Text
            style={[
              styles.subtitleText,

              themeStyles.primaryText,
              {
                // alignSelf: 'center',
                lineHeight: 46,
                fontSize: appFontStyles.welcomeText.fontSize + 6,
                opacity: 0.9,
                paddingRight: 50,
              },
            ]}
          >
            {friendDashboardData?.[0]?.future_date_in_words ||
              "No date available"}
          </Text>
        </>
      </Pressable>
    );
  }, [
    onPress,
    selectedFriend,
    friendDashboardData,
    appFontStyles,
    themeStyles,
    manualGradientColors,
    styles,
  ]);

  // useEffect(() => {
  //   if (selectedFriend) {
  //     fetchCompletedMomentsAPI(selectedFriend.id);

  //   }

  // }, [selectedFriend]);

  const navigateToMoments = () => {
    navigation.navigate("Moments");
  };

  const navigateToImages = () => {
    navigation.navigate("ImageView", { startingIndex: 0 });
  };

  const navigateToAddMoment = () => {
    navigation.navigate("MomentFocus");
  };

  const handleSinglePress = () => {
    navigateToMoments();
  };

  const handleDoublePress = () => {
    navigateToAddMoment();
  };

  const onPress = () => {
    const now = Date.now();
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) {
      clearTimeout(pressTimeout.current);
      handleDoublePress();
    } else {
      pressTimeout.current = setTimeout(() => {
        handleSinglePress();
      }, DOUBLE_PRESS_DELAY);
    }
    lastPress.current = now;
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: SELECTED_FRIEND_CARD_MARGIN_TOP,
          borderRadius: borderRadius,
          borderColor: borderColor,
          paddingHorizontal: 4,
        },
      ]}
    >
      <View
        style={{
          zIndex: 30000,

          height: "100%",
          width: "100%",
          marginTop: 0,
        }}
      >
        <View style={styles.containerOverScrollView}>
          <View
            style={{
              flex: 1,
              //height: 200,
              width: "100%",
              // backgroundColor: 'pink',
              alignItems: "center",
              paddingBottom: 253, // change this to change were the bottom fadingEdge of scrollview starts
            }}
          >
            <ScrollView
              style={{ width: "100%" }}
              fadingEdgeLength={30}
              contentContainerStyle={{ 
                paddingHorizontal: 0,
                alignItems: "center", // optional
              }}
            >
              {isLoading && !friendLoaded && (
                <>
                  <View style={styles.loadingWrapper}>
                    <LoadingPage
                      loading={isPending}
                      spinnerType={themeStyleSpinners.homeScreen}
                    />
                  </View>
                </>
              )}

              {!loadingNewFriend && friendLoaded && (
                <View
                  style={{
                    marginVertical: 4,

                    maxHeight: SELECTED_FRIEND_CARD_HEIGHT + 40,
                    flexShrink: 1,
                    alignItems: "center",
                    flexDirection: "row",

                    justifyContent: "space-between",
                    borderRadius: borderRadius,
                    // backgroundColor: 'orange',
                    padding: SELECTED_FRIEND_CARD_PADDING,
                    paddingRight: 10,
                    width: "100%",
                    backgroundColor:
                      themeStyles.overlayBackgroundColor.backgroundColor,
                    borderRadius: 20,
                  }}
                >
                  <View style={styles.textContainer}>
                    {renderSuggestedHello}
                    <Pressable
                      onPress={navigateToMoments}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        backgroundColor: manualGradientColors.lightColor,
                        justifyContent: "center",
                        borderRadius: 10,
                        padding: 4,
                        width: "auto",
                        height: "100%",
                      }}
                    >
                      {/* <MaterialCommunityIcons
                        name={"run-fast"}
                        size={40}
                        color={themeStyles.primaryText.color}
                      /> */}
                      <FontAwesome6
                        name={"person-walking-arrow-right"}
                        size={30}
                        color={manualGradientColors.homeDarkColor}
                      />
                    </Pressable>
                  </View>

                  <View
                    style={{
                      borderRadius: 20,
                      // height: "100%",
                      width: "100%",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <LoadedMoments
                          height={"40%"}
                          iconSize={36}
                          iconColor={themeStyles.primaryText.color}
                          onPress={onPress}
                          circleColor={"orange"}
                          countTextSize={11}
                          countColor={manualGradientColors.homeDarkColor}
                        /> */}
                    {/* <LoadedImages
                      height={"40%"} //ADJUST POSITION HERE
                      iconSize={36}
                      iconColor={themeStyles.primaryText.color}
                      onPress={navigateToImages}
                      circleColor={"orange"}
                      countTextSize={11}
                      countColor={manualGradientColors.homeDarkColor}
                    /> */}
                  </View>
                </View>
              )}
              <View style={{ width: "100%", marginVertical: 3 }}>
                <TalkingPointsChart
                  selectedFriend={!!selectedFriend}
                  outerPadding={spacerAroundCalendar}
                />
              </View>
              <View style={{ width: "100%", marginVertical: 3 }}>
                <Pics
                  selectedFriend={!!selectedFriend}
                  outerPadding={spacerAroundCalendar}
                />
              </View>
              <View style={{ width: "100%", marginVertical: 3 }}>
                <AllFriendCharts
                  selectedFriend={selectedFriend} //removed the boolean casting to be able to pass in name
                  outerPadding={spacerAroundCalendar}
                />
              </View>

              <View style={{ marginVertical: 3 }}>
                <CalendarChart
                  selectedFriend={!!selectedFriend}
                  outerPadding={spacerAroundCalendar}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   overflow: 'hidden',
  //   width: "100%",
  //   flex: 1,
  //   alignContent: "center",
  //   alignItems: "center",
  // },

  container: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    minHeight: 190,
    height: "100%",
    alignContent: "center",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  containerOverScrollView: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "black",
  },
  textContainer: {
    zIndex: 5,
    // flexDirection: "column",
    width: "100%",
    flexWrap: "wrap",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingWrapper: {
    flex: 1,
    // height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectedFriendHome;
