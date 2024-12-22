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

import { saveHello } from "../api";

import PickerMultiMoments from "../components/PickerMultiMoments";

import Icon from "react-native-vector-icons/FontAwesome";
import PickerDate from "../components/PickerDate";
import PickerHelloType from "../components/PickerHelloType";
import PickerHelloLocation from "../components/PickerHelloLocation";

import ButtonBaseSpecialSave from "../components/ButtonBaseSpecialSave";
import KeyboardSaveButton from "../components/KeyboardSaveButton";

const ContentAddHello = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { showMessage } = useMessage();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { authUserState } = useAuthUser();
  const { selectedFriend, setFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  const [helloDate, setHelloDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeChoices, setTypeChoices] = useState([
    "via text or social media",
    "in person",
    "happenstance",
    "unspecified",
  ]);

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

  const oneSixthHeight = height / 6;
  const oneEighthHeight = height / 7.6; //location
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

  const timeoutRef = useRef(null);

  const createHelloMutation = useMutation({
    mutationFn: (data) => saveHello(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["pastHelloes"], (old) => {
        const updatedHelloes = old ? [data, ...old] : [data];
        return updatedHelloes;
      });

      const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
      console.log("Actual HelloesList after mutation:", actualHelloesList);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
  });

  useEffect(() => {
    if (createHelloMutation.isSuccess) {
      showMessage(true, null, "Hello saved!");
      setUpdateTrigger((prev) => !prev);
      setFriend(null);
      navigateToMainScreen();
    }
  }, [createHelloMutation.isSuccess]);

  const handleCreateHello = async (helloData) => {
    const hello = {
      user: authUserState.user.id,
      friend: helloData.friend,
      type: helloData.type,
      typed_location: helloData.manualLocation,
      additional_notes: helloData.notes,
      location: helloData.locationId,
      date: helloData.date,
      thought_capsules_shared: helloData.momentsShared,
      delete_all_unshared_capsules: deleteMoments ? true : false,
    };

    console.log("Payload before sending:", hello);

    try {
      await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

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

  const handleMomentSelect = (selectedMoments) => {
    setMomentsSelected(selectedMoments);
    console.log("Selected Moments in Parent:", selectedMoments);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || friendDate;
    setShowDatePicker(false);

    const dateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    setHelloDate(dateWithoutTime);
    console.log(dateWithoutTime);
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
                  <View style={{ flex: 1, width: "100%" }}>
                    
                {!isKeyboardVisible && (
                    <> 
                        {locationListIsSuccess && (
                          <View style={{height:oneEighthHeight }}>
                            
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
                          
                        <View style={{height:oneEighthHeight }}>
                            
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
                         
                        </>
                       
                )}
                     

                    <TextEditBox
                      width={"100%"}
                      height={!isKeyboardVisible ? oneSixthHeight : oneHalfHeight}
                      ref={editedTextRef}
                      autoFocus={false}
                      title={"Add notes"}
                      mountingText={""}
                      onTextChange={updateNoteEditString}
                      multiline={false}
                    />

                    <View
                      style={[
                        styles.momentsContainer,
                        {
                          marginVertical: "2%",
                          flex: 1,
                          width: "100%",
                          height: "auto",
                        },
                      ]}
                    >
                      <PickerMultiMoments onMomentSelect={handleMomentSelect} />
                    </View>
                    <View
                      style={[
                        styles.deleteRemainingContainer,
                        { marginVertical: "2%" },
                      ]}
                    >
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
                          {"DELETE UNUSED MOMENTS"}
                        </Text>
                        <Icon
                          name={deleteMoments ? "check-square-o" : "square-o"}
                          size={20}
                          style={[styles.checkbox, themeStyles.footerIcon]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
                
              )}
              </>
            </View>

            {helloDate &&
              selectedFriend &&
              !loadingNewFriend &&
              selectedTypeChoice !== null && (
                <>
                  {!isKeyboardVisible && (
                    <ButtonBaseSpecialSave
                      label="SAVE HELLO! "
                      maxHeight={80}
                      onPress={handleSave}
                      isDisabled={false}
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
                        onPress={handleSave}
                        isDisabled={false}
                        image={false}
                      />
                    </View>
                  )}
                </>
              )}
          </View>
          <View></View>
        </View>

        <View></View>
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
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  paddingForElements: {
    paddingHorizontal: "4%",
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
    fontSize: 15,
    fontFamily: "Poppins-Regular",
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
