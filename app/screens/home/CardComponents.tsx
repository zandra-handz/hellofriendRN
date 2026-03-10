import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import manualGradientColors from '@/app/styles/StaticColors';

//manualGradientColors.lightColor
//manualGradientColors.darkColor

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────

const COLORS = {
  bg: '#0a0a0a',
  surface: '#141414',
  divider: '#1c1c1c',
  white: '#ffffff',
  dim: '#787878',
  muted: '#373737',
  green: '#a0f143',
  greenDark: '#6aaa27',
};

// Manual gradient stops for the green accent highlights.
// Pass these as `highlightColors` wherever the component accepts them.
export const GREEN_HIGHLIGHT_COLORS = {
  bar: ['#c8f576', '#a0f143', '#6aaa27'] as const,
  arrow: ['#b8f05a', '#a0f143', '#7ab832'] as const,
  dot: ['#a0f143', '#78c430'] as const,
};

// ─── UP NEXT CARD ─────────────────────────────────────────────────────────────
// The large highlighted card for the nearest upcoming hello.

interface UpNextCardProps {
  name: string;
  dateLabel: string;        // e.g. "Say hi on Monday, March 9"
  tag?: string;             // e.g. "TODAY" | "TOMORROW"
  backgroundColor?: string;
  textColor?: string;
  highlightColors?: readonly [string, string, ...string[]];
  onPress?: () => void;
  style?: ViewStyle;
}

export function UpNextCard({
  name,
  dateLabel,
  tag = 'TODAY',
  backgroundColor = COLORS.surface,
  textColor = COLORS.white,
  highlightColors = GREEN_HIGHLIGHT_COLORS.bar,
  onPress,
  style,
}: UpNextCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.upNextOuter, { backgroundColor }, style]}
    >
      {/* Green accent bar */}
      <LinearGradient
        colors={highlightColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.upNextBar}
      />

      <View style={styles.upNextContent}>
        <View style={styles.upNextLeft}>
          <Text style={[styles.upNextTag, { color: highlightColors[1] }]}>
            {tag}
          </Text>
          <Text style={[styles.upNextName, { color: textColor }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.upNextDate, { color: COLORS.dim }]}>
            {dateLabel}
          </Text>
        </View>

        {/* Arrow button */}
        <LinearGradient
          colors={GREEN_HIGHLIGHT_COLORS.arrow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.upNextArrow}
        >
          <Text style={styles.upNextArrowText}>›</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

// ─── SOON ROW ─────────────────────────────────────────────────────────────────
// A single row in the "Soon" list.

interface SoonRowProps {
  dateLabel: string;        // e.g. "Tue Mar 10"
  name: string;
  leafCount?: number;
  textColor?: string;
  showDivider?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SoonRow({
  dateLabel,
  name,
  leafCount,
  textColor = COLORS.white,
  showDivider = true,
  onPress,
  style,
}: SoonRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.soonRow, style]}
    >
      {showDivider && <View style={styles.soonDivider} />}

      <Text style={styles.soonDate}>{dateLabel}</Text>

      <View style={styles.soonRight}>
        {leafCount !== undefined && (
          <View style={styles.soonLeaves}>
            <LeafIcon color={COLORS.muted} size={12} />
            <Text style={styles.soonLeafCount}>{leafCount}</Text>
          </View>
        )}
        <Text style={styles.soonSep}>|</Text>
        <Text style={[styles.soonName, { color: textColor }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── CATEGORY PILL ────────────────────────────────────────────────────────────
// A small card in the 2×2 categories grid.

interface CategoryPillProps {
  name: string;
  friendCount: number;
  dotColor?: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CategoryPill({
  name,
  friendCount,
  dotColor = COLORS.green,
  backgroundColor = COLORS.surface,
  textColor = COLORS.white,
  onPress,
  style,
}: CategoryPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.catPill, { backgroundColor }, style]}
    >
      <View style={[styles.catDot, { backgroundColor: dotColor }]} />
      <View style={styles.catInfo}>
        <Text style={[styles.catName, { color: textColor }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.catCount}>
          {friendCount} {friendCount === 1 ? 'friend' : 'friends'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
// The small uppercase label above each section.

interface SectionHeaderProps {
  label: string;
  style?: ViewStyle;
}

export function SectionHeader({ label, style }: SectionHeaderProps) {
  return (
    <Text style={[styles.sectionHeader, style]}>
      {label.toUpperCase()}
    </Text>
  );
}

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────

export function SectionDivider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.sectionDivider, style]} />;
}

// ─── LEAF ICON (inline SVG-free approximation) ────────────────────────────────

function LeafIcon({ color = COLORS.muted, size = 14 }: { color?: string; size?: number }) {
  // Simple rotated oval to approximate a leaf
  return (
    <View
      style={{
        width: size,
        height: size * 1.3,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ rotate: '-20deg' }],
        opacity: 0.6,
      }}
    />
  );
}

// ─── EXAMPLE COMPOSITION ──────────────────────────────────────────────────────
// Drop this into your home screen to see all three cards in context.

interface ScheduleSectionProps {
  upNext: {
    name: string;
    dateLabel: string;
    tag?: string;
  };
  soon: Array<{
    dateLabel: string;
    name: string;
    leafCount?: number;
  }>;
  categories: Array<{
    name: string;
    friendCount: number;
    dotColor?: string;
  }>;
  // Override colours for a themed friend — leave undefined for default black
  cardBackgroundColor?: string;
  cardTextColor?: string;
}

export function HomeScheduleSection({
  upNext,
  soon,
  categories,
  cardBackgroundColor,
  cardTextColor,
}: ScheduleSectionProps) {
  return (
    <View style={styles.scheduleSection}>
      {/* UP NEXT */}
      <SectionHeader label="Up next" style={styles.sectionHeaderSpacing} />
      <UpNextCard
        {...upNext}
        backgroundColor={cardBackgroundColor}
        textColor={cardTextColor}
      />

      {/* SOON */}
      <SectionHeader label="Soon" style={[styles.sectionHeaderSpacing, { marginTop: 20 }]} />
      {soon.map((row, i) => (
        <SoonRow
          key={i}
          {...row}
          textColor={cardTextColor}
          showDivider={i > 0}
        />
      ))}

      <SectionDivider style={{ marginTop: 16 }} />

      {/* CATEGORIES */}
      <SectionHeader label="Categories" style={styles.sectionHeaderSpacing} />
      <View style={styles.catGrid}>
        {categories.map((cat, i) => (
          <CategoryPill
            key={i}
            {...cat}
            backgroundColor={cardBackgroundColor}
            textColor={cardTextColor}
            style={styles.catGridItem}
          />
        ))}
      </View>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // UpNextCard
  upNextOuter: {
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#222222',
  },
  upNextBar: {
    width: 4,
    borderRadius: 2,
  },
  upNextContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  upNextLeft: {
    flex: 1,
    gap: 3,
  },
  upNextTag: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  upNextName: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    lineHeight: 26,
  },
  upNextDate: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 13,
  },
  upNextArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  upNextArrowText: {
    color: '#000000',
    fontSize: 22,
    fontFamily: 'SpaceGrotesk-Bold',
    lineHeight: 26,
    marginTop: -2,
  },

  // SoonRow
  soonRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  soonDivider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#1c1c1c',
  },
  soonDate: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: COLORS.muted,
    width: 80,
  },
  soonRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  soonLeaves: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  soonLeafCount: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: COLORS.muted,
  },
  soonSep: {
    color: COLORS.muted,
    fontSize: 12,
    opacity: 0.4,
  },
  soonName: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 13,
    maxWidth: 180,
  },

  // CategoryPill
  catPill: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  catInfo: {
    flex: 1,
    gap: 2,
  },
  catName: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 12,
  },
  catCount: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 10,
    color: COLORS.dim,
  },

  // Section helpers
  sectionHeader: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.muted,
    marginBottom: 12,
  },
  sectionHeaderSpacing: {
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#1c1c1c',
  },

  // Composition
  scheduleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catGridItem: {
    width: '47.5%',
  },
});