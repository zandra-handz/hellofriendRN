import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useCallback } from "react";
import manualGradientColors  from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
type Props = {
  primaryColor: string;
  selected: any;
  onChange: (index: number) => void;
};

const iconNames = ["message-reply-text", "coffee", "party-popper", "comment"];

const labels = ["digital", "in person", "surprise", "N/A"];

const PickHelloType = ({ primaryColor, selected, onChange }: Props) => {
  const renderButtonStyle = useCallback(
    (indexNumber: number) => {
      const isSelected = selected === indexNumber;
      return (
        <Pressable
          onPress={() => onChange(indexNumber)}
          style={{
            backgroundColor: isSelected
              ? manualGradientColors.lightColor
              : "transparent",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
        flexShrink: 1,
            width: "100%",
          }}
        >
          <MaterialCommunityIcons
            name={iconNames[indexNumber]}
            size={20}
            color={
              isSelected ? manualGradientColors.homeDarkColor : primaryColor
            }
          />
          <Text
            style={{
              color: isSelected
                ? manualGradientColors.homeDarkColor
                : primaryColor,
            }}
          >
            {labels[indexNumber]}
          </Text>
        </Pressable>
      );
    },
    [selected, primaryColor, onChange]  
  );
  return (
    <View style={[styles.container]}>
  
      <View style={{flexDirection: 'row', height: '100%', width: '100%'}}>
        <View style={[styles.divider]} />
        <>
          <View style={styles.section}>{renderButtonStyle(0)}</View>
        </>
        <View style={[styles.divider]} />
        <>
          <View style={styles.section}>
            <View style={styles.section}>{renderButtonStyle(1)}</View>
          </View>
        </>
        <View style={[styles.divider]} />
        <>
          <View style={styles.section}>
            <View style={styles.section}>{renderButtonStyle(2)}</View>
          </View>
        </>
        <View style={[styles.divider]} />
        <>
          <View style={styles.section}>
            <View style={styles.section}>{renderButtonStyle(3)}</View>
          </View>
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100, 
 
    flexDirection: "column",
  },
  section: {
    flex: 1,
    width: "100%",

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { 
  },
});
export default PickHelloType;
