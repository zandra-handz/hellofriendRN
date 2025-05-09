// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AlertList from "../alerts/AlertList";
import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import NotesOutlineSvg from "@/app/assets/svgs/notes-outline.svg"; 
import { useNavigation } from "@react-navigation/native";
import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg";

const LocationCategory = ({
  location,
 
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const [isModalVisible, setModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle(); 
  const [hasCategory, setHasCategory] = useState(false);


  const navigation = useNavigation();

  const closeModalAfterDelay = () => {
    let timeout;
    timeout = setTimeout(() => {
      setModalVisible(false);
    }, 1000);
  };


  const handleGoToLocationEditScreenFocusCategory = () => {
    navigation.navigate("LocationEdit", {
      location: location,
      category: location.category || "",
      notes: location.personal_experience_info || "",
      parking: location.parking_score || "",
      focusOn: 'focusCategory',
      
    });
    //doesn't help
    closeModalAfterDelay();
  };
 

  const handlePress = () => {
    setModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  useLayoutEffect(() => {
    if (location && location.category) {
      setHasCategory(true);
    } else {
      setHasCategory(false);
    }
  }, [location]);
 

  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          <TouchableOpacity onPress={hasCategory? handlePress : handleGoToLocationEditScreenFocusCategory} style={styles.iconContainer}>
            {!hasCategory && (
              <Text style={[styles.categoryText, themeStyles.genericText]}>Add to category</Text>
            )}
            {hasCategory && (
               <Text numberOfLines={1} style={[styles.categoryText, {color: themeAheadOfLoading.lightColor}]}>#{location?.category}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <AlertList
        includeBottomButtons={false}
        isModalVisible={isModalVisible}
        useSpinner={false}
        questionText={`${location.title}` || ``}
        toggleModal={toggleModal}
        includeSearch={false}
        headerContent={
          <NotesOutlineSvg
            width={42}
            height={42}
            color={themeStyles.modalIconColor.color}
          />
        }
        content={
          <View style={styles.contentContainer}>
            <View
              style={[
                styles.notesContainer,
                {
                  backgroundColor:
                    themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "auto",
                }}
              >
                <Text style={themeStyles.subHeaderText}>CATEGORY</Text>
                <EditPencilOutlineSvg
                  height={30}
                  width={30}
                  onPress={handleGoToLocationEditScreenFocusCategory}
                  color={themeStyles.genericText.color}
                />
              </View>
              {location.category && (
                <ScrollView
                  style={{ flex: 1, width: "100%", padding: "6%" }}
                  contentContainerStyle={{ paddingVertical: 0 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.notesText, themeStyles.genericText]}>
                    {location.category}
                  </Text>
                </ScrollView>
              )}
            </View>
           
          </View>
        }
        onCancel={toggleModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 2,
    overflow: 'hidden',
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
  categoryText: {
    //fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    fontSize: 12,

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

export default LocationCategory;
