import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import CategoryFriendCurrentList from "./CategoryFriendCurrentList";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCategories } from "@/src/context/CategoriesContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import useCategoryHistoryLookup from "@/src/hooks/useCategoryHistoryLookup";
import CategoryFriendHistoryList from "./CategoryFriendHistoryList";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  categoryId: number;
  onSearchPress: () => void;
}

const CategoryFriendHistoryCombinedModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  categoryId,
  onSearchPress,
}) => {
  const { userCategories, updateCategory, updateCategoryMutation } =
    useCategories();

  const { settings, updateSettings } = useUserSettings();
  const category = Array.isArray(userCategories)
    ? userCategories.find((category) => category.id === categoryId) || null
    : null;

  // console.log(`category in modal: `, category);

  const { user } = useUser();
  const { themeStyles, appFontStyles, appSpacingStyles } = useGlobalStyle();
  const { selectedFriend, friendDashboardData, handleUpdateDefaultCategory } =
    useSelectedFriend();
  const { capsuleList } = useCapsuleList();

  const startingText = category?.description || null;

  const { selectedFriendStats } = useSelectedFriendStats();

  const textInputRef = useRef(null);

  const isUserDefault = categoryId === settings.user_default_category;
  const isFriendDefault =
    categoryId === friendDashboardData?.friend_faves.friend_default_category;

  const {
    categoryHistory,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useCategoryHistoryLookup({
    categoryId: categoryId,
    friendId: selectedFriend?.id,
  });

  useEffect(() => {
    if (selectedFriendStats) {
      console.warn(`SELECTED FRIEND STATS ---->>>>`, selectedFriendStats);

      const categoryHistoryForFriend = selectedFriendStats.find(
        (category) => category.id === categoryId
      );
      if (categoryHistoryForFriend) {
        console.log(categoryHistoryForFriend);
        const capsuleHistory = categoryHistoryForFriend.capsule_ids;
        console.log(capsuleHistory);
      } else {
        console.error(`no capsules here`);
      }
    }
  }, [selectedFriendStats]);

  useFocusEffect(
    useCallback(() => {
      if (category && textInputRef && textInputRef.current) {
        textInputRef.current.value = category?.description;
      }
    }, [category])
  );

  const [textInput, setTextInput] = useState(startingText);

  const handleTextChange = (text) => {
    if (textInputRef?.current) {
      textInputRef.current.value = text;
      setTextInput(text);
    }
  };

  const [momentsInCategory, setMomentsInCategory] = useState(null);

  // const momentsInCategory = capsuleList.filter(
  //   (capsule) => capsule?.user_category === categoryId
  // );

  const handleRemoveUserDefault = async () => {
    await updateSettings({ user_default_category: null });
  };

  const handleMakeUserDefault = async () => {
    await updateSettings({ user_default_category: categoryId });
  };

  const handleRemoveFriendDefault = () => {
    handleUpdateDefaultCategory({ categoryId: null });
  };

  const handleMakeFriendDefault = () => {
    handleUpdateDefaultCategory({ categoryId: categoryId });
  };

  useFocusEffect(
    useCallback(() => {
      if (category && capsuleList && capsuleList?.length > 0) {
        const moments = capsuleList.filter(
          (capsule) => capsule?.user_category === categoryId
        );
        setMomentsInCategory(moments);
      }
    }, [category, capsuleList])
  );
  const [showEdit, setShowEdit] = useState(false);
  const toggleEdit = () => {
    setShowEdit((prev) => !prev);
  };

  const handleUpdateCategory = () => {
    updateCategory({
      user: user?.id,
      id: categoryId,

      updates: { description: textInputRef.current.value },
    });

    setShowEdit(false);
  };

  
  return (
    <ModalWithGoBack
      isVisible={isVisible}
      isFullscreen={false}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText={category && category.name}
      children={
        <View style={styles.bodyContainer}>
          <View
            style={[
              styles.sectionContainer,
              {
                backgroundColor: showEdit ? "red" : "transparent",
                padding: 10,
                paddingTop: 0,
                borderRadius: 20,
              },
            ]}
          >
            <View
              style={{
                height: "auto",
                padding: 10,
                borderRadius: 999,
                width: "100%",
                backgroundColor: "red",
              }}
            >
              <Pressable
                onPress={
                  isUserDefault
                    ? handleRemoveUserDefault
                    : handleMakeUserDefault
                }
              >
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.subWelcomeText,
                    { fontSize: 14 },
                  ]}
                >
                  {isUserDefault ? `Remove default` : `Make default`}{" "}
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                height: "auto",
                padding: 10,
                borderRadius: 999,
                width: "100%",
                backgroundColor: "teal",
              }}
            >
              {" "}
              <Pressable
                onPress={
                  isFriendDefault
                    ? handleRemoveFriendDefault
                    : handleMakeFriendDefault
                }
              >
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.subWelcomeText,
                    { fontSize: 14 },
                  ]}
                >
                  {isFriendDefault ? `Remove default` : `Make default`}{" "}
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: "auto",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  { fontSize: 16 },
                ]}
              >
                Description
              </Text>
              <Pressable onPress={toggleEdit}>
                <MaterialCommunityIcons
                  name={showEdit ? "cancel" : "pencil-outline"}
                  size={20}
                  color={themeStyles.footerIcon.color}
                />
              </Pressable>
              {showEdit && (
                <Pressable onPress={handleUpdateCategory}>
                  <MaterialCommunityIcons
                    name={"check"}
                    size={20}
                    color={themeStyles.footerIcon.color}
                  />
                </Pressable>
              )}
            </View>
            {showEdit && (
              <View
                style={{ height: 100, backgroundColor: "pink", width: "100%" }}
              >
                <TextInput
                  ref={textInputRef}
                  style={[styles.searchInput, themeStyles.genericText]}
                  autoFocus={true}
                  value={textInput}
                  onChangeText={handleTextChange}
                  multiline
                />
              </View>
            )}

            {!showEdit && (
              <ScrollView style={{ height: "auto", maxHeight: 200, width: "100%" }}>
                <Text style={themeStyles.primaryText}>
                  {category?.description}
                </Text>
              </ScrollView>
            )}
          </View>
                    {/* {selectedFriend && momentsInCategory && (
            <View style={[styles.sectionContainer]}>
       
                <CategoryFriendCurrentList categoryId={categoryId} />
          
            </View>
          )} */}
          <View style={[styles.sectionContainer, {flexGrow: 1}]}>
            <View style={{maxHeight: 300}}>
              
              <CategoryFriendCurrentList categoryId={categoryId} />
              
            </View>
          <CategoryFriendHistoryList
            categoryId={categoryId}
            closeModal={closeModal}
          />
          </View>

        </View>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    // height: 100,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
    textAlign: "left",
    paddingRight: 2,
    height: 200,
  },
});

export default CategoryFriendHistoryCombinedModal;
