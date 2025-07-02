import React, { useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

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
import { useUserSettings } from "@/src/context/UserSettingsContext";
import SectionUserCategories from "../friends/SectionUserCategories";
import ModalWithoutSubmit from "../alerts/ModalWithoutSubmit";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  categoryId: number;
  onSearchPress: () => void;
}

const CategoryDetailsModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  categoryId,
  onSearchPress,
}) => {
  const { userCategories, updateCategory, updateCategoryMutation } =
    useUserSettings();
  const category =
    userCategories.find((category) => category.id === categoryId) || null;
  console.log(`category in modal: `, category);

  const { user } = useUser();
  const { themeStyles, appFontStyles, appSpacingStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { capsuleList } = useCapsuleList();

  const startingText = category?.description || null;

  const textInputRef = useRef(null);

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

  const [ momentsInCategory, setMomentsInCategory ] = useState(null);

  // const momentsInCategory = capsuleList.filter(
  //   (capsule) => capsule?.user_category === categoryId
  // );

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

  const renderMomentsInCategoryItem = useCallback(({ item, index }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        borderRadius: 10,
        backgroundColor: themeStyles.lighterOverlayBackgroundColor,
        width: "100%",
        marginVertical: 6,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 40,
          alignItems: "center",
          justifyContent: "start",
          flexDirection: "row",
        }}
      >
        <MaterialCommunityIcons
          name={"comment-outline"}
          size={20}
          color={themeStyles.primaryText.color}
        />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text style={[themeStyles.primaryText]}>{item.capsule}</Text>
      </View>
    </View>
  ), [momentsInCategory, themeStyles]);

  return (
    <ModalWithoutSubmit
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
        <View contentContainerStyle={styles.bodyContainer}>
          <View
            style={[
              styles.sectionContainer,
              {
                backgroundColor: showEdit ? "red" : "transparent",
                padding: 10,
                borderRadius: 20,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: "auto",
                alignItems: 'center', 
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
              <View style={{ height: 200, width: "100%" }}>
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
              <ScrollView style={{ height: 300, width: "100%" }}>
                <Text style={themeStyles.primaryText}>
                  {category?.description}
                </Text>
              </ScrollView>
            )}
          </View>
          {selectedFriend && momentsInCategory && (
            <View style={styles.sectionContainer}>
                            <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.subWelcomeText,
                  { fontSize: 16 },
                ]}
              >
                Talking points for {selectedFriend.name}
              </Text>
              <View style={{width: '100%', height: 300}}>

              <FlatList
                data={momentsInCategory}
                renderItem={renderMomentsInCategoryItem}
              />
              </View>
            </View>
          )}
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

export default CategoryDetailsModal;
