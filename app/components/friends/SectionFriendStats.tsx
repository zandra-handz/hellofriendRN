import React from "react";
import { View } from "react-native"; 

import { MaterialCommunityIcons } from "@expo/vector-icons";

import NoToggle from "../user/NoToggle";

const SectionFriendStats = ({ primaryColor, friendDaysSince, friendTimeScore }) => {
 

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <NoToggle
      primaryColor={primaryColor}
        label={friendDaysSince}
        icon={
          <MaterialCommunityIcons
            name={"timer"}
            size={20}
            color={primaryColor}
          />
        }
        onPress={() => {}}
      />

      <NoToggle
        label={friendTimeScore}
        icon={
          <MaterialCommunityIcons
            name={"heart"}
            size={20}
            color={primaryColor}
          />
        }
        onPress={() => {}}
      />
    </View>
  );
};

export default SectionFriendStats;
