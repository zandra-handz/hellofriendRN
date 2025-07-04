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
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from "react-native";
import { useMessage } from "@/src/context/MessageContext";

import TextEditBox from "@/app/components/appwide/input/TextEditBox";
import TotalMomentsAddedUI from "../moments/TotalMomentsAddedUI";
import TitleContainerUI from "./TitleContainerUI";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useHelloes } from "@/src/context/HelloesContext";
import { useLocations } from "@/src/context/LocationsContext";
import Icon from "react-native-vector-icons/FontAwesome";
import PickerDate from "../selectors/PickerDate";
import PickerHelloType from "../selectors/PickerHelloType";
import PickerHelloLocation from "../selectors/PickerHelloLocation";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import KeyboardSaveButton from "@/app/components/appwide/button/KeyboardSaveButton";
import DoubleChecker from "@/app/components/alerts/DoubleChecker";
import BodyStyling from "../scaffolding/BodyStyling";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import { useFocusEffect } from "@react-navigation/native";
 
// WARNING! Need to either remove back button when notes are expanded, or put notes on their own screen
// otherwise it's too easy to back out of the entire hello and lose what is put there when just trying to back out of editing the notes
const ContentAddHello = () => {
  const navigation = useNavigation();
const {refetchUpcomingHelloes } = useUpcomingHelloes();
  const { showMessage } = useMessage();
  const { preAdded, allCapsulesList } = useCapsuleList();

  const filterOutNonAdded = allCapsulesList.filter((capsule) =>
    preAdded?.includes(capsule.id)
  );

  const [momentsAdded, setMomentsAdded] = useState([]);
  const { createHelloMutation, handleCreateHello } = useHelloes();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);

  const { selectedFriend, setFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
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

  const editedTextRef = useRef(null);

  const { height } = Dimensions.get("window");

  const oneSeventhHeight = height / 7;
  const oneHalfHeight = height / 2; //notes when keyboard is up

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

  const faveLocations = useMemo(() => {
    if (!locationList || !friendDashboardData?.[0]?.friend_faves?.locations) {
      return [];
    }

    return locationList.filter((location) =>
      friendDashboardData[0].friend_faves.locations.includes(location.id)
    );
  }, [locationList, friendDashboardData]);

  const openDoubleChecker = () => {
    setIsDoubleCheckerVisible(true);
  };

  const toggleDoubleChecker = () => {
    setIsDoubleCheckerVisible((prev) => !prev);
  };

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (createHelloMutation.isSuccess) {
      refetchUpcomingHelloes();
      showMessage(true, null, "Hello saved!"); 
      setFriend(null);
      navigateToMainScreen();
    }
  }, [createHelloMutation.isSuccess]);

  // useLayoutEffect(() => {
  //   showMessage(
  //     true,
  //     null,
  //     "Changes made on this page will not be saved if you exit."
  //   );
  // }, []);

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
      // console.log("open location modal");

      toggleLocationModal();
    } else {
      setSelectedHelloLocation("None");
    }
    // console.log(index);
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
            typed_category: moment.typedCategory,
            capsule: moment.capsule,
          };
        });
        const requestData = {
          friend: selectedFriend.id,
          type: selectedTypeChoiceText,
          manualLocation: customLocation,
          notes: editedTextRef.current.getText(),
          locationId: existingLocationId,
          date: formattedDate,
          momentsShared: momentsDictionary,
          deleteMoments: deleteMoments ? true : false,
        };

        handleCreateHello(requestData);
      }
    } catch (error) {
      console.log("catching errors elsewhere, not sure i need this", error);
    }
  };

  // useEffect(() => {
  //   if (createHelloMutation.isError) {
  //     showMessage(true, null, "Error saving Hello. Please try again!");
  //   }
  // }, [createHelloMutation.isError]);

  return (
    <View style={[styles.container]}>
      <>
        <View
          style={{
            width: "100%",

            flexDirection: "column",
          }}
        >
          <BelowHeaderContainer
            height={10}
            minHeight={10}
            maxHeight={10}
            alignItems="center"
            marginBottom="2%"
            justifyContent="center"
          />

          <BodyStyling
            height={"100%"}
            width={"100%"}
            minHeight={"96%"}
            paddingTop={0}
            paddingHorizontal={0} //too much padding will cause the Type picker to flow to next line
            children={
              <>
                <View style={styles.paddingForElements}>
                  <>
                    {!isKeyboardVisible && (
                      <TitleContainerUI
                        height={140}
                        title={"Type"}
                        children={
                          <PickerHelloType
                            selectedTypeChoice={selectedTypeChoice}
                            onTypeChoiceChange={handleTypeChoiceChange}
                          />
                        }
                      />
                    )}

                    {selectedTypeChoiceText && (
                      <>
                        <>
                          {!isKeyboardVisible && (
                            <>
                              {locationListIsSuccess && (
                                <TitleContainerUI
                                  height={60}
                                  title={"Location"}
                                  children={
                                    <PickerHelloLocation
                                      faveLocations={faveLocations}
                                      savedLocations={locationList}
                                      onLocationChange={handleLocationChange}
                                      modalVisible={locationModalVisible}
                                      setModalVisible={setLocationModalVisible}
                                      selectedLocation={selectedHelloLocation}
                                    />
                                  }
                                />
                              )}
                            </>
                          )}

                          {!isKeyboardVisible && (
                            <TitleContainerUI
                              height={60}
                              title={"Date"}
                              children={
                                <PickerDate
                                  buttonHeight={36}
                                  value={helloDate}
                                  mode="date"
                                  display="default"
                                  onChange={onChangeDate}
                                  showDatePicker={showDatePicker}
                                  setShowDatePicker={setShowDatePicker}
                                />
                              }
                            />
                          )}
                          <TitleContainerUI
                            height={
                              !isKeyboardVisible
                                ? oneSeventhHeight
                                : oneHalfHeight
                            }
                            title={"Notes"}
                            children={
                              <TextEditBox
                                width={"100%"}
                                height={
                                  !isKeyboardVisible
                                    ? oneSeventhHeight
                                    : oneHalfHeight
                                }
                                ref={editedTextRef}
                                autoFocus={false}
                                title={""}
                                helperText={
                                  !isKeyboardVisible
                                    ? null
                                    : "Press enter to exit"
                                }
                                iconColor={
                                  !isKeyboardVisible
                                    ? themeStyles.genericText.color
                                    : "red"
                                }
                                mountingText={""}
                                onTextChange={updateNoteEditString}
                                multiline={false}
                              />
                            }
                          />

                          <TitleContainerUI
                            height={180}
                            title={`Talked: ${momentsAdded.length}`}
                            children={
                              <TotalMomentsAddedUI
                                momentsAdded={momentsAdded}
                              />
                            }
                          />

                          <TitleContainerUI
                            height={40}
                            title={""}
                            children={
                              <TouchableOpacity
                                onPress={toggleDeleteMoments}
                                style={[
                                  styles.controlButton,
                                  themeStyles.footerIcon,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.controlButtonText,
                                    { color: themeStyles.footerText.color },
                                  ]}
                                >
                                  {"Delete unused?"}
                                </Text>
                                <Icon
                                  name={
                                    deleteMoments
                                      ? "check-square-o"
                                      : "square-o"
                                  }
                                  size={20}
                                  style={[
                                    styles.checkbox,
                                    themeStyles.footerIcon,
                                  ]}
                                />
                              </TouchableOpacity>
                            }
                          />
                        </>
                      </>
                    )}
                  </>
                </View>

                {helloDate &&
                  //selectedFriend &&
                  //!loadingNewFriend &&
                  selectedTypeChoice !== null && (
                    <>
                      {!isKeyboardVisible && (
                        <ButtonBaseSpecialSave
                          label="SAVE HELLO! "
                          maxHeight={80}
                          onPress={openDoubleChecker}
                          isDisabled={
                            selectedFriend && !loadingNewFriend ? false : true
                          }
                          image={require("@/app/assets/shapes/redheadcoffee.png")}
                        />
                      )}

                      {isKeyboardVisible && (
                        <View
                          style={{
                            position: "absolute",
                            bottom: 40,
                            left: 0,
                            right: 0,
                            width: "100%",
                            flex: 1,
                          }}
                        >
                          <KeyboardSaveButton
                            label="SAVE HELLO! "
                            onPress={openDoubleChecker}
                            isDisabled={
                              selectedFriend && !loadingNewFriend ? false : true
                            }
                            image={false}
                          />
                        </View>
                      )}
                    </>
                  )}
              </>
            }
          />
        </View>

        {isDoubleCheckerVisible && (
          <DoubleChecker
            isVisible={isDoubleCheckerVisible}
            toggleVisible={toggleDoubleChecker}
            singleQuestionText="Ready to save hello?"
            onPress={() => handleSave()}
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
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationContainer: {
    width: "50%",
  },
  dateContainer: {
    width: "50%",
  },
  momentsContainer: {
    flex: 1,
    width: "100%",
    minHeight: 100,
  },

  locationTitle: {
    fontSize: 17,
    fontFamily: "Poppins-Regular",
  },
  inputContainer: {
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  deleteRemainingContainer: {
    // position: "absolute",
    // bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  paddingForElements: {
    paddingHorizontal: 0,
    flex: 1,

    //backgroundColor: 'pink',
    paddingBottom: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
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
