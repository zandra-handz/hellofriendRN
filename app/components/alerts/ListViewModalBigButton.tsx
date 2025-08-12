import { View, Text, OpaqueColorValue } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
// ((
//   FOR REFERENCE interface ThemeAheadOfLoading {
//   darkColor: Friend["theme_color_dark"];
//   lightColor: Friend["theme_color_light"];
//   fontColor: Friend["theme_color_font"];
//   fontColorSecondary: Friend["theme_color_font_secondary"];
// }
// ))

// only friends setting uses theme, so passing it in is optional so only friend settings will be
// in friendlist rerender tree

import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  onClose: () => void; 
  // height: number;
  label: string;
  rightSideElement?: React.ReactElement;
  labelColor: OpaqueColorValue;
};

const ListViewModalBigButton = ({
  onClose,
 
  rightSideElement,
  // height,
  label,
  labelColor,
}: Props) => {
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();

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
          <View style={{ height: "100%" }}>


          </View>


       

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
        {/* <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.welcomeText,
            {
              fontSize: 20,

              fontFamily: "Poppins-Bold",
              color: labelColor,
            },
          ]}
        >
          {label}
        </Text> */}
        <Text style={[ appFontStyles.subWelcomeText, {lineHeight: 12, fontFamily: 'Poppins-Bold', color: manualGradientColors.darkHomeColor, fontSize: 11}]}>Close</Text>
        <MaterialIcons
          name={`keyboard-arrow-down`}
          size={17}
          color={labelColor}
        />
      </View>
    </GlobalPressable>
  );
};

export default ListViewModalBigButton;
