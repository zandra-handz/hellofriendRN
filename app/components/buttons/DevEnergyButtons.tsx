import { View, Pressable, Text, StyleSheet } from "react-native";
import React from "react";
import useDevResetEnergy from "@/src/hooks/useDevResetEnergy";
import useDevDepleteEnergy from "@/src/hooks/useDevDepleteEnergy";

type Props = {
  primaryColor?: string;
};

const DevEnergyButtons = ({ primaryColor = "orange" }: Props) => {
  const { handleDevResetEnergy, devResetEnergyMutation } = useDevResetEnergy();
  const { handleDevDepleteEnergy, devDepleteEnergyMutation } = useDevDepleteEnergy();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: primaryColor }]}>Dev Tools</Text>
      <View style={styles.row}>
        <Pressable
          onPress={handleDevResetEnergy}
          disabled={devResetEnergyMutation.isPending}
          style={[
            styles.button,
            { borderColor: primaryColor },
            devResetEnergyMutation.isPending && styles.buttonDisabled,
          ]}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>
            {devResetEnergyMutation.isPending ? "Resetting..." : "Reset Energy"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleDevDepleteEnergy}
          disabled={devDepleteEnergyMutation.isPending}
          style={[
            styles.button,
            { borderColor: primaryColor },
            devDepleteEnergyMutation.isPending && styles.buttonDisabled,
          ]}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>
            {devDepleteEnergyMutation.isPending ? "Depleting..." : "Deplete Energy"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    zIndex: 1000,
    // backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.6,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default DevEnergyButtons;
