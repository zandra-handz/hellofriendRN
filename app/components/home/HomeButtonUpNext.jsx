import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
// import { useFriendStyle } from "@/src/context/FriendStyleContext";

import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";
import HomeScrollSoon from "./HomeScrollSoon";
import Animated, {
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
  SlideOutRight,
} from "react-native-reanimated";

// Press function is internal
const HomeButtonUpNext = ({
  upcomingHelloes,
  isLoading,
  getThemeAheadOfLoading,
  friendList,
  header = "Up next",
  height = "100%",
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  // const { getThemeAheadOfLoading } = useFriendStyle();
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  const { setFriend, selectFriend } = useSelectedFriend();

  const onPress = () => {
    const { id, name } = upcomingHelloes[0].friend;
    const selectedFriend = id === null ? null : { id: id, name: name };
    setFriend(selectedFriend);
    const friend = friendList.find((friend) => friend.id === id);
    getThemeAheadOfLoading(friend);
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
        },
      ]}
    >
      {upcomingHelloes && ( //used tp be isLoading
        <View
          style={{
            height: "100%",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: 10,
          }}
        >
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{ width: "100%", height: 200 }}
          >
            <Pressable onPress={onPress} style={[styles.textContainer]}>
              <Text style={[styles.headerText, appFontStyles.welcomeText]}>
                {header}
              </Text>

              <Text
                style={[
                  appFontStyles.welcomeText,
                  {
                    color: themeStyles.primaryBackground.backgroundColor,
                  },
                ]}
              >
                {upcomingHelloes &&
                // friendList?.length > 0 &&

                upcomingHelloes[0]
                  ? upcomingHelloes[0].friend.name
                  : "Please add a friend to use this feature!"}
              </Text>

              <Text style={[styles.subtitleText, appFontStyles.subWelcomeText]}>
                Say hi on{" "}
                {upcomingHelloes && upcomingHelloes[0]
                  ? upcomingHelloes[0].future_date_in_words
                  : ""}
                !
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={SlideInDown.delay(100)}
            exiting={SlideOutDown}
            style={{
              zIndex: 30000,
              height: "100%",
              width: "100%",
            }}
          >
            <HomeScrollSoon
              upcomingHelloes={upcomingHelloes}
              isLoading={isLoading}
              getThemeAheadOfLoading={getThemeAheadOfLoading}
              setFriend={setFriend}
              selectFriend={selectFriend}
              friendList={friendList}
              themeStyles={themeStyles}
              manualGradientColors={manualGradientColors}
              height={"100%"}
              maxHeight={700}
              borderRadius={10}
              borderColor="black"
            />
          </Animated.View>
          <Animated.View
            entering={FadeIn}
            exiting={SlideOutRight}
            style={{
              position: "absolute",
              right: -56,
              top: 0,
              transform: [{ rotate: "180deg" }],
            }}
          >
            <GeckoSvg
              color={manualGradientColors.homeDarkColor}
              width={200}
              height={200}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 0,
    minHeight: 190,
    alignContent: "center",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  loadingWrapper: {
    flex: 1,
    width: "100%",
  },
  textContainer: {
    zIndex: 5,
    position: "absolute",
    width: "82%",

    flexDirection: "column",

    justifyContent: "space-around",
  },
  headerText: {
    // fontFamily: "Poppins-Regular",
    // fontWeight: "bold",
    // fontSize: 20,
  },
  subtitleText: {
    fontFamily: "Poppins-Regular",

    fontSize: 16,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeButtonUpNext;
