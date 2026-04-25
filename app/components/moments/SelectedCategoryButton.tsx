import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import CategoryFriendHistoryCombinedModal from "../headers/CategoryFriendHistoryCombinedModal";

import SvgIcon from "@/app/styles/SvgIcons";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
import { RefObject } from "react";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
import { AppFontStyles } from "@/app/styles/AppFonts";
type Props = {
  userId: string;
  userChangedCategory: boolean;
  userDefaultCategory: number;
  friendDefaultCategory: number;
  primaryColor: string;
  primaryBackground: string;
  lighterOverlayColor: string;
  friendId: number;
  friendName: string;
  categoryId: number;
  freezeCategory: RefObject<boolean>;
  label: string;
  fontSize: number;
  fontSizeEditMode: number;
  onPress: () => void;
  editMode: boolean;

  iconSize: number;
};

const SelectedCategoryButton = ({
  userId,
  userDefaultCategory,

  themeColors,
  primaryColor,
  primaryBackground,
  lighterOverlayColor,
  friendId,
  friendName,
  friendDefaultCategory,

  categoryId,
  freezeCategory,

  label = "category name",
  fontSize = 24,
  fontSizeEditMode = 16,
  onPress,
  editMode = true,
}: Props) => {
  const { userCategories } = useCategories({ userId: userId });

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
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
        2000,
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

  const handleCloseModal = () => {
    setDetailsModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={handleOnPress}
        onLongPress={handleLongPress}
        style={({ pressed }) => [
          styles.container,
          {
            borderColor: `${primaryColor}30`,
            backgroundColor: `${primaryColor}0D`,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <SvgIcon name="pencil" color={primaryColor} size={22} />
        <View style={styles.textWrap}>
          <View style={styles.hintRow}>
            <Text style={[styles.hint, { color: primaryColor }]}>Category</Text>
            {isFriendDefault && (
              <SvgIcon name="star" size={11} color={primaryColor} />
            )}
            {isFrozen && <SvgIcon name="pin" size={11} color={primaryColor} />}
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.label, { color: primaryColor }]}
          >
            {label ? label : "Pick category"}
          </Text>
        </View>
      </Pressable>
      {detailsModalVisible && (
        <View>
          <CategoryFriendHistoryCombinedModal
            userId={userId}
            userDefaultCategory={userDefaultCategory}
            friendId={friendId}
            friendName={friendName}
            primaryColor={primaryColor}
            lighterOverlayColor={lighterOverlayColor}
            primaryBackground={primaryBackground}
            subWelcomeTextStyle={subWelcomeTextStyle}
            friendDefaultCategory={friendDefaultCategory}
            themeColors={themeColors}
            isVisible={detailsModalVisible}
            closeModal={handleCloseModal}
            categoryId={categoryId}
            userCategories={userCategories}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 2,
    marginTop: 0,
    marginBottom: 0,
    width: "100%",
  },
  textWrap: {
    flex: 1,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hint: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    marginTop: 2,
  },
});

//export default SelectedCategoryButton;

export default React.memo(SelectedCategoryButton);
