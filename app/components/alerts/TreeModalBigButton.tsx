import { View, Text, OpaqueColorValue } from "react-native";
import React from "react"; 
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
 

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
  manualGradientColors,
 welcomeTextStyle,
  subWelcomeTextStyle,
  label,
  labelColor,
}: Props) => { 

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
          {/* <MaterialIcons
            name={`keyboard-arrow-left`}
            size={26}
            color={manualGradientColors.homeDarkColor}
          /> */}
          {/* <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.welcomeText,
              {
                fontSize: 20,

                fontFamily: "Poppins-Bold",
                color: manualGradientColors.homeDarkColor,
              },
            ]}
          >
            Close
          </Text> */}

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
