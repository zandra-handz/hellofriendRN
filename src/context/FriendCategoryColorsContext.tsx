// FriendCategoryColorsContext.tsx
import React, { createContext, useContext, useMemo, useRef } from 'react';
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

export const FriendCategoryColorsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();

  const { userCategories, categoryIds } = useCategories({ userId: user?.id, enabled: !!user?.id });

  const prevColorsMapRef = useRef<Record<string, string>>({});
  const prevColorsRef = useRef<string[]>([]);

  const friendCategoryColorsMap = useMemo(() => {
    if (!selectedFriend?.lightColor || !selectedFriend?.darkColor || !userCategories?.length) {
      return prevColorsMapRef.current;
    }
    const newMap = generateGradientColorsMap(userCategories, selectedFriend.lightColor, selectedFriend.darkColor);
    prevColorsMapRef.current = newMap;
    return newMap;
  }, [userCategories, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  const friendCategoryColors = useMemo(() => {
    if (!userCategories?.length || !selectedFriend?.lightColor || !selectedFriend?.darkColor) {
      return prevColorsRef.current;
    }
    const newColors = generateGradientColors(categoryIds, selectedFriend.lightColor, selectedFriend.darkColor);
    prevColorsRef.current = newColors;
    return newColors;
  }, [categoryIds, selectedFriend?.lightColor, selectedFriend?.darkColor]);

  // Memoize the context value to prevent children from rerendering
  const contextValue = useMemo(() => ({
    friendCategoryColorsMap,
    friendCategoryColors,
  }), [friendCategoryColorsMap, friendCategoryColors]);

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