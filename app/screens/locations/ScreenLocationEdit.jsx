import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import TextEditBox from "@/app/components/appwide/input/TextEditBox";
import FlatListChangeChoice from "@/app/components/appwide/FlatListChangeChoice";

import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "@/src/context/UserContext"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
import ButtonBaseSpecialSave from "@/app/components/buttons/scaffolding/ButtonBaseSpecialSave";
import KeyboardSaveButton from "@/app/components/appwide/button/KeyboardSaveButton";
import useDeleteLocation from "@/src/hooks/LocationCalls/useDeleteLocation";
import BodyStyling from "@/app/components/scaffolding/BodyStyling";
import BelowHeaderContainer from "@/app/components/scaffolding/BelowHeaderContainer";
import useUpdateLocation from "@/src/hooks/LocationCalls/useUpdateLocation";
import SlideToDeleteHeader from "@/app/components/foranimations/SlideToDeleteHeader";

import { LinearGradient } from "expo-linear-gradient";

import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";

const ScreenLocationEdit = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const category = route.params?.category ?? null;
  const notes = route.params?.notes ?? null;
  const parking = route.params?.parking ?? null;
  const focusOn = route.params?.focusOn ?? null;


  const { user } = useUser();


  const { handleDeleteLocation, deleteLocationMutation } = useDeleteLocation({userId: user?.id, locationId: location?.id});
  const { handleUpdateLocation, updateLocationMutation } = useUpdateLocation({userId: user?.id, locationId: location?.id});

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();
 
const { lightDarkTheme } = useLDTheme(); 
  const { themeAheadOfLoading } = useFriendStyle();

  const editedTextRef = useRef(null);
  const editedCategoryRef = useRef(null);

  // useLayoutEffect(() => {
  //   if ((focusOn === 'focusNotes') && editedTextRef && editedTextRef.current) {
  //     editedTextRef.current.focus();
  //   }

  //   if (focusOn === 'focusCategory' && editedCategoryRef.current) {
  //     editedCategoryRef.current.focus();
  //   }

  // }, [focusOn]);

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

  const parkingScores = [
    { label: "Free parking", value: "location has free parking lot" },
    { label: "Free parking nearby", value: "free parking lot nearby" },
    { label: "Street parking", value: "street parking" },
    {
      label: "Stressful parking",
      value: "fairly stressful or unreliable street parking",
    },
    { label: "No parking", value: "no parking whatsoever" },
    { label: "unspecified", value: "unspecified" },
  ];

  const updateCategoryEditString = (text) => {
    if (editedCategoryRef && editedCategoryRef.current) {
      editedCategoryRef.current.setText(text);
      console.log("in parent", editedCategoryRef.current.getText());
    }
  };

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.setText(text);
      console.log("in parent", editedTextRef.current.getText());
    }
  };

  const editedParkingScoreRef = useRef(null);

  const updateParkingScore = (text) => {
    if (editedParkingScoreRef && editedParkingScoreRef.current) {
      editedParkingScoreRef.current.setText(text);
      console.log("in parent", editedParkingScoreRef.current.getText());
    }
  };

  //weekdayTextData is coming from LocationHoursOfOperation component

  const handleDelete = (fluff) => {
    try {
      handleDeleteLocation();
    } catch (error) {
      console.log("error, location not deleted: ", error, location);
    }
  };

  const handleSubmit = () => {
    handleUpdateLocation(location.id, {
      category: editedCategoryRef.current.getText(),
      personal_experience_info: editedTextRef.current.getText(),
      parking_score: editedParkingScoreRef.current.getText(),
    });
  };

  useEffect(() => {
    if (updateLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [updateLocationMutation]);

  useEffect(() => {
    if (deleteLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [deleteLocationMutation]);

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      {/* <View
                style={{
                  width: "100%",
      
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              > */}
      <BelowHeaderContainer
        height={30}
        minHeight={30}
        maxHeight={30}
        alignItems="center"
        marginBottom="2%"
        justifyContent="center"
        children={
          <View style={styles.sliderContainer}>
            <SlideToDeleteHeader
              itemToDelete={location}
              onPress={handleDelete}
              sliderWidth={"100%"}
              targetIcon={TrashOutlineSvg}
            />
          </View>
        }
      />

      <BodyStyling
        backgroundColor={lightDarkTheme.primaryBackground}
        friendLightColor={themeAheadOfLoading.lightColor}
        height={"96%"}
        width={"101%"}
        minHeight={"96%"}
        paddingTop={"4%"}
        paddingHorizontal={"0%"} //too much padding will cause the Type picker to flow to next line
        children={
          <>
            <View
              style={{
                height: isKeyboardVisible ? "30%" : "20%",
                marginBottom: "3%",
              }}
            >
              <TextEditBox
                ref={editedCategoryRef}
                autoFocus={focusOn === "focusCategory"}
                title={"Edit category"}
                mountingText={category}
                onTextChange={updateCategoryEditString}
                multiline={false}
                height={"100%"}
              />
            </View>

            <View
              style={{
                height: isKeyboardVisible ? "50%" : "30%",
                flexGrow: 1,
                marginBottom: "3%",
              }}
            >
              <TextEditBox
                ref={editedTextRef}
                autoFocus={focusOn === "focusNotes"}
                title={"Edit notes"}
                mountingText={notes}
                onTextChange={updateNoteEditString}
                height={"100%"}
              />
            </View>

            <View style={{ height: "20%", flexShrink: 1, marginBottom: "3%" }}>
              <FlatListChangeChoice
                lightDarkTheme={lightDarkTheme}
                themeAheadOfLoading={themeAheadOfLoading}
                horizontal={true}
                choicesArray={parkingScores}
                ref={editedParkingScoreRef}
                title={"Change parking score"}
                oldChoice={parking}
                onChoiceChange={updateParkingScore}
              />
            </View>
            {!isKeyboardVisible && (
              <ButtonBaseSpecialSave
                label="SAVE CHANGES "
                maxHeight={80}
                onPress={handleSubmit}
                isDisabled={false}
                fontFamily={"Poppins-Bold"}
                image={require("@/app/assets/shapes/redheadcoffee.png")}
              />
            )}
          </>
        }
      />

      {/* </View> */}
      {isKeyboardVisible && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            flex: 1,
            zIndex: 2000,
          }}
        >
          <KeyboardSaveButton
            label="SAVE CHANGES "
            onPress={handleSubmit}
            isDisabled={false}
            image={false}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  sliderContainer: {
    //position: "absolute",
    bottom: 0,
    left: -4,
    right: 0,
    zIndex: 3,
    height: 30,
    width: "100%",
  },
});

export default ScreenLocationEdit;
