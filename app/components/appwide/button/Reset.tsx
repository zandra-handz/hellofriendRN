import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ButtonResetHelloes from "../../buttons/helloes/ButtonResetHelloes";
interface Props {
  userId: number;
  label: string;
  icon: React.ReactElement;
  value: boolean;
  onPress: () => void;
}

const Reset: React.FC<Props> = ({
  userId,
  label,
  icon,
  primaryColor = "orange",
  manualGradientColors,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {icon && (
          <View
            style={{
              width: 40,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "start",
            }}
          >
            {icon}
          </View>
        )}
        <Text style={[styles.label, { color: primaryColor }]}>{label}</Text>
      </View>
      <ButtonResetHelloes
        userId={userId} 
        manualGradientColors={manualGradientColors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    paddingTop: 2,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  customButton: {
    marginLeft: 6,
    borderRadius: 15,
    backgroundColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  altButton: {
    borderRadius: 15,
    paddingVertical: 4,
    alignContent: "center",
    paddingHorizontal: 10,
  },
});

export default Reset;
