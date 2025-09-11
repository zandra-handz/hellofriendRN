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
  includeSendButton: boolean;
  onSendPress?: () => void;
};

const EscortBarMoments = ({
  primaryBackground,
  primaryColor,
  onLeftPress,
  onRightPress,
  includeSendButton,
  onSendPress,
  children,
}: Props) => {
  const { navigateBack } = useAppNavigations();
  return (
    <Animated.View
      style={{ flexDirection: "row", width: "100%" }}
      entering={SlideInDown}
      exiting={SlideOutDown}
    >
      <GlobalPressable
        onPress={() => console.log("nada")}
        style={[
          {
            height: 50,
            paddingHorizontal: 10,
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-end",

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
            // justifyContent: "center",

            width: 20,
            //  flexShrink: 1,
            position: "absolute",
            left: 0,
            flexDirection: "row",
            // backgroundColor: 'pink',
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

            //  flexShrink: 1,
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
        {/* <View style={{ width: 40 }}></View> */}
        {includeSendButton && (
          <Pressable
            hitSlop={10}
            style={{
              height: "100%",
              alignItems: "center",
              // justifyContent: "center",

              width: 20,
              //  flexShrink: 1,
              position: "absolute",
              right: 0,
              flexDirection: "row",
            }}
            onPress={onSendPress}
          >
            <MaterialIcons
              name={"keyboard-arrow-right"}
              size={20}
              color={primaryColor}
            />
          </Pressable>
        )}
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBarMoments;
