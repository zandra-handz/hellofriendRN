// <TextInput
//   style={[styles.input, themeStyles.input]}
// value={customTitle}
// onChangeText={setCustomTitle}
// placeholder='Optional custom title'
// placeholderTextColor='darkgray'
// />

import React, { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useGlobalStyle } from "../context/GlobalStyleContext";
import ShopAddOutlineSvg from "../assets/svgs/shop-add-outline.svg";
import AlertFormSubmit from "../components/AlertFormSubmit";

// import useLocationFunctions from '../hooks/useLocationFunctions';
import { useLocations } from "../context/LocationsContext";

import { useFriendList } from "../context/FriendListContext";
import PickerParkingType from "../components/PickerParkingType";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";

import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";

import BodyStyling from "../layoutComponents/BodyStyling";
import BelowHeaderContainer from "../layoutComponents/BelowHeaderContainer";

import TextEditBox from "../components/TextEditBox";

const ContentAddLocation = ({ title, address, close }) => {
  const notesTextRef = useRef(null);
  const customTitleRef = useRef(null);

  const navigation = useNavigation();

  const { themeStyles } = useGlobalStyle();
  const { friendList } = useFriendList();
  const { handleCreateLocation, createLocationMutation } = useLocations();

  const [parkingType, setParkingType] = useState(null);
  const [parkingTypeText, setParkingTypeText] = useState(null);
  const [typeChoices] = useState([
    "location has free parking lot",
    "free parking lot nearby",
    "street parking",
    "fairly stressful or unreliable street parking",
    "no parking whatsoever",
    "unspecified",
  ]);
  const [personalExperience, setPersonalExperience] = useState("");
  const [customTitle, setCustomTitle] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isMakingCall, setIsMakingCall] = useState(false);

  const onParkingTypeChange = (index) => {
    setParkingType(index);
    setParkingTypeText(`${typeChoices[index]}`);
    console.log(`Parking type selected: ${typeChoices[index]}`);
  };

  const handleFriendSelect = (friendId) => {
    const updatedFriends = selectedFriends.includes(friendId)
      ? selectedFriends.filter((id) => id !== friendId)
      : [...selectedFriends, friendId];
    setSelectedFriends(updatedFriends);
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

    try {
      await handleCreateLocation(
        friends,
        title,
        address,
        parkingTypeText,
        trimmedCustomTitle,
        personalExperience
      );
      //close(); // Close after submission completes
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  return (
    <View style={styles.container}>
      <BelowHeaderContainer
        height={30}
        minHeight={30}
        maxHeight={30}
        alignItems="center"
        marginBottom="2%"
        justifyContent="center"
        children={null}
      />
      <BodyStyling
        height={"96%"}
        width={"101%"}
        minHeight={"96%"}
        paddingTop={"4%"}
        paddingHorizontal={"0%"} //too much padding will cause the Type picker to flow to next line
        children={
          <>
          <View style={styles.paddingForElements}>

          <>
            <View style={styles.locationDetailsContainer}>
              <Text style={[styles.locationTitle, themeStyles.subHeaderText]}>
                {title}
              </Text>
              <Text style={[styles.locationAddress, themeStyles.genericText]}>
                {address}
              </Text>

              <Text style={[styles.previewTitle, themeStyles.genericText]}>
                Give this location a parking score
              </Text>

              <PickerParkingType
                height={"20%"}
                containerText=""
                selectedTypeChoice={parkingType}
                onTypeChoiceChange={onParkingTypeChange}
              />

              <TextInput
                style={[themeStyles.input, styles.textArea]}
                value={personalExperience}
                onChangeText={setPersonalExperience}
                placeholder="Optional notes"
                placeholderTextColor="darkgray"
                multiline
                numberOfLines={4}
              />

              {/* <View style={styles.friendCheckboxesContainer}>
                <FlatList
                  data={friendList}
                  keyExtractor={(item) => item.id.toString()} // Ensure each key is unique
                  renderItem={({ item }) => (
                    <CheckBox
                      title={item.name}
                      checked={selectedFriends.includes(item.id)}
                      onPress={() => handleFriendSelect(item.id)}
                    />
                  )}
                  style={styles.flatList}
                  showsVerticalScrollIndicator={false}
                />
              </View> */}
            </View>
            </>
            </View> 
            <ButtonBaseSpecialSave
              label="SAVE "
              maxHeight={80}
              onPress={handleSubmit}
              isDisabled={false}
              fontFamily={"Poppins-Bold"}
              image={require("../assets/shapes/redheadcoffee.png")}
            />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    zIndex: 1,
  },
  paddingForElements: {
    paddingHorizontal: "4%",
    flex: 1,
    //backgroundColor: 'pink',
    paddingBottom: "5%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  locationDetailsContainer: {
    borderRadius: 8,
    marginVertical: "2%",
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationAddress: {
    fontSize: 16,
  },
  previewContainer: {},
  previewTitle: {
    fontSize: 16,
    marginBottom: "4%",
  },
  input: {
    height: "auto",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textArea: {
    height: "100",
    textAlignVertical: "top",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
  },
  friendCheckboxesContainer: {
    height: 130,
  },
  flatList: {},
});

export default ContentAddLocation;
