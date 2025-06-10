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
  FadeIn,
  ZoomInEasyUp,
} from "react-native-reanimated";

interface FriendHeaderMessageUIProps {
  isKeyboardVisible: boolean; // indirect condition to change message to friend picker
}

const FriendHeaderMessageUI: React.FC<FriendHeaderMessageUIProps> = ({
  isKeyboardVisible = false,
}) => {
  const { themeStyles,   appFontStyles } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const friendModalButtonHeight = 16;
  const message = `Selected: ${selectedFriend.name}`;
  const compositionMessage = `Talking point for ${selectedFriend.name}`;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        {
          //alignItems: "center",
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
          padding: 10,
          paddingTop: 35,
          paddingBottom: 35,
        },
      ]}
    >
      <Animated.Text
        style={[
          appFontStyles.welcomeText,
          { color: themeStyles.primaryText.color },
        ]}
      >
        {selectedFriend && !loadingNewFriend && !isKeyboardVisible
          ? message
          : selectedFriend && !loadingNewFriend && isKeyboardVisible
            ? compositionMessage
            : ""}{" "} 
        <View
          style={{
            height: appFontStyles.welcomeText.fontSize,
            width: "auto", 
          }}
        >
          <FriendModalIntegrator
            includeLabel={true}
            height={appFontStyles.welcomeText.fontSize}
            iconSize={friendModalButtonHeight}
            customLabel={"Pick friend"}
            customFontStyle={appFontStyles.subWelcomeText}
            navigationDisabled={true}
            useGenericTextColor={true}
          />
        </View>
     
      </Animated.Text>
    </Animated.View>
  );
};

export default FriendHeaderMessageUI;
