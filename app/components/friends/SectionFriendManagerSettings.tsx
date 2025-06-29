import React from "react";
import { View, Text, StyleSheet } from "react-native"; 
  import Reset from "../appwide/button/Reset";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SectionFriendManagerSettings = () => {
  const { themeStyles } = useGlobalStyle(); 

  return (
        <View
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            padding: 0,
            width: "100%",
            alignSelf: "flex-start",
          }}
        >
                <Reset
        label="Reset all hello dates"
        icon={
          <MaterialCommunityIcons
            name={"timer"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        }  
      />
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

export default SectionFriendManagerSettings;