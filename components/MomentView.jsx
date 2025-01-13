import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal, 
  ScrollView,
  Dimensions,
} from "react-native"; 

import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useFriendList } from "../context/FriendListContext"; 
import HeaderMomentWithSlider from "../components/HeaderMomentWithSlider";
import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";
import { LinearGradient } from "expo-linear-gradient";
import { useCapsuleList } from "../context/CapsuleListContext";

import FormatMonthDay from "../components/FormatMonthDay";




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

  const saveToHello = async () => {
    try {
      updateCapsule(momentData.id);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={false}>
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
              <View style={[styles.container]}>
                {momentData && momentData.typedCategory && (
                  <View style={styles.iconAndMomentContainer}>
                    <View style={styles.categoryHeader}>
                      <View style={{ flexDirection: "row", width: "100%" }}>
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
                    </View> 
                      <ScrollView
                        contentContainerStyle={[
                          styles.textWrapper,
                          { padding: 10 },
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


            </View>
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
                  label="ADD TO HELLO "
                  maxHeight={80}
                  onPress={saveToHello}
                  isDisabled={false}
                  fontFamily={"Poppins-Bold"}
                  image={require("../assets/shapes/redheadcoffee.png")}
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
    borderRadius: 30,
    width: "100%",

    paddingHorizontal: "5%",
    paddingTop: "6%",
    paddingBottom: "5%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  iconAndMomentContainer: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
  },
  categoryHeader: {
    paddingBottom: "3%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    minHeight: 30,
    height: "auto",
    maxHeight: 50,
  },
  modalContent: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },
  innerContainer: {
    height: '90%', //440
    width: '100%',
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
  momentContainer: {
    width: "100%",
    overflow: "hidden",
    flexDirection: "column",
    flex: 1,
    padding: "5%",
    paddingHorizontal: "3%",
  },
  momentText: {
    //fontFamily: 'Poppins-Regular',
   
    fontFamily: 'Poppins-Regular',
    fontSize: 16,

    lineHeight: 22,
    alignSelf: "left",
  },
  textWrapper: {
    //flexGrow: 1,
    //height: '100%',
    textAlign: "left",
    // justifyContent: 'center',
    width: "100%", 
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
