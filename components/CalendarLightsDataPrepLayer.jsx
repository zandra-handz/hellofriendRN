//i think can use with other data just need
//a -- a full date with day (i think multiple dif formats would work) which gets converted
//to utc to get the day and add it to a list that the calenderlights component will match
//to the days on the calender)
// turn that into `${month}/${year}` with monthYear variable as well to find start/end.
//MUST be 'monthYear' because this matches with the dates range that CalenderLights uses

import React from "react";
import { 
  StyleSheet,
} from "react-native";

import { useSelectedFriend } from "../context/SelectedFriendContext";
 

// import useHelloesData from "../hooks/useHelloesData";
import { useHelloes } from "../context/HelloesContext";

import CalendarLights from "../components/CalendarLights";

const CalendarLightsDataPrepLayer = ({
  daySquareBorderRadius = 0,
  daySquareBorderColor = "black",
  opacityMinusAnimation = 1,
  animationColor = "orange",
}) => {
  //these are in parent too but they are not rerendering in the child (CalendarLights)
  const { helloesList, helloesListMonthYear,  monthsInRange } = useHelloes();
  const sortedData = helloesListMonthYear;

  const { selectedFriend, friendDashboardData } = useSelectedFriend();

  const combineMonthRangeAndHelloesDates = (months, helloes) => {
    if (months && helloes) {
      return months.map((month) => {
        const helloData =
          helloes.find((hello) => hello.monthYear === month.monthYear) || null;
  
        return {
          monthData: month,
          helloData,
        };
      });
    }
    return []; // Return an empty array if months or helloes is undefined/null
  };
  
 
 
  return (
    <>
      {helloesList && friendDashboardData && sortedData && selectedFriend && monthsInRange && (
        <CalendarLights
          daySquareBorderRadius={daySquareBorderRadius}
          daySquareBorderColor={daySquareBorderColor}
          opacityMinusAnimation={opacityMinusAnimation}
          animationColor={animationColor} 
          combinedData={combineMonthRangeAndHelloesDates(monthsInRange, sortedData)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default CalendarLightsDataPrepLayer;
