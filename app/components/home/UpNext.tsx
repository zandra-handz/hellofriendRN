import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import manualGradientColors from "@/src/hooks/StaticColors";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
type Props = {
  upcomingHelloes: object[];
  onPress: () => void;
};

const UpNext = ({ upcomingHelloes, onPress }: Props) => {
  const HEADER = `Up next`;
  const HEIGHT = 200;
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  if (!upcomingHelloes) {
    return <View style={{ width: "100%", height: HEIGHT }}></View>;
  }
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{ width: "100%", height: 200  }}
    >
      <Pressable onPress={onPress} style={[styles.textContainer]}>
        <Text
          style={[
            subWelcomeTextStyle,
            {
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 26,
              paddingLeft: 4,
              color: manualGradientColors.homeDarkColor,
            },
          ]}
        >
          {HEADER}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            welcomeTextStyle,
            {
              fontSize: 40,
              lineHeight: 50,
              color: manualGradientColors.homeDarkColor,
              marginBottom: 10,
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
              lineHeight: 32,
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
  );
};

const styles = StyleSheet.create({
  textContainer: {
    zIndex: 5,
    position: "absolute",
    width: "78%",

    flexWrap: "flex",
    flexDirection: "column",
    height: "100%",
    paddingVertical: 10,
    paddingBottom: 30,

    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default UpNext;
