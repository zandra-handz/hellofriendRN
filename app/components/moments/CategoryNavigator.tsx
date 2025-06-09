import {
  View,
  Text, 
  ScrollView,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import React from "react";
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import CategoryButton from "./CategoryButton"; 
const CategoryNavigator = ({
  visibilityValue,
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

 
  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: visibilityValue.value,

  }))
  

  return (
    <Animated.View
      style={[
        appContainerStyles.categoryNavigatorContainer,
        appSpacingStyles.momentsScreenPrimarySpacing,

        { backgroundColor: gradientColorsHome.darkColor },
        visibilityStyle,
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
          <View style={{marginHorizontal: 6, marginBottom: 6}}>

          <CategoryButton
         height={'auto'}
          viewableItemsArray={viewableItemsArray} 
            key={categoryName || "Uncategorized"}
            label={categoryName}
            onPress={() => onPress(categoryName)} 
          />
          </View>
        ))}
      </View>
      
        
      </ScrollView> 
    </Animated.View>
  );
};

export default CategoryNavigator;