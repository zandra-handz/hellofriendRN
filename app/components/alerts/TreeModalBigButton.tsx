import { View, Text, StyleSheet, OpaqueColorValue } from "react-native";
import React from "react";
import { ThemeAheadOfLoading } from "@/src/types/FriendTypes"; 
import SvgIcon from "@/app/styles/SvgIcons";
import manualGradientColors from "@/app/styles/StaticColors";
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
  const flattenedLabelStyle = StyleSheet.flatten([
    styles.labelText,
    { color: labelColor },
  ]);
  const flattenedSubLabelStyle = StyleSheet.flatten([
    styles.subLabelText,
    { color: manualGradientColors.darkHomeColor },
  ]);

  return (
    <GlobalPressable
      onPress={onClose != undefined ? onClose : undefined}
      style={styles.container}
    >
      {onClose != undefined && (
        <View style={styles.rightsideContainer}>
          {/* <View style={{ height: "100%" }}></View> */}

          <View style={{}}>
            {rightSideElement != undefined && rightSideElement}
          </View>
        </View>
      )}
      <View style={styles.labelContainer}>
        <Text style={flattenedLabelStyle}>{label}</Text>
        <Text style={flattenedSubLabelStyle}>Close</Text>
        <SvgIcon
          name={`chevron_down`}
          size={17}
          color={labelColor}
        />
      </View>
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  rightsideContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },
  labelText: {
    fontSize: 20,
    lineHeight: 34,
    fontFamily: "Poppins-Bold",
  },
  subLabelText: { lineHeight: 12, fontFamily: "Poppins-Bold", fontSize: 11 },
});

export default TreeModalBigButton;
