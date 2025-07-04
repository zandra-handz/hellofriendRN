import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// app state
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useNavigationState } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import UserCategorySelectorButton from "./UserCategorySelectorButton";
import Donut from "./Donut";
import Pie from "./Pie";
import Animated, {
  useAnimatedStyle,
  withTiming,
  SlideInLeft,
  SlideInRight,
  SlideOutRight,
  useSharedValue,
  useAnimatedRef,
} from "react-native-reanimated";
import GradientBackground from "../appwide/display/GradientBackground";
import CategoryDetailsModal from "./CategoryDetailsModal";
import PieChartModal from "./PieChartModal";

const UserCategorySelector = ({
  onPress,
  onSave,
  existingCategory,
  updatingExisting,
  existingId,
}) => {
  const navigationState = useNavigationState((state) => state);
  const { user, onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend, deselectFriend, friendDashboardData } =
    useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { capsuleList } = useCapsuleList();
  const {
    userCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    createNewCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useUserSettings();
  // these are the only dimensions I foresee potentially changing, hence why they are at top here
  const footerHeight = 90;
  const topperHeight = 70;
  const footerPaddingBottom = 20;
  const footerIconSize = 28;
  const flatListRef = useAnimatedRef(null);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const newCategoryRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");
  const [pressedOnce, setPressedOnce] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(existingCategory);

  const [newCategoryId, setNewCategoryId] = useState(null);

  const [selectedId, setSelectedId] = useState(null);

  const handleUpdateNewCategoryText = (text) => {
    if (newCategoryRef.current) {
      newCategoryRef.current.value = text;
      setNewCategory(text);
    }
  };

  const remaining = useMemo(() => {
    if (userCategories && userCategories.length > 0) {
      return userCategories[0].max_active - userCategories.length;
    }
  }, [userCategories]);

  const {
    categorySizes,
    addCategoryItem,
    moveCategoryCount,
    generateGradientColors,
    generateRandomColors,
  } = useMomentSortingFunctions({
    listData: capsuleList,
  });

  //   const biggestCategoryId = useMemo(() => {
  //   if (capsuleList && capsuleList.length > 0) {
  //     return userCategories[0].max_active - userCategories.length;
  //   }
  // }, [capsuleList]);

  const ITEM_WIDTH = 140;
  const ITEM_RIGHT_MARGIN = 4;
  const COMBINED_WIDTH = ITEM_WIDTH + ITEM_RIGHT_MARGIN;

  const getItemLayout = (item, index) => {
    return {
      length: COMBINED_WIDTH,
      offset: COMBINED_WIDTH * index,
      index,
    };
  };

  const scrollToCategory = (index) => {
    if (index !== undefined) {
      flatListRef.current?.scrollToOffset({
        offset: COMBINED_WIDTH * index,
        animated: true, // disables the "intermediate" rendering problem
      });
    }
  };

  const [categoriesSummary, setCategoriesSummary] = useState({});
  const [categoriesMap, setCategoriesMap] = useState({});
  const [categoriesSortedList, setCategoriesSortedList] = useState([]);
  const [tempCategoriesSortedList, setTempCategoriesSortedList] = useState([]);
  const [tempCategoriesMap, setTempCategoriesMap] = useState({});
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

  const [categoryColors, setCategoryColors] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (userCategories && userCategories.length > 0) {
    
      // setCategoryColors(
      //   generateGradientColors(
      //     userCategories, 
      //     manualGradientColors.lightColor,
      //       manualGradientColors.homeDarkColor,
      //     // themeAheadOfLoading.darkColor
      //   )
      // );
            setCategoryColors(
        generateRandomColors(
          userCategories 
        )
      );
    }
  }, [userCategories]);




useEffect(() => {
  if (categoryColors && tempCategoriesSortedList) {
    const userCategorySet = new Set(
      tempCategoriesSortedList.map(item => item.user_category)
    );

    const filteredColors = categoryColors
      .filter(item => userCategorySet.has(item.user_category))
      .map(item => item.color);  
    setColors(filteredColors);  
  }
}, [categoryColors, tempCategoriesSortedList]);

  useEffect(() => {
    if (!categoriesSortedList) {
      return;
    }

    if (updatingExisting && existingId) {
      const find = userCategories.findIndex(
        (category) => category.id === existingId
      );
      // console.log(find);
      setTimeout(() => {
        scrollToCategory(find);
      }, 100);
      setSelectedId(existingId);

      return;
    }

    let largest = categoriesSortedList[0]?.user_category;
    // console.log(`largest: `, typeof largest);

    if (largest) {
      setSelectedId(largest);
    }
  }, [categoriesSortedList]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [pieChartModalVisible, setPieChartModalVisible] = useState(false);

  const CategoryButton = React.memo(
    ({ item, index, colors, selectedId, onPress, onLongPress }) => {
      return (
        <UserCategorySelectorButton
          item={item}
          index={index}
          colors={colors}
          selectedId={selectedId}
          onPress={onPress}
          onLongPress={onLongPress}
          height={topperHeight - 20}
          width={ITEM_WIDTH}
          marginRight={ITEM_RIGHT_MARGIN}
        />
      );
    }
  );

  const handlePressOut = (item, index) => {
    if (!item) {
      return;
    }
    const itemId = item?.id;
    if (itemId && itemId === selectedId && pressedOnce) {
      onSave();
      setPressedOnce(false);
    } else {
      let newData = {};

      if (!updatingExisting) {
        console.log("NOT updating existing");
        newData = addCategoryItem(categoriesMap, {
          user_category: item.id,
          name: item.name,
          sizeToAdd: 1,
        });
      }

      if (updatingExisting) {
        console.log(
          "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~updating existing!",
          selectedId,
          item.id,
          item.name
        );
        newData = moveCategoryCount(
          tempCategoriesMap,
          selectedId,
          item.id,
          item.name
        );
      }

      handleOnPress(itemId);
      scrollToCategory(index);

      setTempCategoriesSortedList(newData.sortedList);
      setTempCategoriesMap(newData.lookupMap);
      setPressedOnce(true);
    }
  };

  // useEffect(() => {
  //   if (selectedId) {
  //     console.log("selectedId change: ", typeof selectedId, selectedId);
  //   }
  // }, [selectedId]);

  const handleLongPress = (item, index) => {
    if (!item) {
      return;
    }

    const itemId = item?.id;

    if (itemId !== selectedId) {
      setSelectedId(itemId);
    }

    if (!pressedOnce) {
      setPressedOnce(true);
    }

    scrollToCategory(index);

    setDetailsModalVisible(true);
  };

  // useEffect(() => {
  //   console.log("new category id: ", newCategoryId);
  // }, [newCategoryId]);

  const clearInput = () => {
    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.clear();
    }

    setNewCategory("");
  };

  useEffect(() => {
    if (
      createNewCategoryMutation.isSuccess &&
      newCategoryId &&
      userCategories.find((category) => category.id === newCategoryId)
    ) {
      if (newCategoryRef && newCategoryRef.current) {
        newCategoryRef.current.clear();
      }

      setInputActive(false);
      setNewCategory("");
      // console.log(userCategories);
      const find = userCategories.findIndex(
        (category) => category.id === newCategoryId
      );
      // console.log(find);
      setTimeout(() => {
        scrollToCategory(find);
      }, 100);
      setNewCategoryId(null);
    }
  }, [createNewCategoryMutation.isSuccess, newCategoryId, userCategories]);

  const handleCreateCategory = async () => {
    try {
      const updatedData = await createNewCategory({
        user: user?.id,
        name: newCategoryRef.current.value,
      });

      // console.log(`updated data from create new category`, updatedData);
      if (updatedData && updatedData?.id) {
        setNewCategoryId(updatedData.id);
        handlePressOut(updatedData); // if for some reason item is not in categories yet to match again, this won't error, just won't select anything
      }
    } catch (error) {
      console.log("error saving new category: ", error);
    }
  };

  const handleSave = () => {
    handleCreateCategory();
  };

  const handleOnPress = (itemId) => {
    setSelectedId(itemId);
    // console.log(itemId);
    onPress(itemId);
  };

  const [inputActive, setInputActive] = useState(false);

  const toggleInput = () => {
    if (remaining === 0) {
      console.log("none remaining");

      Alert.alert(
        `Oops!`,
        `Max amount of categories added already. Please go to the category settings if you would like to delete an existing one.`,
        [
          {
            text: "Okay",
            onPress: () => {},
            style: "cancel",
          },
          // {
          //   text: "Delete",
          //   onPress: () => handleDeleteCategory(),
          // },
        ]
      );
      return;
    }
    if (inputActive) {
      clearInput();
    }
    setInputActive((prev) => !prev);
  };
  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `user-category-${index}`;

  const renderHeader = useCallback(() => {
    return (
      <Pressable
        onPress={toggleInput}
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: inputActive ? "100%" : 60,
          height: topperHeight - 20,
          backgroundColor: inputActive
            ? manualGradientColors.lightColor
            : "transparent",
        }}
      >
        <View
          style={{
            backgroundColor: manualGradientColors.homeDarkColor,
            borderRadius: 40 / 2,
            marginLeft: 10,
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            width: 40,
          }}
        >
          <MaterialCommunityIcons
            name={!inputActive ? "plus" : "keyboard-backspace"}
            size={20}
            color={manualGradientColors.lightColor}
          />
        </View>
        {inputActive && (
          <Animated.View
            key="inputBox"
            entering={SlideInLeft}
            style={{
              width: "90%",
              flexGrow: 1,
              paddingLeft: 11,
              paddingRight: 20,
            }}
          >
            <TextInput
              ref={newCategoryRef}
              style={[
                themeStyles.primaryText,
                {
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: themeStyles.primaryText.color,
                  borderRadius: 10,
                  width: "100%",
                  flex: 1,
                  flexGrow: 1,
                  paddingHorizontal: 12,
                  backgroundColor:
                    themeStyles.primaryBackground.backgroundColor,
                },
              ]}
              autoFocus
              value={newCategory}
              onSubmitEditing={handleSave}
              onChangeText={handleUpdateNewCategoryText}
            />

            {newCategory && newCategory.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  height: 20,
                  width: "auto",
                  bottom: 3,
                  right: 30,
                }}
              >
                <Text
                  style={[
                    themeStyles.primaryText,
                    { opacity: 0.6, fontSize: 12 },
                  ]}
                >
                  Enter to save new category
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </Pressable>
    );
  }, [toggleInput, inputActive]);

  const renderCategoryButton = useCallback(
    ({ item, index }) => {
      return (
        <CategoryButton
          item={item}
          index={index}
          colors={categoryColors}
          selectedId={selectedId}
          onPress={handlePressOut}
          onLongPress={handleLongPress}
        />
      );
    },
    [handlePressOut, onPress, selectedId, categoryColors]
  );

  return (
    <GradientBackground
      useFriendColors={!!selectedFriend}
      additionalStyles={[
        styles.container,
        {
          // height: footerHeight,
          height: topperHeight,
          // paddingBottom: footerPaddingBottom,
          paddingVertical: 10,
          opacity: 0.94,
        },
      ]}
    >
      <Animated.View
        entering={SlideInRight}
        style={[
          styles.container,
          {
            height: topperHeight,

            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
        ]}
      >
        {renderHeader()}
        {userCategories && userCategories.length > 0 && !inputActive && (
          <Animated.View entering={SlideInRight} exiting={SlideOutRight}>
            <Animated.FlatList
              // ListHeaderComponent={renderHeader}
              // ListHeaderComponent={renderHeaderItem}
              data={userCategories}
              extraData={selectedId}
              renderItem={renderCategoryButton}
              contentContainerStyle={{ height: "100%", alignItems: "center" }}
              keyboardShouldPersistTaps="handled"
              ref={flatListRef}
              scrollEventThrottle={16}
              horizontal
              keyExtractor={extractItemKey}
              snapToInterval={COMBINED_WIDTH}
              getItemLayout={getItemLayout}
              // initialNumToRender={10}
              // maxToRenderPerBatch={10}
              // windowSize={10}
              // removeClippedSubviews={true}
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={() => <View style={{ width: 300 }} />}
            />
          </Animated.View>
        )}
      </Animated.View>

      {detailsModalVisible && (
        <View>
          <CategoryDetailsModal
            isVisible={detailsModalVisible}
            closeModal={() => setDetailsModalVisible(false)}
            categoryId={selectedId}
          />
        </View>
      )}
      {pieChartModalVisible && (
        <View>
          <PieChartModal
            isVisible={pieChartModalVisible}
            closeModal={() => setPieChartModalVisible(false)}
            data={tempCategoriesSortedList}
            // categoryId={selectedId}
          />
        </View>
      )}

      {categoriesSortedList && colors &&
        categoriesSortedList.length > 0 &&
        !pieChartModalVisible && (
          <Pressable
            onLongPress={() => setPieChartModalVisible(true)}
            style={{
              position: "absolute",
              // backgroundColor: "red",
              alignItems: "center",
              zIndex: 10000,
              elevation: 10000,
              bottom: -60,

              right: 30,
              width: 50,
              height: "100%",
            }}
          >
            <Donut data={tempCategoriesSortedList} colors={colors} />
          </Pressable>
        )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    //overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 0,
    borderTopRightRadius: 40, // matches talkingPointCard style
    borderTopLeftRadius: 40, // matches talkingPointCard style
    zIndex: 6000,
    elevation: 6000,
  },
  section: {
    overflow: "hidden",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default UserCategorySelector;
