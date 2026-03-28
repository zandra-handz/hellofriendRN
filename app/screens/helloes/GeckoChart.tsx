import { StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { View } from "react-native";
import InteractiveGeckoSections from "./GeckoSections";

type GeckoSection = {
  id: string;    // must be one of: "head" | "feet" | "body" | "tail"
  label: string;
  color: string;
};

type Props = {
  sections: GeckoSection[];
  radius?: number;
  upDrillCategoryId: (id: string | null) => void;
  darkerOverlayBackgroundColor: string;
  primaryColor: string;
  geckoColor?: string;
};

const GeckoChart = ({
  sections,
  upDrillCategoryId,
  radius = 80,
  darkerOverlayBackgroundColor,
  primaryColor,
  geckoColor,
}: Props) => {
  const handleSectionPress = useCallback(
    (sectionId: string | null) => {
      upDrillCategoryId(sectionId);
    },
    [upDrillCategoryId],
  );

  return (
    <View style={styles.wrapper}>
      <InteractiveGeckoSections
        width={radius * 2}
        sections={sections}
        primaryColor={primaryColor}
        geckoColor={geckoColor}
        overlayBackgroundColor={darkerOverlayBackgroundColor}
        dimmedOpacity={0.2}
        onSectionPress={handleSectionPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexShrink: 1,
    width: "100%",
    alignItems: "center",
  },
});

export default GeckoChart;