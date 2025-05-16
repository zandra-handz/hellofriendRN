import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import GearsTwoBiggerCircleSvg from "@/app/assets/svgs/gears-two-bigger-circle.svg";
import ArrowLeftCircleOutline from "@/app/assets/svgs/arrow-left-circle-outline.svg";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/navigation/types"; // Adjust this import to your app’s navigation types if needed

// Props type definition
interface SettingsStyleHeaderProps {
  isLoadingComplete: boolean;
  displayText?: string;
}

const SettingsStyleHeader: React.FC<SettingsStyleHeaderProps> = ({
  isLoadingComplete,
  displayText,
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  if (!isLoadingComplete) return null;

  return (
    <View
      style={[
        appContainerStyles.settingsHeaderContainer,
        themeStyles.headerContainer,
      ]}
    >
      <TouchableOpacity
        onPress={handleNavigateBack}
        style={appContainerStyles.settingsHeaderLeftContainer}
      >
        <ArrowLeftCircleOutline
          height={30}
          width={30}
          color={themeStyles.footerIcon.color}
        />
      </TouchableOpacity>

      <View style={appContainerStyles.settingsHeaderMiddleContainer}>
        <Text
          numberOfLines={1}
          style={[
            appFontStyles.settingsHeaderText,
            themeStyles.genericText,
            { color: themeStyles.footerIcon.color },
          ]}
        >
          {displayText || ""}
        </Text>
      </View>

      <View style={appContainerStyles.settingsHeaderRightContainer}>
        <GearsTwoBiggerCircleSvg
          width={34}
          height={34}
          color={themeStyles.genericText.color}
        />
      </View>
    </View>
  );
};

export default SettingsStyleHeader;
