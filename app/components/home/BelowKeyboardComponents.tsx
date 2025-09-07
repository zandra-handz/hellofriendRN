import React from "react";
import { View } from "react-native";
import HomeButtonUpNext from "./HomeButtonUpNext";
import SelectedFriendHome from "./SelectedFriendHome";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import { appFontStyles } from "@/src/hooks/StaticFonts";
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
  const welcomeTextStyle = appFontStyles.welcomeText;
  const subWelcomeTextStyle = appFontStyles.subWelcomeText;
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
        <HomeButtonUpNext
          isLoading={isLoading}
          getThemeAheadOfLoading={getThemeAheadOfLoading}
          onPress={onPress}
          borderRadius={10}
          height={"100%"}
          manualGradientColors={manualGradientColors}
          welcomeTextStyle={welcomeTextStyle}
          subWelcomeTextStyle={subWelcomeTextStyle}
          primaryColor={primaryColor}
          overlayColor={primaryOverlayColor}
          primaryBackground={primaryBackgroundColor}
          // borderColor="black"
        />
      )}
      {selectedFriendId && (
        <View style={{ height: "100%" }}>
          <SelectedFriendHome
            userId={userId}
            manualGradientColors={manualGradientColors}
            appColorsStyle={manualGradientColors}
            friendStyle={friendStyle}
            primaryColor={primaryColor}
            welcomeTextStyle={welcomeTextStyle}
            subWelcomeTextStyle={subWelcomeTextStyle}
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
            borderRadius={10}
            borderColor="black"
            height={"100%"}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default BelowKeyboardComponents;
