import React from "react";
import {
  StyleSheet,
  Text,
  View, 
  ScrollView, 
} from "react-native"; 

import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";


import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave"; 
import { useCapsuleList } from "@/src/context/CapsuleListContext";


import { useNavigation } from "@react-navigation/native";

import FormatMonthDay from "@/app/components/appwide/format/FormatMonthDay";

 


import BodyStyling from "../scaffolding/BodyStyling"; 
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";

import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg";



const ContentMomentView = ({
  momentData, 
  onSliderPull,  
}) => {
  const { themeStyles } = useGlobalStyle(); 
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
    navigation.navigate('MomentFocus', {
        momentText: momentData?.capsule || null,
        updateExistingMoment: true,
        existingMomentObject: momentData || null,
      });
  };

  const saveToHello = async () => {
    try {
      updateCapsule(momentData.id);
    } catch (error) {
      console.error("Error during pre-save:", error);
    }
  };

  return ( 
    
     <View style={[styles.container]}>
       <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom="2%" //default is currently set to 2
        justifyContent="flex-end"
        children={
              <SlideToDeleteHeader
                itemToDelete={momentData}
                onPress={onSliderPull}
                sliderWidth={"100%"}
                targetIcon={TrashOutlineSvg}
              /> 
        }/> 
      <BodyStyling
        height={"100%"}
        width={"101%"} 
        paddingTop={"6%"}
        paddingHorizontal={"6%"}
        paddingBottom={'0%'}
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

<View
                style={{
                  position: "absolute",
                  height: 70,
                  bottom: 0,
                  left: -4, 
                  zIndex: 1000,
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

              
            </View> 
  );
};

const styles = StyleSheet.create({
 
  container: {
    backgroundColor: "transparent",
    flex: 1, 
    width: "100%",
    zIndex: 1, 
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
  sliderContainer: {
    //position: "absolute",
    bottom: 0,
    left: -4,
    right: 0,
    zIndex: 3, 
    height: 28,
    width: "100%",
  },
});

export default ContentMomentView;
