import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";
import useAppNavigations from "@/src/hooks/useAppNavigations";

const RestoreButton = ({
  primaryColor,
  darkerOverlayColor,
  preAdded,
}) => {
  const { navigateToPreAdded } = useAppNavigations();

  if (!preAdded?.length) return null;

  return (
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={navigateToPreAdded}>
        <Text
          style={[
            AppFontStyles.subWelcomeText,
            styles.buttonText,
            { color: primaryColor, backgroundColor: darkerOverlayColor },
          ]}
        >
          Restore ({preAdded?.length})
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  button: {
    height: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontWeight: "bold",
  },
});

export default RestoreButton;