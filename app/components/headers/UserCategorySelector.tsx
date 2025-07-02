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

const UserCategorySelector = ({ onPress, onSave, existingCategory }) => {
  const navigationState = useNavigationState((state) => state);
  const { user, onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
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

  const [ detailsModalVisible, setDetailsModalVisible ] = useState(false);

 

  const CategoryButton = React.memo(({ item, index, selectedId, onPress, onLongPress }) => {
    return (
      <Pressable
        onPress={() => onPress(item.id, index)}
        onLongPress={() => onLongPress(item.id, index)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          height: topperHeight - 20,

          width: ITEM_WIDTH,
          marginRight: ITEM_RIGHT_MARGIN,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: themeAheadOfLoading.darkColor,

          backgroundColor:
            selectedId === item.id
              ? themeAheadOfLoading.darkColor
              : "transparent",
          // : themeStyles.lighterOverlayBackgroundColor.backgroundColor,
          paddingHorizontal: 10,

          borderRadius: 10,
          // width: "auto",
          // marginVertical: 6,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "auto",
            height: "100%",
            flexShrink: 1,
            paddingRight: 6,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          {selectedId !== item.id && (
            <MaterialCommunityIcons
              name={"shape"}
              size={20}
              color={
                selectedId === item.id
                  ? themeAheadOfLoading.fontColor
                  : themeStyles.primaryText.color
              }
            />
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text
            numberOfLines={2}
            style={[
              themeStyles.primaryText,
              {
                fontFamily:
                  selectedId === item.id ? "Poppins-Bold" : "Poppins-Regular",
                color:
                  selectedId === item.id
                    ? themeAheadOfLoading.fontColor
                    : themeStyles.primaryText.color,
                // fontWeight: selectedId === item.id ? "bold" : null,
              },
            ]}
          >
            {selectedId === item.id && (
              <Text
                style={[
                  themeStyles.primaryText,
                  {
                    color:
                      selectedId === item.id
                        ? themeAheadOfLoading.fontColor
                        : themeStyles.primaryText.color,
                    fontFamily:
                      selectedId === item.id
                        ? "Poppins-Bold"
                        : "Poppins-Regular",
                    // fontWeight: selectedId === item.id ? "bold" : null,
                  },
                ]}
              >
                Save to:{" "}
              </Text>
            )}
            {item.name}
          </Text>
        </View>
      </Pressable>
    );
  });

  const handlePressOut = (itemId, index) => {
    if (itemId && itemId === selectedId && pressedOnce) {
      onSave();
      setPressedOnce(false);
    } else {
      handleOnPress(itemId);
      scrollToCategory(index);
      setPressedOnce(true);
    }
  };

  const handleLongPress = (itemId, index) => {

    if (!itemId) {
      return;
    }

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
        handlePressOut(updatedData.id); // if for some reason item is not in categories yet to match again, this won't error, just won't select anything
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
    console.log(itemId);
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
                  fontFamily: 'Poppins-Regular',
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
          selectedId={selectedId}
          onPress={handlePressOut}
          onLongPress={handleLongPress}
        />
      );
    },
    [handlePressOut, onPress, selectedId]
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
              // extraData={selectedId}
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

    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
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
