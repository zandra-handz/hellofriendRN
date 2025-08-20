import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Pressable, View, Text, TextInput } from "react-native";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import useFriendFunctions from "@/src/hooks/useFriendFunctions";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
const EditPhone = ({ iconSize = 15, value='None' }) => {
 
const { selectedFriend, friendDashboardData } = useSelectedFriend();

  const [phoneNumber, setPhoneNumber] = useState(
    friendDashboardData?.suggestion_settings?.phone_number || null
  );


  const { themeStyles, manualGradientColors } = useGlobalStyle();
    const { 
    handleUpdateFriendSettings,
  } = useFriendFunctions();

  const [showEdit, setShowEdit] = useState(false);

  const togglePhoneEdit = () => {
    setShowEdit((prev) => !prev);
  };
  // useEffect(() => {
  //   if (remixAllNextHelloesMutation.isSuccess) {

  //     // showMessage(true, null, `All friend dates reset!`);
  //   } else if (remixAllNextHelloesMutation.isError) {
  //     console.log('error');
  //   }

  // }, [remixAllNextHelloesMutation]);
  const handleNewPhoneNumber = (number) => {
    setPhoneNumber(number);
  };

    const handleUpdatePhoneNumber = () => {
    if (phoneNumber) {
      handleUpdateFriendSettings(
      
        selectedFriend.id,
        friendDashboardData.suggestion_settings.effort_required,
        friendDashboardData.suggestion_settings.priority_level,
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
        backgroundColor: showEdit ? 'red' : 'transparent',
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
            color={themeStyles.primaryText.color}
          />
        </View>
        <Text style={[styles.label, themeStyles.modalText]}>
          {phoneNumber || `None`}
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
                    <Pressable onPress={togglePhoneEdit} style={{marginRight: 10}}>
            <MaterialCommunityIcons
              name={"cancel"}
              size={20}
              color={themeStyles.primaryText.color}
            />
          </Pressable>
          <Pressable onPress={handleUpdatePhoneNumber}>
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
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        <TextInput
          style={[
            themeStyles.primaryText,
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
