import React from "react";
import { View } from "react-native";
import AllHome from "./AllHome";
import SelectedFriendHome from "./SelectedFriendHome";
import manualGradientColors  from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import Animated, {
  SharedValue,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

interface BelowKeyboardComponentsProps {
  userId: number;
  friendListLength: number;
  onPress: () => void;
}

const BelowKeyboardComponents: React.FC<BelowKeyboardComponentsProps> = ({
  userId,

  isLoading,

  friendStyle,
  primaryColor,
  primaryBackgroundColor,
  primaryOverlayColor,
  darkerOverlayBackgroundColor,
lighterOverlayBackgroundColor,
  spinnerStyle,
  // loadingDash,
  // friendDash,
  selectedFriendId,
  selectedFriendName,
  friendListLength,
  onPress,
}) => {
  const { friendDash, loadingDash } = useFriendDash();
  const { themeAheadOfLoading, getThemeAheadOfLoading } = useFriendStyle();
 
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={[
        {
          alignItems: "center",
          flex: 1,
          width: "100%",
        },
      ]}
    >
      {!selectedFriendId && friendListLength > 0 && (
        <View style={{ height: "100%" }}>
          <AllHome
          lighterOverlayColor={lighterOverlayBackgroundColor}
          darkerOverlayColor={darkerOverlayBackgroundColor}
            isLoading={isLoading}
            getThemeAheadOfLoading={getThemeAheadOfLoading}
            onPress={onPress}
            borderRadius={10}
            height={"100%"}  
            primaryColor={primaryColor}
            overlayColor={primaryOverlayColor}
            primaryBackground={primaryBackgroundColor}
            // borderColor="black"
          />
        </View>
      )}
      {selectedFriendId && (
        <View style={{ height: "100%" }}>
          <SelectedFriendHome
            userId={userId} 
            friendStyle={friendStyle}
            primaryColor={primaryColor} 
            primaryOverlayColor={primaryOverlayColor}
            primaryBackgroundColor={primaryBackgroundColor}
            darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
            themeAheadOfLoading={themeAheadOfLoading}
            spinnerStyle={spinnerStyle}
            loadingDash={loadingDash}
            friendDash={friendDash}
            selectedFriendId={selectedFriendId}
            selectedFriendName={selectedFriendName}
            onPress={onPress}
     
            height={"100%"}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default BelowKeyboardComponents;
