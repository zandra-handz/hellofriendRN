// FriendCategoryColorsContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { generateGradientColorsMap } from '../hooks/GenerateGradientColorsMapUtil';
import { generateGradientColors } from '../hooks/GradientColorsUril';
import useCategories from '../hooks/useCategories';
import useUser from '../hooks/useUser';
import { useSelectedFriend } from './SelectedFriendContext';


interface FriendCategoryColorsContextValue {
  friendCategoryColorsMap: Record<string, string>;
  friendCategoryColors: string[];
}

const FriendCategoryColorsContext = createContext<FriendCategoryColorsContextValue | null>(null);

export const FriendCategoryColorsProvider = ({ children}: { children: React.ReactNode; userId: number }) => {
  const { user } = useUser();
    const { selectedFriend } = useSelectedFriend();
  
  const { userCategories, categoryIds } = useCategories({ userId: user?.id, enabled: !!user?.id});

  const friendCategoryColorsMap = useMemo(() => {
    if (!selectedFriend?.lightColor || !selectedFriend?.darkColor || !userCategories?.length)
      return {};
    return generateGradientColorsMap(userCategories, selectedFriend.lightColor, selectedFriend.darkColor);
  }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  const friendCategoryColors = useMemo(() => {
    if (!userCategories?.length || !selectedFriend?.lightColor || !selectedFriend?.darkColor)
      return [];
    return generateGradientColors(categoryIds, selectedFriend.lightColor, selectedFriend.darkColor);
  }, [categoryIds, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  return (
    <FriendCategoryColorsContext.Provider value={{ friendCategoryColorsMap, friendCategoryColors }}>
      {children}
    </FriendCategoryColorsContext.Provider>
  );
};

export const useFriendCategoryColors = () => {
  const ctx = useContext(FriendCategoryColorsContext);
  if (!ctx) throw new Error('useFriendCategoryColors must be used within FriendCategoryColorsProvider');
  return ctx;
};