// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, {  useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import PushPinSolidSvg from "@/app/assets/svgs/push-pin-solid.svg";

import AlertConfirm from "../alerts/AlertConfirm";  

import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useLocations } from '@/src/context/LocationsContext';
import HeartAddOutlineSvg from "@/app/assets/svgs/heart-add-outline.svg";
import HeartCheckSolidSvg from "@/app/assets/svgs/heart-check-solid.svg";
import AddSquareOutlineSvg from "@/app/assets/svgs/add-square-outline.svg";
 
import LoadingPage from "../appwide/spinner/LoadingPage";
//The original will cause infinite rerendering if it appears in more than one component at a time (for example a flashlist!)

//UPDATE THE RERENDER WAS USING USELOCATIONFUNCTIONS DIRECTLY, I HAD TO GO UP TO LOCATIONS SCREEN AND DRILL IT DOWN INSTEAD



// SCREENLOCATIONS IS NOT BEING USED I DONT THINK ??? DELETE
const LocationSavingActionsForCard = ({
  location,  
  iconSize = 34,
  family = "Poppins-Bold", 
  style,
}) => {

  const {   handleAddToFaves,
    handleRemoveFromFaves } = useLocations();
  const { themeAheadOfLoading } = useFriendStyle();

  // FRIEND FAVES DATA AND FAVE LOCATION IDS NO LONGER EXIST
  const { selectedFriend, friendFavesData, getFaveLocationIds } = useSelectedFriend();
  const { friendFaveLocations } = friendFavesData;
 
  const [isModalVisible, setModalVisible] = useState(false); 
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

 
  const closeModal = () => {
    setModalVisible(false);
  };

 

  const removeFromFaves = async () => {
    if (selectedFriend && location) {
      
      handleRemoveFromFaves(selectedFriend.id, location.id);
      setIsFave(false);
 
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
