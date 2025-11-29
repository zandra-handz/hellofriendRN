import React from "react";
import { View, Text, StyleSheet } from "react-native";
 
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";

// import { useFriendDash } from "@/src/context/FriendDashContext";
import useFriendDash from "@/src/hooks/useFriendDash";
import ReloadList from "@/app/components/helloes/ReloadList";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useRoute } from "@react-navigation/native"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
 
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
    <SafeViewFriendStatic
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      useOverlay={true}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={styles.container}
    >
      {selectedFriend && !loadingDash && (
        <View style={{ flex: 1 }}>
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
    </SafeViewFriendStatic>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10}
});


export default ScreenReload;
