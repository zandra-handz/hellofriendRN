// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import PushPinSolidSvg from "../assets/svgs/push-pin-solid.svg";

import AlertConfirm from "../components/AlertConfirm";
import ModalAddNewLocation from "../components/ModalAddNewLocation";

import { useSelectedFriend } from "../context/SelectedFriendContext"; 
import { useFriendList } from "../context/FriendListContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useLocations } from '../context/LocationsContext';
import HeartAddOutlineSvg from "../assets/svgs/heart-add-outline.svg";
import HeartCheckSolidSvg from "../assets/svgs/heart-check-solid.svg";
import AddSquareOutlineSvg from "../assets/svgs/add-square-outline.svg";

import LoadingPage from "../components/LoadingPage"; 
//The original will cause infinite rerendering if it appears in more than one component at a time (for example a flashlist!)

//UPDATE THE RERENDER WAS USING USELOCATIONFUNCTIONS DIRECTLY, I HAD TO GO UP TO LOCATIONS SCREEN AND DRILL IT DOWN INSTEAD

const LocationSavingActionsForCard = ({
  location, 
  size = 11,
  iconSize = 34,
  family = "Poppins-Bold", 
  style,
}) => {

  const { addToFavesMutation, removeFromFavesMutation, handleAddToFaves,
    handleRemoveFromFaves } = useLocations();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendFavesData, getFaveLocationIds } = useSelectedFriend();
  const { friendFaveLocations } = friendFavesData;
  // const { handleAddToFaves, handleRemoveFromFaves  } = useLocationFunctions();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const { themeStyles } = useGlobalStyle();  
  const [showSpinner, setShowSpinner ] = useState(false); // to distinguish from other copies of this component with dif location data

  const [faveLocations, setFaveLocations] = useState(null);
  const navigation = useNavigation();
 

  const [isFave, setIsFave] = useState(false);
  

  const handleGoToLocationSaveScreen = () => {
    navigation.navigate("LocationSave", { location: location });
  };

 

  useLayoutEffect(() => { 
    console.log('new isFave state');
    let newIsFave; 
   
    setFaveLocations(getFaveLocationIds()); 
    if (location && location.id && friendFaveLocations) {
      newIsFave = friendFaveLocations.includes(location.id);
    } else {
      newIsFave = false;
    }
  
    // Only update state if the value has changed
    if (isFave !== newIsFave) {
      
      setIsFave(newIsFave);
    }
  }, [location, friendFaveLocations, isFave]);
  // Add `friendDashboardData` as a dependency

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeModal2 = () => {
    setModal2Visible(false);
  };

  const onClose = () => {
    setModal2Visible(false);
  };

  const removeFromFaves = async () => {
    if (selectedFriend && location) {
      
      handleRemoveFromFaves(selectedFriend.id, location.id);
      setIsFave(false);
      onClose();
    }
  };

  const addToFaves = async () => {
    try {
      if (String(location.id).startsWith("temp")) {
        console.log(
          "location not a saved object yet/add code to ButtonSaveLocation pls"
        );
 
      } else {
        if (selectedFriend && location) {
          setIsFave(true);
          await handleAddToFaves(selectedFriend.id, location.id);
        
     
        } 
      }
    } catch (error) {
      console.error("Error saving new location in handleSave:", error);
    }
  };


  // useEffect(() => {
  //   if (!addToFavesMutation.isPending && !removeFromFavesMutation.isPending) {
  //     setShowSpinner(false);
  //   }

  // }, [addToFavesMutation, removeFromFavesMutation]);

 



  const onConfirmAction = () => {
    setShowSpinner(true);
    if (isFave) {
      //handleRemoveFromFaves(selectedFriend.id, location.id);
      removeFromFaves(location.id);
      //setIsFave(false);
    } else {
      addToFaves(location);
      setIsFave(true);
    } 
  };

  return (
    <View>
      {location && String(location.id).startsWith("temp") && (
        <TouchableOpacity style={[styles.container, style]}>
          <AddSquareOutlineSvg
            width={iconSize}
            height={iconSize}
            color={themeStyles.genericText.color}
            onPress={handleGoToLocationSaveScreen}
          />

          <Text
            style={[
              styles.saveText,
              { color: themeStyles.genericText.color, fontFamily: family },
            ]}
          >
            {" "}
            ADD{" "}
          </Text>
        </TouchableOpacity>
      )}

       <View style={styles.container}>
          <View style={[styles.iconContainer, {wdith: iconSize}]}>
          {location && faveLocations && !String(location.id).startsWith("temp") && !showSpinner && (
       <>
            {!isFave && !showSpinner && ( 
  
              <HeartAddOutlineSvg
                width={iconSize}
                height={iconSize}
                color={themeStyles.genericText.color}
                onPress={onConfirmAction}
               // onPress={handlePress}
              /> 
            )}
            {isFave && !showSpinner && ( 
                
              <HeartCheckSolidSvg
                width={iconSize}
                height={iconSize}
                color={themeAheadOfLoading.lightColor}
                onPress={onConfirmAction}
              />
               
            )}
            </>
          )}
          {showSpinner && (
        <View style={[styles.spinnerWrapper, {width: iconSize, height: iconSize}]}>

        <LoadingPage
        loading={showSpinner} 
        //loading={true}
        color={themeAheadOfLoading.darkColor}
        spinnerType='circle'
        spinnerSize={20}
        includeLabel={false} 
        />
        </View>
          )}

          </View>
        </View>
     

      {location && isModal2Visible && (
        <ModalAddNewLocation
          isVisible={isModal2Visible}
          close={closeModal2}
          title={location.title}
          address={location.address}
        />
      )}

      {location && isModalVisible && (
        <AlertConfirm
          isModalVisible={isModalVisible}
          toggleModal={closeModal}
          headerContent={
            <PushPinSolidSvg width={18} height={18} color="black" />
          }
          questionText={
            isFave
              ? "Remove this location from friend's dashboard?"
              : "Pin this location to friend dashboard?"
          }
          onConfirm={onConfirmAction}
          onCancel={closeModal}
          confirmText="Yes"
          cancelText="No"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 2,
  },
  iconContainer: {
    margin: 0, 
  },
  spinnerWrapper: {
    flexDirection: 'row', 
    zIndex: 1000,

  },
  saveText: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
});

export default LocationSavingActionsForCard;
