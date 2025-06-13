// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Touchable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import PushPinSolidSvg from "@/app/assets/svgs/push-pin-solid.svg";

import AlertConfirm from "../alerts/AlertConfirm";
import ModalAddNewLocation from "./ModalAddNewLocation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useLocations } from "@/src/context/LocationsContext";

import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const LocationSavingActions = ({
  location,
  iconSize = 26,
  fadeOpacity,
  favorite = false,

  family = "Poppins-Bold",

  style,
}) => {
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { handleAddToFaves, handleRemoveFromFaves } = useLocations();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const { themeStyles } = useGlobalStyle();

  const navigation = useNavigation();

  const [isFave, setIsFave] = useState(location.isFave);

  const handleGoToLocationSaveScreen = () => {
    navigation.navigate("LocationCreate", { location: location });
  };

  useEffect(() => {
    if (favorite && location && location.id) {
      setIsFave(location.isFave);
    }
  }, [location]);

  const handlePressAdd = () => {
    if (location && !isFave) {
      Alert.alert(
        `Bookmark`,
        `Add ${location.title} to ${selectedFriend.name}'s bookmarks?`,
        [
          {
            text: "Cancel",
            onPress: () => {},
          },
          {
            text: "Add",
            onPress: () => {
              addToFaves(location);
              setIsFave(true);
            },
          },
        ]
      );
    }
  };

  const handlePressRemove = () => {
    if (location && isFave) {
      Alert.alert(
        `Remove`,
        `Remove ${location.title} from ${selectedFriend.name}'s bookmarks? (This can be readded, but will not be connected to any Helloes.)`,
        [
          {
            text: "Cancel",
            onPress: () => {},
          },
          {
            text: "Remove",
            onPress: () => {
              removeFromFaves(location.id);
              setIsFave(false);
            },
          },
        ]
      );
    }
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
    if (selectedFriend && location && isFave) {
      handleRemoveFromFaves(selectedFriend.id, location.id);
      onClose();
    }
  };

  const addToFaves = async () => {
    try {
      if (String(location.id).startsWith("temp")) {
        console.log(
          "location not a saved object yet/add code to ButtonSaveLocation pls"
        );

        setIsEditing(false);
      } else {
        if (selectedFriend && location) {
          handleAddToFaves(selectedFriend.id, location.id);
        }
        onClose();
      }
    } catch (error) {
      console.error("Error saving new location in handleSave:", error);
    }
  };

  const onConfirmAction = () => {
    if (isFave) {
      removeFromFaves(location.id);
      setIsFave(false);
    } else {
      addToFaves(location);
      setIsFave(true);
    }
  };

  return (
    <View>
      {location && String(location.id).startsWith("temp") && (
        <TouchableOpacity style={[styles.container, style]}>
          <MaterialCommunityIcons
            name={"plus-circle-outline"}
            size={iconSize}
            opacity={fadeOpacity}
            color={themeStyles.genericText.color}
            onPress={handleGoToLocationSaveScreen}
          />

          <Text
            style={[
              styles.saveText,
              {
                color: themeStyles.genericText.color,
                fontFamily: family,
                opacity: fadeOpacity,
              },
            ]}
          >
            Add
          </Text>
        </TouchableOpacity>
      )}

      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          {!isFave && (
            <TouchableOpacity
              onPress={handlePressAdd}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                //name="heart-plus-outline"
                name="bookmark-plus-outline"
                size={iconSize}
                opacity={fadeOpacity}
                color={themeStyles.genericText.color}
                style={{ marginRight: 4 }}
              />
              <Text style={[themeStyles.primaryText, {}]}>Bookmark</Text>
            </TouchableOpacity>
            // <HeartAddOutlineSvg width={34} height={34} color={themeStyles.genericText.color} onPress={handlePress} />
          )}
          {isFave && (
            <TouchableOpacity
              onPress={handlePressRemove}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                // name="heart-minus"
                name="bookmark-remove"
                size={iconSize}
                color={themeAheadOfLoading.lightColor}
                style={{ marginRight: 4 }}
              />
              <Text style={[themeStyles.primaryText, {}]}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {location && (
        <ModalAddNewLocation
          isVisible={isModal2Visible}
          close={closeModal2}
          title={location.title}
          address={location.address}
        />
      )}

      <AlertConfirm
        isModalVisible={isModalVisible}
        toggleModal={closeModal}
        headerContent={<PushPinSolidSvg width={18} height={18} color="black" />}
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
  saveText: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default LocationSavingActions;
