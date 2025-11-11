// import React, { createContext, useContext, useMemo, ReactNode, useRef } from "react";
// import { useUser } from "./UserContext"; 
// import { useQuery } from "@tanstack/react-query";
// import { getUserCategories } from "../calls/api";
// import isEqual from "lodash.isequal";

// // Define the type for a single category
// export interface CategoryType {
//   id: number;
//   name: string;
//   // add other fields here if needed
// }

// // Context type
// interface CategoriesContextType {
//   userCategories: CategoryType[];
//   isLoading: boolean;
//   isSuccess: boolean;
// }

// // Create context
// const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// // Hook to use the context
// export const useCategories = (): CategoriesContextType => {
//   const context = useContext(CategoriesContext);
//   if (!context) {
//     throw new Error(
//       "useCategories must be used within a CategoriesProvider"
//     );
//   }
//   return context;
// };

// // Provider props
// interface CategoriesProviderProps {
//   children: ReactNode;
// }

// export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
//   const { user, isInitializing } = useUser(); 

//   const prevCategoriesRef = useRef<CategoryType[]>([]);

//   const { data, isLoading, isSuccess } = useQuery({
//     queryKey: ["categories", user?.id],
//     queryFn: () => getUserCategories(user?.id),
//     enabled: !!(user?.id && !isInitializing),
//     staleTime: 1000 * 60 * 60 * 10, // 10 hours
//   });

//   // Ensure stable reference: only update if actual content changed
//   const userCategories = useMemo(() => {
//     if (!data) return [];
//     if (isEqual(prevCategoriesRef.current, data)) return prevCategoriesRef.current;
//     prevCategoriesRef.current = data;
//     return data;
//   }, [data]);

//   const contextValue = useMemo(
//     () => ({
//       userCategories,
//       isLoading,
//       isSuccess,
//     }),
//     [userCategories, isLoading, isSuccess]
//   );

//   return (
//     <CategoriesContext.Provider value={contextValue}>
//       {children}
//     </CategoriesContext.Provider>
//   );
// };
