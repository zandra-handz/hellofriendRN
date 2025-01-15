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
import AlertList from "../components/AlertList";
import { useFriendList } from "../context/FriendListContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import NotesOutlineSvg from "../assets/svgs/notes-outline.svg";
import NotesSolidSvg from "../assets/svgs/notes-solid.svg";
import { useNavigation } from "@react-navigation/native";
import EditPencilOutlineSvg from "../assets/svgs/edit-pencil-outline.svg";

const LocationNotes = ({
  location,
  favorite = false,
  size = 11,
  iconSize = 34,
  family = "Poppins-Bold",
  color = "black",
  style,
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const [isModalVisible, setModalVisible] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const [hasNotes, setHasNotes] = useState(false);

  const navigation = useNavigation();

  const closeModalAfterDelay = () => {
    let timeout;
    timeout = setTimeout(() => {
      setModalVisible(false);
    }, 1000);
  };

  const handleGoToLocationEditScreenFocusNotes = () => {
    navigation.navigate("LocationEdit", {
      location: location,
      category: location.category || "",
      notes: location.personal_experience_info || "",
      parking: location.parking_score || "",
      focusOn: 'focusNotes',
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
    if (location && location.personal_experience_info) {
      setHasNotes(true);
    } else {
      setHasNotes(false);
    }
  }, [location]);

  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            {!hasNotes && (
              <NotesOutlineSvg
                width={iconSize}
                height={iconSize}
                color={themeStyles.genericText.color}
                onPress={handlePress}
              />
            )}
            {hasNotes && (
              <NotesSolidSvg
                width={iconSize}
                height={iconSize}
                color={themeAheadOfLoading.lightColor}
                onPress={handlePress}
              />
            )}
          </View>
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
                <Text style={themeStyles.subHeaderText}>NOTES</Text>
                <EditPencilOutlineSvg
                  height={30}
                  width={30}
                  onPress={handleGoToLocationEditScreenFocusNotes}
                  color={themeStyles.genericText.color}
                />
              </View>
              {location.personal_experience_info && (
                <ScrollView
                  style={{ flex: 1, width: "100%", padding: "6%" }}
                  contentContainerStyle={{ paddingVertical: 0 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.notesText, themeStyles.genericText]}>
                    {location.personal_experience_info}
                  </Text>
                </ScrollView>
              )}
            </View>
            {/* <View
              style={[
                styles.parkingScoreContainer,
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
                <Text style={themeStyles.subHeaderText}>PARKING</Text>
                <EditPencilOutlineSvg
                  height={30}
                  width={30}
                  onPress={handleGoToLocationEditScreen}
                  color={themeStyles.genericText.color}
                />
              </View>

              {location.parking_score && (
                <View style={{ flex: 1, width: "100%", padding: "6%" }}>
                  <Text style={[styles.notesText, themeStyles.genericText]}>
                    {location.parking_score}
                  </Text>
                </View>
              )}
            </View> */}
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
