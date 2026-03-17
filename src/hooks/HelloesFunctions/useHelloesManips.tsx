// import { useMemo, useEffect } from "react";

// import {
//   eachMonthOfInterval,
//   startOfMonth,
//   getDaysInMonth,
//   format,
// } from "date-fns";

// type Props = {
//   helloesData: object[];
// };

// const useHelloesManips = ({ helloesData }: Props) => {
//   // console.log("HELLOES DATA IN MANIP: ", helloesData);

//   const flattenHelloes = useMemo(() => {
//     if (helloesData && helloesData.length > 0) {
//       return helloesData.flatMap((hello) => {
//         const helloCapsulesObj = hello.thought_capsules_shared || {};
//         const helloCapsules = Object.entries(helloCapsulesObj);

//         return helloCapsules.length > 0
//           ? helloCapsules.map(([capsuleId, capsuleData]) => ({
//               id: hello.id,
//               date: hello.date,
//               type: hello.type,
//               typedLocation: hello.typed_location,
//               locationName: hello.location_name,
//               location: hello.location,
//               additionalNotes: hello.additional_notes || "",
//               capsuleId,
//               capsule: capsuleData.capsule,
//               typedCategory: capsuleData.typed_category,
//               userCategory: capsuleData.user_category,
//               userCategoryName: capsuleData.user_category_name,
//             }))
//           : [
//               {
//                 id: hello.id,
//                 date: hello.date,
//                 type: hello.type,
//                 typedLocation: hello.typed_location,
//                 locationName: hello.location_name,
//                 location: hello.location,
//                 additionalNotes: hello.additional_notes || "",
//                 capsuleId: null,
//                 capsule: null,
//                 typedCategory: null,
//                 userCategory: null,
//                 userCategoryName: null,
//               },
//             ];
//       });
//     }
//     return [];
//   }, [helloesData]);

//   const lightFormatBackendDateToMonthYear = (backendDate) => {
//     const date = new Date(backendDate);
//     const month = date.getUTCMonth() + 1; // Get UTC month
//     const year = date.getUTCFullYear(); // Get UTC year
//     //console.log('LATEST DATE IN CALCULATOR:', year, month);
//     return `${month}/${year}`;
//   };

  
//   const helloesListMonthYear = useMemo(() => {
//     if (helloesData && helloesData.length > 0) {
//       if (!Array.isArray(helloesData)) {
//         console.error(
//           "Invalid data passed to groupByMonthAndYear:",
//           helloesData
//         );
//         return [];
//       }

      

//       const groupedData = helloesData.reduce((acc, item) => {
//         const createdDate = new Date(item.date + "T00:00:00");

//         if (isNaN(createdDate)) {
//           return acc;
//         }

//         const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

//         if (!acc[monthYear]) {
//           acc[monthYear] = {
//             data: [],
//             days: [], // will hold objects like { dayNumber: { voided: boolean, manual: boolean } }
//           };
//         }

//         acc[monthYear].data.push(item);

//         const dayOfMonth = createdDate.getDate();

//         // Find index if day already exists in days array
//         const existingDayIndex = acc[monthYear].days.findIndex(
//           (dayObj) => dayOfMonth in dayObj
//         );

//         // Determine if manual_reset field exists at all on item (voided) and its value (manual)
//         const voided = item.hasOwnProperty("manual_reset");
//         const manual = !!item.manual_reset;
//         const id = item.id;

//         if (existingDayIndex === -1) {
//           // Day not present yet, add new day object with voided/manual flags
//           acc[monthYear].days.push({
//             [dayOfMonth]: {
//               voided,
//               manual,
//               id,
//             },
//           });
//         } else {
//           // Day exists, update values:
//           const existing = acc[monthYear].days[existingDayIndex][dayOfMonth];
//           acc[monthYear].days[existingDayIndex][dayOfMonth] = {
//             voided: existing.voided || voided,
//             manual: existing.manual || manual,
//             id: existing.id || id,
//           };
//         }

//         return acc;
//       }, {});

//       // rest of your code unchanged:
//       const allDates = helloesData.map(
//         (item) => new Date(item.date + "T00:00:00")
//       );
//       const minDate = new Date(Math.min(...allDates));
//       const maxDate = new Date(Math.max(...allDates));

//       const monthsList = [];
//       const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
//       const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

//       while (start <= end) {
//         const monthYear = `${start.getMonth() + 1}/${start.getFullYear()}`;
//         monthsList.push(monthYear);
//         start.setMonth(start.getMonth() + 1);
//       }



//       const sortedMonths = monthsList.map((monthYear, index) => ({
//         monthYear,
//         index,
//         data: groupedData[monthYear]?.data || [],
//         days: groupedData[monthYear]?.days || [],
//       }));

//       return sortedMonths;
//     }
//     return [];
//   }, [helloesData]);

//   const monthsInRange = useMemo(() => {
//     if (helloesData && helloesData.length > 0) {
//       const earliestDate = lightFormatBackendDateToMonthYear(
//         helloesData[helloesData.length - 1].date
//       );
//       const latestDate = lightFormatBackendDateToMonthYear(helloesData[0].date);

//       const [startMonthNum, startYear] = earliestDate.split("/").map(Number);
//       const [endMonthNum, endYear] = latestDate.split("/").map(Number);

//       // Set the start and end dates based on the given months
//       const startDate = new Date(startYear, startMonthNum - 1, 1); // Start of the given start month
//       const endDate = new Date(endYear, endMonthNum - 1, 1); // Start of the given end month
//       //console.log("END DATE", endDate);
//       // Generate all months in the interval
//       const months = eachMonthOfInterval({
//         start: startDate,
//         end: endDate,
//       }).map((date) => {
//         return {
//           month: format(date, "MMMM"), // Full month name
//           year: format(date, "yyyy"), // Year
//           daysInMonth: getDaysInMonth(date), // Total days in the month
//           startsOn: format(startOfMonth(date), "EEEE"), // Day of the week the month starts on
//           monthYear: format(date, "M/yyyy"), // Month/Year in M/yyyy format
//         };
//       });

//       return months;
//     }
//   }, [helloesData]);

         
//     const combineMonthRangeAndHelloesDates = (months, helloes) => {
//     if (months && helloes) {
//       // console.warn(helloes);
//       return months.map((month) => {
//         const helloData =
//           helloes.find((hello) => hello.monthYear === month.monthYear) || null;
  
//         return {
//           monthData: month,
//           helloData,
//         };
//       });
//     }
//     return [];  
//   };

//           const combinedData = useMemo(() => {
//           if (monthsInRange && helloesListMonthYear) {
//             return (
//               combineMonthRangeAndHelloesDates(monthsInRange, helloesListMonthYear)
//             )
//           }
      
//         }, [monthsInRange, helloesListMonthYear]);

 

//   return {
//     flattenHelloes,
//     helloesListMonthYear,
//     monthsInRange,
//     combinedData,
//   };
// };

// export default useHelloesManips;


import { useMemo } from "react";

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

  const flattenHelloes = useMemo(() => {
    if (!helloesData?.length) return [];

    return helloesData.flatMap((hello) => {
      const helloCapsulesObj = hello.thought_capsules_shared || {};
      const helloCapsules = Object.entries(helloCapsulesObj);

      const base = {
        id: hello.id,
        date: hello.date,
        type: hello.type,
        typedLocation: hello.typed_location,
        locationName: hello.location_name,
        location: hello.location,
        additionalNotes: hello.additional_notes || "",
      };

      return helloCapsules.length > 0
        ? helloCapsules.map(([capsuleId, capsuleData]) => ({
            ...base,
            capsuleId,
            capsule: capsuleData.capsule,
            typedCategory: capsuleData.typed_category,
            userCategory: capsuleData.user_category,
            userCategoryName: capsuleData.user_category_name,
          }))
        : [
            {
              ...base,
              capsuleId: null,
              capsule: null,
              typedCategory: null,
              userCategory: null,
              userCategoryName: null,
            },
          ];
    });
  }, [helloesData]);

  const helloesListMonthYear = useMemo(() => {
    if (!helloesData?.length) return [];
    if (!Array.isArray(helloesData)) return [];

    const groupedData: Record<
      string,
      { data: object[]; days: Record<number, { voided: boolean; manual: boolean; id: any }>}
    > = {};

    let minTime = Infinity;
    let maxTime = -Infinity;

    for (let i = 0; i < helloesData.length; i++) {
      const item = helloesData[i];
      const createdDate = new Date(item.date + "T00:00:00");
      const time = createdDate.getTime();
      if (isNaN(time)) continue;

      if (time < minTime) minTime = time;
      if (time > maxTime) maxTime = time;

      const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

      if (!groupedData[monthYear]) {
        groupedData[monthYear] = { data: [], days: {} };
      }

      const group = groupedData[monthYear];
      group.data.push(item);

      const dayOfMonth = createdDate.getDate();
      const voided = item.hasOwnProperty("manual_reset");
      const manual = !!item.manual_reset;
      const id = item.id;

      const existing = group.days[dayOfMonth];
      if (!existing) {
        group.days[dayOfMonth] = { voided, manual, id };
      } else {
        existing.voided = existing.voided || voided;
        existing.manual = existing.manual || manual;
        existing.id = existing.id || id;
      }
    }

    // Build month range from min/max (no extra Date array allocation)
    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);

    const monthsList: string[] = [];
    const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    while (cursor <= end) {
      monthsList.push(`${cursor.getMonth() + 1}/${cursor.getFullYear()}`);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    // Convert days from object to array format for compatibility
    return monthsList.map((monthYear, index) => {
      const group = groupedData[monthYear];
      const daysArray = group
        ? Object.entries(group.days).map(([day, val]) => ({ [Number(day)]: val }))
        : [];

      return {
        monthYear,
        index,
        data: group?.data || [],
        days: daysArray,
      };
    });
  }, [helloesData]);

  const monthsInRange = useMemo(() => {
    if (!helloesData?.length) return undefined;

    // Use the already-computed list to get date range instead of re-parsing
    const first = helloesData[helloesData.length - 1];
    const last = helloesData[0];
    if (!first?.date || !last?.date) return undefined;

    const firstDate = new Date(first.date + "T00:00:00");
    const lastDate = new Date(last.date + "T00:00:00");

    const startDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    const endDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);

    return eachMonthOfInterval({ start: startDate, end: endDate }).map(
      (date) => ({
        month: format(date, "MMMM"),
        year: format(date, "yyyy"),
        daysInMonth: getDaysInMonth(date),
        startsOn: format(startOfMonth(date), "EEEE"),
        monthYear: format(date, "M/yyyy"),
      }),
    );
  }, [helloesData]);

  const combinedData = useMemo(() => {
    if (!monthsInRange || !helloesListMonthYear) return undefined;

    // O(1) lookup 
    const helloesMap = new Map<string, (typeof helloesListMonthYear)[0]>();
    for (const h of helloesListMonthYear) {
      helloesMap.set(h.monthYear, h);
    }

    return monthsInRange.map((month, index) => ({
      index: index,
      monthData: month,
      helloData: helloesMap.get(month.monthYear) || null,
    }));
  }, [monthsInRange, helloesListMonthYear]);






  return {
    flattenHelloes,
    helloesListMonthYear,
    monthsInRange,
    combinedData,
  };
};

export default useHelloesManips;