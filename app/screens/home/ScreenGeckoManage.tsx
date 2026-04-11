import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useUser from "@/src/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { AppFontStyles } from "@/app/styles/AppFonts";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import GeckoChart from "../helloes/GeckoChart"; 
import useUserGeckoConfigs from "@/src/hooks/GeckoCalls/useUserGeckoConfigs"; 
import useUpdateGeckoConfigs from "@/src/hooks/GeckoCalls/useUpdateGeckoConfigs";
import OptionChoiceEdit from "@/app/components/headers/OptionChoiceEdit";
import HoursSelector from "./HoursSelector";
import GeckoEnergyLogList from "@/app/components/helloes/GeckoEnergyLogList";
import GeckoSyncLogList from "@/app/components/helloes/GeckoSyncLogList";
import GeckoSyncLogChartStack from "@/app/components/helloes/GeckoSyncLogChartStack";
import useUserGeckoSyncLog from "@/src/hooks/GeckoCalls/useUserGeckoSyncLog";
import useUserGeckoEnergyLog from "@/src/hooks/GeckoCalls/useUserGeckoEnergyLog";
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
  const {
    userGeckoEnergyLogFlattened,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUserGeckoEnergyLog({ fetchAll: false });

  const [viewCategoryId, setViewCategoryId] = useState<string | null>(null);
  const [syncLogView, setSyncLogView] = useState<"list" | "chart">("chart");
  const [syncRange, setSyncRange] = useState<"24h" | "7d" | "30d" | "all">(
    "24h",
  );

  const sinceISO = useMemo(() => {
    if (syncRange === "all") return undefined;
    const now = Date.now();
    const hours =
      syncRange === "24h" ? 24 : syncRange === "7d" ? 24 * 7 : 24 * 30;
    return new Date(now - hours * 60 * 60 * 1000).toISOString();
  }, [syncRange]);

  const {
    userGeckoSyncLogFlattened,
    isFetchingNextPage: syncLogIsFetchingNextPage,
    fetchNextPage: fetchNextSyncLogPage,
    hasNextPage: hasNextSyncLogPage,
  } = useUserGeckoSyncLog({ fetchAll: syncLogView === "chart", since: sinceISO });

  const { updateGeckoConfigs } = useUpdateGeckoConfigs({ userId: user?.id });

  // useEffect(() => {
  //   if (viewCategoryId){
  //     console.log(viewCategoryId)
  //     console.log(currentValue)
  //     console.log(geckoConfigs?.thresholds)
  //   }

  // },[viewCategoryId, geckoConfigs]);

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

  const THRESHOLDS = geckoConfigs ? geckoConfigs?.thresholds : null;

  const activeHours = geckoConfigs ? geckoConfigs?.active_hours : [];




  // useEffect(() => {
  //   if (activeHours){
  //     console.log(`gecko active hours`,geckoConfigs?.active_hours) 
  //   }

  // }, [geckoConfigs]);

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

    const handleActiveHours = useCallback(
    (hours: number[], newHourType: number) => {
      if (!activeConfig) return;
      updateGeckoConfigs({
        active_hours: hours,
        active_hours_type: newHourType,
      });
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
            {viewCategoryId === "feet" && (
              <HoursSelector
                key={`${currentValue}-${(geckoConfigs?.active_hours ?? []).join(",")}`}
                hourType={currentValue}
                activeHours={geckoConfigs?.active_hours ?? []}
                maxHours={geckoConfigs?.thresholds?.max_active_hours}
                onSave={handleActiveHours}
                primaryColor={textColor}
                backgroundColor={lightDarkTheme.primaryBackground}
                buttonColor={lightDarkTheme.darkerGlassBackground}
                textStyle={subWelcomeTextStyle}
              />
            )}
          </Animated.View>
        )}
{/* 
        <GeckoEnergyLogList
          userId={user?.id}
          listData={userGeckoEnergyLogFlattened}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          primaryColor={textColor}
        /> */}

        <View style={styles.syncToggleRow}>
          <Pressable
            onPress={() => setSyncLogView("list")}
            style={[
              styles.syncToggleBtn,
              {
                borderColor: textColor,
                backgroundColor:
                  syncLogView === "list" ? textColor : "transparent",
              },
            ]}
          >
            <Text
              style={[
                styles.syncToggleText,
                {
                  color:
                    syncLogView === "list"
                      ? lightDarkTheme.primaryBackground
                      : textColor,
                },
              ]}
            >
              list
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSyncLogView("chart")}
            style={[
              styles.syncToggleBtn,
              {
                borderColor: textColor,
                backgroundColor:
                  syncLogView === "chart" ? textColor : "transparent",
              },
            ]}
          >
            <Text
              style={[
                styles.syncToggleText,
                {
                  color:
                    syncLogView === "chart"
                      ? lightDarkTheme.primaryBackground
                      : textColor,
                },
              ]}
            >
              chart
            </Text>
          </Pressable>
        </View>

        <View style={styles.syncToggleRow}>
          {(["24h", "7d", "30d", "all"] as const).map((r) => {
            const active = syncRange === r;
            return (
              <Pressable
                key={r}
                onPress={() => setSyncRange(r)}
                style={[
                  styles.syncToggleBtn,
                  {
                    borderColor: textColor,
                    backgroundColor: active ? textColor : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.syncToggleText,
                    {
                      color: active
                        ? lightDarkTheme.primaryBackground
                        : textColor,
                    },
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {syncLogView === "list" ? (
          <GeckoSyncLogList
            userId={user?.id}
            listData={userGeckoSyncLogFlattened}
            isFetchingNextPage={syncLogIsFetchingNextPage}
            fetchNextPage={fetchNextSyncLogPage}
            hasNextPage={hasNextSyncLogPage}
            primaryColor={textColor}
          />
        ) : (
          <ScrollView
            style={styles.chartScroll}
            contentContainerStyle={styles.chartScrollContent}
            showsVerticalScrollIndicator={false}
          >
          <GeckoSyncLogChartStack
            listData={userGeckoSyncLogFlattened}
            primaryColor={textColor}
            charts={[
              {
                key: "energy",
                title: "energy",
                series: [
                  {
                    key: "client_energy",
                    label: "client_energy",
                    color: "#4FC3F7",
                    accessor: (e) => e.client_energy,
                  },
                  {
                    key: "server_energy_after",
                    label: "server_energy_after",
                    color: "#FF8A65",
                    accessor: (e) => e.server_energy_after,
                  },
                ],
              },
              {
                kind: "strip",
                key: "variance_strip",
                title: "client divergence (vs server truth)",
                height: 60,
                accessor: (e) =>
                  e.client_energy != null && e.server_energy_after != null
                    ? e.client_energy - e.server_energy_after
                    : null,
              },
              {
                key: "energy_variance",
                title: "client divergence (client − server)",
                series: [
                  {
                    key: "energy_variance",
                    label: "+ ahead / − behind",
                    color: "#BA68C8",
                    accessor: (e) =>
                      e.client_energy != null && e.server_energy_after != null
                        ? e.client_energy - e.server_energy_after
                        : null,
                  },
                ],
              },
              {
                key: "surplus",
                title: "surplus energy",
                yMin: -1,
                yMax: 2,
                series: [
                  {
                    key: "server_surplus_after",
                    label: "server",
                    color: "#FF8A65",
                    accessor: (e) => e.server_surplus_after,
                  },
                  {
                    key: "client_surplus",
                    label: "client",
                    color: "#4FC3F7",
                    accessor: (e) => e.client_surplus,
                  },
                ],
              },
              {
                key: "recharge",
                title: "recharge",
                series: [
                  {
                    key: "server_recharge",
                    label: "server",
                    color: "#FF8A65",
                    accessor: (e) => e.recompute_recharge,
                  },
                  {
                    key: "client_recharge",
                    label: "client",
                    color: "#4FC3F7",
                    accessor: (e) => e.client_recharge,
                  },
                ],
              },
              {
                key: "fatigue",
                title: "fatigue",
                series: [
                  {
                    key: "server_fatigue",
                    label: "server",
                    color: "#FF8A65",
                    accessor: (e) => e.recompute_fatigue,
                  },
                  {
                    key: "client_fatigue",
                    label: "client",
                    color: "#4FC3F7",
                    accessor: (e) => e.client_fatigue,
                  },
                ],
              },
              {
                kind: "strip",
                key: "start_time_gap_strip",
                title: "client_started_on − server_updated_at_before (sec)",
                height: 60,
                redThreshold: 2,
                accessor: (e) => {
                  if (!e.client_started_on || !e.server_updated_at_before)
                    return null;
                  const client = new Date(e.client_started_on).getTime();
                  const server = new Date(e.server_updated_at_before).getTime();
                  if (!Number.isFinite(client) || !Number.isFinite(server))
                    return null;
                  return (client - server) / 1000;
                },
              },
            ]}
          />
          </ScrollView>
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
  hourSelectorWrapper: {
    width: '100%',
    height: 60,
    backgroundColor: 'pink',
     marginVertical: 20,
  },
  syncToggleRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  syncToggleBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  syncToggleText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  chartScroll: {
    flex: 1,
    width: "100%",
  },
  chartScrollContent: {
    paddingBottom: 20,
  },
});

export default ScreenGeckoManage;