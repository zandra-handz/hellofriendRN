import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useFriendList } from "@/src/context/FriendListContext";
import ImageMenuButton from "@/app/components/images/ImageMenuButton";
import useImageFunctions from "@/src/hooks/useImageFunctions";
import ImagesList from "@/app/components/images/ImagesList"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import ImageGalleryOutlineSvg from "@/app/assets/svgs/image-gallery-outline.svg";



const ScreenImages = () => {
  const { imageList } = useImageFunctions();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();

    const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title="Images"
        navigateTo="Images"
        icon={ImageGalleryOutlineSvg}
        altView={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground header={renderHeader} style={{ flex: 1 }}>
  
        <View style={{ flex: 1 }}>
          {imageList.length > 0 ? (
            <>
              <ImagesList height={80} width={80} singleLineScroll={false} />
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
