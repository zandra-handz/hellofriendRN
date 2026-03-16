import React from "react";
import { Text } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import OptionListItem from "./OptionListItem";

type Props = {
  item: object;
  index: number;
  helloDate: string;
  primaryColor?: string;
  onHelloPress: (helloId: number, originalId: number) => void;
};

const FriendHistoryMomentItem = ({
  item,
  index,
  helloDate,
  primaryColor = "orange",
  onHelloPress,
}: Props) => {
  return (
    <OptionListItem
      primaryColor={primaryColor}
      backgroundColor="transparent"
      buttonColor="transparent"
      rightElement={
        <GlobalPressable
          hitSlop={20}
          style={{ padding: 20, zIndex: 40000, elevation: 40000 }}
          onPress={() => onHelloPress(item.hello.id, item.original_id)}
        >
          <SvgIcon name="calendar" size={16} color={primaryColor} style={{ marginHorizontal: 4 }} />
        </GlobalPressable>
      }
    >
      {item.capsules.map((capsule) => (
        <Text
          key={capsule.id}
          style={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily: "SpaceGrotesk-Medium",
            color: primaryColor,
          }}
        >
          {capsule.capsule}
        </Text>
      ))}
      <Text style={{ fontFamily: "SpaceGrotesk-Bold", fontSize: 11, color: primaryColor, opacity: 0.45 }}>
        # {item.category_name}
        <Text style={{ fontFamily: "SpaceGrotesk-Regular" }}>
          {" "}on {helloDate}
        </Text>
      </Text>
    </OptionListItem>
  );
};

export default FriendHistoryMomentItem;