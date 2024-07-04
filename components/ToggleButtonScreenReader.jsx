// ScreenReaderToggleButton.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Animated, Easing, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { updateUserAccessibilitySettings } from '../api';
import { useAuthUser } from '../context/AuthUserContext';
import AlertMicro from '../components/AlertMicro'; // Assuming AlertMicro component is located here

const ToggleButtonScreenReader = () => {
  const { authUserState, userAppSettings, updateUserSettings } = useAuthUser();
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false); // Local state for screen reader
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (userAppSettings) {
      setIsScreenReaderEnabled(userAppSettings.screen_reader); // Initialize local state with screen reader status
    }
  }, [userAppSettings]);

  const updateScreenReaderSetting = async (newValue) => {
    setIsScreenReaderEnabled(newValue); // Update local state immediately

    try {
      // Update backend setting
      await updateUserAccessibilitySettings(authUserState.user.id, { screen_reader: newValue });

      // Update user settings context if needed
      const updatedSettings = { ...userAppSettings, screen_reader: newValue };
      updateUserSettings(updatedSettings);

      console.log(`Screen reader ${newValue ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling screen reader:', error);
    }
  };

  const toggleScreenReader = async () => {
    if (!AccessibilityInfo.isScreenReaderEnabled()) {
      setShowAlert(true);
      return;
    }

    const newValue = !isScreenReaderEnabled; // Toggle local state

    updateScreenReaderSetting(newValue);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, isScreenReaderEnabled ? styles.on : styles.off]}
        onPress={toggleScreenReader}
      >
        <FontAwesome5 name="volume-up" size={20} color="black" style={styles.icon} />
      </TouchableOpacity>
      
      {/* Alert message component */}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#ccc',
  },
  on: {
    backgroundColor: '#4cd137',
  },
  off: {
    backgroundColor: '#dcdde1',
  },
  icon: {
    marginRight: 10,
  },
});

export default ToggleButtonScreenReader;
