 
import React, { useCallback  } from "react";
import { useRoute } from "@react-navigation/native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import useImageFunctions from "@/src/hooks/useImageFunctions";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import ImageViewPage from "@/app/components/images/ImageViewPage";

import ImageGalleryOutlineSvg from "@/app/assets/svgs/image-gallery-outline.svg";

const ScreenImageView = () => {
  const route = useRoute(); 
  const startingIndex = route.params?.index ?? null;
  const { imageList, deleteImage, deleteImageMutation } = useImageFunctions();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
 
  const totalCount = imageList.length;

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title="Image"
        navigateTo="Images"
        icon={ImageGalleryOutlineSvg}
        altView={false}  
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading ]
  );

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <CarouselSlider
        initialIndex={startingIndex}
        data={imageList}
        children={ImageViewPage}
 
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenImageView;
