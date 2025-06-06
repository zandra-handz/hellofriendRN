import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import ImageGallerySingleOutlineSvg from "@/app/assets/svgs/image-gallery-single-outline.svg";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";

// state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ContentAddImage from "@/app/components/images/ContentAddImage";

// nav
import { useRoute } from "@react-navigation/native";

const ScreenAddImage = () => {
  const route = useRoute();
  const imageUri = route.params?.imageUri ?? false;

  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title="Upload for"
        navigateTo="Images"
        icon={ImageGallerySingleOutlineSvg}
        altView={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground header={renderHeader} style={{ flex: 1 }}>
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
