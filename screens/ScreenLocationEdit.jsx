import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import TextEditBox from "../components/TextEditBox";
import FlatListChangeChoice from "../components/FlatListChangeChoice";
import { useFriendList } from "../context/FriendListContext";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

// import useLocationFunctions from "../hooks/useLocationFunctions";
import { useLocations } from '../context/LocationsContext';


import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";
import KeyboardSaveButton from "../components/KeyboardSaveButton";

import { LinearGradient } from "expo-linear-gradient";

const ScreenLocationEdit = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const category = route.params?.category ?? null;
  const notes = route.params?.notes ?? null;
  const parking = route.params?.parking ?? null;
  const focusOn = route.params?.focusOn ?? null;

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  const { handleUpdateLocation, updateLocationMutation } =
    useLocations();

  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
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

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, themeStyles.signinContainer]}
    > 
            <View
                style={{
                  width: "100%",
      
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <View style={[styles.selectFriendContainer, { marginBottom: "2%" }]}>
                  {/* <FriendSelectModalVersionButtonOnly
                    includeLabel={true}
                    width="100%"
                  /> */}
                </View>
      
      
                <View
                  style={[
                    styles.backColorContainer,
                    themeStyles.genericTextBackground,
                    { borderColor: themeAheadOfLoading.lightColor },
                  ]}
                >
      <View
        style={{
          height: isKeyboardVisible ? "30%" : "14%",
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
          height: isKeyboardVisible ? "50%" : "34%",
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
          image={require("../assets/shapes/redheadcoffee.png")}
        />
      )}


      </View>
      
      </View>
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
  backColorContainer: {
    height: "96%",
    alignContent: "center",
    //paddingHorizontal: "4%",
    paddingTop: "6%",
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1999,
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
});

export default ScreenLocationEdit;
