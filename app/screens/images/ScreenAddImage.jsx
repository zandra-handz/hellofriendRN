import React from "react";
import { View, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useUser } from "@/src/context/UserContext";
import TopBarLikeMinusWidth from "../moments/TopBarLikeMinusWidth";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import ContentAddImage from "@/app/components/images/ContentAddImage";
import manualGradientColors from "@/src/hooks/StaticColors";
import useCreateImage from "@/src/hooks/ImageCalls/useCreateImage";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
// nav
import { useRoute } from "@react-navigation/native";
const ScreenAddImage = () => {
  const route = useRoute();
  const imageUri = route.params?.imageUri ?? false;
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { resizeImage } = useImageUploadFunctions();

  const { createImage, createImageMutation } = useCreateImage({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { lightDarkTheme } = useLDTheme();
  const { themeAheadOfLoading } = useFriendStyle();

  
  const handleSave = async (imageUri, imageTitle, imageCategory) => {
    // console.log(imageUri);

    if (imageUri && imageTitle.trim() && selectedFriend?.id && user?.id) {
      try {
        const manipResult = await resizeImage(imageUri);

        const formData = new FormData();
        const fileType = manipResult.uri.split(".").pop();

        formData.append("image", {
          uri: manipResult.uri,
          name: `image.${fileType}`,
          type: `image/${fileType}`,
        });
        formData.append("title", imageTitle.trim());
        formData.append("image_category", imageCategory.trim());
        formData.append("image_notes", "");
        formData.append("friend", selectedFriend?.id);
        formData.append("user", user?.id);
        formData.append("thought_capsules", "");

        //removed the await here, the function is not async
        createImage(formData);
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  };

  const PADDING_HORIZONTAL = 6; //same as homme/selected friend screens

  //using this arrangement below to keep top and bottom bar spacing the same :)
  const CARD_PADDING = 4;
  const SPACER_BETWEEN_BAR_AND_CARD = 2; // low bc there is already parent padding
  const topBarHeight = 50;

  const topBarTotalHeight = topBarHeight;

  const handleImageSave = () => {};

  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      addColorChangeDelay={true}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{ flex: 1 }}
    >
      <View
        // entering={SlideInUp}
        // exiting={SlideOutUp}
        style={{
          height: topBarTotalHeight,
          zIndex: 60000,
          paddingHorizontal: PADDING_HORIZONTAL,
        }}
      >
        <TopBarLikeMinusWidth
          primaryColor={lightDarkTheme.primaryText}
          primaryBackground={lightDarkTheme.primaryBackground}
          forwardFlowOn={false}
          // marginTop={topBarMarginTop}
          onExpandPress={() => console.log("on expand press")}
          onPress={() => console.log("on press")}
          label={""}
          onPressLabel={"Save"}
        />
      </View>
      <View
        // entering={SlideInDown}
        style={{
          width: "100%",
          flex: 1,
          marginTop: SPACER_BETWEEN_BAR_AND_CARD,
          paddingHorizontal: PADDING_HORIZONTAL,
        }}
      >
        <ContentAddImage
          userId={user?.id}
          friendId={selectedFriend?.id}
          friendName={selectedFriend?.name}
          primaryColor={lightDarkTheme.primaryText}
          darkerOverlayColor={lightDarkTheme.darkerOverlayColor}
          themeAheadOfLoading={themeAheadOfLoading}
          imageUri={imageUri}
          escortBarSpacer={SPACER_BETWEEN_BAR_AND_CARD + CARD_PADDING}
          backgroundColor={lightDarkTheme.primaryBackground}
          cardPaddingVertical={CARD_PADDING}
        />
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
