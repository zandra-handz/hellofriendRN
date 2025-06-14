import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface OverlayLargeButtonProps {
  label: string;
  onPress: () => void;
  buttonOnBottom: boolean;
}

const OverlayLargeButton: React.FC<OverlayLargeButtonProps> = ({
  label,
  onPress,
  buttonOnBottom = false,
}) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const iconSize = 30; 

  return (
    <TouchableOpacity
      style={[
        themeStyles.overlayBackgroundColor,
        {
          marginVertical: 2,
          padding: 20,
          width: "100%",
          height: "auto",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          textAlign: "center",
          flexWrap: "wrap",
        },
      ]}
      onPress={!buttonOnBottom ? onPress : () => {}}
      disabled={buttonOnBottom}
    >
      <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}>
        {label}
      </Text>
      {buttonOnBottom && (
        <TouchableOpacity onPress={onPress} style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
            <MaterialCommunityIcons
            //name={"menu-swap"}
            name={"swap-horizontal-circle"}
            size={iconSize}
            color={themeStyles.primaryText.color}
            

            />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default OverlayLargeButton;
