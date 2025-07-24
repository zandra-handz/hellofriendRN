import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  SlideInLeft,
  FadeOut,
  ZoomInEasyUp,
} from "react-native-reanimated";

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
  username = "",
  isNewUser = false,
  borderBottomRightRadius = 10,
  borderBottomLeftRadius = 10,
  backgroundColor = "red",
  //isKeyboardVisible = false,
  onPress = () => {},
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();

  const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

  const message = isNewUser
    ? `Hi ${username}! Welcome to hellofriend!`
    : `Hi ${username}! What would you like to do?`;

  const compositionMessage = selectedFriend
    ? `Talking point for ${selectedFriend.name}`
    : `Who is this talking point for?`;

  const friendModalButtonHeight = 20;

  return (
    <AnimatedPressable
      onPress={onPress}
      layout={SlideInLeft}
      // entering={ZoomInEasyUp}
      // exiting={FadeOut}
      style={[
        {
          backgroundColor: backgroundColor,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
          padding: 10,
          paddingTop: 10, // same as friend message
          paddingBottom: 10, // same as friend message
          flexDirection: "row",
          justifyContent: "flex-start",
        },
      ]}
    >
      <>
        <Animated.Text
          style={[
            appFontStyles.welcomeText,
            {
              color: themeStyles.primaryText.color,
              fontSize: 46,
              lineHeight: 48,
            },
          ]}
        >
          {message}
          <View
            style={{
              height: appFontStyles.welcomeText.fontSize - 2,
              opacity: 0.6,
            }}
          >
            <FriendModalIntegrator
              includeLabel={true}
              height={"100%"}
              iconSize={appFontStyles.subWelcomeText.fontSize + 4}
              customLabel={"Pick friend"}
              customFontStyle={appFontStyles.subWelcomeText}
              navigationDisabled={true}
              useGenericTextColor={true}
            />
          </View>
        </Animated.Text>
      </>
    </AnimatedPressable>
  );
};

//export default WelcomeMessageUI;

export default React.memo(WelcomeMessageUI);
