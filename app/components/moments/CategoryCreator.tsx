// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  SlideInUp,
  SlideOutUp,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryButton from "./CategoryButton";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import SearchModal from "../headers/SearchModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { useNavigation } from "@react-navigation/native";
import { SharedValue } from "react-native-reanimated";
import UserCategorySelectorButton from "../headers/UserCategorySelectorButton";
import { useCategories } from "@/src/context/CategoriesContext";
import CategoryButtonForCreator from "./CategoryButtonForCreator";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  isVisible: boolean;
  categoryNames: string[];
  categoryColorsMap: Record<string, string>;
  onPress: () => void;
  onSave: () => void;
  onClose: () => void;
  updatingExisting: boolean;
  existingId: number;
  selectedId: number;
};
const CategoryCreator = ({
  isVisible,
  onPress,
  updatingExisting,
  existingId,
  categoryColorsMap,
  onClose,
}: Props) => {
  const { capsuleList } = useCapsuleList();
  const { userCategories, createNewCategory, createNewCategoryMutation } =
    useCategories();
  const {
    themeStyles,
    manualGradientColors,
    gradientColorsHome,
    appContainerStyles,
    appSpacingStyles,
  } = useGlobalStyle();

  const {
    categorySizes,
    addCategoryItem,
    moveCategoryCount,
    generateGradientColors,
    generateRandomColors,
  } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  // console.log(categoryColorsMap);

  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [categoriesSortedList, setCategoriesSortedList] = useState([]);
  const [tempCategoriesSortedList, setTempCategoriesSortedList] = useState([]);
  const [tempCategoriesMap, setTempCategoriesMap] = useState({});

  useEffect(() => {
    console.log(`CategoryCreator selectedId`, selectedId);
  }, [selectedId]);
  useFocusEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      }

      let categories = categorySizes();
      //  console.log(categories);
      setCategoriesMap(categories.lookupMap);
      setCategoriesSortedList(categories.sortedList);
      setTempCategoriesSortedList(categories.sortedList);
      setTempCategoriesMap(categories.lookupMap);
    }, [capsuleList])
  );

  const handleOnPress = ({ name: name, id: id }) => {
    onPress({ name: name, id: id });
    setSelectedId(id);
  };

  // useEffect(() => {
  //   if (categoryColorsMap && tempCategoriesSortedList) {
  //     // console.log('tempcategorysortedlist');
  //     const userCategorySet = new Set(
  //       tempCategoriesSortedList.map((item) => item.user_category)
  //     );
  //     // console.log(tempCategoriesSortedList);
  //     // console.log(userCategorySet);

  //     const filteredColors = categoryColors
  //       .filter((item) => userCategorySet.has(item.user_category))
  //       .map((item) => item.color);
  //     setColors(filteredColors);
  //   }
  // }, [categoryColors, tempCategoriesSortedList]);

  useEffect(() => {
    console.log('useeffect we need triggered');
    if (!categoriesSortedList) {
      console.log(`use effect returning without doing anything`);
      return;
    }

    // console.log(`existing: `, existingId);

    if (updatingExisting && existingId) {
      const find = userCategories.findIndex(
        (category) => category.id === existingId
      );
       console.log(find);

      setSelectedId(existingId);

      return;
    }

    let largest = categoriesSortedList[0]?.user_category;
    let largestName = categoriesSortedList[0]?.name;

    console.log(`largest: `, typeof largest);
     console.log(`largestName: `, typeof largestName);

    if (largest && largestName) {
      console.log('setting largest');

       onPress({ name: largestName, id: largest });
      setSelectedId(largest);
    }
  }, [categoriesSortedList]);
  const renderedButtons = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {/* {memoizedSearchIcon} */}
        {userCategories.map(({ name, id }) => {
          const categoryColor = categoryColorsMap[id];

          return (
            <View
              key={id ?? name ?? "Uncategorized"}
              style={styles.buttonWrapper}
            >
              <CategoryButtonForCreator
                height={"auto"}
                selectedId={selectedId}
                //  viewableItemsArray={viewableItemsArray}
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
    [userCategories, categoryColorsMap, onPress, selectedId]
  );

  return (
    <>
      {categoryColorsMap && isVisible && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp}
          style={[
            styles.categoryNavigatorContainer,
            styles.momentsScreenPrimarySpacing,
            {
              backgroundColor:
                // themeStyles.overlayBackgroundColor.backgroundColor,
                themeStyles.primaryBackground.backgroundColor,
            },
          ]}
        >
          {userCategories && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.scrollContainer]}
            >
              {renderedButtons}
            </ScrollView>
          )}
          <Pressable
            onPress={onClose}
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              height: 30,
              paddingTop: 5,
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
        </Animated.View>
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
    top: -24, //20
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

export default React.memo(CategoryCreator);
