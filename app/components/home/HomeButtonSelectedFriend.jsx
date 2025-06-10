import { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import ButtonIconMoments from "../buttons/moments/ButtonIconMoments";
import ButtonIconImages from "../buttons/images/ButtonIconImages";
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";

import HomeFriendItems from "./HomeFriendItems";
import EclipseAnim from "@/app/animations/EclipseAnim";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScrollSoon from "./HomeScrollSoon";

const DOUBLE_PRESS_DELAY = 300;

const HomeButtonSelectedFriend = ({
  height = "100%",
  maxHeight = 190,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const navigation = useNavigation();
  const { themeStyleSpinners, manualGradientColors, themeStyles } =
    useGlobalStyle();
  const { darkColor, lightColor, homeDarkColor, homeLightColor } =
    manualGradientColors;
  const { themeAheadOfLoading } = useFriendList();

  const spacerAroundCalendar = 10;
  //friendLoaded = dashboard data retrieved successfully
  const {
    selectedFriend,
    friendLoaded,
    friendDashboardData,
    isPending,
    isLoading,
    setFriend,
    deselectFriend,
    loadingNewFriend,
  } = useSelectedFriend();

  const lastPress = useRef(0);
  const pressTimeout = useRef(null);

  const navigateToMoments = () => {
    navigation.navigate("Moments");
  };

  //const navigateToLocations = () => {
  //  navigation.navigate('Locations');
  // };

  const navigateToImages = () => {
    navigation.navigate("Images");
  };

  const navigateToAddMoment = () => {
    navigation.navigate("MomentFocus");
  };

  const handleSinglePress = () => {
    navigateToMoments();
  };

  const handleDoublePress = () => {
    console.log("Double press detected");
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
    <View style={{ borderRadius: borderRadius }}>
      <View
        style={[
          styles.container,
          {
            //  backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
            borderRadius: borderRadius,
            borderColor: borderColor,
            justifyContent: "flex-start",
            flexDirection: "column",
            //height: height,
          },
        ]}
      >
        <View style={[{ paddingHorizontal: 10, borderRadius: 20 }]}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={20}
              color={themeStyles.primaryBackground.backgroundColor}
              style={{ marginBottom: 6 }}
            />
            <Text
              style={[
                manualGradientColors.homeDarkColor,
                {
                  marginLeft: 6,
                  marginBottom: spacerAroundCalendar,
                  fontWeight: "bold",
                },
              ]}
            >
              Past Helloes
            </Text>
          </View>
          {selectedFriend && (
            <HomeScrollCalendarLights
              height={70}
              borderRadius={20}
              borderColor="black"
            />
          )}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: spacerAroundCalendar,
              marginBottom: 10, // place this spacing elsewhere
            }}
          >
            {/* <TouchableOpacity
              style={{ 
                flexDirection: "row",
                height: "100%",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Helloes")}
            >
              <Text
                style={[
                  manualGradientColors.homeDarkColor,
                  { marginRight: 6, marginBottom: 10, fontWeight: "bold" },
                ]}
              >
                View
              </Text>
              <View
                style={{
                  transform: [{ rotate: "180deg" }],
                  paddingRight: 20,
                  marginBottom: 8,
                  width: 20,
                  
                  // alignItems: "center",
                }}
              >
                <BackArrowLongerStemSvg
                  height={20}
                  width={20}
                  color={manualGradientColors.homeDarkColor}
                />
              </View>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{ width: "100%", height: 170 }}>
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
                height: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                borderRadius: borderRadius,
                //backgroundColor: 'pink',
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => deselectFriend()}
                style={{ zIndex: 3000, position: "absolute", top: 0, left: 10 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BackArrowLongerStemSvg
                    height={20}
                    width={20}
                    color={"#121212"}
                  />

                  <Text
                    style={{
                      fontFamily: "Poppins-Bold",
                      fontSize: 14,
                      color: "#121212",
                    }}
                  >
                    {`  `}Back
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <TouchableOpacity onPress={onPress}>
                  <>
                    <>
                      <Text
                        style={[
                          {
                            fontFamily: "Poppins-Regular",
                            fontSize: 23,
                            fontColor: manualGradientColors.homeDarkColor,
                          },
                        ]}
                      >
                        {selectedFriend && friendDashboardData
                          ? // ? selectedFriend.name
                            `Next suggested hello`
                          : "None"}
                      </Text>
                    </>
                    <>
                      <Text style={styles.subtitleText}>
                        {friendDashboardData &&
                        friendDashboardData[0] &&
                        friendDashboardData[0].future_date_in_words
                          ? `${friendDashboardData[0].future_date_in_words}`
                          : "No date available"}
                      </Text>
                    </>
                  </>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderRadius: 20,
                  height: "100%",
                  minWidth: "10%",
                  maxWidth: "12%",
                  alignItems: "center",
                  alignContent: "center",
                  flexDirection: "column",
                  justifyContent: "space-between", //ADJUST POSITION HERE
                  paddingTop: "2%", //ADJUST POSITION HERE
                  paddingRight: 10,
                }}
              >
                <ButtonIconMoments
                  height={"40%"} //ADJUST POSITION HERE
                  iconSize={46}
                  onPress={onPress}
                  circleColor={"orange"}
                  countTextSize={11}
                  countColor={
                    themeAheadOfLoading
                      ? themeAheadOfLoading.fontColorSecondary
                      : "orange"
                  }
                />
                <ButtonIconImages
                  height={"40%"} //ADJUST POSITION HERE
                  iconSize={46}
                  onPress={navigateToImages}
                  circleColor={"orange"}
                  countTextSize={11}
                  countColor={
                    themeAheadOfLoading
                      ? themeAheadOfLoading.fontColorSecondary
                      : "orange"
                  }
                />
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            zIndex: 30000,
            height: "100%",
            width: "100%",
            marginTop: 10,
            paddingHorizontal: 10,
          }}
        >
          <HomeScrollSoon
            startAtIndex={0}
            height={"100%"}
            maxHeight={700}
            borderRadius={10}
            borderColor="black"
          />
        </View>
        {/* <HomeFriendItems borderRadius={10} height={40} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 194,
    flexDirection: "row",
    width: "100%",
    flex: 1,
    padding: 0,
    alignContent: "center",
    borderWidth: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  textContainer: {
    zIndex: 5,
    paddingLeft: "2%",
    //paddingTop: '6%',
    flexDirection: "column",
    width: "58%",
    height: "100%",
    justifyContent: "center", //'space-between'
  },
  subtitleText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  loadingWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeButtonSelectedFriend;
