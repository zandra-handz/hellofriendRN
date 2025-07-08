import { View, Text } from "react-native";
import React from "react";
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue,
};

const CalendarChart = ({ selectedFriend, outerPadding }: Props) => {
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();

  const HEIGHT = 160;

  return (
    <View
      style={[
        {
          overflow: "hidden",
          height: HEIGHT,
          padding: 10,
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          borderRadius: 20,
        },
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",

          // backgroundColor: 'orange',
          marginBottom: outerPadding,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            // name="hand-wave-outline"
              name="calendar-heart"
            size={20}
            color={themeStyles.primaryText.color}
            style={{ marginBottom: 0 }}
          />
          <Text
            style={[
              themeStyles.primaryText,
              {
                marginLeft: 6,
                marginRight: 12,
                fontWeight: "bold",
              },
            ]}
          >
            Past Helloes
          </Text>
        </View>
        <LabeledArrowButton
          color={themeStyles.primaryText.color}
          label="View"
          opacity={0.7}
          onPress={() => navigation.navigate("Helloes")}
        />
      </View>
      {selectedFriend && (
        <HomeScrollCalendarLights
          itemColor={themeStyles.primaryText.color}
          backgroundColor={themeStyles.overlayBackgroundColor.backgroundColor}
          height={70}
          borderRadius={20}
        />
      )}
      <View style={{ width: "100%", height: 10 }}></View>
    </View>
  );
};

export default CalendarChart;
