import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";

import { useQuery } from "@tanstack/react-query";

// endpoint data: additionalDetails.data.open_now

const useLocationDetailFunctions = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const checkIfOpen = (data) => {
    if (data && data.open_now) {
      // console.log('location is open');
      return true;
    }

    if (data && data.open_now === false) {
      // console.log('location is closed');
      return false;
    }

    // console.log('unknown if location is currently open');

    return null;
  };

  const getCurrentDay = () => {
    const currentDayIndex = new Date().getDay();
    console.log(currentDayIndex);

    let returnObject = {};

    return (returnObject = {
      index: currentDayIndex,
      day: days[currentDayIndex],
    });
  };

  const getMsUntilMidnight = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };

  const expire = getMsUntilMidnight();

  const { data: currentDay } = useQuery({
    queryKey: ["currentDay"], // doesn't need to be user specific
    queryFn: getCurrentDay,
    staleTime: expire,
    cacheTime: expire + 1000, // tiny buffer to avoid premature GC
  });

  // 5  3 days rom now

  const getNumOfDaysFrom = (increment) => {
    console.log(`current day in function`, currentDay);

    const steps = currentDay.index + increment;

    const newIndex = steps % 7;  // returns index of day that is increment number of days ahead of current day
                      // NOTE the api data is just what year-round data is available, and might in some cases be wrong
      let returnObject = {};

     return (returnObject = {
      index: newIndex,
      day: days[newIndex],
    });                
  };

  const getNumericParkingScore = (parkingScore) => {
    if (!parkingScore) {
      return { label: "Not specified", score: 0 };
    }

    if (parkingScore === "location has free parking lot") {
      return { label: "Free parking", score: 1 };
    }

    if (parkingScore === "free parking lot nearby") {
      return { label: "Free parking nearby", score: 2 };
    }

    if (parkingScore === "street parking") {
      return { label: "Street parking", score: 3 };
    }

    if (parkingScore === "fairly stressful or unreliable street parking") {
      return { label: "Stressful parking", score: 4 };
    }

    if (parkingScore === "no parking whatsoever") {
      return { label: "No parking", score: 5 };
    }

    if (parkingScore === "unspecified") {
      return { label: "Not specified", score: 0 };
    }

    return { label: "Not specified", score: 0 };
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const getTomorrow = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDayIndex = new Date().getDay();
    const tomorrowDayIndex = (currentDayIndex + 1) % 7; // Ensures it wraps around to 0 after Saturday
    return days[tomorrowDayIndex];
  };

  const getTodayHours = (allHours) => {
    if (allHours) {
      return allHours.find((hour) => hour.startsWith(getCurrentDay()));
    }
    return null;
  };

  const getTomorrowsHours = (allHours) => {
    if (allHours) {
      return allHours.find((hour) => hour.startsWith(getTomorrow()));
    }
    return null;
  };

  const getSoonestAvailable = (allHours) => {
    const todayHours = getTodayHours(allHours);

    const sanitizedHours = todayHours
      .replace(/[\u200B\u2009\u200C\u200D\uFEFF]/g, " ") // Remove invisible characters
      .replace(/\s+/g, " ")
      .trim();

    // console.log("Sanitized todayHours length:", sanitizedHours.length);
    // console.log("Sanitized todayHours:", sanitizedHours);

    const dayTimeRegex =
      /([A-Za-z]+:\s*)?(\d{1,2}:\d{2})\s*(AM|PM|am|pm)?\s*–\s*(\d{1,2}:\d{2})\s*(AM|PM|am|pm)/;

    let match = dayTimeRegex.exec(sanitizedHours);

    if (!match) {
      // console.log(sanitizedHours);
      // console.log('no match');

      if (checkIfOpen(allHours) === false) {
        // console.log('returning tomorrow');
        return getTomorrow();
      } else {
        // console.log('returning unknown');
        return "Unknown";
      }
    }

    let endTime, period;

    // Extract end time and period from the match
    endTime = match[4];
    period = match[5];

    if (!endTime || !period) {
      // console.log('Invalid time or period format');
      if (checkIfOpen(allHours) === false) {
        return getTomorrow();
      } else {
        return "Unknown";
      }
    }

    // Split the time and convert it to a 24-hour format
    const [hour, minute] = endTime.split(":").map(Number);

    // Check if hour and minute are valid numbers
    if (isNaN(hour) || isNaN(minute)) {
      // console.log('Invalid time format');
      return getCurrentDay();
    }

    const endHour24 =
      period === "PM" && hour !== 12
        ? hour + 12
        : period === "AM" && hour === 12
          ? 0
          : hour;

    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Compare the current time with the end time
    if (
      currentHour > endHour24 ||
      (currentHour === endHour24 && currentMinute > minute)
    ) {
      // console.log('returning tomorrow\'s date');
      return getTomorrow();
    } else {
      // console.log('returning today', currentHour, endHour24);
      return getCurrentDay();
    }
  };

  const getScoreColor = (range, score) => {
    const [min, max] = range;
    const clampedScore = Math.max(min, Math.min(score, max));
    const percent = (clampedScore - min) / (max - min);

    const r =
      percent < 0.5
        ? Math.round(255 * (percent * 2)) // 0 → 255 (green to yellow)
        : 255; // red stays max after midpoint

    const g =
      percent < 0.5
        ? 255 // green stays max before midpoint
        : Math.round(255 * (1 - (percent - 0.5) * 2)); // 255 → 0 (yellow to red)

    return `rgb(${r}, ${g}, 0)`;
  };

  return {
    checkIfOpen,
    getCurrentDay,
    currentDay,
    getTodayHours,
    getTomorrow,
    getSoonestAvailable,
    getNumericParkingScore,
    getScoreColor,
    getNumOfDaysFrom,
  };
};

export default useLocationDetailFunctions;
