import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal, 
  ScrollView,
  Dimensions,
} from "react-native"; 

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext"; 
import HeaderMomentWithSlider from "../headers/HeaderMomentWithSlider";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import { LinearGradient } from "expo-linear-gradient";
import { useCapsuleList } from "@/src/context/CapsuleListContext";


import { useNavigation } from "@react-navigation/native";

import FormatMonthDay from "@/app/components/appwide/format/FormatMonthDay";


import BodyStyling from "../scaffolding/BodyStyling"; 

import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg";



const MomentView = ({
  momentData,
  navigationArrows,
  onSliderPull,
  isModalVisible,
  toggleModal,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { height: screenHeight } = Dimensions.get("window");
  const navigation = useNavigation();
    const { updateCapsule } = useCapsuleList();


  //useEffect(() => {
  //if (momentData) {
  //  console.log('moment data changed: ', momentData);
  //  }

  // }, [momentData]);

  //Added from chatGPT
  const capitalizeFirstFiveWords = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const capitalizedWords = words
      .slice(0, 5)
      .map((word) => word.toUpperCase())
      .concat(words.slice(5));
    return capitalizedWords.join(" ");
  };

  const handleEditMoment = () => {
    if (momentData) {
      toggleModal();
      setTimeout(() => {
        navigation.navigate('MomentFocus', {
          momentText: momentData?.capsule || null,
          updateExistingMoment: true,
          existingMomentObject: momentData || null,
        });
      }, 300); // delay is necessary to prevent modal animation from interfering with AutoFocus in TextMomentBox on Moment Focus screen
    }
  };

  const saveToHello = async () => {
    try {
      updateCapsule(momentData.id);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  return (
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
              { maxHeight: screenHeight },
            ]}
          >
            <HeaderMomentWithSlider
              onBackPress={toggleModal}
              itemData={momentData}
              onSliderPull={onSliderPull}
              headerTitle={"VIEW MOMENT"}
            />
      <BodyStyling
        height={"100%"}
        width={"101%"} 
        paddingTop={"6%"}
        paddingHorizontal={"6%"}
        children={
              <>
              <View style={[styles.container]}>
                {momentData && momentData.typedCategory && (
                  <View style={styles.iconAndMomentContainer}>
                    <View style={styles.categoryHeader}>
                      <View style={{ opacity: .8, flexDirection: "row", width: "100%", alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Text
                          style={[styles.categoryText, themeStyles.genericText]}
                        >
                          {momentData.typedCategory.length > 40
                            ? `${momentData.typedCategory.substring(0, 40)}...`
                            : momentData.typedCategory}{" "}
                          • added{" "}
                        </Text>
                        <FormatMonthDay
                          date={momentData.created}
                          fontSize={13}
                          fontFamily={"Poppins-Regular"}
                          parentStyle={[styles.categoryText, themeStyles.genericText]}
                        />
                        
                        </View> 
                                       <EditPencilOutlineSvg
                                          height={20}
                                          width={20}
                                          onPress={handleEditMoment}
                                          color={themeStyles.genericText.color}
                                        /> 
                      </View>
                    </View> 
                      <ScrollView
                        contentContainerStyle={[
                          styles.textWrapper
                        ]}
                         style={{width: '100%'  }}
                      >
                        {momentData && momentData.capsule && (
                          <Text
                          selectable={true}
                            style={[styles.momentText, themeStyles.genericText]}
                          >
                            {capitalizeFirstFiveWords(momentData.capsule)}
                          </Text>
                        )}
                      </ScrollView> 
                  </View>
                )}
              </View>
              </>
  }
  />


            </View> 
          <View
                style={{
                  position: "absolute",
                  height: 70,
                  bottom: -6,
                  left: -4,
                  width: "103%", 
                }}
              >
                <ButtonBaseSpecialSave
                  label="ADD TO HELLO "
                  maxHeight={80}
                  onPress={saveToHello}
                  isDisabled={false}
                  fontFamily={"Poppins-Bold"}
                  image={require("@/app/assets/shapes/redheadcoffee.png")}
                />
              </View>
        </LinearGradient>
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, 
    width: "100%",
    zIndex: 1, 
  },
  container: {
    backgroundColor: "transparent",
  },
  iconAndMomentContainer: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",  
    //textAlign: "justify",
  },
  categoryHeader: {
    paddingBottom: "2%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    width: "100%", 
    minHeight: 30,
    height: "auto",
    maxHeight: 40,
  },
  modalContent: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },  
  momentText: {
    //fontFamily: 'Poppins-Regular',
   
    fontFamily: 'Poppins-Regular',
    fontSize: 15,

    lineHeight: 22,
    alignSelf: "left",
  },
  textWrapper: {
    //flexGrow: 1,
    //height: '100%',
    textAlign: "left",
    //flexWrap: 'wrap',
    
    // justifyContent: 'center',
    width: "100%", 
    paddingTop: '3%', 
    paddingHorizontal: '0%', 
    paddingBottom: 160 
     
  },
  categoryText: {
    fontSize: 14, 
    lineHeight: 21,
    color: "darkgrey",
    overflow: "hidden",
    textTransform: "uppercase",
  }, 
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    paddingRight: 30,
    paddingLeft: 7,
    paddingTop: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "left",
    flex: 1,
  },
});

export default MomentView;
