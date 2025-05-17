import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import React, { useEffect, useLayoutEffect, useState } from "react";
import CategoryButton from "./CategoryButton";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

const CategoryNavigator = ({
  categoryNames,
  onPress,
  scrollY,
  itemHeight,
  currentVisibleIndex,
}) => {
  const { categoryStartIndices } = useCapsuleList();
  const {
    themeStyles,
    gradientColors,
    gradientColorsHome,
    appContainerStyles,
    appSpacingStyles,
  } = useGlobalStyle();

  const [activeCategory, setActiveCategory] = useState(null);

  const sortedCategories = Object.entries(categoryStartIndices).sort(
    (a, b) => a[1] - b[1]
  );

  const getCategoryFromIndex = (index) => {
    for (let i = 0; i < sortedCategories.length; i++) {
      const [category, startIndex] = sortedCategories[i];
      const nextStartIndex = sortedCategories[i + 1]?.[1];

      if (
        index >= startIndex &&
        (nextStartIndex === undefined || index < nextStartIndex)
      ) {
        return category;
      }
    }

    // Fallback to first category if no match
    return sortedCategories[0]?.[0] || null;
  };

  useLayoutEffect(() => {
    const startingCategory = getCategoryFromIndex(0);
    setActiveCategory(startingCategory);
  }, [categoryStartIndices]);

  // useEffect(() => {
  //   if (!scrollY || typeof scrollY.addListener !== "function") return;

  //   const listenerId = scrollY.addListener(({ value }) => {
  //     const clampedValue = Math.max(0, value);
  //     const currentIndex = Math.floor(clampedValue / itemHeight);
  //    // console.log(currentIndex, clampedValue);

  //     const category = getCategoryFromIndex(currentIndex);

  //     if (category && category !== activeCategory) {
  //       setActiveCategory(category);
  //     }
  //   });

  //   return () => {
  //     scrollY.removeListener(listenerId);
  //   };
  // }, [scrollY, itemHeight, categoryStartIndices, activeCategory]);

  useEffect(() => {
    if (!currentVisibleIndex) return;

    console.log(`current visible index`, currentVisibleIndex);

    const category = getCategoryFromIndex(currentVisibleIndex);

    if (category && category !== activeCategory) {
      setActiveCategory(category);
    }
  }, [currentVisibleIndex]);

  return (
    <View
      style={[
        appContainerStyles.categoryNavigatorContainer,
        appSpacingStyles.momentsScreenPrimarySpacing,

        { backgroundColor: gradientColorsHome.darkColor },
      ]}
    >
      <Text
        style={[
          themeStyles.genericText,
          { paddingVertical: 4, paddingHorizontal: 4 },
        ]}
      >
        CATEGORY: {activeCategory}
      </Text>
      <ScrollView style={{maxHeight: 100}}>
      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
        {categoryNames.map((categoryName) => (
          <CategoryButton
            key={categoryName || "Uncategorized"}
            label={categoryName}
            onPress={() => onPress(categoryName)}
            isHighlighted={activeCategory === categoryName}
          />
        ))}
      </View>
      
        
      </ScrollView>
      {/* <FlatList
        data={categoryNames}
        horizontal={false}
        snapToInterval={44}
        ListFooterComponent={() => <View style={{ height: 0 }} />}
        keyExtractor={(categoryName) =>
          categoryName ? categoryName.toString() : "Uncategorized"
        }
        renderItem={({ item: categoryName }) => (
          <CategoryButton
            label={categoryName}
            onPress={onPress}
            isHighlighted={activeCategory === categoryName}
          />
        )}
      /> */}
    </View>
  );
};

export default CategoryNavigator;
