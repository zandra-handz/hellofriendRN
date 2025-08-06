import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import React, { useState,  useEffect, useRef, useMemo } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { useCategories } from "@/src/context/CategoriesContext";
import { useUser } from "@/src/context/UserContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  height: number;
  addToOnPress: ({
    categoryId,
    categoryName,
  }: {
    categoryId: number;
    categoryName: string;
  }) => void; //sets selected category Id after creating it
};

const AddNewCategory = ({ height = 60, addToOnPress }: Props) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const newCategoryRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");
  const { user } = useUser();
 

  const ENTER_MESSAGE_WIDTH = 60;

  const { userCategories, createNewCategory, createNewCategoryMutation } =
    useCategories();

  const clearInput = () => {
    if (newCategoryRef && newCategoryRef.current) {
      newCategoryRef.current.clear();
    }

    setNewCategory("");
  };

  useEffect(() => {
    if (createNewCategoryMutation.isError) {
      showFlashMessage(`Oops! Not added`, true, 1000);
    }

  }, [createNewCategoryMutation.isError]);

  const remaining = useMemo(() => {
    if (userCategories && userCategories.length > 0) {
      return userCategories[0].max_active - userCategories.length;
    }
  }, [userCategories]);

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

  const handleSave = () => {
    handleCreateCategory();
  };

  const handleCreateCategory = async () => {
    showFlashMessage(`Added!`, false, 1000);
    try {
      console.error(`SAVING NEW CAT HERE!!!!!!!!!!!!!!!!!!!!!!~!~!~!~!~!~!~!!~!~!~!~!~!~!~!`);
      const updatedData = await createNewCategory({
        user: user?.id,
        name: newCategoryRef.current.value,
      });

      if (updatedData && updatedData?.id) {
        console.log("back end return of new category: ", updatedData);

        const itemId = updatedData?.id;
        const categoryName = updatedData?.name;

        addToOnPress({ categoryId: itemId, categoryName: categoryName });
      }
    } catch (error) {
      console.log("error saving new category: ", error);
    }
  };

  const handleUpdateNewCategoryText = (text: string) => {
    if (newCategoryRef.current) {
      newCategoryRef.current.value = text;
      setNewCategory(text);
    }
  };

  return (
    <>
      {!remaining && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            // backgroundColor: "pink",
            padding: 10,
            height: "auto",
          }}
        >
          <Text
            style={[
              themeStyles.primaryText,
              { fontSize: 13, fontWeight: "bold" },
            ]}
          >
            max amount of categories
          </Text>
        </View>
      )}
      {remaining && remaining > 0 && (
        <Pressable
          onPress={toggleInput}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,

            width: inputActive ? "100%" : 60,
            height: height - 20,
            backgroundColor: inputActive
              ? manualGradientColors.lightColor
              : "transparent",
          }}
        >
          <MaterialIcons
            name={!inputActive ? "add" : "keyboard-backspace"}
            color={themeStyles.primaryText.color}
            color={manualGradientColors.homeDarkColor}
            size={16}
            style={{
              backgroundColor: manualGradientColors.lightColor,
              borderRadius: 999,
            }}
          />

          {!inputActive && remaining && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                width: 200,
                height: "100%",
              }}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  { fontSize: 13, fontWeight: "bold" },
                ]}
              >
                new category
              </Text>
            </View>
          )}

          {inputActive && (
            <Animated.View
              key="inputBox"
              entering={SlideInLeft}
              style={{
                width: "90%",
                flexGrow: 1,
                paddingLeft: 11,
                paddingRight: 0,
              }}
            >
              <TextInput
                ref={newCategoryRef}
                style={[
                  themeStyles.primaryText,
                  {
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    lineHeight: 14,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: themeStyles.primaryText.color,
                    borderRadius: 0,
                    width: "100%",
                    flex: 1,

                    flexDirection: "row",
                    alignItems: "center",
                    alignContents: "center",
                    paddingLeft: 12,
                    paddingRight: ENTER_MESSAGE_WIDTH + 12, // space for enter message
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
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor:
                    //   themeStyles.lighterOverlayBackgroundColor.backgroundColor,
                    width: ENTER_MESSAGE_WIDTH,

                    right: 0,
                  }}
                >
                  <View
                    style={{
                      flexWrap: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: ENTER_MESSAGE_WIDTH - 20, // for paddingHorizontal of 10
                    }}
                  >
                    <Text
                      style={[
                        themeStyles.primaryText,
                        { opacity: 0.6, fontSize: 13, lineHeight: 12, fontWeight: "bold" },
                      ]}
                    >
                      Press Enter
                    </Text>
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </Pressable>
      )}
    </>
  );
};

export default AddNewCategory;
