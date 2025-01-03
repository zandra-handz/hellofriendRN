import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Dimensions, Modal } from "react-native";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendList } from "../context/FriendListContext";
import { useCapsuleList } from "../context/CapsuleListContext";

import useImageFunctions from "../hooks/useImageFunctions";

import { useGlobalStyle } from "../context/GlobalStyleContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import AlertConfirm from "../components/AlertConfirm";

import HelloViewTitleCard from "../components/HelloViewTitleCard";
import NotesDisplayCard from "../components/NotesDisplayCard";

import FormatMonthDay from "../components/FormatMonthDay";

import PickerMultiMomentsArchived from "../components/PickerMultiMomentsArchived";
import ViewMultiMomentsArchived from "../components/ViewMultiMomentsArchived";
import DisplayHelloNotes from "../components/DisplayHelloNotes";

import ButtonReuseMoments from "../components/ButtonReuseMoments";

import HeaderBaseItemViewTwoOptions from "../components/HeaderBaseItemViewTwoOptions";
import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";
import HelloMomentsDisplayCard from "./HelloMomentsDisplayCard";

const { width, height } = Dimensions.get("window");

const oneThirdHeight = height / 3;
const oneFourthHeight = height / 4;
const oneFifthHeight = height / 5;
const oneSixthHeight = height / 6;
const oneSeventhHeight = height / 7;
const oneHalfHeight = height / 2;

const HelloView = ({
  helloData,
  navigationArrows,
  onSliderPull,
  isModalVisible,
  toggleModal,
}) => {
  const { themeStyles } = useGlobalStyle();
  const [categories, setCategories] = useState([]);
  const { selectedFriend } = useSelectedFriend();
  const { imageList, updateImage, deleteImage } = useImageFunctions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isOldModalVisible, setIsOldModalVisible] = useState(true);
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const { capsuleList } = useCapsuleList();
  const [isDeleting, setIsDeleting] = useState(false);

  const [momentsToSave, setMomentsToSave] = useState(false);

  const [momentsSelected, setMomentsSelected] = useState([]);

  useEffect(() => {
    if (helloData) {
      setCategories([
        ...new Set(helloData.pastCapsules.map((moment) => moment.typed_category)),
      ]);
    }
  }, [helloData]);

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
    if (!helloData?.moments) {
      console.error("Error: Image URL is null or undefined");
      return;
    }

    const fileUri =
      FileSystem.documentDirectory +
      (helloData.title || "shared_image") +
      ".jpg";

    try {
      const { uri } = await FileSystem.downloadAsync(helloData.image, fileUri);
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
    } catch (error) {
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
          <View
            style={[styles.modalContainer, themeStyles.genericTextBackground]}
          >
            <View
              style={[
                styles.modalContent,
                themeStyles.genericText,
                { maxHeight: height * 1, paddingBottom: 0 },
              ]}
            >
              <HeaderBaseItemViewTwoOptions
                onBackPress={toggleModal}
                itemData={helloData}
                onSliderPull={onSliderPull}
                headerTitle={"VIEW HELLO"}
              />

              <View
                style={[
                  styles.container,
                  themeStyles.textGenericBackgroundShadeTwo,
                ]}
              >
                <HelloViewTitleCard
                  helloData={helloData}
                  height={oneSixthHeight}
                />
                {helloData && helloData.additionalNotes && (
                  <View style={{flex: 1, marginTop: '4%'}}>
                  <NotesDisplayCard
                    notesData={helloData.additionalNotes}
                    height={'100%'}
                  />
                  </View>
                )}

                {helloData && helloData.pastCapsules && helloData.pastCapsules.length > 0 && (
                  <View style={{flex: 1, marginTop: '4%'}}>
                  <HelloMomentsDisplayCard
                    momentsData={helloData.pastCapsules}
                    momentsCategories={categories}
                    height={oneThirdHeight}
                  />
                  </View>
                )}
              </View>

              <View
                style={{
                  position: "absolute",
                  height: 80,
                  bottom: -6,
                  left: -4,
                  width: "103%",
                }}
              >
                <ButtonBaseSpecialSave
                  label={`SEND TO ${selectedFriend.name} `}
                  maxHeight={80}
                  onPress={handleShare}
                  isDisabled={false}
                  fontFamily={"Poppins-Bold"}
                  image={require("../assets/shapes/chatmountain.png")}
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
    width: "100%",
    overflow: "hidden",
    flexDirection: "column",
    flex: 1,
    padding: "5%",
    paddingHorizontal: "3%",
    justifyContent: "space-between",
    paddingBottom: "20%",
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
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  categoryText: {
    fontSize: 13,
    flexShrink: 1,
    lineHeight: 21,
    color: "white",
    overflow: "hidden",
    //textTransform: 'uppercase',
  },
});

export default HelloView;
