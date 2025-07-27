// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  SlideInUp,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryButton from "./CategoryButton";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import SearchModal from "../headers/SearchModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
 
import { useNavigation } from "@react-navigation/native";
import { SharedValue } from "react-native-reanimated";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  visibilityValue: SharedValue;
  viewableItemsArray: SharedValue[];
  categoryNames: string[];
  categoryColorsMap: Record<string, string>;
  onPress: () => void;
  onSearchPress: () => void;
  onClose: () => void;
};
const CategoryNavigator = ({
  visibilityValue,
  viewableItemsArray,
  categoryNames,
  onPress,
  onSearchPress,
  categoryColorsMap,
  onClose,
}: Props) => {
  const {
    themeStyles,
    manualGradientColors,
    gradientColorsHome,
    appContainerStyles,
    appSpacingStyles,
  } = useGlobalStyle();
  const isVisible = true;

 
  // console.log(categoryColorsMap);

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
       //   backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          justifyContent: "center",
          borderRadius: 999,
          // paddingHorizontal: 20,
          paddingVertical: 5,

          textAlign: "center",
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <MaterialCommunityIcons
          name={"text-search"}
          size={iconSize}
          color={themeStyles.genericText.color}
          style={{}}
        />
        {/* <Text style={[themeStyles.genericText, styles.categoryLabel]}>
          Search
        </Text> */}
      </Pressable>
    ),
    [iconSize, themeStyles]
  );
  const renderedButtons = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {memoizedSearchIcon}
        {categoryNames.map(({ category, categoryId }) => {
          const categoryColor = categoryColorsMap[categoryId];

          return (
            <View
              key={categoryId ?? category ?? "Uncategorized"}
              style={styles.buttonWrapper}
            >
              <CategoryButton
                height={"auto"}
                viewableItemsArray={viewableItemsArray}
                label={category}
                highlightColor={categoryColor}
                onPress={() => onPress(category)}
              />
            </View>
          );
        })}
      </View>
    ),
    [categoryNames, categoryColorsMap, onPress, viewableItemsArray]
  );

  // const renderedButtons = useMemo(
  //   () => (
  //     <View style={styles.buttonRow}>
  //       {memoizedSearchIcon}
  //       {categoryNames.map((categoryName) => (
  //         <View
  //           key={categoryName || "Uncategorized"}
  //           style={styles.buttonWrapper}
  //         >
  //           <CategoryButton
  //             height={"auto"}
  //             viewableItemsArray={viewableItemsArray}
  //             label={categoryName}
  //             onPress={() => onPress(categoryName)}
  //           />
  //         </View>
  //       ))}
  //     </View>
  //   ),
  //   [categoryNames, onPress, viewableItemsArray]
  // );

  return (
    <>
      {categoryColorsMap && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[
            styles.categoryNavigatorContainer,
            styles.momentsScreenPrimarySpacing,
            {
              backgroundColor:
                // themeStyles.overlayBackgroundColor.backgroundColor,
                themeStyles.primaryBackground.backgroundColor,
            },
            visibilityStyle,
          ]}
        >
          <Pressable
            onPress={onClose}
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // position: "absolute",
              // top: -20,
              height: 30,
              paddingTop: 5,
              // backgroundColor: "red",
              // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          
            }}
          >
            <MaterialIcons
              name={"keyboard-arrow-down"}
              color={themeStyles.primaryText.color}
              color={manualGradientColors.homeDarkColor}
              size={16}
                            style={{
                backgroundColor: manualGradientColors.lightColor,
                borderRadius: 999,
              }}
            />
          </Pressable>


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
   // borderRadius: 10,
    
    padding: 0,
  },
  categoryNavigatorContainer: {
    position: "absolute",
    bottom: -24, //20
    paddingTop: 0,
    zIndex: 5,
    height: "auto",
    height: 200,
    // width: "74%",
    width: "100%",
    selfAlign: "center",
  
  },
  scrollContainer: {
    maxHeight: 130,
    marginTop: 0,
    borderRadius: 10,
    padding: 10,
    paddingTop: 10,
 
  },
  buttonRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonWrapper: {
    flexDirection: "row",

    marginHorizontal: 0,
    marginBottom: 10,
  },
});

export default React.memo(CategoryNavigator);
