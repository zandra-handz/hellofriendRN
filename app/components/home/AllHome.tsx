import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { appFontStyles } from "@/src/hooks/StaticFonts";
import GeckoSvg from "@/app/assets/svgs/gecko-solid.svg";
import HomeScrollSoon from "./HomeScrollSoon";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import Animated, {
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
  SlideOutRight,
} from "react-native-reanimated";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useFriendList } from "@/src/context/FriendListContext";

// Press function is internal
const AllHome = ({
  isLoading,
  getThemeAheadOfLoading,
  header = "Up next",
  height = "100%",
  borderRadius = 20,
  borderColor = "transparent",
  primaryColor,
  overlayColor,
}) => {
  const { friendList } = useFriendList();
  const { upcomingHelloes } = useUpcomingHelloes();
  const { selectFriend } = useSelectedFriend();

  const welcomeTextStyle = appFontStyles.welcomeText;
  const subWelcomeTextStyle = appFontStyles.subWelcomeText;

  const onPress = () => {
    const { id, name } = upcomingHelloes[0].friend;
    const selectedFriend = id === null ? null : { id: id, name: name };
    selectFriend(selectedFriend);
    const friend = friendList.find((friend) => friend.id === id);
    getThemeAheadOfLoading(friend);
  };

  console.log("hombutton rerendered");

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
              <Text
                style={[
                  subWelcomeTextStyle,
                  { fontSize: 20, color: manualGradientColors.homeDarkColor },
                ]}
              >
                {header}
              </Text>

              <Text
                style={[
                  welcomeTextStyle,
                  {
                    fontSize: 33,
                    lineHeight: 60,
                    color: manualGradientColors.homeDarkColor,
                  },
                ]}
              >
                {upcomingHelloes &&
                // friendList?.length > 0 &&

                upcomingHelloes[0]
                  ? upcomingHelloes[0].friend.name
                  : "Please add a friend to use this feature!"}
              </Text>

              <Text
                style={[
                  styles.subtitleText,
                  subWelcomeTextStyle,
                  {
                    fontSize: 22,
                    lineHeight: 26,
                    // marginTop: 20,
                    color: manualGradientColors.homeDarkColor,
                  },
                ]}
              >
                Say hi on{" "}
                {upcomingHelloes && upcomingHelloes[0]
                  ? upcomingHelloes[0].future_date_in_words
                  : ""}
                !
              </Text>
            </Pressable>
          </Animated.View>

          <View style={{width: '100%', height: 400}}>
            <Animated.View
              entering={SlideInDown.delay(100)}
              exiting={SlideOutDown}
              style={{
                zIndex: 3,
                flex: 1,
                // height: "100%",
                // height: 400,
                width: "100%",
               // backgroundColor: "pink",
              }}
            >
              <HomeScrollSoon
                upcomingHelloes={upcomingHelloes}
                isLoading={isLoading}
                getThemeAheadOfLoading={getThemeAheadOfLoading}
                selectFriend={selectFriend}
                friendList={friendList}
                primaryColor={primaryColor}
                overlayColor={overlayColor}
                manualGradientColors={manualGradientColors}
                height={"100%"}
                maxHeight={700}
                borderRadius={10}
                borderColor="black"
              />
            </Animated.View>
          </View>
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
    width: "78%",

    flexWrap: "flex",
    flexDirection: "column",

    justifyContent: "space-around",
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

export default AllHome;
