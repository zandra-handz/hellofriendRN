import { View, Pressable, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import Animated, { SlideInLeft } from "react-native-reanimated";

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
  friendId,
  friendName,
  themeColors, 
  paddingHorizontal = 10,
  username = "",
  isNewUser = false,
  borderBottomRightRadius = 10,
  borderBottomLeftRadius = 10,
  backgroundColor = "red",
  isKeyboardVisible = false,
  onPress = () => {},
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    {/* <SvgIcon
    name={'moon_waning_crescent'}
    size={1000}
    color={backgroundColor}
    style={styles.crescentMoon}
    /> */}
            <View
              style={[
                {
                  height: 275,
                  width: "100%",
                  top: -100,
                  alignSelf: "center",
                  position: "absolute",
                  backgroundColor: backgroundColor,
                },
              ]}
            ></View>
    
    <AnimatedPressable
      onPress={onPress}
      layout={SlideInLeft}
      style={[
        {
        backgroundColor: isKeyboardVisible ? "transparent" : backgroundColor,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
          paddingHorizontal: paddingHorizontal,
          height: isKeyboardVisible ? 80 : 200,
        },
        styles.container,
      ]}
    >
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

              // backgroundColor: isKeyboardVisible
              //   ? "transparent"
              //   : "rgba(0,0,0,0.8)", // semi-transparent background
            },
          ]}
        >
          {conditionalMessage}{" "}
          <View style={styles.wrapper}>
            {!isKeyboardVisible && (
              <FriendModalIntegrator
              userId={userId}
              friendId={friendId}

                includeLabel={true}
                height={"100%"}
                friendId={friendId}
                friendName={friendName}
                primaryColor={primaryColor}
                themeColors={themeColors} 
                iconSize={18} //subWelcomeTextStyle.fontSize + 4
                customLabel={"Pick friend"}
                navigationDisabled={true}
                useGenericTextColor={true}
              />
            )}
          </View>
        </Animated.Text>
      </>
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
    crescentMoon: {
    position: "absolute",
    top: -190,
    left: -293,
    // opacity: 0.5,
    transform: [{ rotate: "270deg" }, { scaleX: -1 }],
           shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 7,
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
