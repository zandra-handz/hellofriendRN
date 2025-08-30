import { View } from "react-native";
import React from "react"; 
import { CheckBox } from "react-native-elements";

import { Moment } from "@/src/types/MomentContextTypes";

type Props = {
  item: Moment;
  selectedItems: Moment[];
  isSelected: boolean;
  height: number;
  onPress: (item: Moment) => void;
};

const CheckboxListItem = ({
  manualGradientColors,
  primaryColor = 'red',
  item,
  selectedItems,
  isSelected = false,
  height = 50,
  onPress,
}: Props) => { 
  return (
    <View
      style={[
        {
          height: isSelected ? "auto" : height,
          minHeight: height,
          flexDirection: "row",
          width: "100%",
          paddingRight: 0,
          paddingVertical: 10,
          marginBottom: 5,
          borderRadius: 30,
          overflow: "hidden",
          backgroundColor: isSelected
            ? manualGradientColors.homeDarkColor
            : "transparent",
        },
      ]}
    >
      <View
        style={{
          height: "100%",
          flexShrink: 1,
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckBox
          checked={selectedItems?.includes(item)}
          onPress={() => onPress(item)}
          title={`#${item.user_category_name} - ${item.capsule}`}
          containerStyle={{
            borderWidth: 0,
            backgroundColor: isSelected
              ? manualGradientColors.homeDarkColor
              : "transparent",
            padding: 0,
            flex: 1,
            width: "100%",
          }}
          wrapperStyle={{
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          textStyle={{
            width: "82%",
            color: isSelected
              ? manualGradientColors.lightColor
              : primaryColor,
            fontSize: 13,
          }}
          uncheckedColor={primaryColor}
          checkedColor={manualGradientColors.lightColor}
          iconRight={true}
          right={true}
        />
      </View>
    </View>
  );
};

export default CheckboxListItem;
