import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import { useFriendStyle } from "@/src/context/FriendStyleContext";
import ImageMenuButton from "@/app/components/images/ImageMenuButton";
import useImageFunctions from "@/src/hooks/useImageFunctions";
import ImagesList from "@/app/components/images/ImagesList"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const ScreenImages = () => {
  const { imageList } = useImageFunctions();
  const { themeAheadOfLoading } = useFriendStyle();
  const { selectedFriend  } = useSelectedFriend();
 const { themeStyles, manualGradientColors } = useGlobalStyle();

   
  return (
    <SafeViewAndGradientBackground 
        startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
    
    style={{ flex: 1 }}>
  
        <View style={{ flex: 1 }}>
          {imageList.length > 0 ? (
            <>
              <ImagesList primaryBackground={themeStyles.primaryBackground.backgroundColor} themeAheadOfLoading={themeAheadOfLoading} height={80} width={80} singleLineScroll={false} />
            </>
          ) : (
            <Text></Text>
          )}
        </View>
        <ImageMenuButton /> 
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: "100%",
    justifyContent: "space-between",
  },
});

export default ScreenImages;
