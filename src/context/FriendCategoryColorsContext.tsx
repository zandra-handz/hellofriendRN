// import React, { createContext, useContext, useMemo } from 'react';
// import { generateGradientColorsMap } from '../hooks/GenerateGradientColorsMapUtil';
// import { generateGradientColors } from '../hooks/GradientColorsUril';
// import useCategories from '../hooks/useCategories';
// import useUser from '../hooks/useUser';
// import { useSelectedFriend } from './SelectedFriendContext';

// interface FriendCategoryColorsContextValue {
//   friendCategoryColorsMap: Record<string, string>;
//   friendCategoryColors: string[];
// }

// const FriendCategoryColorsContext = createContext<FriendCategoryColorsContextValue | null>(null);

// export const FriendCategoryColorsProvider = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useUser();
//   const { selectedFriend } = useSelectedFriend();
//   const { userCategories, categoryIds } = useCategories({ userId: user?.id, enabled: !!user?.id });

//   const friendCategoryColorsMap = useMemo(() => {
//     if (!selectedFriend?.lightColor || !selectedFriend?.darkColor || !userCategories?.length) return {};
//     return generateGradientColorsMap(userCategories, selectedFriend.lightColor, selectedFriend.darkColor);
//   }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

//   const friendCategoryColors = useMemo(() => {
//     if (!categoryIds?.length || !selectedFriend?.lightColor || !selectedFriend?.darkColor) return [];
//     return generateGradientColors(categoryIds, selectedFriend.lightColor, selectedFriend.darkColor);
//   }, [categoryIds, selectedFriend?.lightColor, selectedFriend?.darkColor]);

//   const contextValue = useMemo(() => ({
//     friendCategoryColorsMap,
//     friendCategoryColors,
//   }), [friendCategoryColorsMap, friendCategoryColors]);

//   return (
//     <FriendCategoryColorsContext.Provider value={contextValue}>
//       {children}
//     </FriendCategoryColorsContext.Provider>
//   );
// };

// export const useFriendCategoryColors = () => {
//   const ctx = useContext(FriendCategoryColorsContext);
//   if (!ctx) throw new Error('useFriendCategoryColors must be used within FriendCategoryColorsProvider');
//   return ctx;
// };

import React, { createContext, useContext, useMemo, useRef } from 'react';
import { generateGradientColorsMap } from '../hooks/GenerateGradientColorsMapUtil';
import { generateGradientColors } from '../hooks/GradientColorsUril';
import useCategories from '../hooks/useCategories';
import useUser from '../hooks/useUser';
import { useSelectedFriend } from './SelectedFriendContext';
import useSelectedFriendStats from '../hooks/useSelectedFriendStats';
import manualGradientColors from '@/app/styles/StaticColors';

const hexToRgb = (hex: string) => hex.match(/\w\w/g)!.map((c) => parseInt(c, 16));
const rgbToHex = (rgb: number[]) =>
  "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

interface FriendCategoryColorsContextValue {
  friendCategoryColorsMap: Record<string, string>;
  friendCategoryColors: string[];
  friendStatsCategoryColorsMap: Record<number, string>;
}

const FriendCategoryColorsContext = createContext<FriendCategoryColorsContextValue | null>(null);

export const FriendCategoryColorsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { userCategories, categoryIds } = useCategories({ userId: user?.id, enabled: !!user?.id });

  const { sortedList } = useSelectedFriendStats({
    userId: user?.id,
    friendId: selectedFriend?.id,
    friendIsReady: !!selectedFriend?.id,
    enabled: !!selectedFriend?.id,
  });

  const friendCategoryColorsMap = useMemo(() => {
    if (!selectedFriend?.lightColor || !selectedFriend?.darkColor || !userCategories?.length) return {};
    return generateGradientColorsMap(userCategories, selectedFriend.lightColor, selectedFriend.darkColor);
  }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  const friendCategoryColors = useMemo(() => {
    if (!categoryIds?.length || !selectedFriend?.lightColor || !selectedFriend?.darkColor) return [];
    return generateGradientColors(categoryIds, selectedFriend.lightColor, selectedFriend.darkColor);
  }, [categoryIds, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  const friendStatsCategoryColorsMap = useMemo(() => {
    if (!sortedList?.length || !selectedFriend?.darkColor) return {};

    const nonZero = sortedList.filter((item) => item.size > 0);
    const count = nonZero.length;
    if (count === 0) return {};

    const start = hexToRgb(selectedFriend.lightColor);
    const end = hexToRgb(selectedFriend.darkColor);

    return Object.fromEntries(
      nonZero.map((item, i) => {
        const t = i / Math.max(count - 1, 1);
        const interpolated = start.map((s, j) =>
          Math.round(s + (end[j] - s) * t)
        );
        return [item.user_category, rgbToHex(interpolated)];
      })
    );
  }, [sortedList, selectedFriend?.darkColor]);

  const contextValue = useMemo(() => ({
    friendCategoryColorsMap,
    friendCategoryColors,
    friendStatsCategoryColorsMap,
  }), [friendCategoryColorsMap, friendCategoryColors, friendStatsCategoryColorsMap]);

  return (
    <FriendCategoryColorsContext.Provider value={contextValue}>
      {children}
    </FriendCategoryColorsContext.Provider>
  );
};

export const useFriendCategoryColors = () => {
  const ctx = useContext(FriendCategoryColorsContext);
  if (!ctx) throw new Error('useFriendCategoryColors must be used within FriendCategoryColorsProvider');
  return ctx;
};