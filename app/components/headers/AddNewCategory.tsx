import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react"; 
import {  MaterialIcons } from "@expo/vector-icons";
import Animated, { SlideInLeft } from "react-native-reanimated"; 
 
import useCreateNewCategory from "@/src/hooks/CategoryCalls/useCreateNewCategory";
 
import FlashMessage from "../alerts/FlashMessage";

type Props = {
  userId: number;
  height: number;
  fontStyle?: number;
  addToOnPress?: ({
    categoryId,
    categoryName,
  }: {
    categoryId: number;
    categoryName: string;
  }) => void; //sets selected category Id after creating it
};

const AddNewCategory = ({
  primaryColor,
  primaryBackground,
  manualGradientColors,
  userId,
  userCategories,
  height = 60,
  fontStyle = 1,
  addToOnPress,
}: Props) => { 
  const newCategoryRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");
 
  const ENTER_MESSAGE_WIDTH = 60;

  const [flashMessage, setFlashMessage] = useState<null | {
    text: string;
    error: boolean;
    duration: number;
  }>(null);

 


    const { createNewCategory, createNewCategoryMutation } = useCreateNewCategory({userId: userId});
  const [inputActive, setInputActive] = useState(false);

 
 

  useEffect(() => {
    if (inputActive && newCategoryRef.current) {
      console.log("ready!!!!!!");
      setNewCategory(" "); // space or something else
      setTimeout(() => setNewCategory(""), 0);
      setTimeout(() => {
        newCategoryRef.current?.focus();
      }, 50);
    } else if (!inputActive && newCategoryRef.current) {
      setTimeout(() => {
        setNewCategory("");
      }, 50);
    }
  }, [inputActive]);
 

  useEffect(() => {
    if (createNewCategoryMutation.isSuccess) {
      setInputActive(false);
      // showFlashMessage(`Oops! Not added`, true, 1000);
    }
  }, [createNewCategoryMutation.isSuccess]);

  useEffect(() => {
    if (createNewCategoryMutation.isError) {
      setFlashMessage({
        text: `Oops! Not added`,
        error: true,
        duration: 1000,
      });
    }
  }, [createNewCategoryMutation.isError]);

  const remaining = useMemo(() => {
    if (userCategories && userCategories.length > 0) {
      return userCategories[0].max_active - userCategories.length;
    } else {
      return 1;
    }
  }, [userCategories]);

  const toggleInput = () => {
    console.log("toggle pressed");
    if (remaining === 0) {
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

    // if (inputActive) {

    //   clearInput();
    // } else {
    //   handleRefocus();
    // }
    setInputActive((prev) => !prev);
  };

  const handleSave = () => {
    handleCreateCategory();
  };

  const handleCreateCategory = async () => {
    // if (!newCategoryRef?.current?.value) {
    //   return;
    // }

    if (!newCategory.trim()) return;

    setFlashMessage({
      text: `Added!`,
      error: false,
      duration: 1000,
    }); 
    try {
      const updatedData = await createNewCategory({
 
        name: newCategory,
      });

      if (updatedData && updatedData?.id) {
        // console.log("back end return of new category: ", updatedData);

        if (addToOnPress) {
          const itemId = updatedData.id;
          const categoryName = updatedData.name;
          addToOnPress({ categoryId: itemId, categoryName });
        }
      }
    } catch (error) {
      console.log("error saving new category: ", error);
    }
  };

  const handleUpdateNewCategoryText = (text: string) => {
 
    setNewCategory(text);
 
  };

  return (
    <>
      {flashMessage && (
        <FlashMessage
          isInsideModal={true}
          message={flashMessage.text}
          error={flashMessage.error}
          onClose={() => setFlashMessage(null)}
        />
      )}
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
          
              { color: primaryColor, fontSize: 13, fontWeight: "bold" },
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
            paddingLeft: 0,
            borderRadius: fontStyle === 2 ? 20 : 0,
            width: inputActive ? "100%" : 60,
            height: height - 20,
            backgroundColor: inputActive
              ? manualGradientColors.lightColor
              : "transparent",
          }}
        >
          <MaterialIcons
            name={!inputActive ? "add" : "keyboard-backspace"}
            color={primaryColor}
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
                paddingHorizontal: 18,
                width: 200,
                height: "100%",
              }}
            >
              <Text
                style={[ 
                  {
                    color: primaryColor,
                    fontSize: fontStyle === 2 ? 18 : 15,
                    fontWeight: fontStyle === 2 ? "regular" : "bold",
                    fontFamily: fontStyle === 2 ? "Poppins-Regular" : undefined,
                  },
                ]}
              >
                Add new
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
                  {
                    color: primaryColor,
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    lineHeight: 14,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: primaryColor,
                    borderRadius: fontStyle === 2 ? 20 : 0,
                    width: "100%",
                    flex: 1,

                    flexDirection: "row",
                    alignItems: "center",
                    alignContents: "center",
                    paddingLeft: 12,
                    paddingRight: ENTER_MESSAGE_WIDTH + 12, // space for enter message
                    backgroundColor: primaryBackground,
                  },
                ]}
                autoFocus={true}
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
                        {
                          color: primaryColor,
                          opacity: 0.6,
                          fontSize: 13,
                          lineHeight: 12,
                          fontWeight: "bold",
                        },
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
