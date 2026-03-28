import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useUser from "@/src/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import GeckoChart from "../helloes/GeckoChart"; 
import useUserGeckoConfigs from "@/src/hooks/useUserGeckoConfigs"; 
import useUpdateGeckoConfigs from "@/src/hooks/GeckoCalls/useUpdateGeckoConfigs";
import OptionChoiceEdit from "@/app/components/headers/OptionChoiceEdit";

// ─── Map gecko section ids to backend field names ───────────────
const SECTION_CONFIG_MAP = {
  head: {
    label: "Memory",
    color: "#4ECDC4",
    valueField: "memory_type",
    labelField: "memory_type_label",
    choicesField: "memory_types",
  },
  feet: {
    label: "Active Hours",
    color: "#FF6B6B",
    valueField: "active_hours_type",
    labelField: "active_hours_type_label",
    choicesField: "active_hours_types",
  },
  body: {
    label: "Story",
    color: "#45B7D1",
    valueField: "story_type",
    labelField: "story_type_label",
    choicesField: "story_types",
  },
  tail: {
    label: "Personality",
    color: "#F7DC6F",
    valueField: "personality_type",
    labelField: "personality_type_label",
    choicesField: "personality_types",
  },
};

type Props = {};

const ScreenGeckoManage = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { geckoConfigs } = useUserGeckoConfigs({ userId: user?.id });
  const { updateGeckoConfigs } = useUpdateGeckoConfigs({ userId: user?.id });

  const [viewCategoryId, setViewCategoryId] = useState<string | null>(null);

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  // Build sections array for the gecko chart
  const geckoSections = useMemo(
    () =>
      Object.entries(SECTION_CONFIG_MAP).map(([id, config]) => ({
        id,
        label: config.label,
        color: config.color,
      })),
    [],
  );

  const handleUpDrillCategoryId = useCallback((categoryId: string | null) => {
    setViewCategoryId(categoryId ?? null);
  }, []);

  // Get the config for the currently selected section
  const activeConfig = viewCategoryId
    ? SECTION_CONFIG_MAP[viewCategoryId]
    : null;

  // Current value for the selected section
  const currentValue = activeConfig && geckoConfigs
    ? geckoConfigs[activeConfig.valueField]
    : null;

  // Available choices for the selected section
  const currentChoices = useMemo(() => {
    if (!activeConfig || !geckoConfigs?.available_choices) return [];
    const raw = geckoConfigs.available_choices[activeConfig.choicesField];
    if (!Array.isArray(raw)) return [];
    // Backend gives { value, label } — OptionEditChoice expects { id, label }
    return raw.map((c: { value: number; label: string }) => ({
      id: c.value,
      label: c.label,
    }));
  }, [activeConfig, geckoConfigs]);

  const handleChoiceChange = useCallback(
    (newValue: number | string) => {
      if (!activeConfig) return;
      updateGeckoConfigs({ [activeConfig.valueField]: newValue });
    },
    [activeConfig, updateGeckoConfigs],
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
    >
      <TextHeader
        label="Your Gecko"
        color={textColor}
        fontStyle={welcomeTextStyle}
        showNext={false}
        nextEnabled={false}
      />

      <View style={styles.outerWrapper}>
        <GeckoChart
          sections={geckoSections}
          upDrillCategoryId={handleUpDrillCategoryId}
          radius={110}
          darkerOverlayBackgroundColor={lightDarkTheme.darkerGlassBackground}
          primaryColor={textColor}
        />

        {viewCategoryId && activeConfig && geckoConfigs && (
          <Animated.View
            entering={SlideInDown.duration(200)}
            exiting={SlideOutDown.duration(200)}
            style={styles.detailPanel}
          >
            <OptionChoiceEdit
              label={activeConfig.label}
              value={currentValue}
              choices={currentChoices}
              onValueChange={handleChoiceChange}
              onConfirm={() => {}}
              primaryColor={textColor}
              backgroundColor={lightDarkTheme.primaryBackground}
              buttonColor={lightDarkTheme.darkerGlassBackground}
              textStyle={subWelcomeTextStyle}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 0,
  },
  outerWrapper: {
    width: "100%",
    flex: 1,
    paddingBottom: 30,
  },
  detailPanel: {
    paddingTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
});

export default ScreenGeckoManage;