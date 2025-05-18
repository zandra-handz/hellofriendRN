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
import { useAnimatedStyle, useSharedValue, useAnimatedReaction, withRepeat, withTiming } from 'react-native-reanimated';

const CategoryNavigator = ({
  viewableItemsArray,
  categoryNames,
  onPress, 
}) => { 
  const {
    themeStyles, 
    gradientColorsHome,
    appContainerStyles,
    appSpacingStyles,
  } = useGlobalStyle();

 
  

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
        CATEGORIES
      </Text>
      <ScrollView style={{maxHeight: 100}}>
      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
        {categoryNames.map((categoryName) => (
          <CategoryButton
          viewableItemsArray={viewableItemsArray} 
            key={categoryName || "Uncategorized"}
            label={categoryName}
            onPress={() => onPress(categoryName)} 
          />
        ))}
      </View>
      
        
      </ScrollView> 
    </View>
  );
};

export default CategoryNavigator;
