 
// // import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
// // import React, { useMemo } from "react";
// // import { useQuery, useQueryClient } from "@tanstack/react-query";

// // type Props = {
// //   userId: number;
// //   isInitializing?: boolean;
 
// //   enabled: boolean; 
// // };

// // const useUserStats = ({
// //   userId,
// //   isInitializing=false,
 
// //   enabled, // was using settingsLoaded from UserSettings in the previous Context version of this hook
// // }: Props) => {
// //   const queryClient = useQueryClient();

// //   const { data: stats, isLoading: loadingUserStats } = useQuery(
// //     {
// //     queryKey: ["userStats", userId],
// //     queryFn: () => fetchCategoriesHistoryCountAPI({returnNonZeroesOnly: true}), //return non-empty categories only
    
// //       // queryFn: () => fetchCategoriesFriendHistoryAPI(selectedFriend.id, false), //return non-empty categories only
// //       enabled: !!(
// //         userId &&
 
// //         !isInitializing &&
// //         enabled
// //       ),
// //       staleTime: 1000 * 60 * 60 * 10, // 10 hours
// //     }
// //   );

// //  const refetchUserStats = () => {
// //      if (userId && !isInitializing) {
// //         queryClient.refetchQueries({ queryKey: ["userStats", userId]});//also manually added this to categories and create hello
// //   }

// // };


// // const invalidateUserStats = () => {
// //      if (userId && !isInitializing) {
// //     queryClient.invalidateQueries(["userStats", userId]);
// //   }

// // };


// //   return {
// //     stats,
// //     loadingUserStats,
// //     refetchUserStats,
// //     invalidateUserStats
// //   };
// // };

// // export default useUserStats;



// import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
// import React, { useMemo } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import manualGradientColors from "@/app/styles/StaticColors";

// type Props = {
//   userId: number;
//   isInitializing?: boolean;
//   enabled: boolean;
// };

// const hexToRgb = (hex: string) => hex.match(/\w\w/g)!.map((c) => parseInt(c, 16));
// const rgbToHex = (rgb: number[]) =>
//   "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

// const useUserStats = ({
//   userId,
//   isInitializing = false,
//   enabled,
// }: Props) => {
//   const queryClient = useQueryClient();

//   const { data: stats, isLoading: loadingUserStats } = useQuery({
//     queryKey: ["userStats", userId],
//     queryFn: () => fetchCategoriesHistoryCountAPI({ returnNonZeroesOnly: true }),
//     enabled: !!(userId && !isInitializing && enabled),
//     staleTime: 1000 * 60 * 60 * 10,
//   });
// const statsCategoryColorsMap = useMemo(() => {
//     if (!stats || !Array.isArray(stats)) return {};

//     const withSize = stats.map((item) => ({
//       id: item.id,
//       size: item.capsule_ids?.length ?? 0,
//     }));
//     const sorted = [...withSize].sort((a, b) => b.size - a.size);
//     const nonZero = sorted.filter((item) => item.size > 0);
//     const count = nonZero.length;
//     if (count === 0) return {};

//     const start = hexToRgb(manualGradientColors.darkColor);
//     const end = hexToRgb(manualGradientColors.lightColor);

//     return Object.fromEntries(
//       nonZero.map((item, i) => {
//         const t = i / Math.max(count - 1, 1);
//         const interpolated = start.map((s, j) =>
//           Math.round(s + (end[j] - s) * t)
//         );
//         return [item.id, rgbToHex(interpolated)];
//       })
//     );
//   }, [stats]);

//   const refetchUserStats = () => {
//     if (userId && !isInitializing) {
//       queryClient.refetchQueries({ queryKey: ["userStats", userId] });
//     }
//   };

//   const invalidateUserStats = () => {
//     if (userId && !isInitializing) {
//       queryClient.invalidateQueries({queryKey: ["userStats", userId]});
//     }
//   };

//   return {
//     stats,
//     statsCategoryColorsMap,
//     loadingUserStats,
//     refetchUserStats,
//     invalidateUserStats,
//   };
// };

// export default useUserStats;











import { fetchCategoriesHistoryCountAPI } from "@/src/calls/api";
import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  userId: number;
  isInitializing?: boolean;
  enabled: boolean;
};

const hexToRgb = (hex: string) => hex.match(/\w\w/g)!.map((c) => parseInt(c, 16));
const rgbToHex = (rgb: number[]) =>
  "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

const useUserStats = ({
  userId,
  isInitializing = false,
  enabled,
}: Props) => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: loadingUserStats } = useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => fetchCategoriesHistoryCountAPI({ returnNonZeroesOnly: true }),
    enabled: !!(userId && !isInitializing && enabled),
    staleTime: 1000 * 60 * 60 * 10,
  });

  const { sortedList, hasAnyCapsules, statsCategoryColorsMap } = useMemo(() => {
    if (!stats || !Array.isArray(stats) || stats.length === 0) {
      return { sortedList: [], hasAnyCapsules: false, statsCategoryColorsMap: {} };
    }

    let totalCapsuleCount = 0;
    const categorySizeMap = new Map();

    stats.forEach((category) => {
      const categoryId = Number(category.id);
      const categoryName = String(category.name);
      const categorySize =
        category.completed_capsules?.length ||
        category.capsule_ids?.length ||
        0;

      totalCapsuleCount += categorySize;
      categorySizeMap.set(categoryId, {
        name: categoryName,
        size: categorySize,
      });
    });

    const sorted = Array.from(categorySizeMap.entries())
      .map(([user_category, sizeAndName]) => ({
        user_category,
        name: sizeAndName.name,
        size: sizeAndName.size,
        value: sizeAndName.size,
      }))
      .sort((a, b) => b.size - a.size);

    const nonZero = sorted.filter((item) => item.size > 0);
    const count = nonZero.length;

    let colorsMap: Record<number, string> = {};
    if (count > 0) {
      const start = hexToRgb(manualGradientColors.darkColor);
      const end = hexToRgb(manualGradientColors.lightColor);

      colorsMap = Object.fromEntries(
        nonZero.map((item, i) => {
          const t = i / Math.max(count - 1, 1);
          const interpolated = start.map((s, j) =>
            Math.round(s + (end[j] - s) * t)
          );
          return [item.user_category, rgbToHex(interpolated)];
        })
      );
    }

    return {
      sortedList: sorted,
      hasAnyCapsules: totalCapsuleCount > 0,
      statsCategoryColorsMap: colorsMap,
    };
  }, [stats]);

  const refetchUserStats = () => {
    if (userId && !isInitializing) {
      queryClient.refetchQueries({ queryKey: ["userStats", userId] });
    }
  };

  const invalidateUserStats = () => {
    if (userId && !isInitializing) {
      queryClient.invalidateQueries({ queryKey: ["userStats", userId] });
    }
  };

  return {
    stats,
    sortedList,
    hasAnyCapsules,
    statsCategoryColorsMap,
    loadingUserStats,
    refetchUserStats,
    invalidateUserStats,
  };
};

export default useUserStats;