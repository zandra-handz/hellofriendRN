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

const DOUBLE_PRESS_DELAY = 300;

const HomeButtonSelectedFriend = ({
  height = "100%",
  maxHeight = 190,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const navigation = useNavigation();
  const { themeStyleSpinners, manualGradientColors } = useGlobalStyle();
  const { darkColor, lightColor, homeDarkColor, homeLightColor } =
    manualGradientColors;
  const { themeAheadOfLoading } = useFriendList();
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
    <View style={{ maxHeight: maxHeight, borderRadius: borderRadius }}>
      <EclipseAnim
        color={homeLightColor ? homeLightColor : "lightgreen"}
        innerColor={homeDarkColor ? homeDarkColor : "darkgreen"}
        delay={10}
        speed={100}
      >
        <View
          style={[
            styles.container,
            {
              borderRadius: borderRadius,
              borderColor: borderColor,
              height: height,
              maxHeight: maxHeight,
            },
          ]}
        >
          <LinearGradient
            colors={[darkColor, lightColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />

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
                            fontColor: "#000002",
                          },
                        ]}
                      >
                        {selectedFriend && friendDashboardData
                          ? selectedFriend.name
                          : "None"}
                      </Text>
                    </>
                    <>
                      <Text style={styles.subtitleText}>
                        {friendDashboardData &&
                        friendDashboardData[0] &&
                        friendDashboardData[0].future_date_in_words
                          ? `Suggested: Say hi on ${friendDashboardData[0].future_date_in_words}`
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
        
      </EclipseAnim>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    padding: "5%",
    alignContent: "center",
    borderWidth: 0,
    marginVertical: "1%",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: "teal",
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
