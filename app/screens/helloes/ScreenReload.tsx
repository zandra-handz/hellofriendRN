import React from "react";
import { View, Text } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUser } from "@/src/context/UserContext";
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
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
const { capsuleList} = useCapsuleList();
  const { friendDash, loadingDash } = useFriendDash();
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  console.log('reload screen');

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
             backgroundTransparentOverlayColor={themeStyles.overlayBackgroundColor.backgroundColor}
     
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
            <ReloadList
            capsuleList={capsuleList}
              userId={user?.id}
              friendId={selectedFriend?.id}
              friendDash={friendDash}
              helloId={helloId}
              items={savedMoments}
            />
          )}
        </View>
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenReload;
