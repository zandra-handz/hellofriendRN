import React, { useState, useRef } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import useFriendFunctions from "@/src/hooks/useFriendFunctions";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import EffortSettingSlider from "../../friends/EffortSettingSlider";
const EditEffort = ({ iconSize = 15, value = "None" }) => {
  const { user } = useUser();
  const { selectedFriend, friendDashboardData } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();

  const [effort, setEffort] = useState(
    friendDashboardData?.suggestion_settings?.effort_required || null
  );

  const effortRef = useRef();

  const handleSave = () => {
    try {
      handleUpdateFriendSettings(
        user.id,
        selectedFriend.id,
        effortRef.current.getValue()
      );
      setEffort(effortRef.current.getValue());
      setShowEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const { themeStyles  } = useGlobalStyle();
  const { handleUpdateFriendSettings } = useFriendFunctions();

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
        backgroundColor: showEdit ? 'red' : 'transparent',
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
              name={"calendar"}
              size={20}
              color={themeStyles.primaryText.color}
            />
          </View>
          <Text style={[styles.label, themeStyles.modalText]}>
            Effort: {effort}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!showEdit && (
            <Pressable onPress={togglePhoneEdit}>
              <MaterialCommunityIcons
                name={"pencil"}
                size={20}
                color={themeStyles.primaryText.color}
              />
            </Pressable>
          )}

          {showEdit && (
            <>
              <Pressable onPress={togglePhoneEdit} style={{ marginRight: 10 }}>
                <MaterialCommunityIcons
                  name={"cancel"}
                  size={20}
                  color={themeStyles.primaryText.color}
                />
              </Pressable>
              <Pressable onPress={handleSave}>
                <MaterialCommunityIcons
                  name={"check"}
                  size={20}
                  color={themeStyles.primaryText.color}
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
          <EffortSettingSlider
            //height={"40%"}
            ref={effortRef}
            friendEffort={effort} // Passing friendEffort state as value
            sliderColor={themeAheadOfLoading.lightColor}
            trackColor={themeAheadOfLoading.darkColor}
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

export default EditEffort;
