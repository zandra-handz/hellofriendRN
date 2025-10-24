import React, { useState, useRef } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import useUpdateFriend from "@/src/hooks/useUpdateFriend";
import PrioritySettingSlider from "../../friends/PrioritySettingSlider";
const EditPriority = ({
  userId, 
  themeColors,
  friendId,
  friendPriority,
  primaryColor,
  // refetchUpcoming,
}) => {
  const { handleUpdateFriendSettings } = useUpdateFriend({
    userId: userId,
    friendId: friendId
    // refetchUpcoming: refetchUpcoming,  // don't need to refetch, date won't change until next hello
  });

  const [priority, setPriority] = useState<number>(friendPriority);

  const priorityRef = useRef();

  const handleSave = () => {
    try {
      handleUpdateFriendSettings({priority: priorityRef.current.getValue()});
      setPriority(priorityRef.current.getValue());
      setShowEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [showEdit, setShowEdit] = useState(false);

  const togglePhoneEdit = () => {
    setShowEdit((prev) => !prev);
  };

  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        width: "100%",
        alignSelf: "flex-start",
        backgroundColor: showEdit ? "red" : "transparent",
        padding: showEdit ? 10 : 0,
        borderRadius: showEdit ? 10 : 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "start",
              flexDirection: "row",
            }}
          >
            <MaterialCommunityIcons
              name={"alert"}
              size={20}
              color={primaryColor}
            />
          </View>
          <Text style={[styles.label, { color: primaryColor }]}>
            Priority: {priority}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!showEdit && (
            <Pressable onPress={togglePhoneEdit}>
              <MaterialCommunityIcons
                name={"pencil"}
                size={20}
                color={primaryColor}
              />
            </Pressable>
          )}

          {showEdit && (
            <>
              <Pressable onPress={togglePhoneEdit} style={{ marginRight: 10 }}>
                <MaterialCommunityIcons
                  name={"cancel"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
              <Pressable onPress={handleSave}>
                <MaterialCommunityIcons
                  name={"check"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {showEdit && (
        <View
          style={{
            backgroundColor: "red",
            borderRadius: 20,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <PrioritySettingSlider
            //height={"40%"}
            ref={priorityRef}
            friendPriority={priority} // Passing friendEffort state as value
            sliderColor={themeColors.lightColor}
            trackColor={themeColors.darkColor}
            primaryColor={primaryColor}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: "auto",
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: ".5%",
    paddingVertical: ".5%",
    alignItems: "center",
  },
  pressedStyle: {},
  on: {
    backgroundColor: "#4cd137",
  },
  off: {
    backgroundColor: "#dcdde1",
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
  },
});

export default EditPriority;
