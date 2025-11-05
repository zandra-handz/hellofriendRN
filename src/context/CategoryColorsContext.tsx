import React, { createContext, useContext, useMemo, useState } from "react";

import useCategories from "../hooks/useCategories";
import { isEqual } from "date-fns";




// // array → map
// used for talking points // when need full list of colors
// const categoryColorsMap = Object.fromEntries(
//   categoryColors.map(({ user_category, color }) => [user_category, color])
// );


// const categoryColorsMap = useMemo(() => {
//   return Object.fromEntries(
//     categoryColors.map(({ user_category, color }) => [user_category, color])
//   );
// }, [categoryColors]);


// // map → array
// used for one-offs /individual selections
// const categoryColors = Object.entries(categoryColorsMap).map(
//   ([user_category, color]) => ({ user_category: Number(user_category), color })
// );

// const categoryColors = useMemo(() => {
//   return Object.entries(categoryColorsMap).map(
//     ([user_category, color]) => ({ user_category: Number(user_category), color })
//   );
// }, [categoryColorsMap]);

interface CategoryColorsType {}

const CategoryColorsContext = createContext<CategoryColorsType | undefined>(
  undefined
);

export const useCategoryColors = () => {
  const context = useContext(CategoryColorsContext);

  if (!context) {
    throw new Error(
      "useCategoryColors must be used within a CategoryColorsProvider"
    );
  }
  return context;
};

interface CategoryColorsProviderProps {
  children: React.ReactNode;
}

export const CategoryColorsProvider: React.FC<CategoryColorsProviderProps> = ({
  children,
}) => {
  const [categoryColors, setCategoryColors] = useState([]);

const handleSetCategoryColors = (colors) => {
  setCategoryColors((prevColors) => {
    const isSame = isEqual(prevColors, colors);

    // console.log(
    //   "%chandleSetCategoryColors called",
    //   "color: orange; font-weight: bold;",
    //   { prevColors, newColors: colors, isSame }
    // );

    return isSame ? prevColors : colors;
  });
};

const contextValue = useMemo(() => {
//   console.log(
//     "%cCategoryColorsContext value recalculated",
//     "color: blue; font-weight: bold;",
//     { categoryColors }
//   );

  return { categoryColors, handleSetCategoryColors };
}, [categoryColors, handleSetCategoryColors]);

  return (
    <CategoryColorsContext.Provider value={contextValue}>
      {children}
    </CategoryColorsContext.Provider>
  );
};
