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
    : `Hi ${username}! Who will you say hi to next?`;
  const friendSelectedMessage = `${selectedFriend?.name}`;

  return (
    <Animated.View
      entering={ZoomInEasyUp}
      exiting={FadeOut}
      style={[  {
        //alignItems: "center",
        alignText: "center",
        flexWrap: "flex",
        width: "100%", 
        padding: 10,
        paddingTop: 40,
        paddingBottom: 40,
      }]}
    >
      {selectedFriend && !loadingNewFriend && (
        <>
                <Animated.Text
          style={[  appFontStyles.welcomeText, { color: themeStyles.primaryText.color}]}
        >
          Selected:
        </Animated.Text>
        <Animated.Text
          style={[  appFontStyles.welcomeText, { color: themeStyles.primaryText.color}]}
        >
          {friendSelectedMessage}
        </Animated.Text>
        </>
      )}

      {!selectedFriend && (
        <Animated.Text
     style={[  appFontStyles.welcomeText, { color: themeStyles.primaryText.color}]}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export default WelcomeMessageUI;
