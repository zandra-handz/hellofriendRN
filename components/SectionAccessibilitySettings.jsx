import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store'; 
import { useAuthUser } from '../context/AuthUserContext';
import { updateUserAccessibilitySettings } from '../api';
import ToggleButton from '../components/ToggleButton';
import AlertMicro from '../components/AlertMicro'; 

const SectionAccessibilitySettings = () => {
  const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [simplifyAppForFocus, setSimplifyAppForFocus] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false); // Local state for screen reader
  const [manualTheme, setManualTheme] = useState(false);
  const [manualDarkMode, setManualDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (userAppSettings) {
      setHighContrastMode(userAppSettings.high_contrast_mode);
      setLargeText(userAppSettings.large_text);
      setSimplifyAppForFocus(userAppSettings.simplify_app_for_focus);
      setReceiveNotifications(userAppSettings.receive_notifications);
      setIsScreenReaderEnabled(userAppSettings.screen_reader); // Initialize local state with screen reader status

      if (userAppSettings.manual_dark_mode === null) {
        setManualTheme(false);
      } else {
        setManualTheme(true);
        setManualDarkMode(userAppSettings.manual_dark_mode);
      }
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

  const toggleSimplifyAppForFocus = () => {
    const newValue = !simplifyAppForFocus;
    setSimplifyAppForFocus(newValue);
    updateSetting({ simplify_app_for_focus: newValue });
  };

  const toggleReceiveNotifications = () => {
    const newValue = !receiveNotifications;
    setReceiveNotifications(newValue);
    updateSetting({ receive_notifications: newValue });
  };

  const toggleManualTheme = () => {
    const newValue = !manualTheme;
    if (newValue === true) {
      updateSetting({ manual_dark_mode: false }); 
    };
    if (newValue === false) {
      updateSetting({ manual_dark_mode: null });
      setManualDarkMode(false);
    };
    setManualTheme(newValue); 
  };
 

  const toggleLightDark = () => {
    const newValue = !manualDarkMode;
    setManualDarkMode(newValue);
    updateSetting({ manual_dark_mode: newValue });
  };

  const toggleScreenReader = async () => {
    if (!AccessibilityInfo.isScreenReaderEnabled()) {
      setShowAlert(true);
      return;
    }

    const newValue = !isScreenReaderEnabled; // Toggle local state
    setIsScreenReaderEnabled(newValue); // Update local state immediately

    try {
      await updateUserAccessibilitySettings(authUserState.user.id, { screen_reader: newValue });

      const updatedSettings = { ...userAppSettings, screen_reader: newValue };
      updateUserSettings(updatedSettings);

      console.log(`Screen reader ${newValue ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling screen reader:', error);
    }
  };

  const getPushToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('pushToken');
      if (token) {
        
        return token;
      } else {
        console.log('No push token found in SecureStore');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving push token:', error);
      return null;
    }
  };
  
 




  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FontAwesome5 name="adjust" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Manual Light/Dark Mode</Text>
        <ToggleButton value={manualTheme} onToggle={toggleManualTheme} />
      </View>
      {manualTheme && (  
      <View style={styles.row}>
        <FontAwesome5 name="adjust" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Light/Dark</Text>
        <ToggleButton value={manualDarkMode} onToggle={toggleLightDark} />
      </View>
      )}
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
        <Text style={styles.label}>Simplify App For Focus</Text>
        <ToggleButton value={simplifyAppForFocus} onToggle={toggleSimplifyAppForFocus} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="bell" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Receive Notifications</Text>
        <ToggleButton value={receiveNotifications} onToggle={toggleReceiveNotifications} />
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="volume-up" size={20} color="black" style={styles.icon} />
        <Text style={styles.label}>Screen Reader</Text>
        <ToggleButton value={isScreenReaderEnabled} onToggle={toggleScreenReader} />
      </View>
 
      <AlertMicro
        isModalVisible={showAlert}
        toggleModal={() => setShowAlert(false)}
        modalContent={
          <Text>
            Please enable the screen reader in your device settings to use this feature.
          </Text>
        }
        modalTitle="Screen Reader Required"
      />
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
