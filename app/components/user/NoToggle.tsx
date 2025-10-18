import { View, Text, StyleSheet, Pressable, ColorValue } from "react-native";
import React from "react";

interface Props {
  label: string;
  icon: React.ReactElement;
  primaryColor?: ColorValue;

  onPress: () => void;
}

const NoToggle: React.FC<Props> = ({ primaryColor='orange', label, icon, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container]}>
      <View style={styles.row}>
        {icon && (
          <View
            style={styles.iconWrapper}
          >
            {icon}
          </View>
        )}
        <Text style={[styles.label, { color: primaryColor }]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
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

export default NoToggle;
