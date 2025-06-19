//<Text style={[styles.friendNameText, themeStyles.subHeaderText, {color: calculatedThemeColors.fontColor}]}>
//{selectedFriend ? selectedFriend.name : ''}
//</Text>
//   <HelloFriendFooter />

//put this into a ScrollView in case I need to add to this in case I need to add stuff in the future
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import SettingsStyleHeader from "@/app/components/appwide/SettingsStyleHeader";
import { useMessage } from "@/src/context/MessageContext";

import useFriendFunctions from "@/src/hooks/useFriendFunctions";

import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import ModalColorTheme from "@/app/components/friends/ModalColorTheme";
import EffortPrioritySetter from "@/app/components/friends/EffortPrioritySetter";
import ModalFriendDetails from "@/app/components/friends/ModalFriendDetails";

import DoubleChecker from "@/app/components/alerts/DoubleChecker"; 

import WrenchOutlineSvg from "@/app/assets/svgs/wrench-outline.svg";

import ColorSwatchesSvg from "@/app/components/friends/ColorSwatchesSvg";
import TrashOutlineSvg from "@/app/assets/svgs/trash-outline.svg";

import DetailRow from "@/app/components/appwide/display/DetailRow";

const ScreenFriendSettings = () => {
  const { selectedFriend, setFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend();
  const { handleDeleteFriend, deleteFriendMutation } = useFriendFunctions();
  const { themeAheadOfLoading } = useFriendList();
  const [isDoubleCheckerVisible, setIsDoubleCheckerVisible] = useState(false);
  const { showMessage } = useMessage();
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { darkColor, lightColor } = gradientColorsHome;


    const renderHeader = useCallback(() => (
        <SettingsStyleHeader
          isLoadingComplete={!loadingNewFriend}
          displayText={selectedFriend && selectedFriend?.name}
        />
), [selectedFriend, loadingNewFriend]);

  const [isEffortPriorityModalVisible, setIsEffortPriorityModalVisible] =
    useState(false);
  const [isColorThemeModalVisible, setIsColorThemeModalVisible] =
    useState(false); 

  const openEffortPriorityModal = () => {
    setIsEffortPriorityModalVisible(true);
  };

  const closeEffortPriorityModal = () => {
    setIsEffortPriorityModalVisible(false);
  };

  const openColorThemeModal = () => {
    console.log("opening color theme modal ?");
    setIsColorThemeModalVisible(true);
  };

  const closeColorThemeModal = () => {
    setIsColorThemeModalVisible(false);
  };

  const openDoubleChecker = () => {
    setIsDoubleCheckerVisible(true);
  };

  const toggleDoubleChecker = () => {
    setIsDoubleCheckerVisible((prev) => !prev);
  };

  const handleConfirmDelete = () => {
          Alert.alert('Warning!', `Delete ${selectedFriend.name}? This cannot be undone.`, [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
                  {text: 'Delete', onPress: () => handleDelete()},
     
          ]); 

  };
 
 

  const navigation = useNavigation();

  const friendName = selectedFriend?.name || "friend";
 
 

  const handleDelete = async () => {
    try {
      if (selectedFriend) {
        await handleDeleteFriend(selectedFriend.id);
      }
    } catch (error) {
      console.log("Could not delete friend: ", error);
    }
  };

  const navigateToMainScreen = () => {
    navigation.navigate("hellofriend");
  };
  useEffect(() => {
    if (deleteFriendMutation.isSuccess) {
      showMessage(true, null, ` ${friendName} has been deleted.`);
      //setUpdateTrigger((prev) => !prev);
      setFriend(null);
      navigateToMainScreen();
    }
  }, [deleteFriendMutation.isSuccess]);


  if (!selectedFriend || loadingNewFriend) {
    return;
  }

  return (
    <SafeViewAndGradientBackground   header={renderHeader} includeBackgroundOverlay={true} styles={{ flex: 1 }}>
  

 
          <>
            <ScrollView
              contentContainerStyle={[
                styles.backColorContainer,
                { padding: 10 },
              ]}
              style={{ width: "100%" }}
            >
              <View style={styles.section}>
                <View style={styles.subTitleRow}>
                  <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                    DETAILS
                  </Text>
                </View>
                <ModalFriendDetails mountingDetails={friendDashboardData[0]} />
                <Text style={themeStyles.genericText}></Text>
              </View>

              <View
                style={[
                  styles.divider,
                  { borderBottomColor: themeStyles.modalText.color },
                ]}
              ></View>

              <View style={styles.section}>
                <View style={styles.subTitleRow}>
                  <Text style={[styles.modalSubTitle, themeStyles.genericText]}>
                    SETTINGS
                  </Text>

                  <View style={styles.subTitleButtonContainer}>
                    <WrenchOutlineSvg
                      onPress={openEffortPriorityModal}
                      height={26}
                      width={26}
                      color={themeStyles.genericText.color}
                    />
                  </View>
                </View>

                <EffortPrioritySetter
                  mountingSettings={friendDashboardData[0].suggestion_settings}
                  isModalVisible={isEffortPriorityModalVisible}
                  closeModal={closeEffortPriorityModal}
                />
              </View>

              <View
                style={[
                  styles.divider,
                  { borderBottomColor: themeStyles.modalText.color },
                ]}
              ></View>

              <View style={styles.section}>
                <View style={styles.subTitleRow}>
                  <Text style={[styles.modalSubTitle, themeStyles.genericText]}>
                    CUSTOM COLOR THEME
                  </Text>

                  <View style={styles.subTitleButtonContainer}>
                    {/* <WrenchOutlineSvg onPress={openColorThemeModal} height={26} width={26} color={themeStyles.genericText.color}/>
                     */}

                    <TouchableOpacity onPress={openColorThemeModal}>
                      <ColorSwatchesSvg
                        onPress={openColorThemeModal}
                        darkColor={themeAheadOfLoading.darkColor}
                        lightColor={themeAheadOfLoading.lightColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <ModalColorTheme
                  isModalVisible={isColorThemeModalVisible}
                  closeModal={closeColorThemeModal}
                />
              </View>

              <View
                style={[
                  styles.divider,
                  { borderBottomColor: themeStyles.modalText.color },
                ]}
              ></View>

              {/* <View style={styles.section}>
                <View style={styles.subTitleRow}>
                  <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                    ADDRESSES
                  </Text>
                </View>
                <Text style={themeStyles.genericText}></Text>
              </View> */}

              <View
                style={[
                  styles.divider,
                  { borderBottomColor: themeStyles.modalText.color },
                ]}
              ></View>

              <View style={styles.section}>
                <View style={styles.subTitleRow}>
                  <Text
                    style={[styles.modalSubTitle, themeStyles.dangerZoneText]}
                  >
                    DANGER ZONE
                  </Text>
                </View>

                <TouchableOpacity onPress={handleConfirmDelete}>
                  <DetailRow
                    iconSize={20}
                    label={`Delete`}
                    svg={TrashOutlineSvg}
                    color={themeStyles.dangerZoneText.color}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* {isDoubleCheckerVisible && (
              <DoubleChecker
                isVisible={isDoubleCheckerVisible}
                toggleVisible={toggleDoubleChecker}
                singleQuestionText={`Delete ${friendName}?`}
                onPress={() => handleDelete()}
              />
            )} */}
          </>  
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: "100%",
    width: "100%",
  },
  subTitleRow: {
    flexDirection: "row",
    marginBottom: "4%",
    justifyContent: "space-between",
    width: "100%",
  },
  subTitleButtonContainer: {
    //width: '8%',
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    //zIndex: 1000,
  },
  section: {
    //flexGrow: 1,

    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
    paddingVertical: "5%",
  },
  rowText: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 21,
  },
  modalSubTitle: {
    fontSize: 19,
    fontFamily: "Poppins-Regular",
  },
  divider: {
    borderBottomWidth: 0.8,
  },
  friendNameText: {
    fontSize: 28,
    fontFamily: "Poppins-Regular",
  },
  headerText: {
    fontSize: 20,
    marginTop: 0,
    fontFamily: "Poppins-Regular",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 14,
  },

  backColorContainer: {
    //flex: 1,
    paddingHorizontal: "2%",
    paddingTop: "10%",
    width: "101%",
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
export default ScreenFriendSettings;
