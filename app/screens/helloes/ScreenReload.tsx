import React from "react";
import { View, Text } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUser } from "@/src/context/UserContext";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import ReloadList from "@/app/components/helloes/ReloadList";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useRoute } from "@react-navigation/native"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
import { UserInterfaceIdiom } from "expo-constants";
const ScreenReload = () => {
  const route = useRoute();
  const helloId = route.params?.helloId ?? false;
  const savedMoments = route.params?.items ?? []; 
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();
  const { friendDash, loadingDash } = useFriendDash({userId: user?.id, friendId: selectedFriend?.id});
  const { lightDarkTheme } = useLDTheme(); 
 

  return (
    <SafeViewAndGradientBackground 
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
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
