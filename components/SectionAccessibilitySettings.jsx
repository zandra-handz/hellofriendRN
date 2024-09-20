import React, { useState, useEffect } from 'react';
import { Text } from 'react-native'; 
import { useAuthUser } from '../context/AuthUserContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { updateUserAccessibilitySettings } from '../api'; 
import BaseModalFooterSection from '../components/BaseModalFooterSection';
import BaseRowModalFooter from '../components/BaseRowModalFooter';
import AlertMicro from '../components/AlertMicro'; 
import LoadingPage from '../components/LoadingPage';

const SectionAccessibilitySettings = () => {
  const { authUserState,  removeNotificationPermissions, registerForNotifications, userAppSettings, updateUserNotificationSettings, userNotificationSettings, updateUserSettings } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [simplifyAppForFocus, setSimplifyAppForFocus] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false); 
  const [manualTheme, setManualTheme] = useState(false);
  const [manualDarkMode, setManualDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [ isMakingCall, setIsMakingCall ] = useState(false);

  useEffect(() => {
    if (userAppSettings) {
      setHighContrastMode(userAppSettings.high_contrast_mode);
      setLargeText(userAppSettings.large_text);
      setSimplifyAppForFocus(userAppSettings.simplify_app_for_focus);
      setReceiveNotifications(userAppSettings.receive_notifications);
      setIsScreenReaderEnabled(userAppSettings.screen_reader);  

      if (userAppSettings.manual_dark_mode === null) {
        setManualTheme(false);
      } else {
        setManualTheme(true);
        setManualDarkMode(userAppSettings.manual_dark_mode);
      }
    }
  }, [userAppSettings]);

  const updateSetting = async (setting) => {
    setIsMakingCall(true);
    try {
      const newSettings = { ...userAppSettings, ...setting };
      await updateUserAccessibilitySettings(authUserState.user.id, setting);
      updateUserSettings(newSettings);
      console.log('User settings updated successfully');
    } catch (error) {
      console.error('Error updating user settings:', error);
    } finally {
      setIsMakingCall(false);
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
    console.log(newValue);
    //updateUserNotificationSettings(newValue); 
    setReceiveNotifications(newValue);
    if (newValue) {
      registerForNotifications();
    } else {
      removeNotificationPermissions();
    };
 
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

    const newValue = !isScreenReaderEnabled;  
    setIsScreenReaderEnabled(newValue); 

    try {
      await updateUserAccessibilitySettings(authUserState.user.id, { screen_reader: newValue });
      const updatedSettings = { ...userAppSettings, screen_reader: newValue };
      updateUserSettings(updatedSettings);
      console.log(`Screen reader ${newValue ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling screen reader:', error);
    }
  };
 

  return (
    <BaseModalFooterSection isMakingCall={isMakingCall} LoadingComponent={LoadingPage} themeStyles={themeStyles}>
          
      <BaseRowModalFooter 
        iconName='adjust' 
        iconSize={20}
        useToggle={true}
        label='Manual Light/Dark Mode' 
        value={manualTheme}
        useAltButton={false}
        onTogglePress={toggleManualTheme}  
      />   

      {manualTheme && ( 

        <BaseRowModalFooter 
          iconName='adjust' 
          iconSize={20}
          useToggle={true}
          label='Light/Dark' 
          value={manualDarkMode}
          onTogglePress={toggleLightDark}  
          />  
      )} 

      <BaseRowModalFooter 
        iconName='adjust' 
        iconSize={20}
        useToggle={true}
        label='High Contrast Mode' 
        value={highContrastMode}
        onTogglePress={toggleHighContrastMode}  
      />  

      <BaseRowModalFooter 
        iconName='text-height' 
        iconSize={20}
        useToggle={true}
        label='Large Text' 
        value={largeText}
        onTogglePress={toggleLargeText}  
      />  

      <BaseRowModalFooter 
        iconName='bell' 
        iconSize={20}
        useToggle={true}
        label='Simplify App For Focus' 
        value={simplifyAppForFocus}
        onTogglePress={toggleSimplifyAppForFocus}
      />  

      <BaseRowModalFooter 
        iconName='bell' 
        iconSize={20}
        useToggle={true}
        label='Receive Notifications' 
        value={receiveNotifications}
        onTogglePress={toggleReceiveNotifications} 
      />   

      <BaseRowModalFooter 
        iconName='volume-up' 
        iconSize={20}
        useToggle={true}
        label='Screen Reader' 
        value={isScreenReaderEnabled}
        onTogglePress={toggleScreenReader}
      />        
   
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
    </BaseModalFooterSection>
  );
};

export default SectionAccessibilitySettings;
