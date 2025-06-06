import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";

import SlideToDeleteHeader from "../foranimations/SlideToDeleteHeader";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import { useNavigation } from "@react-navigation/native";
import { useFriendList } from "@/src/context/FriendListContext";

import FormatMonthDay from "@/app/components/appwide/format/FormatMonthDay";
import SlideToAdd from "../foranimations/SlideToAdd";
import BodyStyling from "../scaffolding/BodyStyling";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";

import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg";

const NewHelloView = ({ data, onSliderPull }) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { updateCapsule } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();

 
 

  return (
    <View style={[styles.container]}>
      <BelowHeaderContainer
        height={30}
        alignItems="center"
        marginBottom={0} //default is currently set to 2
        justifyContent="center"
        children={
          <SlideToAdd
            onPress={() => {}}
            sliderText={"Empty"}
            sliderTextSize={15}
            sliderTextColor={themeAheadOfLoading.fontColor}
          />
        }
      />
      <BodyStyling
        height={"100%"}
        width={"100%"}
        paddingTop={"6%"}
        paddingHorizontal={"6%"}
        paddingBottom={"0%"}
        children={
          <>
            <View style={[styles.container]}>
              {data && (
                <View style={styles.iconAndMomentContainer}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={{
                        opacity: 1,
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >

                      {/* <EditPencilOutlineSvg
                        height={20}
                        width={20}
                        onPress={handleEditMoment}
                        color={themeStyles.genericText.color}
                      /> */}
                    </View>
                  </View>
                  <ScrollView
                    fadingEdgeLength={60}
                    contentContainerStyle={[styles.textWrapper]}
                    style={{ width: "100%" }}
                  >
                    {data && (
                      <Text
                        selectable={true}
                        style={[
                          appFontStyles.momentViewText,
                          themeStyles.genericText,
                        ]}
                      >
                        {data.id}
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
          height: 40,
          bottom: 0,
          left: -4,
          zIndex: 1000,
        }}
      >
        {" "}
        {/* <SlideToDeleteHeader
          itemToDelete={data}
          onPress={onSliderPull}
          sliderWidth={"100%"}
          targetIcon={TrashOutlineSvg}
          sliderTextColor={themeStyles.primaryText.color}
        /> */}
        
        {/* <ButtonBaseSpecialSave
          label="ADD TO HELLO "
          maxHeight={80}
          onPress={saveToHello}
          isDisabled={false}
          fontFamily={"Poppins-Bold"}
          image={require("@/app/assets/shapes/redheadcoffee.png")}
        /> */}
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

    fontFamily: "Poppins-Regular",
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
    paddingTop: "3%",
    paddingHorizontal: "0%",
    paddingBottom: 160,
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

export default NewHelloView;
