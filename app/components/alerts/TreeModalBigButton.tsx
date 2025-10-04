import { View, Text, OpaqueColorValue } from "react-native";
import React from "react"; 
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";
import { MaterialIcons } from "@expo/vector-icons";
 
import manualGradientColors from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  onClose: () => void;
  friendTheme?: ThemeAheadOfLoading;
  label: string;
  rightSideElement?: React.ReactElement;
  labelColor: OpaqueColorValue;
};

const TreeModalBigButton = ({
  onClose, 
  rightSideElement,
  label,
  labelColor,
}: Props) => { 

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  return (
    <GlobalPressable
      onPress={onClose != undefined ? onClose : undefined}
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        overflow: "hidden",
      }}
    >
      {onClose != undefined && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ height: "100%" }}></View>
 

          <View style={{  }}>
            {rightSideElement != undefined && rightSideElement}
          </View>
        </View>
      )}
      <View
        style={{
          position: "absolute",
          // backgroundColor: "pink",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={[ 
            welcomeTextStyle,
            {
              // color: primaryColor,
              fontSize: 20,

              fontFamily: "Poppins-Bold",
              color: labelColor,
            },
          ]}
        >
          {label}
        </Text>
        <Text style={[ subWelcomeTextStyle, {lineHeight: 12, fontFamily: 'Poppins-Bold', color: manualGradientColors.darkHomeColor, fontSize: 11}]}>Close</Text>
        <MaterialIcons
          name={`keyboard-arrow-down`}
          size={17}
          color={labelColor}
        />
      </View>
    </GlobalPressable>
  );
};

export default TreeModalBigButton;
