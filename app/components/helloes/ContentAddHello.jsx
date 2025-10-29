//could add some text like the 'date added' tiny header on the moments card
//when the notes + keyboard are up, stating location (if entered) and date

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { View, Text, StyleSheet, Keyboard, Alert } from "react-native";

import DeleteUnused from "./DeleteUnused";
import LocationModal from "../selectors/LocationModal";
import EscortBar from "../moments/EscortBar";
import IdeasAdded from "./IdeasAdded";
import HelloNotes from "./HelloNotes";
import PickHelloDate from "./PickHelloDate";
import PickHelloLoc from "./PickHelloLoc";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
// import useFriendDash from "@/src/hooks/useFriendDash";
import PickHelloType from "./PickHelloType";
// import { useUserStats } from "@/src/context/UserStatsContext";
import { useNavigation } from "@react-navigation/native";
// import { useLocations } from "@/src/context/LocationsContext";
import useLocations from "@/src/hooks/useLocations";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import HelloNotesModal from "../headers/HelloNotesModal";
import { useFocusEffect } from "@react-navigation/native";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useCreateHello from "@/src/hooks/HelloesCalls/useCreateHello";
import useRefetchUpcomingHelloes from "@/src/hooks/UpcomingHelloesCalls/useRefetchUpcomingHelloes";
import { AppFontStyles } from "@/app/styles/AppFonts";
 import useUserStats from "@/src/hooks/useUserStats";

import { useAutoSelector } from "@/src/context/AutoSelectorContext";

// WARNING! Need to either remove back button when notes are expanded, or put notes on their own screen
// otherwise it's too easy to back out of the entire hello and lose what is put there when just trying to back out of editing the notes
const ContentAddHello = ({ userId,  primaryColor, backgroundColor }) => {
  const navigation = useNavigation(); 
  const { autoSelectFriend } = useAutoSelector();

  const { refetchUpcomingHelloes } = useRefetchUpcomingHelloes({
    userId: userId,
  });
  const { preAdded, allCapsulesList } = useCapsuleList();
  const { refetchUserStats } = useUserStats({userId: userId, isInitializing: false, enabled: true});
  const filterOutNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  const [momentsAdded, setMomentsAdded] = useState([]);
  const { createHelloMutation, handleCreateHello } = useCreateHello({
    userId: userId,
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const { navigateBack } = useAppNavigations();
  const { selectedFriend, selectFriend, setToFriend, deselectFriend } =
    useSelectedFriend();

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

  const [selectedHelloLocation, setSelectedHelloLocation] = useState(null);
  const [existingLocationId, setExistingLocationId] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [deleteMoments, setDeleteMoments] = useState(false);

  const [notePreviewText, setNotePreviewText] = useState("No notes");

  const editedTextRef = useRef(null);

  const { locationList, locationListIsSuccess } = useLocations({userId: userId, isInitializing: false});

  useFocusEffect(
    useCallback(() => {
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

  const faveLocations = useMemo(() => {
    if (!locationList || !friendDash?.friend_faves?.locations) {
      return [];
    }

    return locationList.filter((location) =>
      friendDash.friend_faves.locations.includes(location.id)
    );
  }, [locationList, friendDash]);

  const goBack = () => {
    Alert.alert(
      `Leave`,
      `Go back to ideas screen? (Inputs here will be lost.)`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: `Yes`, onPress: () => navigateBack() },
      ]
    );
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
  };

  const [justDeselectedFriend, setJustDeselectedFriend] = useState(false);

  useEffect(() => {
    if (createHelloMutation.isSuccess) {
      showFlashMessage(`Hello saved!`, false, 2000);
      if (autoSelectFriend?.customFriend?.id) {
        setToFriend({
          friend: autoSelectFriend.customFriend,
          preConditionsMet: true,
        });
      } else if (autoSelectFriend?.nextFriend?.id) {
        setToFriend({
          friend: autoSelectFriend.nextFriend,
          preConditionsMet: true,
        });
      } else {
        deselectFriend();
      }

      setJustDeselectedFriend(true);
      navigateToMainScreen();
    }
  }, [createHelloMutation.isSuccess, autoSelectFriend]);

  useEffect(() => {
    if (
      // justDeselectedFriend
      // &&
      selectedFriend === null
    ) {
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

  const clearLocation = () => {
    setSelectedHelloLocation(null);
    setCustomLocation(null);
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
  const fontStyle = AppFontStyles.welcomeText;
  const flattenedHeaderStyle = [fontStyle, { color: primaryColor }];

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={flattenedHeaderStyle}>New hello details</Text>
      </View>
      <>
        <View style={styles.bodyWrapper}>
          <View style={{ flex: 1 }}>
            <View style={styles.typeWrapper}>
              <PickHelloType
                primaryColor={primaryColor}
                selected={selectedTypeChoice}
                onChange={handleTypeChoiceChange}
              />
            </View>

            {selectedTypeChoiceText && locationListIsSuccess && (
              <View style={styles.everythingBellowTypeWrapper}>
                <PickHelloLoc
                  primaryColor={primaryColor}
                  selected={selectedHelloLocation}
                  onChange={handleLocationChange}
                  faveLocations={faveLocations}
                  savedLocations={locationList}
                  setModalVisible={setLocationModalVisible}
                  selectedLocation={selectedHelloLocation}
                  clearLocation={clearLocation}
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

            {selectedTypeChoiceText && locationListIsSuccess && (
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

          {!isKeyboardVisible && selectedTypeChoiceText && (
            <EscortBar
              primaryColor={primaryColor}
              primaryBackground={backgroundColor}
              forwardFlowOn={false}
              label={"Save hello"}
              onPress={openDoubleChecker}
            />
          )}
        </View>
      </>
    </View>
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
  everythingBellowTypeWrapper: {
    width: "100%",
    height: 100,
    marginTop: 10,
    zIndex: 5000,
  },
});

export default ContentAddHello;
