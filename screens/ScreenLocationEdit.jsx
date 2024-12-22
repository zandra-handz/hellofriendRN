import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import TextEditBox from "../components/TextEditBox";
import FlatListChangeChoice from "../components/FlatListChangeChoice";

import { useNavigation, useRoute } from "@react-navigation/native";

import useLocationFunctions from "../hooks/useLocationFunctions";

import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";
import KeyboardSaveButton from "../components/KeyboardSaveButton";

const ScreenLocationEdit = () => {
  const route = useRoute();
  const location = route.params?.location ?? null;
  const notes = route.params?.notes ?? null;
  const parking = route.params?.parking ?? null;

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  const { handleUpdateLocation, updateLocationMutation } =
    useLocationFunctions();

  const { themeStyles } = useGlobalStyle();
  const editedTextRef = useRef(null);

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
    { label: "Free parking", value:  "location has free parking lot"},
    { label: "Free parking nearby", value: "free parking lot nearby"},
    { label: "Street parking", value: "street parking"},
    { label: "Stressful parking", value: "fairly stressful or unreliable street parking" },
    { label: "No parking", value: "no parking whatsoever" },
    { label: "unspecified", value: "unspecified" },
  ];
  

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
    <View style={[styles.container, themeStyles.container]}>
      <TextEditBox
        ref={editedTextRef}
        title={"Edit notes"}
        mountingText={notes}
        onTextChange={updateNoteEditString}
      />

      <FlatListChangeChoice
        horizontal={true}
        choicesArray={parkingScores}
        ref={editedParkingScoreRef}
        title={"Change parking score"}
        oldChoice={parking}
        onChoiceChange={updateParkingScore}
      />
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
            label="SAVE CHANGES " 
            onPress={handleSubmit}
            isDisabled={false} 
            image={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ScreenLocationEdit;
