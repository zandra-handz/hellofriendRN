// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, {   useMemo } from "react";
import {
  View,
  Text, 
  Pressable,
  StyleSheet,
} from "react-native";   
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const LocationNotes = ({
  location,
  iconSize = 26, 
  openEditModal,
  closeEditModal,
  themeAheadOfLoading,
  primaryColor,
}) => {  

  const navigation = useNavigation();

  const closeModalAfterDelay = () => {
    let timeout;
    timeout = setTimeout(() => {
      closeEditModal();
    }, 1000);
  };

  const handleGoToLocationEditScreenFocusNotes = () => {
    navigation.navigate("LocationEdit", {
      location: location,
      category: location.category || "",
      notes: location.personal_experience_info || "",
      parking: location.parking_score || "",
      focusOn: "focusNotes",
    });
    //doesn't help
    closeModalAfterDelay();
  };



  const handlePress = () => {
    const modalData = {
      title: "Notes",
      icon: memoizedIcon,
      contentData: location.personal_experience_info,
      onPress: () => handleGoToLocationEditScreenFocusNotes(),
    };
    openEditModal(modalData);
    //setModalVisible(true);
  };

  // useLayoutEffect(() => {
  //   if (location && location.personal_experience_info) {
  //     setHasNotes(true);
  //   } else {
  //     setHasNotes(false);
  //   }
  // }, [location]);
  const hasNotes = useMemo(() => {
  return location && location.personal_experience_info ? true : false;
}, [location]);



    const memoizedIcon = useMemo(
    () => (
      <MaterialCommunityIcons
        name={hasNotes ? "note-check" : "note-plus-outline"}
        size={iconSize}
        color={
          hasNotes
            ? themeAheadOfLoading.lightColor
            : primaryColor
        }
        style={{ marginRight: 4 }}
      />
    ),
    [
      hasNotes,
      iconSize,
      themeAheadOfLoading.lightColor,
      primaryColor,
    ]
  );

  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
 
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            {memoizedIcon}
            <Text style={  {color: primaryColor}}>Notes</Text>
          </Pressable> 
        </View>
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
  contentContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  notesContainer: {
    width: "100%",
    height: "60%",
    borderRadius: 30,
    padding: 20,
    textAlign: "top",
    justifyContent: "flex-start",
  },
  notesText: {
    fontSize: 15,
    lineHeight: 21,
  },
  parkingScoreContainer: {
    width: "100%",
    height: "30%",
    borderRadius: 30,
    padding: 20,
  },
  iconContainer: {
    margin: 0,
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
  textContainer: {
    padding: 0,
    textAlign: "top",
  },
  containerTitle: {
    fontSize: 16,
    marginBottom: "4%",
  },
  textInput: {
    textAlign: "top",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default LocationNotes;
