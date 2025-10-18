import { View, Text, StyleSheet, ColorValue } from "react-native";
import React from "react";
import ButtonResetHelloes from "../../buttons/helloes/ButtonResetHelloes";
 
interface Props {
  userId: number;
  label: string;
  icon: React.ReactElement;
  primaryColor: ColorValue;
}

const Reset: React.FC<Props> = ({
  userId,
  label,
  icon,
  primaryColor = "orange",
}) => {
  return (
    <View style={styles.container}>
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
      <ButtonResetHelloes
        userId={userId} 
      />
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

export default Reset;
