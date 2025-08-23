import React  from "react";
import { View, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import ContentAddImage from "@/app/components/images/ContentAddImage";
 
// nav
import { useRoute } from "@react-navigation/native";

const ScreenAddImage = () => {
  const route = useRoute();
  const imageUri = route.params?.imageUri ?? false;

  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();
  const { selectedFriend  } = useSelectedFriend();
 

 
  return (
    <SafeViewAndGradientBackground 
          startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
    
   style={{ flex: 1 }}>
      <View style={[styles.container, themeStyles.container]}>
        <ContentAddImage imageUri={imageUri} />
      </View>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenAddImage;
