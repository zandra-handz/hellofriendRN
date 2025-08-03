import { View, Pressable, Text } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import ToNextButton from "@/app/components/moments/ToNextButton";
import ActionAndBack from "@/app/components/moments/ActionAndBack";

type Props = {
  onPress: () => void;
  onPressLabel: string;
  onExpandPress: () => void;
  marginTop: number;
  forwardFlowOn: boolean;
  label: string;
};

const TopBarLikeMinusWidth = ({
  forwardFlowOn = true,
  onPress,
  onPressLabel='Save',
  onExpandPress,
 marginTop = 6,
  label = "categories",
  
}: Props) => {
  const { themeStyles, manualGradientColors, appFontStyles } = useGlobalStyle();
  const { navigateBack } = useAppNavigations();
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View //could make whole bar a pressable instead
        style={[
          themeStyles.primaryBackground,
          {
            height: 50,
            paddingHorizontal: 10,
            flexDirection: "row", 

            // paddingTop: paddingTop,
            // paddingBottom: paddingBottom,
            alignItems: "center",
            justifyContent: "center",
            // justifyContent: "space-between",
            borderRadius: 10,
            // marginVertical: 10,
            marginTop: marginTop,
      
          },
        ]}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
          //  backgroundColor: "red",
            height: "100%",
          }}
        >
          <Pressable
            onPress={onExpandPress}
            style={{
              alignItems: "center",
              position: "absolute",
              width: "100%",
             // backgroundColor: "orange",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name={"keyboard-arrow-up"}
              size={16}
            //   color={manualGradientColors.homeDarkColor}
              // color={themeStyles.primaryText.color}
              color={'transparent'}
              style={{
                position: "absolute",
                bottom: 17,
              }}
            />
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.subWelcomeText,
                { fontSize: 13 },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: '100%', 
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            hitSlop={10}
            style={{
              borderRadius: 999,
              padding: 4,
              //backgroundColor:
               // themeStyles.overlayBackgroundColor.backgroundColor,
              alignItems: "center",
              justifyContent: "center",
            }}
            //   onPress={navigateBack}
            onPress={navigateBack}
          >
            <MaterialIcons
              name={"keyboard-arrow-left"}
              size={20}
              color={themeStyles.primaryText.color}
            />
          </Pressable>

          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.subWelcomeText,
                { fontSize: 13, marginRight: 12 },
              ]}
            >
              {onPressLabel}
            </Text>
            {forwardFlowOn && <ToNextButton onPress={onPress} />}
            {!forwardFlowOn && <ActionAndBack onPress={onPress} />}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TopBarLikeMinusWidth;
