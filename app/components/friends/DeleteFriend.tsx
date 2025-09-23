import { View, Text, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import useRemoveFromFriendList from "@/src/hooks/FriendListCalls/useRemoveFromFriendList";
import useRefetchUpcomingHelloes from "@/src/hooks/UpcomingHelloesCalls/useRefetchUpcomingHelloes";
 import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useDeleteFriend from "@/src/hooks/useDeleteFriend";
type Props = {
  userId: number;
  friendId: number;
  friendName: string;
};

const DeleteFriend = ({ userId, friendId, friendName = "" , handleDeselectFriend}: Props) => {
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);
  const { refetchUpcomingHelloes } = useRefetchUpcomingHelloes({userId: userId});
const { removeFromFriendList} = useRemoveFromFriendList({userId: userId});

const { handleDeleteFriend, deleteFriendMutation } = useDeleteFriend({removeFromFriendList: removeFromFriendList, refetchUpcoming: refetchUpcomingHelloes})

  const handleToggle = () => {
    setShowDeleteOption((prev) => !prev);
  };


  useEffect(() => {
    if (deleteFriendMutation.isPending) {
      showFlashMessage(`Deleting friend...`, false, 1000);
    }

  }, [deleteFriendMutation.isPending]);

  
  useEffect(() => {
    if (deleteFriendMutation.isSuccess) {
      showFlashMessage(`${friendName} deleted`, false, 1000);
      handleDeselectFriend();
    }

  }, [deleteFriendMutation.isSuccess]);
    useEffect(() => {
    if (deleteFriendMutation.isError) {
      showFlashMessage(`${friendName} not deleted`, true, 1000);
    }

  }, [deleteFriendMutation.isError]);
 
 

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
