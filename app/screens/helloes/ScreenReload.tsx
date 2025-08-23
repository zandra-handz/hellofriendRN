import React from "react";
import { View, Text } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ReloadList from "@/app/components/helloes/ReloadList";
import { useRoute } from "@react-navigation/native"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";

const ScreenReload = () => {
  const route = useRoute();
  const helloId = route.params?.helloId ?? false;
  const savedMoments = route.params?.items ?? [];
   const { themeAheadOfLoading } = useFriendStyle();
  const { selectedFriend } = useSelectedFriend();

  const { friendDash, loadingDash } = useFriendDash();
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();

  return (
    <SafeViewAndGradientBackground
             startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useOverlay={true}
      style={{ flex: 1 }}
    >
      {selectedFriend && !loadingDash && (
        <View style={{ flex: 1, padding: 10 }}>
          <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.welcomeText,
              { fontSize: 22 },
            ]}
          >
            Reload ideas
          </Text>

          {savedMoments && selectedFriend && friendDash && (
            <ReloadList friendId={selectedFriend?.id} friendDash={friendDash} helloId={helloId} items={savedMoments} />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenReload;
