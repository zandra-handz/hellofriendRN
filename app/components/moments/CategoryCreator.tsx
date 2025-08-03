// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View,  StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  SlideInUp,
  SlideOutUp,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import {   MaterialIcons } from "@expo/vector-icons";
 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/NavigationTypes";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions"; 
import { useCategories } from "@/src/context/CategoriesContext";
import CategoryButtonForCreator from "./CategoryButtonForCreator";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
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
  const {
    themeStyles,
    manualGradientColors, 
  } = useGlobalStyle();

  const { friendDashboardData } = useSelectedFriend();

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
  const [pressedOnce, setPressedOnce] = useState(false);

  // useEffect(() => {
  //   console.log(`CategoryCreator selectedId`, selectedId);
  // }, [selectedId]);


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
 
    if (!name || !id) { 
      return;
    }

    onPress({ name: name, id: id });
      if (!freezeCategory) {
    // if (!freezeCategory?.current) {
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
    // console.warn(`frezeCategory: `, freezeCategory);
     if (freezeCategory) { 
  // if (freezeCategory?.current) { // do not change category on open if user has already selected one
    return;
  }
    if (updatingExisting && existingId) {
      const find = userCategories.findIndex(
        (category) => category.id === existingId
      );
      console.log(find);

      setSelectedId(existingId);

      return;
    }

    if (friendDashboardData && friendDashboardData?.friend_faves) {
      console.log(
        `friend default:`,
        friendDashboardData.friend_faves.friend_default_category
      );
      const friendDefault =
        friendDashboardData?.friend_faves?.friend_default_category;
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

    let largest = categoriesSortedList[0]?.user_category;
    let largestName = categoriesSortedList[0]?.name;

    console.log(`largest: `, typeof largest);
    console.log(`largestName: `, typeof largestName);

    if (largest && largestName) {
      console.log("setting largest");

      onPress({ name: largestName, id: largest });
      setSelectedId(largest);
    }
  }, [categoriesSortedList, friendDashboardData]);

  const renderedButtons = useMemo(
    () => (
      <View style={styles.buttonRow}>
        {Array.isArray(userCategories) &&
          userCategories.map(({ name, id }) => {
            const categoryColor = categoryColorsMap[id];

            return (
              <View
                key={id ?? name ?? "Uncategorized"}
                style={styles.buttonWrapper}
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
      friendDashboardData,
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
            styles.momentsScreenPrimarySpacing,
            {
              backgroundColor:
                // themeStyles.overlayBackgroundColor.backgroundColor,
                themeStyles.primaryBackground.backgroundColor,
            },
          ]}
        >
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
  momentsScreenPrimarySpacing: {
    // borderRadius: 10,

    padding: 0,
  },
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
