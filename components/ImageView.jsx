import React, { useState } from "react";
import { View,   StyleSheet, Text, Dimensions, Modal } from "react-native";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { Image } from "expo-image";
import useImageFunctions from "../hooks/useImageFunctions";

import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useFriendList } from "../context/FriendListContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import AlertConfirm from "../components/AlertConfirm";

import HeaderBaseItemView from "../components/HeaderBaseItemView";
import HeaderImageWithSlider from "../components/HeaderImageWithSlider";
import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";

const { height: screenHeight } = Dimensions.get("window");

const ImageView = ({
  imageData,
  navigationArrows,
  onSliderPull,
  isModalVisible,
  toggleModal,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { imageList, updateImage, deleteImage } = useImageFunctions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(null);
  const [isOldModalVisible, setIsOldModalVisible] = useState(true);
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";


  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsOldModalVisible(false);
    setIsEditing(false);
    onClose();
  };

  //const handleUpdate = async () => {
  //try {
  // updateImage(image.id, { title });
  // setIsEditing(false);
  // onClose();
  // } catch (error) {
  //   console.error('Error updating image:', error);
  // }
  // };

  const toggleOldModal = () => {
    setConfirmDeleteModalVisible(!isConfirmDeleteModalVisible);
  };

  const handleShare = async () => {
    if (!imageData?.image) {
      console.error("Error: Image URL is null or undefined");
      return;
    }

    const fileUri =
      FileSystem.documentDirectory +
      (imageData.title || "shared_image") +
      ".jpg";

    try {
      const { uri } = await FileSystem.downloadAsync(imageData.image, fileUri);
      await Sharing.shareAsync(uri);

      setTimeout(async () => {
        try {
          setConfirmDeleteModalVisible(true);
        } catch (error) {
          console.error("Error deleting shared image:", error);
        }
      }, 500);
    } catch (error) {
      console.error("Error sharing image:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const imageToDelete = imageList[currentIndex];
      deleteImage(imageList[currentIndex].id);

      // Update currentIndex to prevent out-of-bounds access
      if (currentIndex >= imageList.length - 1) {
        setCurrentIndex(imageList.length - 2); // Move to the previous image
      }

      setSuccessModalVisible(true);
    } catch (error) {
      setFailModalVisible(true);
      console.error("Error deleting image:", error);
    } finally {
      setConfirmDeleteModalVisible(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <>
          <View
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 1000,
              top: "50%",
              transform: [{ translateY: -50 }],
              alignItems: "center",
            }}
          >
            {navigationArrows}
          </View>
          <View style={[styles.modalContainer]}>
            <View
              style={[
                styles.modalContent,
                themeStyles.genericText,
                { maxHeight: screenHeight * 1, paddingBottom: 0 },
              ]}
            >
              <HeaderImageWithSlider
                onBackPress={toggleModal}
                itemData={imageData}
                onSliderPull={onSliderPull}
                headerTitle={"VIEW IMAGE"}
              />

              <View
                style={[
                  styles.innerContainer,
                  themeStyles.genericTextBackground,
                  {
                    paddingHorizontal: 0,
                    borderColor: themeAheadOfLoading.lightColor,
                  },
                ]}
              >
                <View style={styles.container}>
                  <Text style={[styles.imageText, themeStyles.genericText]}>
                    {imageData.title}
                  </Text>
                  <View style={styles.imageContainer}>
                    <Image
                    placeholder={{ blurhash }}
                      source={{ uri: imageData.image }}
                      style={styles.modalImage}
                      contentFit="cover" //switch to cover to see full image
                      cachePolicy={"memory-disk"}
                    />
                  </View>
                  
                </View>

                <ButtonBaseSpecialSave
                  label={`SEND TO ${selectedFriend.name} `}
                  maxHeight={80}
                  onPress={handleShare}
                  isDisabled={false}
                  fontFamily={"Poppins-Bold"}
                  image={require("../assets/shapes/redheadcoffee.png")}
                />
              </View>
              
            </View>
          </View>
        </>
      </Modal>

      <AlertConfirm
        fixedHeight={true}
        height={330}
        isModalVisible={isConfirmDeleteModalVisible}
        questionText="Delete image?"
        isFetching={isDeleting}
        useSpinner={true}
        headerContent={
          <Text style={{ fontFamily: "Poppins-Bold", fontSize: 18 }}>
            {imageList[currentIndex]?.title || "Image"}
          </Text>
        }
        onConfirm={() => handleDelete()}
        onCancel={toggleOldModal}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  modalContent: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },
  container: {
    borderRadius: 30,
    width: "100%",
    flex: 1,
    height: "100%", 
    paddingHorizontal: "5%",
    paddingTop: "6%",
    paddingBottom: "5%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  innerContainer: {
    height: Dimensions.get("screen").height - 164,
    width: Dimensions.get("screen").width - 10,
    alignContent: "center",
    paddingHorizontal: "4%",
    //paddingTop: "4%",
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    zIndex: 2000,
  },
  imageContainer: {
    width: "100%",
    height: "90%",
    overflow: "hidden",
    flexDirection: "column",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  imageText: {
    //fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: "4%",
  },
  modalImageContainer: {
    width: "100%",
    height: "80%",
    borderRadius: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginBottom: 0,
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});

export default ImageView;
