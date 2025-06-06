import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import SafeView from "@/app/components/appwide/format/SafeView";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import useImageFunctions from "@/src/hooks/useImageFunctions";
//import ImageView from "@/app/components/images/ImageView";
import ImageViewPage from "@/app/components/images/ImageViewPage";

import ImageGalleryOutlineSvg from "@/app/assets/svgs/image-gallery-outline.svg";

const ScreenImageView = () => {
  const route = useRoute();
  const image = route.params?.image ?? null;
  const currentIndex = route.params?.index ?? null;
  const { imageList, deleteImage, deleteImageMutation } = useImageFunctions();

  return (
    <SafeView style={{ flex: 1 }}>
      <GradientBackground useFriendColors={true}>
        <GlobalAppHeader
          title={"IMAGES: "}
          // navigateTo={"Images"}
          icon={ImageGalleryOutlineSvg}
          altView={false}
        />
        <CarouselSlider
          initialIndex={currentIndex}
          data={imageList}
          children={ImageViewPage}
        />
      </GradientBackground>
    </SafeView>
  );
};

export default ScreenImageView;
