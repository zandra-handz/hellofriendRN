import { View, Pressable, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import Animated, { SlideInUp } from "react-native-reanimated";
import SuggestedActions from "./SuggestedActions";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SvgIcon from "@/app/styles/SvgIcons";
interface WelcomeMessageUIProps {
  username: string;
  isNewUser: boolean; // in parent: {new Date(user?.user?.created_on).toDateString() === new Date().toDateString()
  isKeyboardVisible: boolean; // indirect condition to change message to friend picker
  onPress: () => void; // because i have turned this component into a focus moment text button
  // in order to let it fill as much space as possible while still being under the friend picker
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  backgroundColor: string;
}

const WelcomeMessageUI: React.FC<WelcomeMessageUIProps> = ({
  userId,
  primaryColor,
  primaryBackground,
  friendId,
  friendName,
  themeColors,
  paddingHorizontal = 10,
  darkerGlassBackground,
  username = "",
  isNewUser = false,
  borderBottomRightRadius = 10,
  borderBottomLeftRadius = 10,
  backgroundColor = "red",
  isKeyboardVisible = false,
  onPress = () => {},
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  // const SELECTED_FRIEND_CARD_PADDING = 20;
  const SELECTED_FRIEND_CARD_PADDING = 30;
  const message = isNewUser
    ? `Hi ${username}! Welcome to hellofriend!`
    : `Welcome back ${username}!`;

  const conditionalMessage = useMemo(() => {
    if (isKeyboardVisible) {
      return `Write an idea:`;
    } else {
      return message;
    }
  }, [message, isKeyboardVisible]);

  return (
    <>
    {!isKeyboardVisible && (

      <View
        style={[styles.absoluteColorSquareContainer,
          { 
            backgroundColor: darkerGlassBackground,
          },
        ]}
      ></View>
            
    )}

      <AnimatedPressable
        onPress={onPress}
        layout={SlideInUp}
        style={[
          {
            backgroundColor: isKeyboardVisible
              ? "transparent"
              : backgroundColor,
            borderBottomLeftRadius: borderBottomLeftRadius,
            borderBottomRightRadius: borderBottomRightRadius,
            paddingHorizontal: paddingHorizontal,
            height: isKeyboardVisible ? 80 : 200,
          },
          styles.container,
        ]}
      >
        {!isKeyboardVisible && (
          <View style={{ width: "100%", alignItems: "center" }}>
            <SvgIcon name={"leaf"} color={primaryColor} size={100} />
          </View>
        )}
        <SvgIcon
          name={"leaf"}
          size={1200}
          color={manualGradientColors.homeDarkColor}
          style={styles.leaf}
        />
        <>
          <Animated.Text
            style={[
              AppFontStyles.welcomeText,
              styles.label,
              {
                paddingTop: isKeyboardVisible ? 0 : 40,
                color: primaryColor,
              },
            ]}
          >
            {conditionalMessage}
            <View style={styles.wrapper}></View>
          </Animated.Text>
        </>
        {!isKeyboardVisible && (
          <View style={{ width: "100%", position: "absolute", bottom: -46 }}>
            <SuggestedActions
              darkerGlassBackground={darkerGlassBackground}
              primaryColor={primaryColor}
              primaryBackground={primaryBackground}
              padding={SELECTED_FRIEND_CARD_PADDING}
            />
          </View>
        )}
      </AnimatedPressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignText: "center",
    flexWrap: "flex",
    width: "100%",
    //  position: isKeyboardVisible ? "absolute" : "relative",

    zindex: 400000,
    elevation: 400000,
    paddingTop: 10, // same as friend message
    paddingBottom: 10, // same as friend message
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  absoluteColorSquareContainer: {
    // height: 275,
        height: 700,
    width: "140%",
    width: 700,
    top: -406,
    alignSelf: "center",
    position: "absolute",
    opacity: 1,
        shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 999,
  },

  leaf: {
    position: "absolute",
    top: -750,
    left: -470,
    opacity: 0.5,
    transform: [{ rotate: "200deg" }, { scaleX: -1 }],
  },
  label: {
    borderRadius: 8,
    paddingHorizontal: 20,
    zindex: 400000,
    elevation: 400000,
    fontSize: 38,
    lineHeight: 48,
  },
  wrapper: {
    height: 30,
    opacity: 0.6,
  },
});

export default React.memo(WelcomeMessageUI);
