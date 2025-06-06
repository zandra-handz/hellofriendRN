import { View, Text } from "react-native";
import React from "react";

const HelloViewPage = ({ item, index, width, height }) => {
  return (
    <View
      style={{
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: 4,
        borderWidth: 0,
        //   height: ITEM_HEIGHT,
        width: width,
      }}
    >
      <View
        style={{
          backgroundColor: "pink",
          padding: 10,
          borderRadius: 10,
          width: "100%",
          height: "100%",
        }}
      > 
        <Text>{item.locationName}</Text>
        <Text>{item.date}</Text>
        <Text>{item.additionalNotes}</Text>
      </View>
    </View>
  );
};

export default HelloViewPage;
