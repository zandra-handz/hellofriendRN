//could add some text like the 'date added' tiny header on the moments card
//when the notes + keyboard are up, stating location (if entered) and date

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet, 
  Keyboard, 
  Alert,
} from "react-native";

import DeleteUnused from "./DeleteUnused";
import LocationModal from "../selectors/LocationModal";
import EscortBar from "../moments/EscortBar";
import IdeasAdded from "./IdeasAdded";
import HelloNotes from "./HelloNotes";
import PickHelloDate from "./PickHelloDate";
import PickHelloLoc from "./PickHelloLoc";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import PickHelloType from "./PickHelloType";
import { useUserStats } from "@/src/context/UserStatsContext";
import { useNavigation } from "@react-navigation/native";
import { useLocations } from "@/src/context/LocationsContext"; 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import DoubleChecker from "@/app/components/alerts/DoubleChecker";
import HelloNotesModal from "../headers/HelloNotesModal";
import { useFocusEffect } from "@react-navigation/native";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useCreateHello from "@/src/hooks/HelloesCalls/useCreateHello";
import useRefetchUpcomingHelloes from "@/src/hooks/UpcomingHelloesCalls/useRefetchUpcomingHelloes";
import { appFontStyles } from "@/src/hooks/StaticFonts";
// WARNING! Need to either remove back button when notes are expanded, or put notes on their own screen
// otherwise it's too easy to back out of the entire hello and lose what is put there when just trying to back out of editing the notes
const ContentAddHello = ({
  userId,

  fontStyle,
  primaryColor,
  backgroundColor,
}) => {
  const navigation = useNavigation();

  const { refetchUpcomingHelloes } = useRefetchUpcomingHelloes({
    userId: userId,
  });
  const { preAdded, allCapsulesList } = useCapsuleList();
  const { refetchUserStats } = useUserStats();
  const filterOutNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  const [momentsAdded, setMomentsAdded] = useState([]);
  const { createHelloMutation, handleCreateHello } = useCreateHello({
    userId: userId,
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);
const { navigateBack} = useAppNavigations();
  const { selectedFriend, deselectFriend } = useSelectedFriend();

  const { friendDash } = useFriendDash();

  const [helloDate, setHelloDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const typeChoices = [
    "via text or social media",
    "in person",
    "happenstance",
    "unspecified",
  ];

  const [selectedTypeChoice, setSelectedTypeChoice] = useState(null);
  const [selectedTypeChoiceText, setSelectedTypeChoiceText] = useState(null);

  const [selectedHelloLocation, setSelectedHelloLocation] =
    useState("Select location");
  const [existingLocationId, setExistingLocationId] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [deleteMoments, setDeleteMoments] = useState(false);

  const [notePreviewText, setNotePreviewText] = useState("No notes");

  const editedTextRef = useRef(null);

  const { locationList, locationListIsSuccess } = useLocations();

  useFocusEffect(
    useCallback(() => {
      // const moments = filterOutNonAdded;
      setMomentsAdded(filterOutNonAdded);
      return () => {
        setMomentsAdded([]);
      };
    }, [allCapsulesList])
  );

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

const [ autoTrigger, setAutoTrigger ] = useState(false);
 

  const faveLocations = useMemo(() => {
    if (!locationList || !friendDash?.friend_faves?.locations) {
      return [];
    }

    return locationList.filter((location) =>
      friendDash.friend_faves.locations.includes(location.id)
    );
  }, [locationList, friendDash]);


    const goBack = () => {
    Alert.alert(`Leave`, `Go back to ideas screen? (Inputs here will be lost.)`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: `Yes`, onPress: () => navigateBack()},
    ]);

    // setIsDoubleCheckerVisible(true);
  };

  const openDoubleChecker = () => {
    Alert.alert(`Save`, `Save hello?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: `Yes`, onPress: () => handleSave() },
    ]);

    // setIsDoubleCheckerVisible(true);
  };

  const toggleDoubleChecker = () => {
    setIsDoubleCheckerVisible((prev) => !prev);
  };

  const [justDeselectedFriend, setJustDeselectedFriend] = useState(false);

  useEffect(() => {
    if (createHelloMutation.isSuccess) {
      showFlashMessage(`Hello saved!`, false, 2000);
      deselectFriend(); // this sets selectedFriend to null
      setJustDeselectedFriend(true);
    }
  }, [createHelloMutation.isSuccess]);

  useEffect(() => {
    if (justDeselectedFriend && selectedFriend === null) {
      console.log("Friend is now deselected, proceeding…");

      refetchUpcomingHelloes();
      refetchUserStats();

      navigateToMainScreen();

      setJustDeselectedFriend(false); // reset the flag
    }
  }, [justDeselectedFriend, selectedFriend]);

  const toggleDeleteMoments = () => {
    setDeleteMoments(!deleteMoments);
  };

  const navigateToMainScreen = () => {
    navigation.navigate("hellofriend");
  };

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.setText(text);
    }
  };

  const setPreviewText = () => {
    if (editedTextRef && editedTextRef.current) {
      setNotePreviewText(editedTextRef.current.getText());
    }
  };

  const handleCloseModal = () => {
    setPreviewText();
    setNotesModalVisible(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || friendDate;

    const dateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    setHelloDate(dateWithoutTime);
    setShowDatePicker(false);
  };

  const handleLocationChange = (item) => {
    if (item && item.id) {
      setSelectedHelloLocation(item.title);
      setExistingLocationId(item.id);
      setCustomLocation(null);
    } else {
      if (item) {
        setSelectedHelloLocation(item);
        setCustomLocation(item);
        setExistingLocationId(null);
      } else {
        setSelectedHelloLocation("None");
      }
    }
  };

  const handleTypeChoiceChange = (index) => {
    setSelectedTypeChoice(index);
    setSelectedTypeChoiceText(`${typeChoices[index]}`);
    if (index === 1 || index === 2) {
      toggleLocationModal();
    } else {
      setSelectedHelloLocation("None");
    }
  };

  const toggleLocationModal = () => {
    setLocationModalVisible(!locationModalVisible);
  };

  const handleSave = () => {
    try {
      if (selectedFriend) {
        const formattedDate = helloDate.toISOString().split("T")[0];
        const momentsDictionary = {};
        momentsAdded.forEach((moment) => {
          momentsDictionary[moment.id] = {
            user_category: moment.user_category || null,
            user_category_name: moment.user_category_name || null,
            typed_category: moment.typedCategory,
            capsule: moment.capsule,
          };
        });
        const requestData = {
          friend: selectedFriend.id,
          type: selectedTypeChoiceText,
          manualLocation: customLocation,
          // notes: editedTextRef.current.getText(),
          notes: notePreviewText,
          locationId: existingLocationId,
          date: formattedDate,
          momentsShared: momentsDictionary,
          deleteMoments: deleteMoments ? true : false,
        };

        handleCreateHello(requestData);
        showFlashMessage(`Hello added!`, false, 1000);
      }
    } catch (error) {
      console.log("catching errors elsewhere, not sure i need this", error);
    }
  };

  return (
    <View
      style={[
        // containerStyle,
        {
          flex: 1,
        },
      ]}
    >
      <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
      
      <Text style={[fontStyle, { color: primaryColor }]}>
        New hello details
      </Text>
        
      </View>
      <>
        <View style={{flex: 1, paddingHorizontal: 4, paddingVertical: 10}}>
          <View style={{ flex: 1 }}>
            {!isKeyboardVisible && (
              <View
                style={{
                  width: "100%",
                  height: 100,
                }}
              >
                <PickHelloType
                  primaryColor={primaryColor}
                  selected={selectedTypeChoice}
                  onChange={handleTypeChoiceChange}
                />
              </View>
            )}

            {selectedTypeChoiceText && 
              locationListIsSuccess && (
                <View
                  style={{
                    width: "100%",
                    height: 100,
                    marginTop: 10,
                    zIndex: 5000,
                    // padding: 10, 
                  }}
                >
                  <PickHelloLoc
                    primaryColor={primaryColor}
                    selected={selectedHelloLocation}
                    onChange={handleLocationChange}
                    faveLocations={faveLocations}
                    savedLocations={locationList}
                    setModalVisible={setLocationModalVisible}
                    selectedLocation={selectedHelloLocation}
                  />
                  <PickHelloDate
                    primaryColor={primaryColor}
                    selected={helloDate}
                    onChange={onChangeDate}
                    modalVisible={showDatePicker}
                    setModalVisible={setShowDatePicker}
                  />

                  <HelloNotes
                    primaryColor={primaryColor}
                    selected={notePreviewText}
                    setModalVisible={setNotesModalVisible}
                  />

                  <IdeasAdded
                    primaryColor={primaryColor}
                    selected={momentsAdded.length}
                    onPress={goBack}
                  />
                 <DeleteUnused
                 primaryColor={primaryColor}
                 checkboxState={deleteMoments}
                 toggleCheckbox={toggleDeleteMoments}
                 
                 />
                  {notesModalVisible && (
                    <HelloNotesModal
                      primaryColor={primaryColor}
                      isVisible={notesModalVisible}
                      closeModal={handleCloseModal}
                      textRef={editedTextRef}
                      mountingText={notePreviewText}
                      onTextChange={updateNoteEditString}
              
                    />
                  )}
                </View>
              )}

            {!isKeyboardVisible &&
              selectedTypeChoiceText &&
              locationListIsSuccess && (
                <LocationModal
                  primaryColor={primaryColor}
                  faveLocations={faveLocations}
                  savedLocations={locationList}
                  onLocationChange={handleLocationChange}
                  modalVisible={locationModalVisible}
                  setModalVisible={setLocationModalVisible}
                  selectedLocation={selectedHelloLocation}
                />
              )}
          </View>

          <></>
          {!isKeyboardVisible && selectedTypeChoiceText && (
            <EscortBar
              manualGradientColors={manualGradientColors}
              subWelcomeTextStyle={appFontStyles.subWelcomeText}
              primaryColor={primaryColor}
              primaryBackground={backgroundColor}
              forwardFlowOn={false}
              label={"Save hello"}
              onPress={openDoubleChecker}
            />
          )}
        </View>

        {isDoubleCheckerVisible && (
          <DoubleChecker
            isVisible={isDoubleCheckerVisible}
            toggleVisible={toggleDoubleChecker}
            singleQuestionText="Ready to save hello?"
            onPress={() => handleSave()}
            manualGradientColors={manualGradientColors}
            primaryColor={primaryColor}
          />
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",

    zIndex: 1,
  },    
  checkbox: {
    paddingLeft: 10,
    paddingBottom: 2,
    paddingRight: 1,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButtonText: {
    fontSize: 12,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  buttonContainer: {
    width: "104%",
    height: "auto",
    position: "absolute",
    bottom: -10,
    flex: 1,
    right: -2,
    left: -2,
  },
});

export default ContentAddHello;
