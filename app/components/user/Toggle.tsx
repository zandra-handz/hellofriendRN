import { View, Text, StyleSheet, ColorValue } from "react-native";
import React from "react";
import ToggleButton from "../appwide/button/ToggleButton";

interface Props {
  label: string;
  icon: React.ReactElement;
  value: boolean;
  onPress: () => void;
  primaryColor: string;
}

const Toggle: React.FC<Props> = ({
  label,
  icon,
  value,
  primaryColor='orange',
  backgroundColor='red',

  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        {icon && (
          <View
            style={styles.iconWrapper}
          >
            {icon}
          </View>
        )}
        <Text style={[styles.label, { color: primaryColor }]}>{label}</Text>
      </View>
      <ToggleButton textColor={primaryColor} backgroundColor={backgroundColor} value={value} onToggle={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    alignItems: "center",
  },

  iconWrapper: {
    width: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Toggle;
