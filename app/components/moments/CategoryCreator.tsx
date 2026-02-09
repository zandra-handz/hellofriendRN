// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, Pressable } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors";
import { generateGradientColorsMap } from "@/src/hooks/GenerateGradientColorsMapUtil";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import AddNewCategory from "../headers/AddNewCategory";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
import SvgIcon from "@/app/styles/SvgIcons";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import CategoryButtonForCreator from "./CategoryButtonForCreator";
import { useCategoryColors } from "@/src/context/CategoryColorsContext";
import FiveValueSlider from "../friends/FiveValueSlider";
type Props = {
  userId: number;
  freezeCategory: boolean;
  isVisible: boolean;
  categoryNames: string[];
  categoryColorsMap: Record<string, string>;
  onPress: () => void;
  addToOnPress: () => void;
  onSave: () => void;
  onClose: () => void;
  updatingExisting: boolean;
  existingId: number;
  selectedId: number;
};
const CategoryCreator = ({
  userId,
  primaryColor,
  primaryBackground,
  freezeCategory,
  friendDefaultCategory,
  friendLightColor,
  friendDarkColor,
  capsuleList,

  onPress,
  addToOnPress,
  updatingExisting,
  existingId,

  onClose,
    yTranslateValue,
    scoresObject,
    handleScoreChange,
}: Props) => {
  const { categoryColors, handleSetCategoryColors } = useCategoryColors();


    
  const categoryColorsMap = useMemo(() => {
    if (!categoryColors || !Array.isArray(categoryColors)) {
      // fallback to empty object if data is not ready
      return {};
    }
  
    return Object.fromEntries(
      categoryColors.map(({ user_category, color }) => [user_category, color])
    );
  }, [categoryColors]);
  

  const animatedYTranslateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: yTranslateValue.value }],
    };
  });

  const { userCategories } = useCategories({userId: userId});

  const { categorySizes } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  // const categoryColorsMap = useMemo(() => {
  //   if (userCategories?.length && friendLightColor && friendDarkColor) {
  //     return generateGradientColorsMap(
  //       userCategories,
  //       friendLightColor,
  //       friendDarkColor
  //     );
  //   }
  //   return null;
  // }, [userCategories, friendLightColor, friendDarkColor]);

  const [selectedId, setSelectedId] = useState(null);
  const [categoriesSortedList, setCategoriesSortedList] = useState<object[]>(
    []
  );
  const [pressedOnce, setPressedOnce] = useState(false);

// type MomentScores = {
//   easy_score: number;
//   hard_score: number;
//   quick_score: number;
//   long_score: number;
//   relevant_score: number;
//   random_score: number;
//   unique_score: number;
//   generic_score: number;
// };

// const DEFAULT_SCORES: MomentScores = {
//   easy_score: 2,
//   hard_score: 2,
//   quick_score: 2,
//   long_score: 2,
//   relevant_score: 2,
//   random_score: 2,
//   unique_score: 2,
//   generic_score: 2,
// };

// // In your component:
// const [scoresObject, setScoresObject] = useState<MomentScores>(DEFAULT_SCORES);

// // Update individual score:
// const handleScoreChange = (field: keyof MomentScores, value: number) => {
//   setScoresObject(prev => ({
//     ...prev,
//     [field]: value
//   }));
// };

// Usage example:
// handleScoreChange('easy_score', 4);

  const HORIZONTAL_PADDING = 10;

  useFocusEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      }

      let categories = categorySizes();

      if (
        !categories ||
        !categories?.sortedList ||
        categories?.sortedList?.length === 0
      ) {
        return;
      }
      setCategoriesSortedList(categories.sortedList);
    }, [capsuleList])
  );

  const handleOnPress = ({ name: name, id: id }) => {
    if (!name || !id) {
      return;
    }

    onPress({ name: name, id: id });
    if (!freezeCategory) {
      addToOnPress();
    }
    setSelectedId(id);
    onClose(); // TESTING, REMOVE IF REALLY WANT DOUBLE PRESS FEATURE

    if (!pressedOnce) {
      setPressedOnce(true);
    } else {
      setPressedOnce(false);
      onClose();
    }
  };

  const handleSelectCreated = ({
    categoryId,
    categoryName,
  }: {
    categoryId: number;
    categoryName: string;
  }) => {
    console.error("setting category:", categoryId, categoryName);
    setSelectedId(categoryId);
    setPressedOnce(true);
    onClose();
  };

  useEffect(() => {
    if (freezeCategory) {
      return;
    }

    if (
      updatingExisting &&
      existingId &&
      userCategories &&
      userCategories.length > 0
    ) {
      const find = userCategories.findIndex(
        (category) => category.id === existingId
      );
    

      setSelectedId(existingId);

      return;
    }

    if (friendDefaultCategory && userCategories && userCategories.length > 0) {
      const friendDefault = friendDefaultCategory;
      const name = userCategories.find(
        (category) => category.id === friendDefault
      );

      if (name) { 

        onPress({ name: name.name, id: name.id });
        setSelectedId(name.id);
        return;
      }
    }

    if (!categoriesSortedList || !(categoriesSortedList.length > 0)) {
      return;
    }



    let largest = categoriesSortedList[0]?.user_category;
    let largestName = categoriesSortedList[0]?.name;

    // console.log(`largest: `, typeof largest);
    // console.log(`largestName: `, typeof largestName);

    if (largest && largestName) {
      onPress({ name: largestName, id: largest });
      setSelectedId(largest);
    }
  }, [
    categoriesSortedList,
    friendDefaultCategory,
    userCategories,
    updatingExisting,
    existingId,
  ]);

  const renderedButtons = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {Array.isArray(userCategories) &&
          userCategories.map(({ name, id }) => {
            const categoryColor = categoryColorsMap[id];

            return (
              <View
                key={id ?? name ?? "Uncategorized"}
                style={[styles.buttonWrapper, { marginRight: 10 }]}
              >
                <CategoryButtonForCreator
                  primaryColor={primaryColor}
                  height={"auto"}
                  selectedId={selectedId}
                  label={name}
                  itemId={id}
                  highlightColor={categoryColor}
                  onPress={() => handleOnPress({ name: name, id: id })}
                />
              </View>
            );
          })}
      </View>
    ),
    [
      userCategories,
      friendDefaultCategory,
      categoryColorsMap,
      onPress,
      selectedId,
      freezeCategory,
    ]
  );

  return (
    <>
      <Animated.View
        style={[
          animatedYTranslateStyle,
          styles.categoryNavigatorContainer,
          {
            paddingHorizontal: HORIZONTAL_PADDING,
            backgroundColor: primaryBackground,

            paddingTop: 450, //IMPORTANT, this is for status bar clearing since this component appears outside of safe view
          },
        ]}
      >
        <AddNewCategory
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          userCategories={userCategories}
          manualGradientColors={manualGradientColors}
          addToOnPress={handleSelectCreated}
        />
        {userCategories && categoryColorsMap && (
          <View
            showsVerticalScrollIndicator={false}
            style={[styles.scrollContainer]}
          >
            {renderedButtons}
          </View>
        )}
        <View style={styles.capsuleScoresPanel}>

        <View style={styles.capsuleScoresPanel}>
  <FiveValueSlider 
    label="Easy"
    value={scoresObject.easy_score}
    onValueChange={(value) => handleScoreChange('easy_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Hard"
    value={scoresObject.hard_score}
    onValueChange={(value) => handleScoreChange('hard_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Quick"
    value={scoresObject.quick_score}
    onValueChange={(value) => handleScoreChange('quick_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Long"
    value={scoresObject.long_score}
    onValueChange={(value) => handleScoreChange('long_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Relevant"
    value={scoresObject.relevant_score}
    onValueChange={(value) => handleScoreChange('relevant_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Random"
    value={scoresObject.random_score}
    onValueChange={(value) => handleScoreChange('random_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Unique"
    value={scoresObject.unique_score}
    onValueChange={(value) => handleScoreChange('unique_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
  
  <FiveValueSlider 
    label="Generic"
    value={scoresObject.generic_score}
    onValueChange={(value) => handleScoreChange('generic_score', value)}
    labelColor={primaryColor}
    barColor={friendLightColor}
    pointColor={friendDarkColor}
    trackColor={'transparent'}
  />
</View>

        </View>
        <Pressable onPress={onClose} style={styles.bottomButtonContainer}>
          <SvgIcon
            name={"chevron_down"}
            color={primaryColor}
            color={manualGradientColors.homeDarkColor}
            size={16}
            style={{
              backgroundColor: manualGradientColors.lightColor,
              borderRadius: 999,
            }}
          />
        </Pressable>
      </Animated.View>
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

  categoryNavigatorContainer: {
    position: "absolute",
   // top: -70, //20
    top: -460,

    paddingTop: 0,
    zIndex: 5000,
    height: "auto",

    // width: "74%",
    width: "100%",
    selfAlign: "center",
  },
  capsuleScoresPanel: {
   // backgroundColor: 'red',
    height: 390,
    marginTop: 10,

  },
  scrollContainer: {
    maxHeight: 400,
    height: "auto",
    flexGrow: 1,
    marginTop: 0,
    borderRadius: 10,
    padding: 0,
    paddingTop: 10,
  },
  buttonRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: 'red',
  },
  buttonWrapper: {
    flexDirection: "row",
    // backgroundColor: "teal",
    marginBottom: 10,
  },
  bottomButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    paddingBottom: 10, 
  },
});

export default React.memo(CategoryCreator);
