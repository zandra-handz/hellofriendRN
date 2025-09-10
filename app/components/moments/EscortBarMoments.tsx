import { View, Pressable } from "react-native";
import React, { ReactElement } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import GlobalPressable from "../appwide/button/GlobalPressable";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  categoryColorsMap: object;
  primaryColor: string;
  primaryBackground: string;
  children: ReactElement;
  onLeftPress: () => void;
  onRightPress: () => void;
};

const EscortBarMoments = ({
  primaryBackground,
  primaryColor,
  onLeftPress,
  onRightPress,
  children,
}: Props) => {
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
            backgroundColor: primaryBackground,

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
            color={primaryColor}
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
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }} 
            onPress={onLeftPress}
          >
            <MaterialIcons
              name={"keyboard-double-arrow-left"}
              size={20}
              style={{ opacity: 0.6 }}
              color={primaryColor}
            />
          </Pressable>
          {children}
          <Pressable
            hitSlop={20}
            style={{
              marginHorizontal: 10,
              marginLeft: 6,  
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
              color={primaryColor}
            />
          </Pressable>
        </View>
        <View style={{ width: 40 }}></View>

      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBarMoments;
