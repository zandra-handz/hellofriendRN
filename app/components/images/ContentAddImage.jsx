import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, StyleSheet, Image, Keyboard } from "react-native";

import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import ImageFocusTray from "@/app/screens/images/ImageFocusTray";
import InputSingleValue from "@/app/components/appwide/input/InputSingleValue";

import KeyboardSaveButton from "@/app/components/appwide/button/KeyboardSaveButton";
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import { useFocusEffect } from "@react-navigation/native";
import useCreateImage from "@/src/hooks/ImageCalls/useCreateImage";

import { useNavigation } from "@react-navigation/native";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

const ContentAddImage = ({
  userId,
  friendId,
  friendName,
  cardPaddingVertical,
  themeAheadOfLoading,
  primaryColor,
  darkerOverlayColor,
  imageUri,
  escortBarSpacer,
  backgroundColor,
}) => {
  const { resizeImage } = useImageUploadFunctions();

  const [canContinue, setCanContinue] = useState("");

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)"; // same as in selected friend home
  
  const INNER_PADDING_HORIZONTAL = 20;

  const TOPPER_PADDING_TOP = 0;

  const [imageTitle, setImageTitle] = useState("");
  const [imageCategory, setImageCategory] = useState("Misc");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  const imageTitleRef = useRef(null);
  const imageCategoryRef = useRef(null);

  const { createImage, createImageMutation } = useCreateImage({
    userId: userId,
    friendId: friendId,
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        if (imageTitleRef.current) {
          console.log("Focusing TextInput");
          imageTitleRef.current.focus();
        }
      }, 50); // Small delay for rendering
      return () => clearTimeout(timeout); // Cleanup timeout
    }, [])
  );

  const handleImageTitleChange = (value) => {
    setImageTitle(value);
    setCanContinue(value.length > 0);
  };

  const handleImageCategoryChange = (value) => {
    setImageCategory(value);
    setCanContinue(value.length > 0);
  };

  useEffect(() => {
    if (createImageMutation.isSuccess) {
      navigation.goBack();
    }
  }, [createImageMutation.isSuccess]);

  const handleTitleEnterPress = () => {
    if (imageCategoryRef.current) {
      imageCategoryRef.current.focus();
    }
  };

  //Can take out if causes accidental premature saving
  const handleCategoryEnterPress = () => {
    if (friendId && canContinue && imageUri) {
      handleSave();
    }
  };

  const handleSave = async () => {
    // console.log(imageUri);

    if (imageUri && imageTitle.trim() && friendId && userId) {
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
        formData.append("friend", friendId);
        formData.append("user", userId);
        formData.append("thought_capsules", "");

        //removed the await here, the function is not async
        createImage(formData);
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={{ flex: 1 }}>
        <View
          style={[
            {
              paddingVertical: cardPaddingVertical, // Padding needs to be on this view for some reason
              width: "100%",
              flex: 1,
            },
          ]}
        >
          <View
            style={[
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                flex: 1,
                flexGrow: 1,
                width: "100%",
                zIndex: 1,
              },
            ]}
          >
            <View
              style={{
                padding: 10,
                paddingHorizontal: INNER_PADDING_HORIZONTAL,
                borderRadius: 10,
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "100%",
                flex: 1,
                marginBottom: escortBarSpacer,
                zIndex: 1,
                overflow: "hidden",
                backgroundColor: darkerOverlayColor,
                backgroundColor: CARD_BACKGROUND,
              }}
            >
              <ImageFocusTray
                themeAheadOfLoading={themeAheadOfLoading}
                primaryColor={primaryColor}
              />

              {imageUri && (
                <>
                  <View
                    style={[
                      styles.previewContainer,
                      //  themeStyles.genericTextBackgroundShadeTwo,
                    ]}
                  >
                    <View style={[styles.previewImageContainer]}>
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.previewImage}
                        resizeMode="cover" //change to contain to fit whole image
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <View style={{ paddingBottom: 6 }}>
                        <InputSingleValue
                          primaryColor={primaryColor}
                          underlineColor={"red"}
                          ref={imageTitleRef}
                          autoFocus={true}
                          onSubmitEditing={handleTitleEnterPress}
                          handleValueChange={handleImageTitleChange}
                          label=""
                          placeholder="Title"
                        />
                      </View>
                      <View>
                        <InputSingleValue
                          primaryColor={primaryColor}
                          underlineColor={"red"}
                          ref={imageCategoryRef}
                          onSubmitEditing={handleCategoryEnterPress}
                          handleValueChange={handleImageCategoryChange}
                          label=""
                          placeholder="Category"
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {!isKeyboardVisible && (
        <ButtonBaseSpecialSave
          label="SAVE IMAGE  "
          maxHeight={80}
          onPress={handleSave}
          // isDisabled={friendId && canContinue && imageUri ? false : true}
          image={require("@/app/assets/shapes/redheadcoffee.png")}
        />
      )}

        {isKeyboardVisible && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            flex: 1,
          }}
        >
          <KeyboardSaveButton
            label="SAVE IMAGE "
            onPress={handleSave}
            // isDisabled={
            //   friendId && canContinue && imageUri ? false : true
            // }
            image={false}
          />
        </View>
      )}



      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    //padding: 4,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "100%",
  },
  backColorContainer: {
    minHeight: "98%",
    alignContent: "center",
    paddingHorizontal: "4%",
    paddingTop: "8%",
    paddingBottom: "32%",
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
  buttonContainer: {
    width: "104%",
    height: "auto",
    position: "absolute",
    bottom: -10,
    flex: 1,
    right: -2,
    left: -2,
  },
  previewContainer: {
    height: 200,
    flexDirection: "row",
    width: "100%",
    padding: "4%",
    borderRadius: 30,
  },

  previewImageContainer: {
    borderRadius: 10,
    flex: 1,
    marginRight: "2%",
    width: "40%",
    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 20,
    alignSelf: "flex-start",
    backgroundColor: "blue",
    padding: "2%",
  },
  inputContainer: {
    width: "100%",
    height: "auto",
    flex: 1,
    alignContent: "center",
    paddingBottom: 10,
  },
});

export default ContentAddImage;
