import { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, View, DimensionValue } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import LoadedMoments from "../buttons/moments/LoadedMoments";
import LoadedImages from "../buttons/images/LoadedImages";
 
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
 
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScrollSoon from "./HomeScrollSoon";

interface SelectedFriendHomeProps {
  borderRadius: DimensionValue,
  borderColor: string;
}

const SelectedFriendHome: React.FC<SelectedFriendHomeProps> = ({
 
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const navigation = useNavigation();
  const { themeStyleSpinners, manualGradientColors, themeStyles, appFontStyles } =
    useGlobalStyle(); 
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
    const SELECTED_FRIEND_CARD_MARGIN_TOP = 194;
    const SELECTED_FRIEND_CARD_PADDING = 10; 

  const navigateToMoments = () => {
    navigation.navigate("Moments");
  }; 

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
          },
        ]}
      >
        <View style={[{ paddingHorizontal: 10, borderRadius: 20 }]}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              // backgroundColor: 'orange',
               marginBottom: spacerAroundCalendar,
              
            }}
          >
            <View style={{flexDirection: 'row'}}> 
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={20}
              color={themeStyles.primaryBackground.backgroundColor}
              style={{ marginBottom: 0 }}
            />
            <Text
              style={[
                manualGradientColors.homeDarkColor,
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
            label="View"
            opacity={.7}
            onPress={() => navigation.navigate("Helloes")}
            />
            
          </View>
          {selectedFriend && (
            <HomeScrollCalendarLights
              height={70}
              borderRadius={20}
              borderColor="black"
            />
          )}
          <View style={{width: '100%', height: 10}}></View>
          {/* <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: 'pink',
              marginTop: spacerAroundCalendar,
              marginBottom: 10, // place this spacing elsewhere
            }}
          >
            <LabeledArrowButton
            label="View"
            onPress={() => navigation.navigate("Helloes")}/>

         
          </View> */}
        </View>
        <View style={{ width: "100%",   height: SELECTED_FRIEND_CARD_HEIGHT }}>
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
               // backgroundColor: 'orange',
                padding: SELECTED_FRIEND_CARD_PADDING,
                width: "100%",
              }}
            > 
              <View style={styles.textContainer}>
                <TouchableOpacity onPress={onPress}>
                  <>
                    <>
                      <Text
                        style={[
                          {
                            fontFamily: "Poppins-Regular", 
                            fontSize: appFontStyles.welcomeText.fontSize - 4,
                            fontColor: manualGradientColors.homeDarkColor,
                         
                          },
                        ]}
                      >
                        {selectedFriend && friendDashboardData
                          ?  
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
                  width: '13%',
                  alignItems: "center",
                  alignContent: "center",
                  flexDirection: "column",
                  justifyContent: "space-between",  
            
                }}
              >
                <LoadedMoments
                  height={"40%"}  
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
                <LoadedImages
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
    flexWrap: 'wrap', 
    height: "100%",
    justifyContent: "flex-start",  
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
