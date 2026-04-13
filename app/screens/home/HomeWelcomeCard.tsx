import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────

const COLORS = {
  white: '#ffffff',
  dim: '#787878',
  muted: '#373737',
  green: '#a0f143',
  divider: '#1c1c1c',
};

export const GREEN_HIGHLIGHT_COLORS = {
  dot: ['#c8f576', '#a0f143', '#78c430'] as const,
};

// ─── WELCOME CARD ─────────────────────────────────────────────────────────────

interface WelcomeCardProps {
  /** e.g. "WELCOME BACK" */
  eyebrow?: string;
  /** First line of the bold heading, e.g. "Stay" */
  headingLine1?: string;
  /** Second line of the bold heading, e.g. "connected" */
  headingLine2?: string;
  /** Subtitle row, e.g. "Monday, March 9  ·  4 upcoming" */
  subtitle?: string;
  textColor?: string;
  /** Gradient stops for the accent dot after headingLine2 */
  dotColors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
}

export function WelcomeCard({
  eyebrow = 'WELCOME BACK',
  headingLine1 = 'Stay',
  headingLine2 = 'connected',
  subtitle,
  textColor = COLORS.white,
  dotColors = GREEN_HIGHLIGHT_COLORS.dot,
  style,
}: WelcomeCardProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Eyebrow */}
      <Text style={styles.eyebrow}>{eyebrow}</Text>

      {/* Heading line 1 */}
      <Text style={[styles.headingLine, { color: textColor }]}>
        {headingLine1}
      </Text>

      {/* Heading line 2 + accent dot */}
      <View style={styles.headingLine2Row}>
        <Text style={[styles.headingLine, { color: textColor }]}>
          {headingLine2}
        </Text>
        <LinearGradient
          colors={dotColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.accentDot}
        />
      </View>

      {/* Subtitle */}
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {/* Bottom divider */}
      <View style={styles.divider} />
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 22, //32
    paddingBottom: 0,
  },
  eyebrow: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.muted,
    marginBottom: 8,
  },
  headingLine: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 48,
    lineHeight: 52,
  },
  headingLine2Row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 12,
  },
  accentDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 10, // sits at baseline of the heading text
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: COLORS.dim,
    marginBottom: 28,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});