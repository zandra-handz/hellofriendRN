import React from "react";
import { View, Text, StyleSheet, TextStyle } from "react-native";

type Props = {
  label?: string;
  primaryColor?: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle?: TextStyle;
  icon?: React.ReactElement;
  buttonPadding?: number;
  children: React.ReactNode;
};

const OptionContainer = ({
  label,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  icon,
  buttonPadding = 4,
  children,
}: Props) => {
  return (
    <View style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}>
      <View style={[styles.inner, { backgroundColor }]}>
        {(!!label || !!icon) && (
          <View style={styles.header}>
            {!!icon && <View style={styles.iconWrap}>{icon}</View>}
            {/* {!!label && (
              <Text
                style={[textStyle, styles.label, { color: primaryColor }]}
                numberOfLines={1}
              >
                {label}
              </Text>
            )} */}
          </View>
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10, 
   
  },
inner: {
  borderRadius: 6,
  paddingVertical: 1,  // same as OptionToggle
  paddingHorizontal: 12, 
  
},
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrap: {
    marginRight: 12,
  },
  label: {
    flexShrink: 1,
  },
});

export default OptionContainer;