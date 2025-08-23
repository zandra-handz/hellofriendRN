// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  SlideInUp,
  SlideOutUp,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialIcons } from "@expo/vector-icons"; 
import AddNewCategory from "../headers/AddNewCategory";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { useCategories } from "@/src/context/CategoriesContext";
import CategoryButtonForCreator from "./CategoryButtonForCreator"; 
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
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
  freezeCategory,
  friendDefaultCategory,
 
  isVisible,
  onPress,
  addToOnPress,
  updatingExisting,
  existingId,
  categoryColorsMap,
  onClose,
}: Props) => {
  const { capsuleList } = useCapsuleList();
  const { userCategories } = useCategories();
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  

  const {
    categorySizes,
    // addCategoryItem,
    // moveCategoryCount,
    // generateGradientColors,
    // generateRandomColors,
  } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  const [selectedId, setSelectedId] = useState(null);
  const [categoriesSortedList, setCategoriesSortedList] = useState<object[]>(
    []
  );
  const [pressedOnce, setPressedOnce] = useState(false);

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
      console.log(find);

      setSelectedId(existingId);

      return;
    }

    if (friendDefaultCategory && userCategories && (userCategories.length > 0)) {
      console.log(
        `friend default:`,
        friendDefaultCategory
      );
      const friendDefault = friendDefaultCategory;
      const name = userCategories.find(
        (category) => category.id === friendDefault
      );
      // console.log(name);

      if (name) {
        console.warn("SETTTINGGGGGGGGGG");

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
      {categoryColorsMap && isVisible && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp}
          style={[
            styles.categoryNavigatorContainer,
            {
              paddingHorizontal: HORIZONTAL_PADDING,
              backgroundColor:
                // themeStyles.overlayBackgroundColor.backgroundColor,
                themeStyles.primaryBackground.backgroundColor,
            },
          ]}
        >
          <AddNewCategory addToOnPress={handleSelectCreated} />
          {userCategories && (
            <View
              showsVerticalScrollIndicator={false}
              style={[styles.scrollContainer]}
            >
              {renderedButtons}
            </View>
          )}
          <Pressable
            onPress={onClose}
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              height: 30,
              paddingBottom: 10,
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

  categoryNavigatorContainer: {
    position: "absolute",
    top: -70, //20

    paddingTop: 0,
    zIndex: 5000,
    height: "auto",

    // width: "74%",
    width: "100%",
    selfAlign: "center",
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
});

export default React.memo(CategoryCreator);
