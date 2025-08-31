import { View, Text, StyleSheet } from "react-native";
import React from "react"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  item: object;
  index: number;
  friendName: string;
};

const UserHistoryMomentItem = ({ item, index, friendName, primaryColor='orange' }: Props) => {
 
  return (
    <View
      style={[
        styles.momentCheckboxContainer,
        {
          paddingBottom: 10,
          paddingTop: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: primaryColor, 
        },
      ]}
    >
      <View style={styles.momentItemTextContainer}>
        <View style={styles.checkboxContainer}>
          <MaterialCommunityIcons
            name={"leaf"}
            size={24}
            color={primaryColor}
          />
        </View>

        <View style={{ width: "100%", flexShrink: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",

              width: "100%",
            }}
          >
            <Text
              style={[
                styles.momentItemText, 
                { color: primaryColor, fontFamily: "Poppins-Bold" },
              ]}
            >
              @ {friendName} on {item.formattedDate}
            </Text>
          </View>
          <Text style={[styles.momentItemText, {color: primaryColor}]}>
            {item.capsule}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Just for list item (copy pasta'd this from CategoryFriendHistoryModal)
const styles = StyleSheet.create({
  momentItemTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",

    width: "100%",
  },
  momentItemText: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
  },
  momentCheckboxContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 0,
    paddingRight: 10,
  },
});

export default UserHistoryMomentItem;
