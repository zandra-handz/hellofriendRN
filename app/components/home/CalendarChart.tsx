import { View, Text, Pressable } from "react-native";
import React, { useState  } from "react"; 
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MonthModal from "../headers/MonthModal";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import useHelloesManips from "@/src/hooks/useHelloesManips";
// import { useHelloes } from "@/src/context/HelloesContext";

type Props = { 
  outerPadding: DimensionValue;
  combinedData: any;
};

const CalendarChart = ({   outerPadding=10, combinedData }: Props) => {

    // const { helloesList } = useHelloes();
    // const { selectedFriend } = useSelectedFriend();
  
  //  const reversedHelloesList = Array.isArray(helloesList) ? [...helloesList].reverse() : [];
  //   const { helloesListMonthYear, monthsInRange } = useHelloesManips({helloesData: reversedHelloesList});
  
       
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();

  const [monthModalVisible, setMonthModalVisible ] = useState(false);
  const [ monthData, setMonthData] = useState(null);

  const HEIGHT = 160;
  const PADDING = 20;

  const handleMonthPress = (data) => {
    setMonthData(data);
    console.log(data);
    setMonthModalVisible(true);

  };
  console.warn('calendarChart rerendered');

  //   const combineMonthRangeAndHelloesDates = (months, helloes) => {
  //   if (months && helloes) {
  //     // console.warn(helloes);
  //     return months.map((month) => {
  //       const helloData =
  //         helloes.find((hello) => hello.monthYear === month.monthYear) || null;
  
  //       return {
  //         monthData: month,
  //         helloData,
  //       };
  //     });
  //   }
  //   return []; // Return an empty array if months or helloes is undefined/null
  // };
 
  // const combinedData = useMemo(() => {
  //   if (monthsInRange && helloesListMonthYear) {
  //     return (
  //       combineMonthRangeAndHelloesDates(monthsInRange, helloesListMonthYear)
  //     )
  //   }

  // }, [monthsInRange, helloesListMonthYear]);

  return (
    <>

    <View
      style={[
        {
          overflow: "hidden",
          height: HEIGHT,
          padding: PADDING,
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

        <Pressable hitSlop={10} onPress={() => navigation.navigate("Helloes")}>
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
   
        <HomeScrollCalendarLights
        onMonthPress={handleMonthPress}
        combinedData={combinedData}
          itemColor={themeStyles.primaryText.color}
          backgroundColor={themeStyles.overlayBackgroundColor.backgroundColor}
          height={70}
          borderRadius={20}
        />
  
      <View style={{ width: "100%", height: 10 }}></View>
      
    </View>

        {monthModalVisible && (
      <MonthModal
      isVisible={monthModalVisible}
      monthData={monthData}
      closeModal={() => setMonthModalVisible(false)}/>
    )}
    
    </>
  );
};

export default CalendarChart;
