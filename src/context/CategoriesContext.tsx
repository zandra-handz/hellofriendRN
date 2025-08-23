// NOT CURRENTLY IN USE BUT AVAILABLE IF NEED TO SEPARATE CATEGORIES FRM SETTNIGS! (comment out on backend too)

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useUser } from "./UserContext";
import { useQuery  } from "@tanstack/react-query";
import {   getUserCategories } from "../calls/api";

interface Categories {
  //   id: number | null;
  //   user: number | null;
  //   expo_push_token: string | null;
  //   high_contrast_mode: boolean;
  //   interests: string | null;
  //   language_preference: string | null;
  //   large_text: boolean;
  //   manual_dark_mode: boolean;
  //   receive_notifications: boolean;
  //   screen_reader: boolean;
}

interface CategoriesContextType {}

const CategoriesContext = createContext<Categories | undefined>(undefined);

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      "useCategories must be used within a UserCategoriesProvider"
    );
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children,
}) => {
  const { user, isInitializing } = useUser();
 
  const {
    data: userCategories,

    isSuccess,
  } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: () => getUserCategories(user?.id),
    enabled: !!(user?.id && !isInitializing), // testing removing this  && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });

  const contextValue = useMemo(
    () => ({ 
      userCategories,
    }),
    [userCategories]
  );

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
};
