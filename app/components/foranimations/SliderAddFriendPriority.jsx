import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SliderBase from "./SliderBase";

const SliderAddFriendPriority = ({
  friendPriority,
  setFriendPriority,
  primaryColor = "orange",
}) => {
  return (
    <View style={styles.sectionContainer}>
      {/* <Text style={[styles.sectionTitle, { color: primaryColor }]}>
        Priority placed on friendship
      </Text> */}
      <SliderBase
        value={friendPriority}
        onValueChange={setFriendPriority}
        labelStyle={{ color: primaryColor }}
        min={1}
        max={3}
        messages={{
          1: "High",
          2: "Medium",
          3: "Unworried",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Poppins-Bold",
  },
});

export default SliderAddFriendPriority;
