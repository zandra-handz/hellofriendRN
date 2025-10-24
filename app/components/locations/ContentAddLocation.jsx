import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import useCreateLocation from "@/src/hooks/LocationCalls/useCreateLocation";
import { View, Keyboard, StyleSheet } from "react-native";
import LocationAddress from "./LocationAddress";
import EscortBar from "../moments/EscortBar";
import FlatListChangeChoice from "@/app/components/appwide/FlatListChangeChoice";
import TextEditBox from "@/app/components/appwide/input/TextEditBox";

const ContentAddLocation = ({
  userId,
  lightDarkTheme, 
  themeColors,
  primaryColor = "orange",
  backgroundColor = "red",
  title,
  address,
}) => {
  const notesTextRef = useRef(null);
  const categoryRef = useRef(null);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  const { handleCreateLocation, createLocationMutation } = useCreateLocation({
    userId: userId,
  });

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
  const [personalExperience, setPersonalExperience] = useState("");
  const [customTitle, setCustomTitle] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isMakingCall, setIsMakingCall] = useState(false);

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

  const updateCategoryEditString = (text) => {
    if (categoryRef && categoryRef.current) {
      categoryRef.current.setText(text);
      console.log("in parent", categoryRef.current.getText());
    }
  };

  const updateNoteEditString = (text) => {
    if (notesTextRef && notesTextRef.current) {
      notesTextRef.current.setText(text);
      console.log("in parent", notesTextRef.current.getText());
    }
  };

  const parkingScoreRef = useRef(null);

  const updateParkingScore = (text) => {
    if (parkingScoreRef && parkingScoreRef.current) {
      parkingScoreRef.current.setText(text);
      console.log("in parent", parkingScoreRef.current.getText());
    }
  };

  useEffect(() => {
    if (createLocationMutation.isSuccess) {
      navigation.goBack();
    }
  }, [createLocationMutation]);

  const handleSubmit = async () => {
    setIsMakingCall(true);
    const trimmedCustomTitle = customTitle?.trim() || null;
    const friends = selectedFriends.map((id) => Number(id));
    const parkingTypeText = parkingScoreRef.current.getText();
    const personalExperience = notesTextRef.current.getText();

    try {
      await handleCreateLocation(
        friends,
        title,
        address,
        parkingTypeText,
        personalExperience
      );
      //close(); // Close after submission completes
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  return (
    <>
      <View style={styles.bodyWrapper}>
        <View style={styles.everythingBesidesTypeWrapper}>
          <LocationAddress address={address} primaryColor={primaryColor} />
          <TextEditBox
            ref={categoryRef}
            autoFocus={true}
            title={"Add to category: "}
            mountingText={""}
            onTextChange={updateCategoryEditString}
            multiline={false}
            height={"100%"}
          />
          <View
            style={{
              height: isKeyboardVisible ? "50%" : "30%",
              flexGrow: 1,
              marginBottom: "3%",
            }}
          >
            <TextEditBox
              ref={notesTextRef}
              autoFocus={false}
              title={"Add notes"}
              mountingText={""}
              onTextChange={updateNoteEditString}
              height={"100%"}
            />
          </View>
          <View style={{ height: "20%", flexShrink: 1, marginBottom: "3%" }}>
            <FlatListChangeChoice 
              primaryColor={lightDarkTheme.primaryText}
              backgroundColor={lightDarkTheme.backgroundColor}
        
             darkColor={themeColors.darkColor}
              horizontal={true}
              choicesArray={parkingScores}
              ref={parkingScoreRef}
              title={"Set parking score"}
              oldChoice={null}
              onChoiceChange={updateParkingScore}
            />
          </View>
        </View>
      </View>

      {!isKeyboardVisible && (
        <EscortBar
          primaryColor={primaryColor}
          primaryBackground={backgroundColor}
          forwardFlowOn={false}
          label={"Save"}
          onPress={handleSubmit}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    padding: 10,
  },
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  typeWrapper: {
    width: "100%",
    height: 100,
  },
  everythingBesidesTypeWrapper: {
    width: "100%",
    height: 100,
    marginTop: 10,
    zIndex: 5000,
  }, 
  textArea: {
    height: "100",
    textAlignVertical: "top",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
  }, 
});

export default ContentAddLocation;
