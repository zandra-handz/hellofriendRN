import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ButtonResetHelloes from "@/app/components/buttons/helloes/ButtonResetHelloes";
  
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 

const SectionFriendSettings = () => {
  const { themeStyles } = useGlobalStyle(); 

  return (
    <View style={[styles.container, themeStyles.modalContainer]}>
 
      <View style={styles.friendSettingsRow}>
        <View style={{ flexDirection: "row" }}>
          <FontAwesome5
            name="recycle"
            size={22}
            style={[styles.icon, themeStyles.modalIconColor]}
          />

          <Text style={[styles.sectionTitle, themeStyles.modalText]}>
            Reset all dates
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
