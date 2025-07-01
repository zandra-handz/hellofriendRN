import React, { useState, useCallback, useRef, useEffect } from "react";
import {
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
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useNavigationState } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated";
import GradientBackground from "../appwide/display/GradientBackground";

const UserCategorySelector = ({ onPress, onSave, existingCategory }) => {
  const navigationState = useNavigationState((state) => state);
  const { user, onSignOut } = useUser();
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === "hellofriend";
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, deselectFriend } = useSelectedFriend();
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

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const newCategoryRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");
  const [pressedOnce, setPressedOnce] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(existingCategory);

  const [selectedId, setSelectedId] = useState(null);

  const handleUpdateNewCategoryText = (text) => {
    if (newCategoryRef.current) {
      newCategoryRef.current.value = text;
      setNewCategory(text);
    }
  };
console.log('categories rerendering');
  const CategoryButton = React.memo(({ item, selectedId, onPress }) => {
    return (
      <Pressable
        onPress={() => onPress(item.id)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 40,

          backgroundColor: selectedId === item.id ? "limegreen" : "transparent",
          padding: 10,
          borderRadius: 10,
          marginHorizontal: 10,
          width: "auto",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 40,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name={"shape"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={[themeStyles.primaryText]}>{item.name}</Text>
        </View>
      </Pressable>
    );
  });

  const handlePressOut = (itemId) => {
    if (itemId === selectedId && pressedOnce) {
      onSave();
      setPressedOnce(false);
    } else {
      handleOnPress(itemId);
      setPressedOnce(true);
    }
  };

  const handleCreateCategory = () => {
    console.log(newCategoryRef.current.value);
    createNewCategory({
      user: user?.id,
      name: newCategoryRef.current.value,
    });
  };

  useEffect(() => {
    if (createNewCategoryMutation.isSuccess) {
      if (newCategoryRef && newCategoryRef.current) {
        newCategoryRef.current.clear();
        setInputActive(false);
      }
    }
  }, [createNewCategoryMutation.isSuccess]);

  const handleSave = () => {
    handleCreateCategory();
  };

  useEffect(() => {
    console.log("selectedId: ", selectedId);
  }, [selectedId]);

  const handleOnPress = (itemId) => {
    setSelectedId(itemId);
    console.log(itemId);
    onPress(itemId);
  };

  const [inputActive, setInputActive] = useState(false);

  const toggleInput = () => {
    setInputActive((prev) => !prev);
  };
  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `user-category-${index}`;

  const renderHeader = useCallback(() => {
    return (
      <Pressable
        onPress={toggleInput}
        style={{
          width: inputActive ? 400 : 40,
          height: 60,
          backgroundColor: "red",
        }}
      >
        {inputActive && (
    //         <Animated.View
    // key="inputBox"
    // entering={SlideInLeft}
    <View
    style={{ marginLeft: 40 }}
  >
            <TextInput
              ref={newCategoryRef}
              style={[
                themeStyles.primaryText,
                {
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: themeStyles.primaryText.color,
                  borderRadius: 10,
                  width: 300,
                },
                // Uncomment or add additional styling as needed
                // styles.textInput,
                // themeStyles.genericText,
                // themeStyles.genericTextBackgroundShadeTwo,
              ]}
              autoFocus
              value={newCategory}
              onSubmitEditing={handleSave}
              onChangeText={handleUpdateNewCategoryText}
            />
          </View>
        )}
      </Pressable>
    );
  }, [toggleInput, inputActive]);

  const renderCategoryButton = useCallback(
    ({ item, index }) => {
      return (
        <CategoryButton
          item={item}
          selectedId={selectedId}
          onPress={handlePressOut}
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
      <View
        style={[
          styles.container,
          {
            height: footerHeight,
            paddingBottom: footerPaddingBottom,
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          },
        ]}
      >
        {userCategories && userCategories.length > 0 && (
          <FlatList
            ListHeaderComponent={renderHeader}
            // ListHeaderComponent={renderHeaderItem}
            data={userCategories}
            extraData={selectedId}
            renderItem={renderCategoryButton}
            keyboardShouldPersistTaps="handled"
            horizontal
            keyExtractor={extractItemKey}
            // initialNumToRender={10}
            // maxToRenderPerBatch={10}
            // windowSize={10}
            // removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: 50 }} />}
          />
        )}
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
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
