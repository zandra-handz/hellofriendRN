import React from "react";
import { View } from "react-native";
import AllHome from "./AllHome";
import SelectedFriendHome from "./SelectedFriendHome";
// import { useFriendDash } from "@/src/context/FriendDashContext"; 
import useFriendDash from "@/src/hooks/useFriendDash";
 

interface BelowKeyboardComponentsProps {
  userId: number;
  friendListLength: number;
  onPress: () => void;
}

const BelowKeyboardComponents: React.FC<BelowKeyboardComponentsProps> = ({
  userId,
  paddingHorizontal,
  isLoading,
  themeAheadOfLoading,
  getThemeAheadOfLoading,
  lockInCustomString, /// to check if prev friend needs to be unpinned. to keep consistent with my other select hooks
 
  primaryColor,
  primaryBackgroundColor,
  primaryOverlayColor,
  darkerOverlayBackgroundColor,
  lighterOverlayBackgroundColor,
  spinnerStyle="flow",
  // loadingDash,
  // friendDash,
  friendId,
  friendName,
  friendListLength,
  onPress,
}) => {
  const { friendDash, loadingDash } = useFriendDash({userId: userId, friendId: friendId});


  console.log('below keyboard rerendered', lockInCustomString)


  return (
    // <Animated.View

    <View
      // entering={FadeInUp}
      // exiting={FadeOutDown}
      style={[
        {
          alignItems: "center",
          flex: 1,
          width: "100%",
        },
      ]}
    >
      {!friendId && friendListLength > 0 && (
        <View style={{ height: "100%" }}>
          <AllHome
            friendId={friendId}
            lockInCustomString={lockInCustomString}
            paddingHorizontal={paddingHorizontal}
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
      {friendId && (
        <View style={{ height: "100%" }}>
          <SelectedFriendHome
            paddingHorizontal={paddingHorizontal}
            userId={userId} 
            primaryColor={primaryColor}
            primaryOverlayColor={primaryOverlayColor}
            primaryBackgroundColor={primaryBackgroundColor}
            darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
            themeAheadOfLoading={themeAheadOfLoading}
            spinnerStyle={spinnerStyle}
            loadingDash={loadingDash}
            friendDash={friendDash}
            selectedFriendId={friendId}
            selectedFriendName={friendName}
            onPress={onPress}
            height={"100%"}
          />
        </View>
      )}
    {/* </Animated.View> */}
    </View>
  );
};

export default BelowKeyboardComponents;
