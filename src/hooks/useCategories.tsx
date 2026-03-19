 

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserCategories } from "@/src/calls/api";

export interface CategoryType {
  id: number;
  name: string;
}

type Props = {
  userId: number;
  isInitializing?: boolean;
  enabled?: boolean;
};

const useCategories = ({
  userId,
  isInitializing = false,
  enabled = true,
}: Props) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getUserCategories(userId),
    enabled: !!(userId && !isInitializing && enabled),
   // staleTime: 1000 * 60 * 60 * 10,
  });

  const userCategories = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const categoryIds = useMemo(
    () => userCategories.map((c) => c.id),
    [userCategories],
  );

  return {
    userCategories,
    categoryIds,
    isLoading,
    isSuccess,
  };
};

export default useCategories;











// import React, { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getUserCategories } from "@/src/calls/api";
// import manualGradientColors from "@/app/styles/StaticColors";

// export interface CategoryType {
//   id: number;
//   name: string;
// }

// type Props = {
//   userId: number;
//   isInitializing?: boolean;
//   enabled?: boolean;
// };

// const hexToRgb = (hex: string) => hex.match(/\w\w/g)!.map((c) => parseInt(c, 16));
// const rgbToHex = (rgb: number[]) =>
//   "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

// const useCategories = ({
//   userId,
//   isInitializing = false,
//   enabled = true,
// }: Props) => {
//   const { data, isLoading, isSuccess } = useQuery({
//     queryKey: ["categories", userId],
//     queryFn: () => getUserCategories(userId),
//     enabled: !!(userId && !isInitializing && enabled),
//     staleTime: 1000 * 60 * 60 * 10,
//   });

//   const userCategories = useMemo(() => {
//     if (!data) return [];
//     return data;
//   }, [data]);

//   const categoryIds = useMemo(
//     () => userCategories.map((c) => c.id),
//     [userCategories],
//   );

//   const categoryColorsMap = useMemo(() => {
//     const count = userCategories.length;
//     if (count === 0) return {};

//     const start = hexToRgb(manualGradientColors.darkColor);
//     const end = hexToRgb(manualGradientColors.lightColor);

//     return Object.fromEntries(
//       userCategories.map((cat, i) => {
//         const t = i / Math.max(count - 1, 1);
//         const interpolated = start.map((s, j) =>
//           Math.round(s + (end[j] - s) * t)
//         );
//         return [cat.id, rgbToHex(interpolated)];
//       })
//     );
//   }, [userCategories]);

//   return {
//     userCategories,
//     categoryIds,
//     categoryColorsMap,
//     isLoading,
//     isSuccess,
//   };
// };

// export default useCategories;