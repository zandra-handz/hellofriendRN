// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);sel
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, {   useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const LocationSavingActions = ({
  userId,
  friendId,
  friendName,
  location,
  iconSize = 26,
  fadeOpacity, 
  handleAddToFaves,
  handleRemoveFromFaves,
  family = "Poppins-Bold",
  style,
  themeAheadOfLoading,
  primaryColor,
  compact = false,
  noLabel = false,
}) => {
  const [isFave, setIsFave] = useState(location.isFave);

    if (!location) return null;

  const isTemp = useMemo(
    () => {
      return String(location?.id).startsWith("temp") || null;

    }, [location?.id]
  )

  const navigation = useNavigation();

  const handleGoToLocationSaveScreen = useCallback(() => {
    navigation.navigate("LocationCreate", { location });
  }, [navigation, location]);

  const handlePressAdd = useCallback(() => {
    console.log(location);
    if (location && !location?.isFave) {
      Alert.alert(
        `Bookmark`,
        `Add ${location.title} to ${friendName}'s bookmarks?`,
        [
          { text: "Cancel", onPress: () => {} },
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
  }, [location?.isFave, location, friendName, addToFaves]);

  const handlePressRemove = useCallback(() => {
    console.log(location)
    if (location?.isFave) {
      Alert.alert(
        `Remove`,
        `Remove ${location.title} from ${friendName}'s bookmarks? (This can be readded, but will not be connected to any Helloes.)`,
        [
          { text: "Cancel", onPress: () => {} },
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
  }, [location?.isFave, location, friendName, removeFromFaves]);

  const removeFromFaves = useCallback(async () => {
    if (friendId && location?.isFave) {
      console.log("removing!");
      handleRemoveFromFaves({ locationId: location?.id });
    }
  }, [friendId, userId, location?.isFave, handleRemoveFromFaves]);

  const addToFaves = useCallback(() => {
    try {
      if (String(location.id).startsWith("temp")) {
        console.log(
          "location not a saved object yet/add code to ButtonSaveLocation pls"
        );

        setIsEditing(false);
      } else {
        if (friendId && location) {
          handleAddToFaves({ locationId: location?.id });
        }
      }
    } catch (error) {
      console.error("Error saving new location in handleSave:", error);
    }
  }, [location, friendId, userId, handleAddToFaves]);

  // const memoizedAddIcon = useMemo(
  //   () => (
  //     <MaterialCommunityIcons
  //       name="plus-circle-outline"
  //       size={iconSize}
  //       opacity={fadeOpacity}
  //       color={primaryColor}
  //     />
  //   ),
  //   [iconSize, fadeOpacity, primaryColor]
  // );

  // const MemoizedFaveIcon = React.useMemo(
  //   () => (
  //     <MaterialCommunityIcons
  //       name={location?.isFave ? "heart" : "bookmark-plus-outline"}
  //       size={iconSize}
  //       color={location?.isFave ? themeAheadOfLoading.darkColor : primaryColor}
  //       style={{ marginRight: 4 }}
  //     />
  //   ),
  //   [location, iconSize, themeAheadOfLoading.darkColor, primaryColor]
  // );

  return (
    <View style={styles.container}>
      {!isTemp && (
        <Pressable
          onPress={location?.isFave ? handlePressRemove : handlePressAdd}
          style={({ pressed }) => ({
            flexDirection: compact ? "column" : "row",
            alignItems: "center",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <MaterialCommunityIcons
            name={location?.isFave ? "heart" : "bookmark-plus-outline"}
            size={iconSize}
            color={
              location?.isFave ? themeAheadOfLoading.darkColor : primaryColor
            }
            style={{ marginRight: 4 }}
          />
          {/* {MemoizedFaveIcon} */}
          {!noLabel && (
            <>
              {location?.isFave ? (
                <Text style={{ color: primaryColor }}>Remove</Text>
              ) : (
                <Text style={{ color: primaryColor }}>Bookmark</Text>
              )}
            </>
          )}
        </Pressable>
      )}
      {isTemp && (
        <Pressable
          onPress={handleGoToLocationSaveScreen}
          style={({ pressed }) => [
            styles.container,
            style,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={iconSize}
            opacity={fadeOpacity}
            color={primaryColor}
          />
          <Text
            style={[
              styles.saveText,
              {
                color: primaryColor,
                fontFamily: family,
                opacity: fadeOpacity,
              },
            ]}
          >
            Add
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 0,
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
