import React, { useCallback, useMemo } from "react";
import { View, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import ImageViewPage from "@/app/components/images/ImageViewPage";
 import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext"; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
 import useImages from "@/src/hooks/ImageCalls/useImages";
 import useDeleteImage from "@/src/hooks/ImageCalls/useDeleteImage";

const ScreenImageView = () => {
  const route = useRoute();
  const startingIndex = route.params?.index ?? null;
  const { user } = useUser();
    const { selectedFriend  } = useSelectedFriend();

  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { imageList  } = useImages({userId: user?.id, friendId: selectedFriend?.id});

 

    const { deleteImage, deleteImageMutation } = useDeleteImage({userId: user?.id, friendId: selectedFriend?.id});

  const { themeAheadOfLoading } = useFriendStyle();

  // const totalCount = imageList.length;


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

 

  return (
    <SafeViewAndGradientBackground
    
          startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
    
    
    style={{ flex: 1 }}>
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
