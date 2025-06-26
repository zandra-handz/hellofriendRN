import { useMemo, useRef } from "react";
import {
  TouchableOpacity,
  Pressable,
  Text,
  StyleSheet,
  View,
  DimensionValue,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import LoadedMoments from "../buttons/moments/LoadedMoments";
import LoadedImages from "../buttons/images/LoadedImages";

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

  const SELECTED_FRIEND_CARD_HEIGHT = 130;
  // const SELECTED_FRIEND_CARD_MARGIN_TOP = 194;
  const SELECTED_FRIEND_CARD_MARGIN_TOP = 202;
  const SELECTED_FRIEND_CARD_PADDING = 10;

  const renderSuggestedHello = useMemo(() => {
    return (
      <Pressable onPress={onPress}>
        <>
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: appFontStyles.welcomeText.fontSize - 4,
              color: themeStyles.primaryText.color,
              opacity: 0.9,
              // color: manualGradientColors.homeDarkColor, // ✅ fixed: `color` not `fontColor`
            }}
          >
            {selectedFriend && friendDashboardData
              ? "Next suggested hello"
              : "None"}
          </Text>
          <Text
            style={[
              styles.subtitleText,
              themeStyles.primaryText,
              { opacity: 0.9 },
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
    <View style={{ borderRadius: borderRadius }}>
      <View
        style={[
          styles.container,
          {
            marginTop: SELECTED_FRIEND_CARD_MARGIN_TOP,
            borderRadius: borderRadius,
            borderColor: borderColor,
            justifyContent: "flex-start",
            flexDirection: "column",
            paddingHorizontal: 4,
          },
        ]}
      >
        <View
          style={[
            {
              overflow: "hidden",
              padding: 10,
              backgroundColor:
                themeStyles.overlayBackgroundColor.backgroundColor,
              borderRadius: 20,
            },
          ]}
        >
          <View
            style={{
              borderRadius: 20,
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",

              // backgroundColor: 'orange',
              marginBottom: spacerAroundCalendar,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="hand-wave-outline"
                size={20}
                color={themeStyles.primaryText.color}
                style={{ marginBottom: 0 }}
              />
              <Text
                style={[
                  themeStyles.primaryText,
                  {
                    marginLeft: 6,
                    marginRight: 12,
                    fontWeight: "bold",
                  },
                ]}
              >
                Past Helloes
              </Text>
            </View>
            <LabeledArrowButton
              color={themeStyles.primaryText.color}
              label="View"
              opacity={0.7}
              onPress={() => navigation.navigate("Helloes")}
            />
          </View>
          {selectedFriend && (
            <HomeScrollCalendarLights
              itemColor={themeStyles.primaryText.color}
              backgroundColor={themeStyles.overlayBackgroundColor.backgroundColor}
              height={70}
              borderRadius={20}
            />
          )}
          <View style={{ width: "100%", height: 10 }}></View>
        </View>
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
                marginVertical: 6,
                height: "100%",
                height: 200,
                alignItems: 'center',
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
                  height: "100%",
                  width: "13%", 
                  flexDirection: "column",  
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              > 

                <LoadedMoments
                  height={"40%"}
                  iconSize={46}
                  iconColor={themeStyles.primaryText.color}
                  onPress={onPress}
                  circleColor={"orange"}
                  countTextSize={11}
                  countColor={manualGradientColors.homeDarkColor}
                />
                <LoadedImages
                  height={"40%"} //ADJUST POSITION HERE
                  iconSize={46}
                  iconColor={themeStyles.primaryText.color}
                  onPress={navigateToImages}
                  circleColor={"orange"}
                  countTextSize={11}
                  countColor={manualGradientColors.homeDarkColor}
                /> 
              </View>
            </View>
          )}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    alignContent: "center",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  textContainer: {
    zIndex: 5,
    flexDirection: "column",
    width: "70%",
    flexWrap: "wrap",
    height: "100%",
    justifyContent: "center",
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

export default SelectedFriendHome;
