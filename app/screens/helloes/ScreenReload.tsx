import React from "react";
import { View, Text } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUser } from "@/src/context/UserContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
 
import ReloadList from "@/app/components/helloes/ReloadList";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useRoute } from "@react-navigation/native";
import { useFriendStyle } from "@/src/context/FriendStyleContext"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
const ScreenReload = () => {
  const route = useRoute();
  const helloId = route.params?.helloId ?? false;
  const savedMoments = route.params?.items ?? [];
  const { themeAheadOfLoading } = useFriendStyle();
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();
  const { friendDash, loadingDash } = useFriendDash();
  const { lightDarkTheme } = useLDTheme(); 
 

  return (
    <SafeViewAndGradientBackground 
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={true}
      style={{ flex: 1 }}
    >
      {selectedFriend && !loadingDash && (
        <View style={{ flex: 1, padding: 10 }}>
          <Text
            style={[
              AppFontStyles.welcomeText,
              { color: lightDarkTheme.primaryText, fontSize: 22 },
            ]}
          >
            Reload ideas
          </Text>

          {savedMoments && selectedFriend && friendDash && (
            <ReloadList 
              subWelcomeTextStyle={AppFontStyles.subWelcomeText}
              primaryColor={lightDarkTheme.primaryText}
              primaryBackground={lightDarkTheme.primaryBackground}
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
