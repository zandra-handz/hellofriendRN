import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface UpNextCardProps {
  name: string;
  /** ISO date string e.g. "2026-03-11" — used only for today/tomorrow classification */
  date: string;
  /** Pre-formatted string from backend e.g. "Wednesday, March 11" — used for future display */
  futureDateInWords?: string;
  backgroundColor?: string;
  textColor?: string;
  /** Left accent bar gradient — top, mid, bottom */
  barColorTop?: string;
  barColorMid?: string;
  barColorBottom?: string;
  /** Arrow button gradient — start and end */
  arrowColorStart?: string;
  arrowColorEnd?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const COLORS = {
  surface: '#141414',
  white: '#ffffff',
  dim: '#787878',
};

const DEFAULTS = {
  barTop: '#c8f576',
  barMid: '#a0f143',
  barBottom: '#6aaa27',
  arrowStart: '#b8f05a',
  arrowEnd: '#7ab832',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

type DateLabel = 'today' | 'tomorrow' | 'future';

function classifyDate(dateStr: string): DateLabel {
  if (!dateStr) return 'future';

  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();

  const parts = dateStr.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (isNaN(year) || isNaN(month) || isNaN(day)) return 'future';

  const isToday = year === todayY && month === todayM && day === todayD;

  // Use local Date constructor (not string parse) for tomorrow rollover safety
  const isTomorrow =
    new Date(year, month - 1, day).toDateString() ===
    new Date(todayY, todayM - 1, todayD + 1).toDateString();

  if (isToday) return 'today';
  if (isTomorrow) return 'tomorrow';
  return 'future';
}

function getTagLabel(classification: DateLabel): string {
  if (classification === 'today') return 'TODAY';
  if (classification === 'tomorrow') return 'TOMORROW';
  return 'NEXT';
}

function getDateSubLabel(
  classification: DateLabel,
  futureDateInWords?: string,
): string {
  if (classification === 'today') return 'Say hi today!';
  if (classification === 'tomorrow') return 'Say hi tomorrow';
  return futureDateInWords ? `Say hi on ${futureDateInWords}` : 'Coming up';
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const UpNextCard: React.FC<UpNextCardProps> = ({
  name,
  date,
  futureDateInWords,
  backgroundColor = COLORS.surface,
  textColor = COLORS.white,
  barColorTop = DEFAULTS.barTop,
  barColorMid = DEFAULTS.barMid,
  barColorBottom = DEFAULTS.barBottom,
  arrowColorStart = DEFAULTS.arrowStart,
  arrowColorEnd = DEFAULTS.arrowEnd,
  onPress,
  style,
}) => {
  const classification = useMemo(() => classifyDate(date), [date]);
  const tag = useMemo(() => getTagLabel(classification), [classification]);
  const dateSubLabel = useMemo(
    () => getDateSubLabel(classification, futureDateInWords),
    [classification, futureDateInWords],
  );

  const barColors = [barColorTop, barColorMid, barColorBottom] as const;
  const arrowColors = [arrowColorStart, arrowColorEnd] as const;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outer,
        { backgroundColor, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {/* Left accent bar */}
      <LinearGradient
        colors={barColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bar}
      />

      <View style={styles.content}>
        <View style={styles.left}>
          {/* Tag — TODAY / TOMORROW / NEXT */}
          <Text style={[styles.tag, { color: barColorMid }]}>{tag}</Text>

          {/* Friend name */}
          <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
            {name}
          </Text>

          {/* Date sub-label */}
          <Text style={[styles.dateLabel, { color: COLORS.dim }]}>
            {dateSubLabel}
          </Text>
        </View>

        {/* Arrow button */}
        <LinearGradient
          colors={arrowColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.arrow}
        >
          <Text style={styles.arrowText}>›</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#222222',
    // marginHorizontal: 20,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 3,
  },
  tag: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  name: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    lineHeight: 26,
  },
  dateLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  arrowText: {
    color: '#000000',
    fontSize: 22,
    fontFamily: 'SpaceGrotesk-Bold',
    lineHeight: 26,
    marginTop: -2,
  },
});

export default UpNextCard;