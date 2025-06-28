import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";

const useLocationHours = (daysHrsData) => {


  if (!daysHrsData) {
    return;
  }

  const removeZeroMinutes = (time) => {
    return time.replace(":00", "");
  };

  const [hours, setHours] = useState(["All", ...daysHrsData]); // needs to be set right away

  const fullDays = [
    "All",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]; // Full day names





  const fullDaysOfWeek = useMemo(() => {
    if (!fullDays) {
      return [];
    }
    return fullDays.map((day) => day + "s");
  }, [fullDays]);



  const daysOfWeek = useMemo(() => {
    if (!daysHrsData) {
      setHours([]);
      return [];
    }

    setHours(["all", ...daysHrsData]);
    const abbreviatedDays = daysHrsData.map((entry) => entry.slice(0, 3));
    return ["All", ...abbreviatedDays];
  }, [daysHrsData]);

//   const hoursForAllDays = useMemo(() => {
//     if (!hours) {
//       return [];
//     }
//     return hours.map(
//       (entry, index) =>
//         `${daysOfWeek[index]}: ${removeZeroMinutes(entry.slice(entry.indexOf(":") + 1))}`
//     );
//   }, [hours]);


const hoursForAllDays = useMemo(() => {
  if (!hours) return {};

  return hours.reduce((acc, entry, index) => {
    const day = daysOfWeek[index];
    const time = removeZeroMinutes(entry.slice(entry.indexOf(":") + 1)).trim();
    acc[day] = time;
    return acc;
  }, {});
}, [hours, daysOfWeek]);

const hoursForAllDaysNiceString = useMemo(() => {
  if (!hoursForAllDays || Object.keys(hoursForAllDays).length === 0) {
    return '';
  }

  const values = Object.values(hoursForAllDays); // turn object into array of time strings
  const lastIndex = values.length - 1;

  return values.map((item, index) =>
    index !== lastIndex ? `${item}, ` : `and ${item}`
  ).join('');
}, [hoursForAllDays]);


// can use hoursForAllDays searching with weekday abbreviations
//   const getHoursForDay = (dayIndex) => {
//     if (dayIndex >= 0 && dayIndex < hours.length) {
//       const hoursString = hours[dayIndex];
//       const timeStartIndex = hoursString.indexOf(":") + 1;

//       const withZeroes =
//         timeStartIndex > 0
//           ? hoursString.slice(timeStartIndex).trim()
//           : "Closed"; // Slice from the colon to end and trim

//       return removeZeroMinutes(withZeroes);
//     }
//     return "Closed";
//   };

  return {
    fullDays,
    fullDaysOfWeek,
    removeZeroMinutes,
    daysOfWeek,
    hours,
    hoursForAllDays,
    hoursForAllDaysNiceString,
    // getHoursForDay,
  };
};

export default useLocationHours;
