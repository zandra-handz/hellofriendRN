import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  Platform,
  useLayoutEffect,
} from "react";
import { View, StyleSheet, Image, Keyboard } from "react-native";

import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";

import InputSingleValue from "@/app/components/appwide/input/InputSingleValue";

import KeyboardSaveButton from "@/app/components/appwide/button/KeyboardSaveButton";
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import { useFocusEffect } from "@react-navigation/native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useImageFunctions from "@/src/hooks/useImageFunctions";
import { useFriendList } from "@/src/context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

const ContentAddImage = ({ imageUri }) => {
  const { resizeImage } = useImageUploadFunctions();
  const { themeStyles } = useGlobalStyle();
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const [canContinue, setCanContinue] = useState("");
  const { themeAheadOfLoading } = useFriendList();
  const [imageTitle, setImageTitle] = useState("");
  const [imageCategory, setImageCategory] = useState("Misc");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  const imageTitleRef = useRef(null);
  const imageCategoryRef = useRef(null);

  const { createImage, createImageMutation } = useImageFunctions();

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
    if (selectedFriend && canContinue && imageUri) {
      handleSave();
    }
  };

  const handleSave = async () => {
    console.log(imageUri);

    if (imageUri && imageTitle.trim() && selectedFriend && user) {
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
        formData.append("friend", selectedFriend.id);
        formData.append("user", user.id);
        formData.append("thought_capsules", "");

        //removed the await here, the function is not async
        createImage(formData);
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  };

  return (
    // <KeyboardAvoidingView
    //   style={styles.container}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust if needed
    // >
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { flex: 1 }]}
    >
      <>
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: "28%",
          }}
        >
          <View style={[styles.selectFriendContainer, { marginBottom: "2%" }]}>
            <FriendModalIntegrator
            navigationDisabled={true}
              includeLabel={true}
              width="100%"
            />
          </View>

          <View
            style={[
              styles.backColorContainer,
              themeStyles.genericTextBackground,
              { borderColor: themeAheadOfLoading.lightColor },
            ]}
          >
            {imageUri && (
              <>
                <View
                  style={[
                    styles.previewContainer,
                    themeStyles.genericTextBackgroundShadeTwo,
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
      </>
      {!isKeyboardVisible && (
        <ButtonBaseSpecialSave
          label="SAVE IMAGE  "
          maxHeight={80}
          onPress={handleSave}
          isDisabled={selectedFriend && canContinue && imageUri ? false : true}
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
            isDisabled={
              selectedFriend && canContinue && imageUri ? false : true
            }
            image={false}
          />
        </View>
      )}
    </LinearGradient>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
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
