import { View, Text } from "react-native";
import React from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
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
}

const WelcomeMessageUI: React.FC<WelcomeMessageUIProps> = ({
  username = "",
  isNewUser = false,
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
 
  const message = isNewUser
    ? `Hi ${username}! Welcome to hellofriend!`
    : `Welcome back, ${username}!`;
  const friendSelectedMessage = `Selected: ${selectedFriend?.name}`;

  return (
    <Animated.View
      entering={ZoomInEasyUp}
      exiting={FadeOut}
      style={{
        //alignItems: "center",
        alignText: "flex-start",
        flexWrap: "flex",
        width: "60%",
      }}
    >
      {selectedFriend && !loadingNewFriend && (
        <Animated.Text
          style={[themeStyles.primaryText, appFontStyles.welcomeText]}
        >
          {friendSelectedMessage}
        </Animated.Text>
      )}

      {!selectedFriend && (
        <Animated.Text
          style={[themeStyles.primaryText, appFontStyles.welcomeText]}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export default WelcomeMessageUI;
