import { View, Text, Pressable, StyleSheet } from "react-native";
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
    <View style={{ height: 50 }}>
      <GlobalPressable onPress={onPress} style={styles.container}>
        <View style={styles.innerContainer}>
          <Pressable
            hitSlop={10}
            style={[
              styles.pressableContainer,
              {
                backgroundColor: overlayColor,
              },
            ]}
            onPress={navigateBack}
          >
            <SvgIcon name={"chevron_left"} size={20} color={primaryColor} />
          </Pressable>
        </View>

        <View
          style={[
            styles.heightView,
            {
              backgroundColor: backgroundColor,
            },
          ]}
        ></View>
        <View style={styles.innerInnerContainer}>
          <View style={styles.chevronUpWrapper}>
            <SvgIcon
              name={"chevron_up"}
              size={16}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  innerContainer: {
    width: "auto",
    left: 0, // should match padding on right
    position: "absolute",
    flex: 1,
    height: "100%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    zIndex: 50000,
  },
  pressableContainer: {
    borderRadius: 999,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  heightView: {
    position: "absolute",
    left: 0,
    right: 0,
    borderRadius: 999,
    height: "100%",
    zIndex: 0,
    marginLeft: 106,
  },
  innerInnerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 0,
  },
  chevronUpWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default EscortBarMinusWidth;
