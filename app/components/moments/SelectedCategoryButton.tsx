import { View, Text, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryDetailsModal from "../headers/CategoryDetailsModal";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TinyFlashMessage from "../alerts/TinyFlashMessage";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

type Props = {
  zIndex?: number;
  categoryId: number;
  label: string;
  fontSize: number;
  onPress: () => void;
  onLongPress?: () => void;
  editMode: boolean;
};

const SelectedCategoryButton = ({
  zIndex = 3,
  categoryId,
  label = "category name",
  fontSize = 24,
  onPress,
  onLongPress,
  editMode,
}: Props) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { settings, updateSettings } = useUserSettings();
  const { handleUpdateDefaultCategory, updateFriendDefaultCategoryMutation } =
    useSelectedFriend();

  const [pressedOnce, setPressedOnce] = useState(false);

  const handleMakeFriendDefault = () => {
    handleUpdateDefaultCategory({ categoryId: categoryId });
  };

  useEffect(() => {
    // if (!updateFriendDefaultCategoryMutation.isSuccess) {
    //   console.log("triggered flash message");
    //   showFlashMessage(
    //     "TESTAAAAA",
    //     updateFriendDefaultCategoryMutation.isSuccess,
    //     2000
    //   );
    // }
    if (updateFriendDefaultCategoryMutation.isError) {
      console.log("triggered flash message");

      showFlashMessage(
        "Error",
        updateFriendDefaultCategoryMutation.isError,
        2000
      ); }
 
  }, [ 
    updateFriendDefaultCategoryMutation.isError,
  ]);


    useEffect(() => {
    // if (!updateFriendDefaultCategoryMutation.isSuccess) {
    //   console.log("triggered flash message");
    //   showFlashMessage(
    //     "TESTAAAAA",
    //     updateFriendDefaultCategoryMutation.isSuccess,
    //     2000
    //   );
    // }
    // if (updateFriendDefaultCategoryMutation.isSuccess) {
    //   console.log("triggered flash message");

    //   showFlashMessage(
    //     "Success",
    //     !updateFriendDefaultCategoryMutation.isSuccess,
    //     2000
    //   ); }
 
  }, [ 
    updateFriendDefaultCategoryMutation.isSuccess,
  ]);

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
      showFlashMessage(
        `Category pinned!`,
        false,
        1000
      );
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
        style={{ paddingHorizontal: 10 }}
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
                size={20}
                style={{ height: 20 }}
                color={themeStyles.primaryText.color}
              />
            </View>
          )}
          <Text
            style={[
              appFontStyles.welcomeText,
              {
                zIndex: 2,
                color: themeStyles.primaryText.color,
                fontSize: editMode ? 24 : fontSize,
              },
            ]}
          >
            {editMode ? label.slice(0,16) + `...` : label}
          </Text>
        </View>
        {editMode && (
          <View
            style={{ height: 2, backgroundColor: "red", width: "100%" }}
          ></View>
        )}
      </GlobalPressable>
      {detailsModalVisible && (
        <View>
          <CategoryDetailsModal
            isVisible={detailsModalVisible}
            closeModal={() => setDetailsModalVisible(false)}
            categoryId={categoryId}
          />
        </View>
      )}
    </>
  );
};

export default SelectedCategoryButton;
