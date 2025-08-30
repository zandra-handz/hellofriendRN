import { View, Text, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable"; 
import CategoryFriendHistoryCombinedModal from "../headers/CategoryFriendHistoryCombinedModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import { useUser } from "@/src/context/UserContext";
import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
import { RefObject } from "react";
import { useLDTheme } from "@/src/context/LDThemeContext";

type Props = {
  userChangedCategory: boolean;
  zIndex?: number;
  categoryId: number;
  freezeCategory: RefObject<boolean>;
  label: string;
  fontSize: number;
  fontSizeEditMode: number;
  onPress: () => void;
  editMode: boolean;
  maxWidth: number;
  iconSize: number;
};

const SelectedCategoryButton = ({
  userId,
  manualGradientColors,
  primaryColor,
  primaryBackground,
  subWelcomeTextStyle,
  userCategories,
  capsuleList,
  friendId,
  friendName,
  friendDefaultCategory,
  welcomeTextStyle,
  zIndex = 3,
  categoryId,
  freezeCategory,

  label = "category name",
  fontSize = 24,
  fontSizeEditMode = 16,
  onPress,
  editMode,
  maxWidth = 100,
  iconSize = 20,
}: Props) => { 

  const { handleUpdateDefaultCategory, updateFriendDefaultCategoryMutation } =
    useUpdateDefaultCategory({ userId: userId, friendId: friendId });

  const handleMakeFriendDefault = () => {
    handleUpdateDefaultCategory({ categoryId: categoryId });
  };

  const isFriendDefault = categoryId === friendDefaultCategory || false;

  const isFrozen = freezeCategory;

  useEffect(() => {
    if (updateFriendDefaultCategoryMutation.isError) {
      showFlashMessage(
        "Error",
        updateFriendDefaultCategoryMutation.isError,
        2000
      );
    }
  }, [updateFriendDefaultCategoryMutation.isError]);

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [lastPress, setLastPress] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const DOUBLE_PRESS_DELAY = 300;
  const handleOnPress = () => {
    const now = Date.now();

    if (lastPress && now - lastPress < DOUBLE_PRESS_DELAY) {
      // Double press detected
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.log("double press here!");
      handleMakeFriendDefault();
      showFlashMessage(`Category pinned!`, false, 1000);
      setLastPress(null);
    } else {
      // First press
      setLastPress(now);

      timeoutRef.current = setTimeout(() => {
        onPress();
        setLastPress(null);
        timeoutRef.current = null;
      }, DOUBLE_PRESS_DELAY);
    }
  };

  const handleLongPress = () => {
    setDetailsModalVisible(true);
  };

  return (
    <>
      <GlobalPressable
        zIndex={zIndex}
        style={{
          paddingHorizontal: 0,
          maxWidth: editMode ? maxWidth : maxWidth,
        }}
        onPress={handleOnPress}
        onLongPress={handleLongPress}
      >
        <View style={{ flexDirection: "row" }}>
          {editMode && (
            <View
              style={{
                flexDirection: "column",

                marginRight: 4,
                paddingBottom: 6, // EYEBALL
                justifyContent: "flex-end",
              }}
            >
              <MaterialCommunityIcons
                name={"pencil-outline"}
                size={iconSize}
                style={{ height: iconSize }}
                color={primaryColor}
              />
            </View>
          )}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              welcomeTextStyle,
              {
                zIndex: 2,
                color: primaryColor,
                fontSize: editMode ? fontSizeEditMode : fontSize,
                maxWidth: editMode ? maxWidth : maxWidth, // ensure constraint
              },
            ]}
          >
            {label ? label : `Pick category`}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginRight: 4,
              paddingBottom: 6, // EYEBALL
              justifyContent: "flex-end",
            }}
          >
            {isFriendDefault && (
              <MaterialCommunityIcons
                name={"star"}
                size={16}
                style={{ height: 20 }}
                color={primaryColor}
              />
            )}
            {isFrozen && (
              <MaterialCommunityIcons
                name={"pin"}
                size={16}
                style={{ height: 20 }}
                color={primaryColor}
              />
            )}
          </View>
        </View>
        {editMode && (
          <View
            style={{ height: 2, backgroundColor: "red", width: "100%" }}
          ></View>
        )}
      </GlobalPressable>
      {detailsModalVisible && (
        <View>
          <CategoryFriendHistoryCombinedModal
          userId={userId}
          friendId={friendId}
          friendName={friendName}
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          subWelcomeTextStyle={subWelcomeTextStyle}
          friendDefaultCategory={friendDefaultCategory}
            isVisible={detailsModalVisible}
            closeModal={() => setDetailsModalVisible(false)}
            categoryId={categoryId}
            manualGradientColors={manualGradientColors}
            userCategories={userCategories}
            capsuleList={capsuleList}
          />
        </View>
      )}
    </>
  );
};

export default SelectedCategoryButton;
