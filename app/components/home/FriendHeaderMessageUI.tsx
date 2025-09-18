import { Pressable, View } from "react-native";
import React from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import manualGradientColors from "@/src/hooks/StaticColors";
import Animated, { FadeOut, FadeIn, SlideInDown } from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { Vibration } from "react-native";
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
  backgroundColor = "red",
  selectedFriendName = "",
  loadingNewFriend = false,
 cardBackgroundColor,

  // onPress,
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const { navigateToSelectFriend } = useAppNavigations();

  const handleOnLongPress = () => {
        Vibration.vibrate(100); 
    navigateToSelectFriend();

  };

  const message = `${selectedFriendName}`;

  return (
    <GlobalPressable
    onLongPress={handleOnLongPress}
      entering={SlideInDown}
      exiting={FadeOut}
      style={[
        {
          backgroundColor: backgroundColor,
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
        
          marginBottom: 2,
          borderRadius: 4,
          paddingTop: 0, // same as friend message
          paddingBottom: 0, // same as friend message
          flexDirection: "row",
          justifyContent: "flex-start",
          backgroundColor: "transparent",

          minHeight:  150,
          height: 'auto',
        },
      ]}
    >
      <View
        style={{
         paddingTop: 50,
          paddingBottom: 30,
          width: "100%",
          height: "100%",
          flexWrap: "flex",
          borderRadius: 10,
          paddingHorizontal: 8,
          justifyContent: "center",
          paddingHorizontal: 20,
          backgroundColor: cardBackgroundColor, // semi-transparent background
        }}
      >
        <Animated.Text
          numberOfLines={2}
          style={[
            welcomeTextStyle,
            {
              color: primaryColor,
              width: "100%",
              //  color: backgroundColor,
              fontSize: 40,
              lineHeight: 48,
            },
          ]}
        >
          {selectedFriendName && !loadingNewFriend && message}
        </Animated.Text>
      </View>
    </GlobalPressable>
  );
};

export default FriendHeaderMessageUI;
