import { View, Text, Pressable } from "react-native";
import React, { useState } from "react"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MonthModal from "../headers/MonthModal"; 
import useHelloesManips from "@/src/hooks/useHelloesManips";
import { useHelloes } from "@/src/context/HelloesContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";

type Props = {
  outerPadding: DimensionValue;
  combinedData: any;
  showTopBar: boolean;
  useBackgroundOverlay: boolean;
};

const CalendarChart = ({
  showTopBar = true,
  useBackgroundOverlay = true,
  outerPadding = 10,
}: Props) => {
  const { helloesList } = useHelloes();
const { navigateToHelloes } = useAppNavigations();

  const reversedHelloesList = Array.isArray(helloesList)
    ? [...helloesList].reverse()
    : [];
  const { combinedData } = useHelloesManips({
    helloesData: reversedHelloesList,
  });

  const { themeStyles } = useGlobalStyle();
 

  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [monthData, setMonthData] = useState(null);

  const HEIGHT = 160;
  const PADDING = 20;

  const handleMonthPress = (data) => {
    setMonthData(data);
    console.log(data);
    setMonthModalVisible(true);
  }; 


 

  return (
    <>
      <View
        style={[
          {
            overflow: "hidden",
            height: HEIGHT,
            padding: PADDING,
            backgroundColor: useBackgroundOverlay
              ? themeStyles.overlayBackgroundColor.backgroundColor
              : "transparent",
            borderRadius: 20,
          },
        ]}
      >
        {showTopBar && (
          <View
            style={{
              borderRadius: 20,
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",

              marginBottom: outerPadding,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
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

            <Pressable
              hitSlop={10}
              onPress={navigateToHelloes}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  { fontWeight: "bold", fontSize: 13 },
                ]}
              >
                Details
              </Text>
            </Pressable>
          </View>
        )}
        {combinedData && (
          <HomeScrollCalendarLights
            onMonthPress={handleMonthPress}
            combinedData={combinedData}
            itemColor={themeStyles.primaryText.color}
            backgroundColor={themeStyles.overlayBackgroundColor.backgroundColor}
            height={70}
            borderRadius={20}
          />
        )}
        <View style={{ width: "100%", height: 10 }}></View>
      </View>

      {monthModalVisible && (
        <MonthModal
          isVisible={monthModalVisible}
          monthData={monthData}
          closeModal={() => setMonthModalVisible(false)}
        />
      )}
    </>
  );
};

export default CalendarChart;
