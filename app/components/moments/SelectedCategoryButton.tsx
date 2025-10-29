import { View, Text } from "react-native";
import React, { useEffect, useState, useRef  } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import CategoryFriendHistoryCombinedModal from "../headers/CategoryFriendHistoryCombinedModal";
 
import SvgIcon from "@/app/styles/SvgIcons";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
import { RefObject } from "react";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
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
  editMode=true, 
  iconSize = 20,
}: Props) => {
  const { userCategories } = useCategories({userId: userId});

  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const welcomeTextStyle = AppFontStyles.welcomeText;
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
        style={{
          paddingHorizontal: 0,
          width: '100%',
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
              <SvgIcon
                name={"pencil"}
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
                width: '100%'
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
              <SvgIcon
                name={"star"}
                size={16}
                style={{ height: 20 }}
                color={primaryColor}
              />
            )}
            {isFrozen && (
              <SvgIcon
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

//export default SelectedCategoryButton;

export default React.memo(SelectedCategoryButton);