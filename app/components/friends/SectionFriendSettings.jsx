import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ButtonResetHelloes from "@/app/components/buttons/helloes/ButtonResetHelloes";
 
import ButtonManageFriends from "@/app/components/buttons/friends/ButtonManageFriends";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

const SectionFriendSettings = () => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();

  return (
    <View style={[styles.container, themeStyles.modalContainer]}>
       {!selectedFriend && (
      <View style={styles.friendSettingsRow}>
       
          <View style={{ flexDirection: "row" }}>
            <FontAwesome5
              name="users"
              size={20}
              style={[styles.icon, themeStyles.modalIconColor]}
            />

            <Text style={[styles.sectionTitle, themeStyles.modalText]}>
              Manage friends
            </Text>
          </View>
        
        <ButtonManageFriends />
      </View>
      )}
      <View style={styles.friendSettingsRow}>
        <View style={{ flexDirection: "row" }}>
          <FontAwesome5
            name="recycle"
            size={22}
            style={[styles.icon, themeStyles.modalIconColor]}
          />

          <Text style={[styles.sectionTitle, themeStyles.modalText]}>
            Reset All
          </Text>
        </View>
        <ButtonResetHelloes />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 0, // changed this from ModalColorTheme
    width: "100%",
    alignSelf: "flex-start",
  },
  friendSettingsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
    marginRight: 10,
  },
});

export default SectionFriendSettings;
