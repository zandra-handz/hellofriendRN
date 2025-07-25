 
import  { useMemo, useEffect } from "react";

import {
  eachMonthOfInterval,
  startOfMonth,
  getDaysInMonth,
  format,
} from "date-fns";

type Props = {
  helloesData: object[];
};

const useHelloesManips = ({ helloesData }: Props) => {

    // console.log('HELLOES DATA IN MANIP: ', helloesData);


  const flattenHelloes = useMemo(() => {
  if (helloesData && helloesData.length > 0) {
    return helloesData.flatMap((hello) => {
      const helloCapsulesObj = hello.thought_capsules_shared || {};
      const helloCapsules = Object.entries(helloCapsulesObj);

      return helloCapsules.length > 0
        ? helloCapsules.map(([capsuleId, capsuleData]) => ({
            id: hello.id,
            date: hello.date,
            type: hello.type,
            typedLocation: hello.typed_location,
            locationName: hello.location_name,
            location: hello.location,
            additionalNotes: hello.additional_notes || "",
            capsuleId,
            capsule: capsuleData.capsule,
            typedCategory: capsuleData.typed_category,
            userCategory: capsuleData.user_category,
            userCategoryName: capsuleData.user_category_name,
          }))
        : [
            {
              id: hello.id,
              date: hello.date,
              type: hello.type,
              typedLocation: hello.typed_location,
              locationName: hello.location_name,
              location: hello.location,
              additionalNotes: hello.additional_notes || "",
              capsuleId: null,
              capsule: null,
              typedCategory: null,
              userCategory: null,
              userCategoryName: null,
            },
          ];
    });
  }
  return [];
}, [helloesData]);



    const lightFormatBackendDateToMonthYear = (backendDate) => {
    const date = new Date(backendDate);
    const month = date.getUTCMonth() + 1; // Get UTC month
    const year = date.getUTCFullYear(); // Get UTC year
    //console.log('LATEST DATE IN CALCULATOR:', year, month);
    return `${month}/${year}`;
  }; 


  
    const helloesListMonthYear = useMemo(() => {
        if (helloesData && helloesData.length > 0) {
        if (!Array.isArray(helloesData)) {
          console.error(
            "Invalid data passed to groupByMonthAndYear:",
            helloesData
          );
          return [];
        }
  
        const groupedData = helloesData.reduce((acc, item) => {
          const createdDate = new Date(item.date + "T00:00:00");
  
          if (isNaN(createdDate)) {
            // console.error("Invalid date:", item.date);
            return acc;
          }
  
          const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
  
          if (!acc[monthYear]) {
            acc[monthYear] = {
              data: [],
              days: [],
            };
          }
  
          acc[monthYear].data.push(item);
  
          const dayOfMonth = createdDate.getDate();
          if (!acc[monthYear].days.includes(dayOfMonth)) {
            acc[monthYear].days.push(dayOfMonth);
          }
  
          return acc;
        }, {});
  
        const allDates = helloesData.map(
          (item) => new Date(item.date + "T00:00:00")
        );
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
      }
      return [];
    }, [helloesData]);

   const monthsInRange = useMemo(() => {
     if (helloesData && helloesData.length > 0) {
       const earliestDate = lightFormatBackendDateToMonthYear(
         helloesData[helloesData.length - 1].date
       );
       const latestDate = lightFormatBackendDateToMonthYear(
         helloesData[0].date
       );
 
       const [startMonthNum, startYear] = earliestDate.split("/").map(Number);
       const [endMonthNum, endYear] = latestDate.split("/").map(Number);
 
       // Set the start and end dates based on the given months
       const startDate = new Date(startYear, startMonthNum - 1, 1); // Start of the given start month
       const endDate = new Date(endYear, endMonthNum - 1, 1); // Start of the given end month
       //console.log("END DATE", endDate);
       // Generate all months in the interval
       const months = eachMonthOfInterval({
         start: startDate,
         end: endDate,
       }).map((date) => {
         return {
           month: format(date, "MMMM"), // Full month name
           year: format(date, "yyyy"), // Year
           daysInMonth: getDaysInMonth(date), // Total days in the month
           startsOn: format(startOfMonth(date), "EEEE"), // Day of the week the month starts on
           monthYear: format(date, "M/yyyy"), // Month/Year in M/yyyy format
         };
       });
 
       return months;
     }
   }, [helloesData]);

  //  useEffect(() => {
  //   if (flattenHelloes) {
  //       console.log('flattenhelloes !!');
  //       console.log(flattenHelloes.length);
  //   }

  //  }, [flattenHelloes]);

  return {
    flattenHelloes,
    helloesListMonthYear,
    monthsInRange,
  };
};

export default useHelloesManips;
