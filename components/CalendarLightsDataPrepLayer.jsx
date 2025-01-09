//i think can use with other data just need
//a -- a full date with day (i think multiple dif formats would work) which gets converted
//to utc to get the day and add it to a list that the calenderlights component will match
//to the days on the calender)
// turn that into `${month}/${year}` with monthYear variable as well to find start/end.
//MUST be 'monthYear' because this matches with the dates range that CalenderLights uses

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";

import { useSelectedFriend } from "../context/SelectedFriendContext";
import { format } from "date-fns";

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
  const { helloesList } = useHelloes();

  const { selectedFriend, friendDashboardData } = useSelectedFriend();

  // useEffect(() => {
  //   if (helloesList) {
  //     console.log('HELLOES LIST', helloesList);
  //   }

  // }, [helloesList]);

  //for some dumb reason i don't record the dates of the helloes thenmselves like a normal person
  //on my backend so here is my modified function to format it
  const lightFormatBackendDateToMonthYear = (backendDate) => {
    //console.log('LATEST DATE IN CALCULATOR:', backendDate);
    const date = new Date(backendDate);
    const month = date.getUTCMonth() + 1; // Get UTC month
    const year = date.getUTCFullYear(); // Get UTC year
    //console.log('LATEST DATE IN CALCULATOR:', year, month);
    return `${month}/${year}`;
  };

  // const lightFormatBackendDateToMonthYear = (backendDate) => {
  //   const date = new Date(backendDate);
  //   const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
  //   const year = date.getFullYear();
  //   return `${month}/${year}`;
  // };
  const groupByMonthAndYear = (data) => {
    //console.log('group by', data);

    // Step 1: Group data by month and year
    const groupedData = data.reduce((acc, item) => {
      const createdDate = new Date(item.dateLong + "T00:00:00"); // Treat as local time

      //console.log(item.dateLong);
      //console.log("CREATED DATE", createdDate);

      // Ensure the date was parsed successfully
      if (isNaN(createdDate)) {
        console.error("Invalid date:", item.dateLong);
        return acc; // Skip invalid dates
      }

      // Format the month/year string as 'month/year'
      const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

      // If this monthYear doesn't exist, create an empty structure
      if (!acc[monthYear]) {
        acc[monthYear] = {
          data: [],
          days: [], // To store unique day numbers
        };
      }

      // Add item to the grouped data
      acc[monthYear].data.push(item);

      // Extract the day of the month using getDate() for local time (no UTC adjustments)
      const dayOfMonth = createdDate.getDate(); // Use getDate() for local day
      if (!acc[monthYear].days.includes(dayOfMonth)) {
        acc[monthYear].days.push(dayOfMonth);
      }
      //console.log(`Final days for ${monthYear}:`, acc[monthYear].days);

      return acc;
    }, {});

    const allDates = data.map((item) => new Date(item.dateLong + "T00:00:00"));
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    const monthsList = [];
    const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    while (start <= end) {
      const monthYear = `${start.getMonth() + 1}/${start.getFullYear()}`;
      monthsList.push(monthYear);
      start.setMonth(start.getMonth() + 1);
    }

    const sortedMonths = monthsList.map((monthYear, index) => {
      return {
        monthYear,
        index,
        data: groupedData[monthYear]?.data || [],
        days: groupedData[monthYear]?.days || [],
      };
    });

    return sortedMonths;
  };

  return (
    <>
      {helloesList && friendDashboardData && (
        <CalendarLights
          daySquareBorderRadius={daySquareBorderRadius}
          daySquareBorderColor={daySquareBorderColor}
          opacityMinusAnimation={opacityMinusAnimation}
          animationColor={animationColor}
          helloesDataSorted={groupByMonthAndYear(helloesList)}
          earliestDataPoint={lightFormatBackendDateToMonthYear(
            helloesList[helloesList.length - 1].dateLong
          )}
          latestDataPoint={lightFormatBackendDateToMonthYear(
            helloesList[0].dateLong
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default CalendarLightsDataPrepLayer;
