import { View, Text } from "react-native";
import React, { useState } from "react";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryDetailsModal from "../headers/CategoryDetailsModal";
import { useUserSettings } from "@/src/context/UserSettingsContext";
type Props = {
  zIndex?: number;
  categoryId: number;
  label: string;
  fontSize: number;
  onPress: () => void;
  onLongPress?: () => void;
};

const SelectedCategoryButton = ({
  zIndex = 3,
  categoryId,
  label = "category name",
  fontSize=24,
  onPress,
  onLongPress,
}: Props) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { settings, updateSettings } = useUserSettings();

const [ detailsModalVisible, setDetailsModalVisible ] = useState(false);


  const handleLongPress = () => {
    setDetailsModalVisible(true);

  };

 

  return (
    <>
    
    <GlobalPressable
      zIndex={zIndex}
      style={{  paddingHorizontal: 10 }}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <Text
        style={[
          appFontStyles.welcomeText,
          {
            zIndex: 2,
            color: themeStyles.primaryText.color,
            fontSize: fontSize,
          },
        ]}
      >
        {label}
      </Text>
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
