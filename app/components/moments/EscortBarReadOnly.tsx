import { View, Text, Pressable } from "react-native";
import React, { ReactElement } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import GlobalPressable from "../appwide/button/GlobalPressable";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

type Props = {
  categoryColorsMap: object;
  children: ReactElement;
  onLeftPress: () => void;
  onRightPress: () => void;
};

const EscortBarReadOnly = ({
  categoryColorsMap,
  onLeftPress,
  onRightPress,
  children,
}: Props) => {
  const { themeStyles } = useGlobalStyle();
  const { navigateBack } = useAppNavigations();
  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
      <GlobalPressable
        onPress={() => console.log("nada")}
        style={[
          {
            height: 50,
            paddingHorizontal: 10,
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10,
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
          },
        ]}
      >
        <Pressable
          hitSlop={10}
          style={{
            height: "100%",
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

        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            width: "auto",
            flexShrink: 1,
          }}
        >
          <Pressable
            hitSlop={20}
            style={{
              marginHorizontal: 10,
              marginRight: 14, // eyeballing/instance of needing a weird customization
              //backgroundColor: themeStyles.lighterOverlayBackgroundColor.backgroundColor,
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
            //   onPress={navigateBack}
            onPress={onLeftPress}
          >
            <MaterialIcons
              name={"keyboard-double-arrow-left"}
              size={20}
              style={{ opacity: 0.6 }}
              color={themeStyles.primaryText.color}
            />
          </Pressable>
          {children}
          <Pressable
            hitSlop={20}
            style={{
              marginHorizontal: 10,
              marginLeft: 6, // eyeballing/instance of needing a weird customization
              //backgroundColor: themeStyles.lighterOverlayBackgroundColor.backgroundColor,
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
            onPress={onRightPress}
          >
            <MaterialIcons
              name={"keyboard-double-arrow-right"}
              size={20}
              style={{ opacity: 0.6 }}
              color={themeStyles.primaryText.color}
            />
          </Pressable>
        </View>
        <View style={{ width: 40 }}></View>
        {/* <Pressable
          hitSlop={10}
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onRightPress}

        >
          <MaterialIcons
            name={"keyboard-arrow-right"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        </Pressable> */}
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBarReadOnly;
