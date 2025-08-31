import React from "react";
import { View } from "react-native";
import HomeButtonUpNext from "./HomeButtonUpNext";
import SelectedFriendHome from "./SelectedFriendHome";
import Animated, {
  SharedValue,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

interface BelowKeyboardComponentsProps {
  userId: number;
  slideAnim: SharedValue<number>;
  friendListLength: number;
  isFriendSelected: boolean;
  onPress: () => void;
}

const BelowKeyboardComponents: React.FC<BelowKeyboardComponentsProps> = ({
  userId,
  userCategories,
  upcomingHelloes,
  isLoading,
  themeAheadOfLoading,
  getThemeAheadOfLoading,
  friendList,
  friendStyle,
  primaryColor,
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryBackgroundColor,
  primaryOverlayColor,
  darkerOverlayBackgroundColor,
  manualGradientColors,
  spinnerStyle,
  loadingDash,
  friendDash,
  selectedFriendId,
  selectedFriendName,
  friendListLength,
  isFriendSelected,
  onPress,
}) => {
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
      {!isFriendSelected && friendListLength > 0 && (
        <HomeButtonUpNext
          upcomingHelloes={upcomingHelloes}
          isLoading={isLoading}
          getThemeAheadOfLoading={getThemeAheadOfLoading}
          friendList={friendList}
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
      {isFriendSelected && (
        <View style={{ height: "100%" }}>
          <SelectedFriendHome
            userId={userId}
            friendList={friendList}
            userCategories={userCategories}
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
