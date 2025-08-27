// old version, updateFriendDashboard is an empty function now. preserving this in case i need to revert something
// if (friendDashboardData && friendDashboardData.length > 0) {
//    friendDashboardData[0].friend_faves = updatedFaves;
//    console.log(friendDashboardData);sel
//    updateFriendDashboardData(friendDashboardData);
//   console.log('Location added to friend\'s favorites.');
//  }

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons"; 
 import useAddToFaves from "@/src/hooks/FriendLocationCalls/useAddToFaves";
 import useRemoveFromFaves from "@/src/hooks/FriendLocationCalls/useRemoveFromFaves";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const LocationSavingActions = ({
  userId,
  friendId,
  friendName,
  location,
  iconSize = 26,
  fadeOpacity,
  favorite = false,
  handleAddToFaves,
  handleRemoveFromFaves,

  family = "Poppins-Bold",

  style,
}) => {
  const { themeAheadOfLoading } = useFriendStyle();
 
 
  const { themeStyles } = useGlobalStyle();

  // const { handleAddToFaves } = useAddToFaves({userId: userId, friendId: friendId })
  //   const { handleRemoveFromFaves } = useRemoveFromFaves({userId: userId, friendId: friendId })
  
  const navigation = useNavigation();

  const [isFave, setIsFave] = useState(location.isFave);

const handleGoToLocationSaveScreen = useCallback(() => {
  navigation.navigate("LocationCreate", { location });
}, [navigation, location]);

  useEffect(() => {
    if (favorite && location && location.id) {
      setIsFave(location.isFave);
    }
  }, [location]);

const handlePressAdd = useCallback(() => {
  if (location && !isFave) {
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
}, [location, isFave, friendName, addToFaves]);

const handlePressRemove = useCallback(() => {
  if (location && isFave) {
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
}, [location, isFave, friendName, removeFromFaves]);


const removeFromFaves = useCallback(async () => {
  if (friendId && location && isFave) {
    console.log('removing!');
    handleRemoveFromFaves({locationId: location?.id});
  }
}, [friendId, userId, location, isFave, handleRemoveFromFaves]);

const addToFaves = useCallback(async () => {
  try {
    if (String(location.id).startsWith("temp")) {
      console.log(
        "location not a saved object yet/add code to ButtonSaveLocation pls"
      );

      setIsEditing(false);
    } else {
      if (friendId && location) {
        handleAddToFaves({locationId: location?.id});
      }
    }
  } catch (error) {
    console.error("Error saving new location in handleSave:", error);
  }
}, [location, friendId, userId, handleAddToFaves]);

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
const memoizedContent = React.useMemo(() => {
  if (!location) return null;

  const isTemp = String(location.id).startsWith("temp");

  if (isTemp) {
    return (
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
    );
  }

  // else not temp
  return (
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
  );
}, [
  location,
  style,
  memoizedAddIcon,
  themeStyles.genericText.color,
  family,
  fadeOpacity,
  isFave,
  handlePressAdd,
  handlePressRemove,
  MemoizedFaveIcon,
  themeStyles.primaryText,
  handleGoToLocationSaveScreen,
]);


  return (
    <View>
      {memoizedContent}
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
