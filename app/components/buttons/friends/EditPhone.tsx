import React, { useState } from "react";
import { StyleSheet, Pressable, View, Text, TextInput } from "react-native";
import useUpdateFriend from "@/src/hooks/useUpdateFriend"; 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
 
const EditPhone = ({ userId,  friendId, friendPhone, primaryColor, refetchUpcoming }) => {
  const [phoneNumber, setPhoneNumber] = useState(friendPhone);
 
  const { handleUpdateFriendSettings } = useUpdateFriend({userId: userId, refetchUpcoming: refetchUpcoming});


  const [showEdit, setShowEdit] = useState(false);

  const togglePhoneEdit = () => {
    setShowEdit((prev) => !prev);
  };

  const handleNewPhoneNumber = (number) => {
    setPhoneNumber(number);
  };

  const handleUpdatePhoneNumber = () => {
    if (phoneNumber) {
      handleUpdateFriendSettings(
        friendId,
        // friendDashboardData.suggestion_settings.effort_required,
        // friendDashboardData.suggestion_settings.priority_level,
        phoneNumber
      );
    }
    setShowEdit(false);
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
        marginVertical: showEdit ? 10 : 0,
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
              name={"phone"}
              size={20}
              color={primaryColor}
            />
          </View>
          <Text style={[styles.label, {color: primaryColor}]}>
            {phoneNumber || `None`}
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
              <Pressable onPress={handleUpdatePhoneNumber}>
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
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <TextInput
            style={[
             {color: primaryColor}
              // Uncomment or add additional styling as needed
              // styles.textInput,
              // themeStyles.genericText,
              // themeStyles.genericTextBackgroundShadeTwo,
            ]}
            autoFocus
            value={phoneNumber}
            onChangeText={handleNewPhoneNumber}
            multiline
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

export default EditPhone;
