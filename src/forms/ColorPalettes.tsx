import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker";
import useUpdateFriendListColors from "@/src/hooks/useUpdateFriendListColors";
import manualGradientColors from "@/app/styles/StaticColors";

interface ColorPalettesProps {
  userId: number;
  friendId: number;
  friendLightColor: string;
  friendDarkColor: string;
  handleSetTheme: (theme: any) => void;
  handleUpdateManualColors: (colors: {
    darkColor: string;
    lightColor: string;
    fontColor: string;
    fontColorSecondary: string;
  }) => Promise<void>;
  onSaveComplete?: () => void;
}

interface ColorPickerResult {
  hex: string;
}
const ColorPalettes: React.FC<ColorPalettesProps> = ({
  userId,
  friendId,
  friendLightColor,
  friendDarkColor,
  handleSetTheme,
  handleUpdateManualColors,
  onSaveComplete,
}) => {
  const { updateFriendListColors } = useUpdateFriendListColors({
    userId,
    setThemeState: handleSetTheme,
  });

  const [darkColor, setDarkColor] = useState(friendDarkColor || "#000000");
  const [lightColor, setLightColor] = useState(friendLightColor || "#FFFFFF");
  const [activeTab, setActiveTab] = useState<"dark" | "light">("dark");

  const handleSwapColors = () => {
    setDarkColor(lightColor);
    setLightColor(darkColor);
  };

  const handleSubmit = async () => {
    try {
      await handleUpdateManualColors({
        darkColor,
        lightColor,
        fontColor: lightColor,
        fontColorSecondary: darkColor,
      });
      updateFriendListColors(friendId, darkColor, lightColor, lightColor, darkColor);
      onSaveComplete?.();
    } catch (e) {
      console.error(e);
    }
  };

  const activeColor = activeTab === "dark" ? darkColor : lightColor;
  const onComplete = (color: ColorPickerResult) => {
    const hex = color.hex.slice(0, 7);
    activeTab === "dark" ? setDarkColor(hex) : setLightColor(hex);
  };

  return (
    <View style={styles.container}>

      {/* Tab switcher */}
      <View style={styles.tabs}>
        {(["dark", "light"] as const).map((tab) => {
          const color = tab === "dark" ? darkColor : lightColor;
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <View style={[styles.tabSwatch, { backgroundColor: color }]} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab === "dark" ? "Dark" : "Light"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Single shared picker — switches based on active tab */}
      <View style={styles.pickerWrapper}>
        <ColorPicker
          key={activeTab} // remount on tab switch so value resets
          style={styles.fullWidth}
          value={activeColor}
          onCompleteJS={onComplete}
        >
          <Panel1 style={styles.panel} />
          <HueSlider style={styles.hue} />
        </ColorPicker>
      </View>

      {/* Preview bar */}
      <View style={styles.preview}>
        <View style={[styles.previewHalf, { backgroundColor: darkColor }]} />
        <View style={[styles.previewHalf, { backgroundColor: lightColor }]} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.swapBtn} onPress={handleSwapColors}>
          <Text style={styles.swapText}>⇄ Swap</Text>
        </Pressable>
        <Pressable style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  fullWidth: { width: "100%" },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  tabActive: {
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  tabSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  tabLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
  },
  tabLabelActive: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Poppins_700Bold",
  },
  pickerWrapper: {
    width: "100%",
    gap: 8,
  },
  panel: {
    borderRadius: 12,
    height: 160,        // much shorter than default
  },
  hue: {
    borderRadius: 12,
    marginTop: 8,
  },
  preview: {
    flexDirection: "row",
    height: 28,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  previewHalf: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  swapBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  swapText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: manualGradientColors.lightColor,
    alignItems: "center",
  },
  saveText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: manualGradientColors.homeDarkColor,
  },
});


export default ColorPalettes;