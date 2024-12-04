import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

// endpoint data: additionalDetails.data.open_now

const useLocationDetailFunctions = () => {

    const checkIfOpen = (data) => {
        if (data && data.open_now) {
            console.log('location is open');
            return true;
        }

        if (data && data.open_now === false) {
            console.log('location is closed');
            return false;

        }

        console.log('unknown if location is currently open');

        return null;

    };

    const getCurrentDay = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const currentDayIndex = new Date().getDay();
        return days[currentDayIndex];
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
            return allHours.find(hour => hour.startsWith(getCurrentDay()));
        }
        return null;
    };

    
    const getTomorrowsHours = (allHours) => {
        if (allHours) {
            return allHours.find(hour => hour.startsWith(getTomorrow()));
        }
        return null;
    };

    const getSoonestAvailable = (allHours) => {
        const todayHours = getTodayHours(allHours);
        
    
        // Normalize spaces and remove invisible characters (zero-width spaces, non-breaking spaces, etc.)
        const sanitizedHours = todayHours
            .replace(/[\u200B\u2009\u200C\u200D\uFEFF]/g, ' ')  // Remove invisible characters
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim();  // Trim extra spaces at the beginning and end
    
        // Log sanitized string length and content for debugging
        console.log("Sanitized todayHours length:", sanitizedHours.length);
        console.log("Sanitized todayHours:", sanitizedHours);
    
        // Updated regex pattern to handle "5:00 – 10:00 PM" and "Monday: 5:00 – 10:00 PM"
        const dayTimeRegex = /([A-Za-z]+:\s*)?(\d{1,2}:\d{2})\s*(AM|PM|am|pm)?\s*–\s*(\d{1,2}:\d{2})\s*(AM|PM|am|pm)/;
    
        let match = dayTimeRegex.exec(sanitizedHours);
    
        if (!match) {
            console.log(sanitizedHours);
            console.log('no match');

                if (checkIfOpen(allHours) === false) {
                    console.log('returning tomorrow');
                    return getTomorrow();
                } else {
                    console.log('returning unknown');
                    return 'Unknown';
                

            }
            
        } 
    
        let endTime, period;
    
        // Extract end time and period from the match
        endTime = match[4]; 
        period = match[5]; 

        if (!endTime || !period) {
            console.log('Invalid time or period format');
            if (checkIfOpen(allHours) === false) {
                return getTomorrow();
            } else {
                return 'Unknown';
            }
        }
    
        // Split the time and convert it to a 24-hour format
        const [hour, minute] = endTime.split(":").map(Number);
    
        // Check if hour and minute are valid numbers
        if (isNaN(hour) || isNaN(minute)) {
            console.log('Invalid time format');
            return getCurrentDay();
        }
    
        const endHour24 = (period === "PM" && hour !== 12 ? hour + 12 : 
                            (period === "AM" && hour === 12 ? 0 : hour));
    
        // Get current time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
    
        // Compare the current time with the end time
        if (currentHour > endHour24 || (currentHour === endHour24 && currentMinute > minute)) {
            console.log('returning tomorrow\'s date'); 
            return getTomorrow();
        } else {
            console.log('returning today', currentHour, endHour24);
            return getCurrentDay();
        }
    };

    
    
    
   
    



    return({

        checkIfOpen,
        getCurrentDay,
        getTodayHours,
        getTomorrow,
        getSoonestAvailable,

})

};

export default useLocationDetailFunctions;