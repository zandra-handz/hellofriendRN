import React, { useMemo, useRef, useState, useEffect } from "react";

import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ScrollView,
  DimensionValue,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import FriendHeaderMessageUI from "./FriendHeaderMessageUI";
import CalendarChart from "./CalendarChart";
import TalkingPointsChart from "./TalkingPointsChart";
import Pics from "./Pics";
import SuggestedHello from "./SuggestedHello";
import useHelloesManips from "@/src/hooks/useHelloesManips";
import { useHelloes } from "@/src/context/HelloesContext";

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

      const { helloesList } = useHelloes();


     const reversedHelloesList = Array.isArray(helloesList) ? [...helloesList].reverse() : [];
      const { helloesListMonthYear, monthsInRange } = useHelloesManips({helloesData: reversedHelloesList});
    
         
    const combineMonthRangeAndHelloesDates = (months, helloes) => {
    if (months && helloes) {
      // console.warn(helloes);
      return months.map((month) => {
        const helloData =
          helloes.find((hello) => hello.monthYear === month.monthYear) || null;
  
        return {
          monthData: month,
          helloData,
        };
      });
    }
    return []; // Return an empty array if months or helloes is undefined/null
  };

        const combinedData = useMemo(() => {
          if (monthsInRange && helloesListMonthYear) {
            return (
              combineMonthRangeAndHelloesDates(monthsInRange, helloesListMonthYear)
            )
          }
      
        }, [monthsInRange, helloesListMonthYear]);
      

  const headerRef = useRef(null); 
  const handleScroll = (event) => {
    if (!headerRef.current) return;

    headerRef.current.measure((x, y, width, height, pageX, pageY) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      const isVisibleNow = pageY - scrollY >= 0;
      if (isVisibleNow !== true) {
        smallHeaderVisibility.value = withTiming(1, {duration: 300});
      //   setIsHeaderVisible(isVisibleNow);
      } else {
          smallHeaderVisibility.value = withTiming(0, {duration: 20});
      }
    });
  };

  const smallHeaderVisibility = useSharedValue(0);

  const smallHeaderAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: smallHeaderVisibility.value,
    }

  });

  // useEffect(() => {
  //   if (!isHeaderVisible) {
  //     console.log("Header scrolled out of view");
  //     // trigger animation, collapse UI, etc.
  //   }
  // }, [isHeaderVisible]);



  const PADDING_HORIZONTAL = 4;

  const spacerAroundCalendar = 10;
  //friendLoaded = dashboard data retrieved successfully
  const {
    selectedFriend,
    friendLoaded,
 
    isPending,
    isLoading,
    loadingNewFriend,
  } = useSelectedFriend();

  const DOUBLE_PRESS_DELAY = 300;

  const lastPress = useRef(0);
  const pressTimeout = useRef(null);

  const SELECTED_FRIEND_CARD_HEIGHT = 120;
  // const SELECTED_FRIEND_CARD_MARGIN_TOP = 194;
  const SELECTED_FRIEND_CARD_MARGIN_TOP = 0;
  const SELECTED_FRIEND_CARD_PADDING = 20;

  const MemoCalendarChart = React.memo(CalendarChart);
  const MemoTalkingPointsChart = React.memo(TalkingPointsChart);
  const MemoPics = React.memo(Pics);
 

  const navigateToMoments = () => {
    navigation.navigate("Moments", { scrollTo: null });
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
          // borderRadius: borderRadius,
          borderColor: borderColor,
          paddingHorizontal: 0,
        },
      ]}
    >
      <View
        style={{
          zIndex: 30000,

          height: "100%",
          width: "100%",
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
              paddingBottom: 0, // change this to change were the bottom fadingEdge of scrollview starts
            }}
          >
            {/* {!isHeaderVisible && ( */}
        
              <Animated.View
                // entering={FadeIn.duration(200)}
                // exiting={FadeOut.duration(200)}
                style={[smallHeaderAnimationStyle, {
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  height: "auto",
                  padding: 6,
                  backgroundColor:
                    themeStyles.primaryBackground.backgroundColor,
                  zIndex: 5000,
                  elevation: 5000,
                }]}
              >
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.subWelcomeText,
                  ]}
                >
                  {selectedFriend.name}
                </Text>
              </Animated.View>
            {/* )} */}
            <ScrollView
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%" }}
              // fadingEdgeLength={30}
              contentContainerStyle={{
                paddingHorizontal: 0,
                alignItems: "center", // optional
              }}
            >
              <View style={{ flex: 1, width: "100%" }} ref={headerRef}>
                <FriendHeaderMessageUI
                  backgroundColor={
                    themeStyles.primaryBackground.backgroundColor
                  }
                  borderBottomLeftRadius={0}
                  borderBottomRightRadius={0}
                  // isKeyboardVisible={isKeyboardVisible}
                  onPress={() => console.log("nada!")}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: PADDING_HORIZONTAL,
                  flexDirection: "column",
                  flex: 1,
                  width: "100%",
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
                  <SuggestedHello
                    padding={SELECTED_FRIEND_CARD_PADDING}
                    height={SELECTED_FRIEND_CARD_HEIGHT}
                    borderRadius={borderRadius}
                  />
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

                {!loadingNewFriend && combinedData && (
                  <View style={{ marginVertical: 3 }}>
                    <CalendarChart
                    combinedData={combinedData}
                    // selectedFriend={!!selectedFriend}
                    // outerPadding={spacerAroundCalendar}
                    />
                  </View>
                )}

                <View style={{ width: "100%", height: 130 }}></View>
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
    padding: 0,
    minHeight: 190,
    height: "100%",
    alignContent: "center",

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
