// src/utils/buildPieChart.ts
//
// Transforms a sorted category stats list into pie chart series data
// by attaching label styling and gradient colors from a precomputed map.
//
// ── Input ──
//
// sortedList: array from useUserStats hook, sorted by size descending:
//   [
//     { user_category: 40, name: "Aisles", size: 675, value: 675 },
//     { user_category: 11, name: "Grab bag", size: 211, value: 211 },
//     ...
//   ]
//
// colorsMap: Record<number, string> from useUserStats hook,
//   keyed by user_category id, gradient dark → light by rank:
//   { 40: "#1a2b3c", 11: "#2c3d4e", 4: "#3e4f60", ... }
//
// primaryColor: hex string for label text color (e.g. "#ffffff")
// labelsSize: font size for pie chart labels (e.g. 9)
//
// ── Output ──
//
// Array of series items for the pie chart component:
//   [
//     {
//       user_category: 40,
//       name: "Aisles",
//       size: 675,
//       value: 675,
//       label: { text: "Aisl", fontFamily: "Poppins-Regular", color: "#ffffff", fontSize: 9 },
//       color: "#1a2b3c",
//     },
//     ...
//   ]
//
// Items with size 0 are filtered out.
// Falls back to manualGradientColors.lightColor if a category id is missing from colorsMap.

import manualGradientColors from "@/app/styles/StaticColors";

type BuildSeriesDataParams = {
  sortedList: any[];
  colorsMap: Record<number, string>;
  labelColor: string;
  labelSize: number;
};

const buildPieChart = ({
  sortedList,
  colorsMap,
  labelColor,
  labelSize=9,
}: BuildSeriesDataParams) => {
 
  if (!sortedList) return [];

  return sortedList
    .filter((item) => Number(item.size) > 0)
    .map((item) => ({
      ...item,
      label: {
        text: item.name.slice(0, 4),
        fontFamily: "Poppins-Regular",
        color: labelColor,
        fontSize: labelSize,
      },
      color: colorsMap[item.user_category] ?? manualGradientColors.lightColor,
    }));
};

export default buildPieChart;