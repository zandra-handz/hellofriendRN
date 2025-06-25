import { View, Pressable } from "react-native";
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
onPress: () => void; // see WelcomeMessageUI for explanation; this component is the same
}

const FriendHeaderMessageUI: React.FC<FriendHeaderMessageUIProps> = ({
  isKeyboardVisible = false,
  onPress,
}) => {
  const { themeStyles,   appFontStyles } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

      const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  

  const friendModalButtonHeight = 16;
  const message = `Selected: ${selectedFriend.name}`;
  const compositionMessage = `Talking point for ${selectedFriend.name}`;

  return (
    <AnimatedPressable
    onPress={onPress}
      hitSlop={10}
  pressRetentionOffset={10}
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        {
          //alignItems: "center",
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
          padding: 10,
          minHeight: 168,
          paddingTop: 15,
          paddingBottom: 15,
        },
      ]}
    >
      <Animated.Text
        style={[
          appFontStyles.welcomeText,
            { color: themeStyles.primaryText.color, fontSize: 46, lineHeight: 48, },
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
    </AnimatedPressable>
  );
};

export default FriendHeaderMessageUI;
