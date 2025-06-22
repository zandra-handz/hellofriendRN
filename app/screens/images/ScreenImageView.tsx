import React, { useCallback, useMemo } from "react";
import { View, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import useImageFunctions from "@/src/hooks/useImageFunctions";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import ImageViewPage from "@/app/components/images/ImageViewPage";
import ImageMenuButton from "@/app/components/images/ImageMenuButton";
import GradientBackground from "../display/GradientBackground";

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import ImageGalleryOutlineSvg from "@/app/assets/svgs/image-gallery-outline.svg";

const ScreenImageView = () => {
  const route = useRoute();
  const startingIndex = route.params?.index ?? null;
  const { imageList, deleteImage, deleteImageMutation } = useImageFunctions();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();

  const totalCount = imageList.length;


    const handleShare = async (currentIndex) => {
      console.log(currentIndex);
    if (!imageList[currentIndex].image) {
      console.error('Error: Image URL is null or undefined');
      return;
    }

    const fileUri = FileSystem.documentDirectory + (imageList[currentIndex].title  || 'shared_image') + '.jpg';
    const message = "Check out this image!"; 

    try {
      const { uri } = await FileSystem.downloadAsync(imageList[currentIndex].image, fileUri);
      await Sharing.shareAsync(uri);
  

      // MOVED TO ITEM FOOTER TO HAVE EASIER ACCESS TO ITEM ID
      // setTimeout(async () => {
      //   try { 
      //         Alert.alert('!', 'Did you send this image?', [
      //   {
      //     text: "No, please keep",
      //     onPress: () => console.log("Cancel Pressed"),
      //     style: "cancel",
      //   },
      //         {text: 'Yes, delete', onPress: () => {}},
 
      // ]); 
      //   } catch (error) {
      //     console.error('Error deleting shared image:', error);
      //   }
      // }, 500);  

    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };


    const handleDelete = (currentItem) => {
    try { 

      // Get the correct image to delete based on currentIndex
        deleteImage(currentItem.id);
 
    } catch (error) { 
      console.error('Error deleting image:', error);
   
  };
};

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title="Image"
        navigateTo="Images"
        icon={ImageGalleryOutlineSvg}
        altView={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <CarouselSlider
        initialIndex={startingIndex}
        data={imageList}
        children={ImageViewPage}
        onRightPress={handleShare}
        onRightPressSecondAction={handleDelete}
      />
      {/* <View style={{ bottom: 62 }}>
        <ImageMenuButton />
      </View> */}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenImageView;
