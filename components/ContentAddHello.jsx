//could add some text like the 'date added' tiny header on the moments card
//when the notes + keyboard are up, stating location (if entered) and date

import React, {
  useState,
  useEffect,
  useLayoutEffect,
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

import { LinearGradient } from "expo-linear-gradient";

import { useMessage } from "../context/MessageContext";

import TextEditBox from "../components/TextEditBox";

import useLocationFunctions from "../hooks/useLocationFunctions";

import FriendSelectModalVersionButtonOnly from "../components/FriendSelectModalVersionButtonOnly";

import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useAuthUser } from "../context/AuthUserContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useUpcomingHelloes } from "../context/UpcomingHelloesContext";
import { useFriendList } from "../context/FriendListContext";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
 

import PickerMultiMoments from "../components/PickerMultiMoments";

import useHelloesData from "../hooks/useHelloesData";

import Icon from "react-native-vector-icons/FontAwesome";
import PickerDate from "../components/PickerDate";
import PickerHelloType from "../components/PickerHelloType";
import PickerHelloLocation from "../components/PickerHelloLocation";

import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";
import KeyboardSaveButton from "../components/KeyboardSaveButton";
import DoubleChecker from "../components/DoubleChecker";

const ContentAddHello = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { showMessage } = useMessage();

  const { createHelloMutation, handleCreateHello } = useHelloesData();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);

  const { authUserState } = useAuthUser();
  const { selectedFriend, setFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
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
  const [momentsSelected, setMomentsSelected] = useState([]);
  const [deleteMoments, setDeleteMoments] = useState(false);

  const editedTextRef = useRef(null);

  const { width, height } = Dimensions.get("window");

  const oneFifthHeight = height / 5;
  const oneSixthHeight = height / 6;
  const oneSeventhHeight = height / 7;
  const oneHalfHeight = height / 2; //notes when keyboard is up

  const { locationList, locationListIsSuccess, savedLocationList } =
    useLocationFunctions();

  const { updateTrigger, setUpdateTrigger } = useUpcomingHelloes();

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
      showMessage(true, null, "Hello saved!");
      setUpdateTrigger((prev) => !prev);
      setFriend(null);
      navigateToMainScreen();
    }
  }, [createHelloMutation.isSuccess]);

  useLayoutEffect(() => {
    showMessage(
      true,
      null,
      "Changes made on this page will not be saved if you exit."
    );
  }, []);

  const toggleDeleteMoments = () => {
    setDeleteMoments(!deleteMoments);
  };

  const navigateToMainScreen = () => {
    navigation.navigate("hellofriend");
  };

  const updateNoteEditString = (text) => {
    if (editedTextRef && editedTextRef.current) {
      editedTextRef.current.setText(text);
      console.log("in parent", editedTextRef.current.getText());
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
    console.log(dateWithoutTime);
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
    console.log(`Hello type selected: ${typeChoices[index]}`);

    if (index === 1 || index === 2) {
      console.log("open location modal");

      toggleLocationModal();
    } else {
      setSelectedHelloLocation("None");
    }
    console.log(index);
  };

  const toggleLocationModal = () => {
    setLocationModalVisible(!locationModalVisible);
  };

  const handleMomentSelect = (selectedMoments) => {
    setMomentsSelected(selectedMoments);
    //console.log("Selected Moments in Parent:", selectedMoments);
  };

  const handleSave = async () => {
    try {
      if (selectedFriend) {
        const formattedDate = helloDate.toISOString().split("T")[0];
        const momentsDictionary = {};
        momentsSelected.forEach((moment) => {
          momentsDictionary[moment.id] = {
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

        await handleCreateHello(requestData);
      }
    } catch (error) {
      console.log("catching errors elsewhere, not sure i need this", error);
    }
  };

  useEffect(() => {
    if (createHelloMutation.isError) {
      showMessage(true, null, "Error saving Hello. Please try again!");
    }
  }, [createHelloMutation.isError]);

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      <>
        <View
          style={{
            width: "100%",

            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.selectFriendContainer, { marginBottom: "2%" }]}>
            <FriendSelectModalVersionButtonOnly
              includeLabel={true}
              width="100%"
            />
          </View>

          <View
            style={[
              styles.backColorContainer,
              themeStyles.genericTextBackground,
              { borderColor: themeAheadOfLoading.lightColor },
            ]}
          >
            <View style={styles.paddingForElements}>
              <>
                {!isKeyboardVisible && (
                  <PickerHelloType
                    containerText=""
                    selectedTypeChoice={selectedTypeChoice}
                    onTypeChoiceChange={handleTypeChoiceChange}
                    useSvg={true}
                  />
                )}

                {selectedTypeChoiceText && (
                  <>
                    <>
                      {!isKeyboardVisible && (
                        <>
                          {locationListIsSuccess && (
                            <View style={{}}>
                              <PickerHelloLocation
                                faveLocations={faveLocations}
                                savedLocations={savedLocationList}
                                onLocationChange={handleLocationChange}
                                modalVisible={locationModalVisible}
                                setModalVisible={setLocationModalVisible}
                                selectedLocation={selectedHelloLocation}
                              />
                            </View>
                          )}
                        </>
                      )}

                      {!isKeyboardVisible && (
                        <View style={{}}>
                          <PickerDate
                            buttonHeight={36}
                            value={helloDate}
                            mode="date"
                            display="default"
                            containerText=""
                            maximumDate={new Date()}
                            onChange={onChangeDate}
                            showDatePicker={showDatePicker}
                            setShowDatePicker={setShowDatePicker}
                            inline={true}
                          />
                        </View>
                      )}

                      <TextEditBox
                        width={"100%"}
                        height={
                          !isKeyboardVisible ? oneSeventhHeight : oneHalfHeight
                        }
                        ref={editedTextRef}
                        autoFocus={false}
                        title={"Add notes"}
                        helperText={
                          !isKeyboardVisible ? null : "Press enter to exit"
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

                      <View style={{}}>
                        <PickerMultiMoments
                          onMomentSelect={handleMomentSelect}
                        />
                      </View>
                      <View style={[styles.deleteRemainingContainer]}>
                        <TouchableOpacity
                          onPress={toggleDeleteMoments}
                          style={[styles.controlButton, themeStyles.footerIcon]}
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
                            name={deleteMoments ? "check-square-o" : "square-o"}
                            size={20}
                            style={[styles.checkbox, themeStyles.footerIcon]}
                          />
                        </TouchableOpacity>
                      </View>
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
                      fontFamily={"Poppins-Bold"}
                      image={require("../assets/shapes/redheadcoffee.png")}
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
          </View>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    zIndex: 1,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    zIndex: 2000,
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
  selectFriendContainer: {
    width: "100%",
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
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
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  paddingForElements: {
    paddingHorizontal: "4%",
    flex: 1,
    //backgroundColor: 'pink',
    paddingBottom: "5%",
    flexDirection: "column",
    justifyContent: "space-between",
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
