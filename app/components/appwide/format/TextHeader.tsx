import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { StyleProps } from "react-native-reanimated";

import BackButton from "../../buttons/BackButton";
import NextButton from "../../buttons/NextButton";

type Props = {
  label: string;
  color: string;
  fontStyle: StyleProps;
  fontSize?: number;
  showBack?: boolean;
  showNext?: boolean;
  nextEnabled?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  timing?: number;
};

const TextHeader = ({
  label = `Header Label`,
  color,
  fontStyle,
  fontSize = 26,
  showBack = true,
  showNext = false,
  nextEnabled = true,
  onBack = () => {},
  onNext = () => {},
  nextColor='darkgreen',
  nextDisabledColor='black',
  nextBackgroundColor='limegreen',
  nextDisabledBackgroundColor='gray',
  nextIconName='check',
  nextDisabledIconName='check',
  timing = 200,
  zIndex = 1
}: Props) => {
  return (
    <View style={[styles.wrapper, {zIndex: zIndex}]}>
      <View style={styles.leftSideWrapper}>
        <BackButton
          label="Back"
          color={color}
          fontStyle={fontStyle}
          timing={timing}
          visible={showBack}
          iconSize={22}
          onPress={onBack}
        />
        <Text
          style={[
            fontStyle,
            { color: color, fontSize: fontSize, paddingLeft: 16 },
          ]}
        >
          {label}
        </Text>
      </View>
      {showNext && (
        <NextButton 
          color={nextColor} 
          disabledColor={nextDisabledColor}
          backgroundColor={nextBackgroundColor}
          disabledBackgroundColor={nextDisabledBackgroundColor}
          timing={timing}
          visible={showBack}
          iconSize={22}
          enabled={nextEnabled}
          onPress={onNext}
          iconName={nextIconName}
          disabledIconName={nextDisabledIconName}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 20,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    // backgroundColor: "blue",
  },
  leftSideWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default TextHeader;
