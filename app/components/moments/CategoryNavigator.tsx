// import {
//   View,
//   Text,
//   ScrollView,
// } from "react-native";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
// import React from "react";
// import Animated, { useAnimatedStyle } from 'react-native-reanimated';
// import CategoryButton from "./CategoryButton";
// const CategoryNavigator = ({
//   visibilityValue,
//   viewableItemsArray,
//   categoryNames,
//   onPress,
// }) => {
//   const {
//     themeStyles,
//     gradientColorsHome,
//     appContainerStyles,
//     appSpacingStyles,
//   } = useGlobalStyle();

//   const visibilityStyle = useAnimatedStyle(() => ({
//     opacity: visibilityValue.value,

//   }))

//   return (
//     <Animated.View
//       style={[
//         appContainerStyles.categoryNavigatorContainer,
//         appSpacingStyles.momentsScreenPrimarySpacing,

//         { backgroundColor: gradientColorsHome.darkColor },
//         visibilityStyle,
//       ]}
//     >
//       <Text
//         style={[
//           themeStyles.genericText,
//           { paddingVertical: 4, paddingHorizontal: 4 },
//         ]}
//       >
//         CATEGORIES
//       </Text>
//       <ScrollView style={{maxHeight: 100}}>
//       <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
//         {categoryNames.map((categoryName) => (
//           <View style={{marginHorizontal: 6, marginBottom: 6}}>

//           <CategoryButton
//          height={'auto'}
//           viewableItemsArray={viewableItemsArray}
//             key={categoryName || "Uncategorized"}
//             label={categoryName}
//             onPress={() => onPress(categoryName)}
//           />
//           </View>
//         ))}
//       </View>

//       </ScrollView>
//     </Animated.View>
//   );
// };

// export default CategoryNavigator;

// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryButton from "./CategoryButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AboutAppModal from "../headers/AboutAppModal";
import SearchModal from "../headers/SearchModal";

const CategoryNavigator = ({
  visibilityValue,
  viewableItemsArray,
  categoryNames,
  onPress,
  onSearchPress,
}) => {
  const {
    themeStyles,
    gradientColorsHome,
    appContainerStyles,
    appSpacingStyles,
  } = useGlobalStyle();

  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: visibilityValue.value,
  }));

  const iconSize = 26;

  const memoizedSearchIcon = useMemo(
    () => (
      <Pressable
        onPress={() => setSearchModalVisible(true)}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <MaterialCommunityIcons
          name={"comment-search-outline"}
          size={iconSize}
          color={themeStyles.genericText.color}
          style={{}}
        />
        <Text
          style={[
            themeStyles.genericText,
            styles.categoryLabel,
            { marginLeft: 6 },
          ]}
        >
          SEARCH
        </Text>
      </Pressable>
    ),
    [iconSize, themeStyles]
  );

  const renderedButtons = useMemo(
    () =>
      categoryNames.map((categoryName) => (
        <View
          key={categoryName || "Uncategorized"}
          style={styles.buttonWrapper}
        >
          <CategoryButton
            height="auto"
            viewableItemsArray={viewableItemsArray}
            label={categoryName}
            onPress={() => onPress(categoryName)}
          />
        </View>
      )),
    [categoryNames, onPress, viewableItemsArray]
  );

  return (
    <>
      <Animated.View
        style={[
          appContainerStyles.categoryNavigatorContainer,
          appSpacingStyles.momentsScreenPrimarySpacing,
          { backgroundColor: gradientColorsHome.darkColor },
          visibilityStyle,
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Text
            style={[
              themeStyles.genericText,
              styles.categoryLabel,
              { marginRight: 20 },
            ]}
          >
            CATEGORIES
          </Text>
        
            {memoizedSearchIcon}
         
        
        </View>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.buttonRow}>{renderedButtons}</View>
        </ScrollView>
      </Animated.View>

      {searchModalVisible && (
        <View>
          <SearchModal
            isVisible={searchModalVisible}
            closeModal={() => setSearchModalVisible(false)}
            onSearchPress={onSearchPress}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  categoryLabel: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  scrollContainer: {
    maxHeight: 100,
  },
  buttonRow: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  buttonWrapper: {
    marginHorizontal: 6,
    marginBottom: 6,
  },
});

export default React.memo(CategoryNavigator);
