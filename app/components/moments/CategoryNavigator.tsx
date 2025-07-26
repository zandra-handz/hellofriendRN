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
import SearchModal from "../headers/SearchModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import GeckoButton from "../home/GeckoButton";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
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
const isVisible = true;

    const navigation = useNavigation<NavigationProp>();
  const navigateToFinalize = () => {
 
    navigation.navigate("Finalize");
  };

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
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          justifyContent: "center",
          borderRadius: 999,
          // paddingHorizontal: 20,
          paddingVertical: 5,

          textAlign: "center",
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <MaterialCommunityIcons
          name={"comment-search-outline"}
          size={iconSize}
          color={themeStyles.genericText.color}
          style={{}}
        />
        <Text style={[themeStyles.genericText, styles.categoryLabel]}>
          Search
        </Text>
      </Pressable>
    ),
    [iconSize, themeStyles]
  );

  const renderedButtons = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {memoizedSearchIcon}
        {categoryNames.map((categoryName) => (
          <View
            key={categoryName || "Uncategorized"}
            style={styles.buttonWrapper}
          >
            <CategoryButton
              height={"auto"}
              viewableItemsArray={viewableItemsArray}
              label={categoryName}
              onPress={() => onPress(categoryName)}
            />
          </View>
        ))}
      </View>
    ),
    [categoryNames, onPress, viewableItemsArray]
  );

  return (
    <>
    {isVisible && (
      
      <Animated.View
        style={[
          styles.categoryNavigatorContainer,
          styles.momentsScreenPrimarySpacing,
          {
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
          visibilityStyle,
        ]}
      >
        <View style={{height: 50, width: 50, position: 'absolute', zIndex: 50000, right: 10, top: 10, margin: 10}}>
          
        <GeckoButton onPress={navigateToFinalize}/>
        
        </View>
     
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[styles.scrollContainer]}
        >
          {renderedButtons}
        </ScrollView>
      </Animated.View>
            )}

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
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  //brought down from global context
  momentsScreenPrimarySpacing: {
    borderRadius: 20,
    padding: 0,
  },
  categoryNavigatorContainer: {
    position: "absolute",
    bottom: -24, //20
    paddingTop: 10,
    zIndex: 5,
    height: "auto",
    height: 140,
    // width: "74%",
    width: "100%",
    selfAlign: "center",
    paddingRight: 36, //space for the speeddial
  },
  scrollContainer: {
    maxHeight: 100,
    marginTop: 0,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 0,
  },
  buttonRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonWrapper: {
    flexDirection: "row",

    marginHorizontal: 6,
    marginBottom: 10,
  },
});

export default React.memo(CategoryNavigator);
