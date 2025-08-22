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
  slideAnim: SharedValue<number>;
  friendListLength: number;
  isFriendSelected: boolean;
  onPress: () => void;
}

const BelowKeyboardComponents: React.FC<BelowKeyboardComponentsProps> = ({
  friendStyle,
  primaryTextStyle,
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryBackgroundColor,
  primaryOverlayColor,
  darkerOverlayBackgroundColor,
  appColorsStyle,
  spinnerStyle,
  loadingNewFriend,
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
          onPress={onPress}
          borderRadius={10}
          height={"100%"}
          borderColor="black"
        />
      )}
      {isFriendSelected && (
        <View style={{ height: "100%" }}>
          <SelectedFriendHome
          appColorsStyle={appColorsStyle}
            friendStyle={friendStyle}
            primaryTextStyle={primaryTextStyle}
            welcomeTextStyle={welcomeTextStyle}
            subWelcomeTextStyle={subWelcomeTextStyle}
            primaryOverlayColor={primaryOverlayColor}
            primaryBackgroundColor={primaryBackgroundColor} 
                    darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                   
            spinnerStyle={spinnerStyle}
            loadingNewFriend={loadingNewFriend}
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
