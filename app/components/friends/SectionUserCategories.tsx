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
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCategories } from "@/src/context/CategoriesContext";

const SectionUserCategories = () => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const {
    userCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    createNewCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useCategories();

  const { user } = useUser();
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
      user: user?.id,
      id: editId,
    });
  };

  const handleCreateCategory = () => {
    createNewCategory({
      user: user?.id,
      name: newCategoryRef.current.value,
    });
  };

  const handleUpdateCategory = () => {
    updateCategory({
      user: user?.id,
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

  const renderHeaderItem = useCallback(({}) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        borderRadius: 10,
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
        <Pressable onPress={toggleAddNew}>
          <MaterialCommunityIcons
            name={"plus"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text
          style={[
            themeStyles.primaryText,
            { fontSize: 14, fontFamily: "Poppins-Bold" },
          ]}
        >
          Add new
        </Text>
      </View>
    </View>
  ));

  const renderCategoryItem = useCallback(({ item, index }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: 40,
        borderRadius: 10,
        backgroundColor: themeStyles.lighterOverlayBackgroundColor,
        width: "100%",
        marginVertical: 8,
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
          name={"tree"}
          size={26}
          color={themeStyles.primaryText.color}
        />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>{item.name}</Text>
      </View>
      <Pressable onPress={() => handleEditExisting(item)}>
        <MaterialCommunityIcons
          name={"pencil"}
          size={20}
          style={{opacity: .4}}
          color={themeStyles.primaryText.color}
        />
      </Pressable>
    </View>
  ));

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

  // const toggleList = () => {
  //   setShowList((prev) => !prev);
  // };
  const toggleEdit = () => {
    console.log("toggleedit pressed");
    setShowEdit((prev) => !prev);
  };

  const toggleAddNew = () => {
    console.log("toggleedit pressed");
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

  //   console.log(`user categories`, userCategories);

  return (
    <View
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        width: "100%",
        alignSelf: "flex-start",
        backgroundColor: showEdit ? "red" : "transparent",
        padding: showEdit ? 10 : 0,
        borderRadius: showEdit ? 10 : 0,
        marginVertical: showEdit ? 10 : 0,
      }}
    >

      {!showEdit && (
        
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          padding: 4,
          marginBottom: 20,
        }}
      >
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.subWelcomeText,
            { lineHeight: 22 },
          ]}
        >
          {/* <MaterialCommunityIcons
            name={"alert"}
            size={17}
            color={themeStyles.primaryText.color}
          /> */}
          {"  "}You can have up to {userCategories[0].max_active} total active
          categories. Current total: {userCategories.length}
        </Text>
      </View>
      
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        {/* <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "start",
              flexDirection: "row",
            }}
          >
            <MaterialCommunityIcons
              name={"message"}
              size={20}
              color={themeStyles.primaryText.color}
            />
          </View>
          <Text style={[themeStyles.modalText, { fontWeight: "bold" }]}>
            Categories
          </Text>
        </View> */}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* {!showEdit && (
            <Pressable
              style={{ backgroundColor: "black" }}
              onPress={toggleList}
            >
              <MaterialCommunityIcons
                name={"eye"}
                size={20}
                color={themeStyles.primaryText.color}
              />
            </Pressable>
          )} */}

          {showEdit && editId && (
            <>
              <Pressable
                onPress={handleConfirmDelete}
                style={{ marginRight: 10 }}
              >
                <MaterialCommunityIcons
                  name={"delete"}
                  size={20}
                  color={themeStyles.primaryText.color}
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
                  color={themeStyles.primaryText.color}
                />
              </Pressable>
              <Pressable onPress={handleSave}>
                <MaterialCommunityIcons
                  name={"check"}
                  size={20}
                  color={themeStyles.primaryText.color}
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
              themeStyles.primaryText,
              {
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: themeStyles.primaryText.color,
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
        userCategories.length > 0 && ( //showList && (
          <View style={{ width: "100%" }}>
            <FlatList
              ListHeaderComponent={renderHeaderItem}
              data={userCategories}
              renderItem={renderCategoryItem}
              keyExtractor={extractItemKey}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <View style={{ height: 150 }} />}
            />
            <View>
              <View style={{ height: 50 }} />
            </View>
          </View>
        )}
    </View>
  );
};

export default SectionUserCategories;
