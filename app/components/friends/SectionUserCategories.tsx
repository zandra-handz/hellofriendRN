import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

import useCreateNewCategory from "@/src/hooks/CategoryCalls/useCreateNewCategory";
import useUpdateCategory from "@/src/hooks/CategoryCalls/useUpdateCategory";
import useDeleteCategory from "@/src/hooks/CategoryCalls/useDeleteCategory";

import AddNewCategory from "../headers/AddNewCategory";

type Props = {
  userId: number;
  userCategories: object[];
};

const SectionUserCategories = ({
  userId,
  userCategories,
  manualGradientColors,
  subWelcomeTextStyle,
  primaryColor = 'orange',
  primaryBackground = 'orange',
  lighterOverlayColor = 'orange',
}) => {
 

  const { createNewCategory, createNewCategoryMutation } = useCreateNewCategory(
    { userId: userId }
  );
  const { updateCategory, updateCategoryMutation } = useUpdateCategory({
    userId: userId,
  });

  const { deleteCategory, deleteCategoryMutation } = useDeleteCategory({
    userId: userId,
  });

  const [showEdit, setShowEdit] = useState(false);

  // const [showList, setShowList] = useState(true);

  const newCategoryRef = useRef(null);

  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState("");

  const handleUpdateNewCategoryText = (text) => {
    if (newCategoryRef.current) {
      newCategoryRef.current.value = text;
      setNewCategory(text);
    }
  };

  const handleConfirmDelete = () => {
    if (editId && newCategory) {
      Alert.alert(
        `Delete: ${newCategory}`,
        `Are you sure you want to delete this category? (Active talking points will be orphaned and you will need to reassign them to new categories by hand.)`,
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => handleDeleteCategory(),
          },
        ]
      );
    }
  };

  const handleDeleteCategory = () => {
    deleteCategory({
      id: editId,
    });
  };

  const handleCreateCategory = () => {
    createNewCategory({
      name: newCategoryRef.current.value,
    });
  };

  const handleUpdateCategory = () => {
    updateCategory({
      id: editId,

      updates: { name: newCategoryRef.current.value },
    });
  };

  const handleSave = () => {
    if (editId) {
      console.log("updating existing");
      handleUpdateCategory();
    } else {
      handleCreateCategory();
    }
  };

  useEffect(() => {
    if (deleteCategoryMutation.isSuccess) {
      if (newCategoryRef && newCategoryRef.current) {
        newCategoryRef.current.clear();
        setShowEdit(false);
        setEditId(null);
      }
    }
  }, [deleteCategoryMutation.isSuccess]);

  useEffect(() => {
    if (createNewCategoryMutation.isSuccess) {
      if (newCategoryRef && newCategoryRef.current) {
        newCategoryRef.current.clear();
        setShowEdit(false);
        setEditId(null);
      }
    }
  }, [createNewCategoryMutation.isSuccess]);

  useEffect(() => {
    if (updateCategoryMutation.isSuccess) {
      if (newCategoryRef && newCategoryRef.current) {
        newCategoryRef.current.clear();
        setShowEdit(false);
        setEditId(null);
      }
    }
  }, [updateCategoryMutation.isSuccess]);

  const renderCategoryItem = useCallback(({ item, index }) => {
    const indexForCalc = index === 0 ? 0.5 : index;

    return (
      <Animated.View
        entering={FadeInUp.duration(100 * (indexForCalc * 0.5)).delay(320)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 40,
          borderRadius: 10,
          backgroundColor: lighterOverlayColor,
          width: "100%",
          marginVertical: 8,
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
            name="tree"
            size={26}
            color={primaryColor}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={[ subWelcomeTextStyle, { color: primaryColor }]}>
            {item.name}
          </Text>
        </View>
        <Pressable onPress={() => handleEditExisting(item)}>
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            style={{ opacity: 0.4 }}
            color={primaryColor}
          />
        </Pressable>
      </Animated.View>
    );
  }, []);

  const handleEditExisting = (item) => {
    setShowEdit(true);
    console.log(item.name);
    setNewCategory(item.name);
    setEditId(item.id);

    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.value = item.name;
      newCategoryRef.current.focus();
    }
  };

  const toggleEdit = () => {
    console.log("toggleedit pressed");
    setShowEdit((prev) => !prev);
  };

  const toggleAddNew = () => {
    setShowEdit(true);

    setEditId(null);
    setNewCategory("");

    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.clear();
      newCategoryRef.current.focus();
    }
  };

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `userCategory-${index}`;

  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        flex: 1,
        width: "100%",
        alignSelf: "flex-start",
        backgroundColor: showEdit ? "red" : "transparent",
        padding: showEdit ? 10 : 0,
        borderRadius: showEdit ? 10 : 0,
        marginVertical: showEdit ? 10 : 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showEdit && editId && (
            <>
              <Pressable
                onPress={handleConfirmDelete}
                style={{ marginRight: 10 }}
              >
                <MaterialCommunityIcons
                  name={"delete"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
            </>
          )}

          {showEdit && (
            <>
              <Pressable onPress={toggleEdit} style={{ marginRight: 10 }}>
                <MaterialCommunityIcons
                  name={"cancel"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
              <Pressable onPress={handleSave}>
                <MaterialCommunityIcons
                  name={"check"}
                  size={20}
                  color={primaryColor}
                />
              </Pressable>
            </>
          )}
        </View>
      </View>
      {showEdit && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 6,
            alignItems: "center",
            height: 50,
          }}
        >
          <TextInput
            ref={newCategoryRef}
            style={[ 
              {
                color: primaryColor,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: primaryColor,
                borderRadius: 10,
                width: "100%",
              },
            ]}
            autoFocus
            value={newCategory}
            // value={newCategoryRef?.current?.value}
            onChangeText={handleUpdateNewCategoryText}
            multiline
          />
        </View>
      )}

      {userCategories &&
        !showEdit && ( //showList && (
          <View style={{ width: "100%", flexShrink: 1 }}>
            <AddNewCategory
              userId={userId}
              userCategories={userCategories}
              fontStyle={2}
              manualGradientColors={manualGradientColors}
            />

            <FlatList
              data={userCategories}
              renderItem={renderCategoryItem}
              keyExtractor={extractItemKey}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <View style={{ height: 40 }} />}
            />

            <View></View>
          </View>
        )}
    </View>
  );
};

export default SectionUserCategories;
