import { View, Text, StyleSheet } from "react-native";
import React from "react";
import OptionListItem from "./OptionListItem";
type Props = {
  item: object;
  index: number;
  friendName: string;
};

const UserHistoryMomentItem = ({
  item,
  index,
  friendName,
  primaryColor = "orange",
  textStyle,
}: Props) => {
  return (
    <OptionListItem
      sublabel={item.capsule}
      primaryColor={primaryColor}
      backgroundColor="transparent"
      buttonColor="transparent"
    >
      <Text
        style={{
          fontFamily: "SpaceGrotesk-Bold",
          fontSize: 11,
          color: primaryColor,
          opacity: 0.45,
        }}
      >
        @ {friendName}
        <Text style={{ fontFamily: "SpaceGrotesk-Regular" }}>
          {" "}
          on {item.formattedDate}
        </Text>
      </Text>
    </OptionListItem>
  );
};

// <OptionListItem
//   label={`@ ${friendName} on ${item.formattedDate}`}
//   sublabel={item.capsule}
//   primaryColor={primaryColor}
//   backgroundColor="transparent"
//   buttonColor="transparent"
//   // textStyle={textStyle}
// />

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
