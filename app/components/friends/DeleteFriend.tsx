import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import Animated, {
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import useFriendFunctions from "@/src/hooks/useFriendFunctions";
type Props = {
  friendId: number;
  friendName: string;
};

const DeleteFriend = ({ friendId, friendName = "" }: Props) => {
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);

  const handleToggle = () => {
    setShowDeleteOption((prev) => !prev);
  };

  const { handleDeleteFriend } = useFriendFunctions();

  const handleDelete = () => {
    handleDeleteFriend(friendId);
    handleToggle();
  };

  const handleConfirmDelete = () => {
    if (!friendId) {
      return;
    }

    Alert.alert(
      `Delete friend`,
      `Are you SURE you want to delete ${friendName}?`,
      [
        {
          text: "No!!",
          onPress: () => handleToggle(),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleDelete(),
        },
      ]
    );
  };

  return (
    <View
      style={[
        {
          position: "absolute",
          width: "100%",
          height: 40,
          bottom: 20,
          zIndex: 6000,

      
        },
      ]}
    >
      {showDeleteOption && (
        <Animated.View
          exiting={SlideOutLeft}
          entering={SlideInLeft}
          style={{
            zIndex: 6000,
            width: "100%",
            height: "100%",
            flexDirection: "row",
            backgroundColor: "gray",
          }}
        >
          <Pressable
            onPress={handleToggle}
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "teal",
            }}
          >
            <MaterialCommunityIcons name={"arrow-left"} size={26} />
          </Pressable>
          <Pressable
            onPress={handleConfirmDelete}
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "teal",
            }}
          >
            <MaterialCommunityIcons name={"delete"} size={26} />
          </Pressable>
        </Animated.View>
      )}

      {!showDeleteOption && (
        <Animated.View
          exiting={SlideOutRight}
          entering={SlideInRight}
          style={{ width: "100%", height: "100%", zIndex: 6000, backgroundColor: "red" }}
        >
          <Pressable
            onPress={handleToggle}
            style={{
              flex: 1,
              backgroundColor: "pink",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name={"eye"} size={26} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default DeleteFriend;
