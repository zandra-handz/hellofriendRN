import { View, Text, Pressable } from "react-native";
import React from "react";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  onPress: () => void;
  label: string;
};

const EscortBarMinusWidth = ({
  backgroundColor,
  overlayColor,
  primaryColor,
  navigateBack,
  onPress,
  label = "categories",
}: Props) => {
  return (
    <View
      style={{ height: 50  }}
      // entering={SlideInDown}
      // exiting={SlideOutDown}
    >
      <GlobalPressable
        onPress={onPress}
        style={[
          {
            paddingHorizontal: 0,
            flexDirection: "row",
            width: "100%",
            //height: 50,
            flex: 1,
            // backgroundColor: 'pink',
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 22,
            
            // backgroundColor: "orange",

            //  marginVertical: 10,
          },
        ]}
      >
        <View
          style={{
            width: "auto",
            left: 0, // should match padding on right
            position: "absolute",
            //    bottom: 0,
            //  top: 0,
            flex: 1,
            height: "100%", 

           // height: 50,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 50000,
          }}
        >
          <Pressable
            hitSlop={10}
            style={{
              borderRadius: 999,
              padding: 4,
              backgroundColor: overlayColor,
              alignItems: "center",
              justifyContent: "center",
            }}
            //   onPress={navigateBack}
            onPress={navigateBack}
          >
            <SvgIcon name={"chevron_left"} size={20} color={primaryColor} />
          </Pressable>
        </View>

        <View
          style={{
            position: "absolute",
            // top: 0,
            // bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 999,
            backgroundColor: backgroundColor,
            height: '100%',

            zIndex: 0,
            marginLeft: 106,
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: 0,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            padding: 0,
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <SvgIcon
              name={"chevron_up"}
              size={16}
              //  color={homeDarkColor}
              color={primaryColor}
              style={{
                position: "absolute",
                bottom: 17,
              }}
            />
            <Text
              style={[
                AppFontStyles.subWelcomeText,
                { color: primaryColor, fontSize: 13 },
              ]}
            >
              {label}
            </Text>
          </View>
        </View>
      </GlobalPressable>
    </View>
  );
};

export default EscortBarMinusWidth;
