import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useAuthUser } from '../context/AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import ToggleButton from '../components/ToggleButton';

const SectionAccessibilitySettings = () => {
  const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    if (userAppSettings) {
      setHighContrastMode(userAppSettings.high_contrast_mode);
      setLargeText(userAppSettings.large_text);
      setReceiveNotifications(userAppSettings.receive_notifications);
      setScreenReader(userAppSettings.screen_reader);
    }
  }, [userAppSettings]);

  const updateSetting = async (setting) => {
    try {
      const newSettings = { ...userAppSettings, ...setting };
      await updateUserAccessibilitySettings(authUserState.user.id, setting);
      updateUserSettings(newSettings);
      console.log('User settings updated successfully');
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  const toggleHighContrastMode = () => {
    const newValue = !highContrastMode;
    setHighContrastMode(newValue);
    updateSetting({ high_contrast_mode: newValue });
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    updateSetting({ large_text: newValue });
  };

  const toggleReceiveNotifications = () => {
    const newValue = !receiveNotifications;
    setReceiveNotifications(newValue);
    updateSetting({ receive_notifications: newValue });
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    updateSetting({ screen_reader: newValue });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FontAwesome5 name="adjust" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>High Contrast Mode</Text>
        <ToggleButton value={highContrastMode} onToggle={toggleHighContrastMode} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="text-height" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Large Text</Text>
        <ToggleButton value={largeText} onToggle={toggleLargeText} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="bell" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Receive Notifications</Text>
        <ToggleButton value={receiveNotifications} onToggle={toggleReceiveNotifications} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="volume-up" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Screen Reader</Text>
        <ToggleButton value={screenReader} onToggle={toggleScreenReader} />
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
