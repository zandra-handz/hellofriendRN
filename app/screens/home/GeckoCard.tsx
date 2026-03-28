import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import SvgIcon from '@/app/styles/SvgIcons';

interface GeckoCardProps {
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

const GeckoCard: React.FC<GeckoCardProps> = ({
  onPress,
  backgroundColor = '#141414',
  textColor = '#ffffff',
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outer,
        { backgroundColor, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <View style={styles.bar} />

      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={[styles.eyebrow, { color: textColor }]}>MANAGE</Text>
          <Text style={[styles.title, { color: textColor }]}>Gecko</Text>
        </View>

    <View style={styles.right}>
          <SvgIcon name="wrench" color={textColor} size={36} style={styles.wrench} />
          <Text style={[styles.arrow, { color: textColor }]}>›</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#222222',
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  left: {
    gap: 3,
  },
  eyebrow: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 10,
    letterSpacing: 1.5,
    opacity: 0.5,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    lineHeight: 26,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
    wrench: {
    opacity: 0.9,
  },
  arrow: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    lineHeight: 32,
    opacity: 0.35,
    marginTop: -2,
  },
});

export default GeckoCard;