//i think can use with other data just need
//a -- a full date with day (i think multiple dif formats would work) which gets converted
//to utc to get the day and add it to a list that the calenderlights component will match
//to the days on the calender)
// turn that into `${month}/${year}` with monthYear variable as well to find start/end.
//MUST be 'monthYear' because this matches with the dates range that CalenderLights uses

import React from "react";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 

// import useHelloesData from "../hooks/useHelloesData";
import { useHelloes } from "@/src/context/HelloesContext";

 

import CalendarLights from "./CalendarLights";

const CalendarLightsDataPrepLayer = ({
  onMonthPress,
  combinedData,
  daySquareBorderRadius = 0,
  daySquareBorderColor = "black",
  opacityMinusAnimation = 1,
  animationColor = "orange",
}) => {
  //these are in parent too but they are not rerendering in the child (CalendarLights)
  const { helloesList } = useHelloes();

 

  const { selectedFriend, friendDashboardData } = useSelectedFriend();

 
  return (
    <>
      {helloesList && friendDashboardData && selectedFriend && (
        <CalendarLights 
        onMonthPress={onMonthPress}
          daySquareBorderRadius={daySquareBorderRadius}
          daySquareBorderColor={daySquareBorderColor}
          opacityMinusAnimation={opacityMinusAnimation}
          animationColor={animationColor} 
          combinedData={combinedData}
        />
      )}
    </>
  );
};
 

export default CalendarLightsDataPrepLayer;
