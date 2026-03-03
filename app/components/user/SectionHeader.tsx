// SectionHeader.tsx
import { View, Text, StyleSheet } from "react-native";
import manualGradientColors from "@/app/styles/StaticColors";
import { useLDTheme } from "@/src/context/LDThemeContext";

const SectionHeader = ({ label }: { label: string }) => {
  const { theme } = useLDTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? manualGradientColors.lightColor : manualGradientColors.darkColor;
  const lineColor = isDark ? "rgba(160,241,67,0.15)" : "rgba(76,175,80,0.3)";

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 4,
    paddingHorizontal: 4,
    gap: 10,
  },
  text: {
    fontSize: 10,
    fontFamily: "Poppins_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  line: {
    flex: 1,
    height: 1,
  },
});

export default SectionHeader;