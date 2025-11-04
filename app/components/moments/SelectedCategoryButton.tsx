import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import CategoryFriendHistoryCombinedModal from "../headers/CategoryFriendHistoryCombinedModal";

import SvgIcon from "@/app/styles/SvgIcons";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
import { RefObject } from "react";
import { useCategories } from "@/src/context/CategoriesContext";
// import useCategories from "@/src/hooks/useCategories";
import { AppFontStyles } from "@/app/styles/AppFonts";
type Props = {
  userChangedCategory: boolean;

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
  const { userCategories } = useCategories();

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
      <GlobalPressable
        zIndex={3}
        style={[styles.container, { borderColor: lighterOverlayColor}]}
        onPress={handleOnPress}
        onLongPress={handleLongPress}
      >
        <View>
          <View
            style={styles.topRowWrapper}
          >
            {isFriendDefault && (
              <SvgIcon name={"star"} size={12} color={primaryColor} />
            )}
            {isFrozen && (
              <SvgIcon name={"pin"} size={12} color={primaryColor} />
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                // welcomeTextStyle,
                {
                  zIndex: 2,
                  color: primaryColor,
                  fontSize: editMode ? fontSizeEditMode : fontSize,
                  width: "100%",
                },
              ]}
            >
              {label ? label : `Pick category`}
            </Text>
            
          </View>
        </View>
      </GlobalPressable>
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
    padding: 8,
    paddingHorizontal: 18,
    paddingTop: 3,
    // flex: 1,
    height: 40,

    borderWidth: 0.8,
    borderRadius: 999,
    width: "100%",
    flexDirection: "column",
  },
  topRowWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    height: 10,
  },
  innerContainer: { flexDirection: "column" },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

//export default SelectedCategoryButton;

export default React.memo(SelectedCategoryButton);
