import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ToggleButton from '../components/ToggleButton';

const SectionAccessibilitySettings = () => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    // Fetch initial accessibility settings on component mount
    AccessibilityInfo.get().then((info) => {
      setHighContrastMode(info.highContrast);
      setLargeText(info.largeText);
      setScreenReader(info.screenReaderEnabled);
    });

    // Subscribe to accessibility changes
    const subscription = AccessibilityInfo.addEventListener('change', (info) => {
      setHighContrastMode(info.highContrast);
      setLargeText(info.largeText);
      setScreenReader(info.screenReaderEnabled);
    });

    return () => {
      // Clean up subscription on component unmount
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FontAwesome5 name="adjust" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>High Contrast Mode</Text>
        <ToggleButton value={highContrastMode} onToggle={() => toggleSetting('highContrast')} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="text-height" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Large Text</Text>
        <ToggleButton value={largeText} onToggle={() => toggleSetting('largeText')} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="volume-up" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Screen Reader</Text>
        <ToggleButton value={screenReader} onToggle={() => toggleSetting('screenReader')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-evenly',
    width: '100%',
    height: 40,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    width: '60%',
  },
});

export default SectionAccessibilitySettings;
