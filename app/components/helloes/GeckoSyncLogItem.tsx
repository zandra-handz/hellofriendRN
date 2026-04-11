import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLDTheme } from "@/src/context/LDThemeContext";

type SyncLogEntry = {
  id: number;
  created_at: string;
  trigger: string;

  client_energy: number | null;
  client_surplus: number | null;
  client_multiplier: number | null;
  client_computed_at: string | null;
  client_steps_in_payload: number | null;
  client_distance_in_payload: number | null;
  client_started_on: string | null;
  client_ended_on: string | null;
  client_fatigue: number | null;
  client_recharge: number | null;

  server_energy_before: number | null;
  server_energy_after: number | null;
  server_surplus_before: number | null;
  server_surplus_after: number | null;
  server_updated_at_before: string | null;
  server_updated_at_after: string | null;

  recompute_window_seconds: number | null;
  recompute_active_seconds: number | null;
  recompute_new_steps: number | null;
  recompute_fatigue: number | null;
  recompute_recharge: number | null;
  recompute_net: number | null;

  pending_entries_count: number | null;
  pending_entries_in_window: number | null;
  pending_entries_stale: number | null;
  pending_total_steps_all: number | null;
  pending_total_steps_in_window: number | null;

  energy_delta: number | null;
  phantom_steps: number | null;

  multiplier_active: boolean | null;
  streak_expires_at: string | null;

  total_steps_all_time: number | null;
};

type Props = {
  logData: SyncLogEntry;
  primaryColor?: string;
};

const formatTime = (dateStr: string | null) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  }).format(date);
};

const fmt = (v: number | string | boolean | null | undefined) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
};

const Row = ({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
}) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, { color }]}>{label}</Text>
    <Text style={[styles.rowValue, { color }]}>{value}</Text>
  </View>
);

const Section = ({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    {children}
  </View>
);

const GeckoSyncLogItem = ({ logData, primaryColor = "orange" }: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const textColor = lightDarkTheme.primaryText;

  const delta = logData.energy_delta;
  const deltaStr =
    delta == null ? "—" : delta > 0 ? `+${delta}` : String(delta);

  return (
    <View style={[styles.container, { borderColor: primaryColor }]}>
      <View style={styles.header}>
        <Text style={[styles.trigger, { color: textColor }]}>
          {logData.trigger ?? "sync"}
        </Text>
        <Text style={[styles.timestamp, { color: textColor }]}>
          {formatTime(logData.created_at)}
        </Text>
      </View>

      <View style={styles.topStats}>
        <Text style={[styles.topStat, { color: textColor }]}>Δ {deltaStr}</Text>
        {logData.phantom_steps != null && (
          <Text style={[styles.topStat, { color: textColor }]}>
            phantom {logData.phantom_steps}
          </Text>
        )}
        <Text style={[styles.topStat, { color: textColor }]}>
          mult {logData.multiplier_active ? "on" : "off"}
        </Text>
      </View>

      <Section title="Client" color={textColor}>
        <Row label="energy" value={fmt(logData.client_energy)} color={textColor} />
        <Row label="surplus" value={fmt(logData.client_surplus)} color={textColor} />
        <Row label="multiplier" value={fmt(logData.client_multiplier)} color={textColor} />
        <Row label="computed_at" value={formatTime(logData.client_computed_at)} color={textColor} />
        <Row label="steps_in_payload" value={fmt(logData.client_steps_in_payload)} color={textColor} />
        <Row label="distance_in_payload" value={fmt(logData.client_distance_in_payload)} color={textColor} />
      </Section>

      <Section title="Server" color={textColor}>
        <Row
          label="energy"
          value={`${fmt(logData.server_energy_before)} → ${fmt(logData.server_energy_after)}`}
          color={textColor}
        />
        <Row
          label="surplus"
          value={`${fmt(logData.server_surplus_before)} → ${fmt(logData.server_surplus_after)}`}
          color={textColor}
        />
        <Row
          label="updated_at"
          value={`${formatTime(logData.server_updated_at_before)} → ${formatTime(logData.server_updated_at_after)}`}
          color={textColor}
        />
      </Section>

      <Section title="Recompute" color={textColor}>
        <Row label="window_seconds" value={fmt(logData.recompute_window_seconds)} color={textColor} />
        <Row label="active_seconds" value={fmt(logData.recompute_active_seconds)} color={textColor} />
        <Row label="new_steps" value={fmt(logData.recompute_new_steps)} color={textColor} />
        <Row label="fatigue" value={fmt(logData.recompute_fatigue)} color={textColor} />
        <Row label="recharge" value={fmt(logData.recompute_recharge)} color={textColor} />
        <Row label="net" value={fmt(logData.recompute_net)} color={textColor} />
      </Section>

      <Section title="Pending" color={textColor}>
        <Row label="entries_count" value={fmt(logData.pending_entries_count)} color={textColor} />
        <Row label="entries_in_window" value={fmt(logData.pending_entries_in_window)} color={textColor} />
        <Row label="entries_stale" value={fmt(logData.pending_entries_stale)} color={textColor} />
        <Row label="total_steps_all" value={fmt(logData.pending_total_steps_all)} color={textColor} />
        <Row label="total_steps_in_window" value={fmt(logData.pending_total_steps_in_window)} color={textColor} />
      </Section>

      <Section title="Streak" color={textColor}>
        <Row label="expires_at" value={formatTime(logData.streak_expires_at)} color={textColor} />
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  trigger: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timestamp: {
    fontSize: 11,
  },
  topStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 6,
  },
  topStat: {
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1,
  },
  rowLabel: {
    fontSize: 11,
    opacity: 0.8,
  },
  rowValue: {
    fontSize: 11,
    fontVariant: ["tabular-nums"],
  },
});

export default GeckoSyncLogItem;
