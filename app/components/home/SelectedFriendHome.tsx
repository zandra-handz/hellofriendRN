import React, { useRef } from "react";

import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  DimensionValue,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import LoadingPage from "../appwide/spinner/LoadingPage";
import FriendHeaderMessageUI from "./FriendHeaderMessageUI";
import CalendarChart from "./CalendarChart";
import TalkingPointsChart from "./TalkingPointsChart";
import Pics from "./Pics";
import Helloes from "./Helloes";
import SuggestedHello from "./SuggestedHello";

interface SelectedFriendHomeProps {
  borderRadius: DimensionValue;
  borderColor: string;
}

const SelectedFriendHome: React.FC<SelectedFriendHomeProps> = ({
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const { themeStyleSpinners, themeStyles, appFontStyles } = useGlobalStyle();

  const headerRef = useRef(null);
  const handleScroll = (event) => {
    if (!headerRef.current) return;

    headerRef.current.measure((x, y, width, height, pageX, pageY) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      const isVisibleNow = pageY - scrollY >= 0;
      if (isVisibleNow !== true) {
        smallHeaderVisibility.value = withTiming(1, { duration: 300 });
      } else {
        smallHeaderVisibility.value = withTiming(0, { duration: 20 });
      }
    });
  };

  const smallHeaderVisibility = useSharedValue(0);

  const smallHeaderAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: smallHeaderVisibility.value,
    };
  });

  const PADDING_HORIZONTAL = 4;

  const spacerAroundCalendar = 10;
  const {
    selectedFriend,
    friendLoaded,

    isPending,
    isLoading,
    loadingNewFriend,
  } = useSelectedFriend();

  const SELECTED_FRIEND_CARD_HEIGHT = 120;
  const SELECTED_FRIEND_CARD_MARGIN_TOP = 0;
  const SELECTED_FRIEND_CARD_PADDING = 20;

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: SELECTED_FRIEND_CARD_MARGIN_TOP,
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
              width: "100%",
              alignItems: "center",
              paddingBottom: 0,
            }}
          >
            <Animated.View
              style={[
                smallHeaderAnimationStyle,
                {
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  height: "auto",
                  padding: 6,
                  backgroundColor:
                    themeStyles.primaryBackground.backgroundColor,
                  zIndex: 5000,
                  elevation: 5000,
                },
              ]}
            >
              <Text
                style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}
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
              contentContainerStyle={{
                paddingHorizontal: 0,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, width: "100%" }} ref={headerRef}>
                <FriendHeaderMessageUI
                  backgroundColor={
                    themeStyles.primaryBackground.backgroundColor
                  }
                  borderBottomLeftRadius={0}
                  borderBottomRightRadius={0}
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

                <View style={{ width: "100%", marginVertical: 3 }}>
                  <Helloes
                    selectedFriend={!!selectedFriend}
                    outerPadding={spacerAroundCalendar}
                  />
                </View>
      

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
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectedFriendHome;
