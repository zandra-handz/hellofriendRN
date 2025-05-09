import React, { useEffect, useState } from "react";
import { View, StyleSheet,  Dimensions, Modal } from "react-native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useAuthUser } from '@/src/context/AuthUserContext';
import { useCapsuleList } from "@/src/context/CapsuleListContext";
 

import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 

import { LinearGradient } from "expo-linear-gradient";
 

import HelloViewTitleCard from "./HelloViewTitleCard";
import NotesDisplayCard from "@/app/components/locations/NotesDisplayCard";
 

import PickerReloadSavedMoments from '../selectors/PickerReloadSavedMoments';
import HeaderBaseItemViewTwoOptions from "../headers/HeaderBaseItemViewTwoOptions";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import HelloMomentsDisplayCard from "../moments/HelloMomentsDisplayCard";

const { height } = Dimensions.get("window");

const oneThirdHeight = height / 3; 
const oneSixthHeight = height / 6; 
const HelloView = ({
  helloData,
  navigationArrows,
  onSliderPull,
  isModalVisible,
  toggleModal,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser();
  const [categories, setCategories] = useState([]);
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList(); 
  const [isReloadModalVisible, setReloadModalVisible] = useState(false);
  const [isConfirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const {  handleCreateMoment, createMomentMutation } = useCapsuleList(); 
 

  const [momentsSelected, setMomentsSelected] = useState([]);

  useEffect(() => {
    if (helloData) {
      setCategories([
        ...new Set(helloData.pastCapsules.map((moment) => moment.typed_category)),
      ]);
    }
  }, [helloData]);

  const onMomentSelect = (moments) => {
    setMomentsSelected(moments);

  };


  const toggleReloadModal = () => {
    setReloadModalVisible(prev => !prev);

  };


  const openReloadModal = () => {
    setReloadModalVisible(true);

  };

 

  const toggleOldModal = () => {
    setConfirmDeleteModalVisible(!isConfirmDeleteModalVisible);
  };

  const handleBulkCreateMoments = () => {
    momentsSelected.map((moment) => {
      const momentData = {
        user: authUserState.user.id,
        friend: selectedFriend.id,
  
        selectedCategory: moment.typed_category,
        moment: moment.capsule,
      };
 
      handleCreateMoment(momentData);
      
    });


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
        <LinearGradient
          colors={[
            themeAheadOfLoading.darkColor,
            themeAheadOfLoading.lightColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.modalContainer]}
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
                styles.innerContainer,
                themeStyles.genericTextBackground,
                {
                  marginHorizontal: '3%',
                  borderColor: themeAheadOfLoading.lightColor,
                },
              ]}
            >
                <HelloViewTitleCard
                  helloData={helloData}
                  height={oneSixthHeight}
                />
                {helloData && helloData.additionalNotes && (
                  <View style={{flex: 1, marginTop: '4%' }}>
                  <NotesDisplayCard
                    notesData={helloData.additionalNotes}
                    height={'100%'}
                  />
                  </View>
                )}
                                {helloData && helloData.pastCapsules && helloData.pastCapsules.length > 0 && (
                  <View style={{flex: 1, marginTop: '4%' }}>
                  <PickerReloadSavedMoments
                  onMomentSelect={onMomentSelect}
                    savedMoments={helloData.pastCapsules} 
                  />
                  </View>
                )}

                {helloData && helloData.pastCapsules && helloData.pastCapsules.length > 0 && (
                  <View style={{flex: 1, marginTop: '4%' }}>
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
                  label={`RELOAD MOMENTS `}
                  maxHeight={80}
                  onPress={handleBulkCreateMoments}
                  isDisabled={!momentsSelected}
                  fontFamily={"Poppins-Bold"}
                  image={require("@/app/assets/shapes/chatmountain.png")}
                />
              </View>
            </View>
          </LinearGradient>
        </>
      </Modal>

 
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

    paddingHorizontal: "5%",
    paddingTop: "6%",
    paddingBottom: "5%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  innerContainer: {
    height: Dimensions.get("screen").height - 100, //440
    width: Dimensions.get("screen").width - 10,
    alignContent: "center",
    paddingTop: "5%", 
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
    zIndex: 1000,
    paddingHorizontal: '4%',
    paddingBottom: '22%',
     
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
