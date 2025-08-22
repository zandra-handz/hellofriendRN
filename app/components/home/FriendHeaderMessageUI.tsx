import {  Pressable } from "react-native";
import React from "react";
 
 
import Animated, {
 
  FadeOut,
  FadeIn, 
} from "react-native-reanimated";

interface FriendHeaderMessageUIProps {
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  backgroundColor: string;
  selectedFriendName: string;
  loadingNewFriend: boolean;
  // isKeyboardVisible: boolean; // indirect condition to change message to friend picker
  onPress: () => void; // see WelcomeMessageUI for explanation; this component is the same
}

const FriendHeaderMessageUI: React.FC<FriendHeaderMessageUIProps> = ({
  primaryColor,
  welcomeTextStyle, 
  backgroundColor='red',
  selectedFriendName='',
  loadingNewFriend=false,
  
  onPress,
}) => {
  

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
 
  const message = `${selectedFriendName}`;
  const compositionMessage = `Talking point for ${selectedFriendName}`;

  return (
    <AnimatedPressable
      onPress={onPress}
      hitSlop={10}
      pressRetentionOffset={10}
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        {
          backgroundColor: backgroundColor, 
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
          height: 'auto', 
          padding: 10, 
          paddingTop: 0,
          paddingBottom: 20,
        },
      ]}
    >
      <Animated.Text
        style={[
          welcomeTextStyle,
          {
            color: primaryColor,
            fontSize: 28,
            lineHeight: 38,
          },
        ]}
      >
        {selectedFriendName && !loadingNewFriend  
          ? message
          : selectedFriendName && !loadingNewFriend 
            ? compositionMessage
            : ""}{" "}
  
      </Animated.Text>
    </AnimatedPressable>
  );
};

export default FriendHeaderMessageUI;
