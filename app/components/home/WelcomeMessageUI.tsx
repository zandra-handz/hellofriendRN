import { View, Text } from "react-native";
import React from "react";
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
}

const WelcomeMessageUI: React.FC<WelcomeMessageUIProps> = ({
  username = "",
  isNewUser = false,
  isKeyboardVisible = false,
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const message = isNewUser
    ? `Hi ${username}! Welcome to hellofriend!`
    : `Hi ${username}! Who will you say hi to next?`;
  const friendSelectedMessage = `${selectedFriend?.name}`;

  const compositionMessage = selectedFriend
    ? `Talking point for ${selectedFriend.name}`
    : `Who is this talking point for?`;

  const friendModalButtonHeight = 20;

  return (
    <Animated.View
      entering={ZoomInEasyUp}
      exiting={FadeOut}
      style={[
        {
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
          padding: 10,
          paddingTop: 40,
          paddingBottom: 40,
          flexDirection: "row",
          justifyContent: "flex-start",
        },
      ]}
    >
      <>
        <Animated.Text
          style={[
            appFontStyles.welcomeText,
            { color: themeStyles.primaryText.color },
          ]}
        >
          {!selectedFriend && isKeyboardVisible
            ? compositionMessage
            : !selectedFriend && !isKeyboardVisible
              ? message
              : ""}{"  "}
          <View
            style={{
              height: appFontStyles.welcomeText.fontSize - 2,
              opacity: .6,
             
              
            }}
          >
            <FriendModalIntegrator
              includeLabel={true}
              height={'100%'}
              iconSize={appFontStyles.subWelcomeText.fontSize + 4}
              customLabel={"Pick friend"}
              customFontStyle={appFontStyles.subWelcomeText}
              navigationDisabled={true}
               useGenericTextColor={true}
            />
          </View>
        </Animated.Text>
      </>
    </Animated.View>
  );
};

export default WelcomeMessageUI;
