import React from "react";
import { View } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import NoToggle from "../user/NoToggle";

const SectionFriendStats = ({ friendDaysSince, friendTimeScore }) => {
  const { themeStyles } = useGlobalStyle();

  return (
    <View
      style={{
        width: "100%",
        alignSelf: "flex-start",
      }}
    >
      <NoToggle
        label={friendDaysSince}
        icon={
          <MaterialCommunityIcons
            name={"timer"}
            size={20}
            color={themeStyles.primaryText.color}
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
            color={themeStyles.primaryText.color}
          />
        }
        onPress={() => {}}
      />
    </View>
  );
};

export default SectionFriendStats;
