import { View, Text, StyleSheet, OpaqueColorValue } from "react-native";
import React from "react";
import manualGradientColors from "@/app/styles/StaticColors";
 import SvgIcon from "@/app/styles/SvgIcons";

// only friends setting uses theme, so passing it in is optional so only friend settings will be
// in friendlist rerender tree

import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  rightSideElement?: React.ReactElement;
  labelColor: OpaqueColorValue;
  onClose: () => void;
};

const ListViewModalBigButton = ({
  rightSideElement,
  labelColor,
  onClose,
}: Props) => {
  const flattenedCloseLabelStyle = StyleSheet.flatten([
    styles.closeLabelContainer,
    {
      color: manualGradientColors.darkHomeColor,
    },
  ]);

  return (
    <GlobalPressable
      onPress={onClose != undefined ? onClose : undefined}
      style={styles.container}
    >
      {onClose != undefined && (
        <View style={styles.rightsideElementContainer}>
          {/* <View style={{ height: "100%" }}></View> */}
          <View style={{}}>
            {rightSideElement != undefined && rightSideElement}
          </View>
        </View>
      )}
      <View style={styles.closeLabelContainer}>
        <Text style={flattenedCloseLabelStyle}>Close</Text>
        <SvgIcon name={`chevron_down`} size={17} color={labelColor} />
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
  rightsideElementContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  closeLabelContainer: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },
  closeLabel: {
    lineHeight: 12,
    fontFamily: "Poppins-Bold",
    fontSize: 11,
  },
});

export default ListViewModalBigButton;
