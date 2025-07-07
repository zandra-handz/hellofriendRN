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
 
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";

import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  const SELECTED_FRIEND_CARD_HEIGHT = 140;
  // const SELECTED_FRIEND_CARD_MARGIN_TOP = 194;
  const SELECTED_FRIEND_CARD_MARGIN_TOP = 196;
  const SELECTED_FRIEND_CARD_PADDING = 20;


 

  const renderSuggestedHello = useMemo(() => {
    return (
      <Pressable onPress={onPress}>
        <>
          <Text
            style={[ {
              fontFamily: "Poppins-Regular",
                 fontSize: appFontStyles.subWelcomeText.fontSize + 5,
           
              color: themeStyles.primaryText.color,
              opacity: 0.9,
              // color: manualGradientColors.homeDarkColor, // ✅ fixed: `color` not `fontColor`
            }]}
          >
            {selectedFriend && friendDashboardData
              ? "Next suggested hello"
              : "None"}
          </Text>
          <Text
            style={[
              styles.subtitleText,

              
              themeStyles.primaryText,
              { lineHeight: 46,   fontSize: appFontStyles.welcomeText.fontSize + 8, opacity: 0.9 },
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1, width: "100%" }}
      >
        <View style={{ width: "100%", height: SELECTED_FRIEND_CARD_HEIGHT }}>
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

                height: SELECTED_FRIEND_CARD_HEIGHT,
                alignItems: "center",
                flexDirection: "row",

                justifyContent: "space-between",
                borderRadius: borderRadius,
                // backgroundColor: 'orange',
                padding: SELECTED_FRIEND_CARD_PADDING,
                width: "100%",
                backgroundColor:
                  themeStyles.overlayBackgroundColor.backgroundColor,
                borderRadius: 20,
              }}
            >
              <View style={styles.textContainer}>{renderSuggestedHello}</View>

              <View
                style={{
                  borderRadius: 20,
                  // height: "100%",
                  width: "13%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LoadedMoments
                  height={"40%"}
                  iconSize={36}
                  iconColor={themeStyles.primaryText.color}
                  onPress={onPress}
                  circleColor={"orange"}
                  countTextSize={11}
                  countColor={manualGradientColors.homeDarkColor}
                />
                <LoadedImages
                  height={"40%"} //ADJUST POSITION HERE
                  iconSize={36}
                  iconColor={themeStyles.primaryText.color}
                  onPress={navigateToImages}
                  circleColor={"orange"}
                  countTextSize={11}
                  countColor={manualGradientColors.homeDarkColor}
                />
              </View>
            </View>
          )}
          <View style={{ marginVertical: 3 }}>
            <AllFriendCharts
              selectedFriend={!!selectedFriend}
              outerPadding={spacerAroundCalendar}
            />
          </View>
          <View style={{ marginVertical: 3 }}>
            <CalendarChart
              selectedFriend={!!selectedFriend}
              outerPadding={spacerAroundCalendar}
            />
          </View>
        </View>

        {/* <View
          style={{
            zIndex: 30000,
            height: "100%",
            width: "100%",
            marginTop: 10,
          }}
        >
          <HomeScrollSoon
            startAtIndex={0}
            height={"100%"}
            maxHeight={700}
            borderRadius={10}
            borderColor="black"
          />
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },
  textContainer: {
    zIndex: 5,
    flexDirection: "column",
    width: "70%",
    flexWrap: "wrap",
    height: "100%",
    justifyContent: "center",
  }, 
  loadingWrapper: {
    flex: 1,
    // height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectedFriendHome;
