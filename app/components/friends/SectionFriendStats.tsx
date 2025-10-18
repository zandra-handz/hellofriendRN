import React from "react";
import { ColorValue, View } from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
import NoToggle from "../user/NoToggle";

type Props = {
  primaryColor: ColorValue;
  friendDaysSince: string;
  friendTimeScore: string;
};

const SectionFriendStats = ({
  primaryColor,
  friendDaysSince,
  friendTimeScore,
}: Props) => {
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
          <SvgIcon
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
          <SvgIcon
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
