import React, { useCallback, useMemo } from "react";
import { View, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import ImageCarouselSlider from "@/app/components/appwide/ImageCarouselSlider";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import ImageViewPage from "@/app/components/images/ImageViewPage";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
// import * as FileSystem from "expo-file-system";
import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import useImages from "@/src/hooks/ImageCalls/useImages";
import useDeleteImage from "@/src/hooks/ImageCalls/useDeleteImage";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { AppFontStyles } from "@/app/styles/AppFonts";
const ScreenImageView = () => {
  const route = useRoute();
  const startingIndex = route.params?.index ?? null;
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const { imageList } = useImages({
    userId: user?.id,
    friendId: selectedFriend?.id,
    enabled: true,
  });

  const { deleteImage, deleteImageMutation } = useDeleteImage({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  // const totalCount = imageList.length;
  const handleShare = async (currentIndex: number) => {
    const imageItem = imageList[currentIndex];
    if (!imageItem?.image) {
      console.error("Error: Image is null or undefined");
      return;
    }

    try {
      // 1️⃣ Create (or ensure) the shared_images directory
      const shareDir = new Directory(Paths.cache, "shared_images");
      if (!shareDir.exists) shareDir.create();

      // 2️⃣ Create the File object
      const fileName = `${imageItem.title || "shared_image"}.jpg`;
      const file = new File(shareDir, fileName);

      // 3️⃣ Delete existing file if present
      if (file.exists) {
        file.delete(); // synchronous deletion
        console.log("Deleted existing file:", file.uri);
      }

      // 4️⃣ Download the image to the file
      const output = await File.downloadFileAsync(imageItem.image, file);

      if (output.exists) {
        // 5️⃣ Share it
        await Sharing.shareAsync(output.uri, { mimeType: "image/jpeg" });
        console.log("Shared file URI:", output.uri);
      } else {
        console.error("Failed to download file for sharing.");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  const handleDelete = (currentItem) => {
    try {
      // Get the correct image to delete based on currentIndex
      deleteImage(currentItem.id);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <SafeViewFriendStatic
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      useOverlay={true}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={[
        {
          flex: 1,
        },
      ]}
    >
      <ImageCarouselSlider
        initialIndex={startingIndex}
        data={imageList}
        children={(props) => (
          <ImageViewPage
            welcomeTextStyle={AppFontStyles.welcomeText}
            primaryColor={lightDarkTheme.primaryText}
            {...props}
          />
        )}
        onRightPress={handleShare}
        onRightPressSecondAction={handleDelete}
        primaryColor={lightDarkTheme.primaryText}
        primaryBackground={lightDarkTheme.primaryBackground}
        overlayColor={lightDarkTheme.overlayBackground}
        dividerStyle={lightDarkTheme.divider}
        welcomeTextStyle={AppFontStyles.welcomeText}
      />
    </SafeViewFriendStatic>
  );
};

export default ScreenImageView;
