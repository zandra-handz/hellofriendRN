// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useEffect, useState, useMemo, memo } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import { useFriendLocationsContext } from "@/src/context/FriendLocationsContext";
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
  const { selectedFriend } = useSelectedFriend();
  const { handleAddToFaves, handleRemoveFromFaves } =
    useFriendLocationsContext();

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

  const removeFromFaves = async () => {
    if (selectedFriend && location && isFave) {
      handleRemoveFromFaves(selectedFriend.id, location.id);
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
      }
    } catch (error) {
      console.error("Error saving new location in handleSave:", error);
    }
  };

  const memoizedAddIcon = useMemo(
    () => (
      <MaterialCommunityIcons
        name="plus-circle-outline"
        size={iconSize}
        opacity={fadeOpacity}
        color={themeStyles.genericText.color}
      />
    ),
    [iconSize, fadeOpacity, themeStyles.genericText.color]
  );

  const MemoizedFaveIcon = React.useMemo(
    () => (
      <MaterialCommunityIcons
        name={isFave ? "bookmark-remove" : "bookmark-plus-outline"}
        size={iconSize}
        color={
          isFave
            ? themeAheadOfLoading.lightColor
            : themeStyles.genericText.color
        }
        style={{ marginRight: 4 }}
      />
    ),
    [
      isFave,
      iconSize,
      themeAheadOfLoading.lightColor,
      themeStyles.genericText.color,
    ]
  );

  return (
    <View>
      {location && String(location.id).startsWith("temp") && (
        <Pressable
          onPress={handleGoToLocationSaveScreen}
          style={({ pressed }) => [
            styles.container,
            style,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          {memoizedAddIcon}
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
        </Pressable>
      )}

      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
          <Pressable
            onPress={isFave ? handlePressRemove : handlePressAdd}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            {MemoizedFaveIcon}
            {isFave ? (
              <Text style={[themeStyles.primaryText]}>Remove</Text>
            ) : (
              <Text style={[themeStyles.primaryText]}>Bookmark</Text>
            )}
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
