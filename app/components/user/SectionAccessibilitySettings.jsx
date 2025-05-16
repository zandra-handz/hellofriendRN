import React, { useState, useEffect } from 'react';
import {Text} from 'react-native'; 
import { useUser } from '@/src/context/UserContext';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; 
import BaseModalFooterSection from '../scaffolding/BaseModalFooterSection';
import BaseRowModalFooter from '../scaffolding/BaseRowModalFooter';
import AlertMicro from '../alerts/AlertMicro'; 
 
import LoadingPage from '../appwide/spinner/LoadingPage';

//fix loading spinner
//moved creation/removal of notification tokens completely out of this into auth context
const SectionAccessibilitySettings = () => {
  const {  user, updateAppSettingsMutation, userAppSettings, updateUserNotificationSettings  } = useUser();
  const { themeStyles } = useGlobalStyle();   
  const [manualTheme, setManualTheme] = useState(false);  
  const [showAlert, setShowAlert] = useState(false); 

  useEffect(() => {
    if (userAppSettings) {  
     
        

      if (userAppSettings.manual_dark_mode === null) {
        setManualTheme(false);
      } else {
        setManualTheme(true); 
      }
    }
  }, [user.authenticated]);

  const updateSetting = async (setting) => { 
    try {
        const newSettings = { ...userAppSettings, ...setting };  
        await updateAppSettingsMutation.mutateAsync({
            userId: user.user.id,  
            setting: newSettings  
        }); 
        console.log('User settings updated successfully');
    } catch (error) {
        console.error('Error updating user settings:', error);
    }  
};

 
  //Managed by auth context RQ
  const updateHighContrastMode = () => {
    updateSetting({ high_contrast_mode: !userAppSettings.high_contrast_mode});
  };

  //Managed by auth context RQ
  const updateLargeText = () => {
    updateSetting({ large_text: !userAppSettings.large_text });
  };

 //Managed by auth context RQ
  const updateSimplifyAppForFocus = () => {
    updateSetting({ simplify_app_for_focus: !userAppSettings.simplify_app_for_focus });
  
  };

  const updateReceiveNotifications = () => { 
    updateSetting({receive_notifications: !userAppSettings.receive_notifications}); 
    updateUserNotificationSettings({receive_notifications : !userAppSettings.receive_notifications});
  };

  const toggleManualTheme = () => {
    const newValue = !manualTheme;
    if (newValue === true) {
      updateSetting({ manual_dark_mode: false }); 
    };
    if (newValue === false) {
      updateSetting({ manual_dark_mode: null }); 
    };
    setManualTheme(newValue); 
  };


  const updateLightDark = () => {
    updateSetting({ manual_dark_mode: !userAppSettings.manual_dark_mode });
  };

  //Screen reader declares loudly that this button is enabled
  const toggleScreenReader = async () => { 
      setShowAlert(true);
      return;
    };
 

  return (
    <BaseModalFooterSection isMakingCall={updateAppSettingsMutation.isLoading} LoadingComponent={LoadingPage} themeStyles={themeStyles}>
          
      <BaseRowModalFooter 
        iconName='adjust' 
        iconSize={16}
        useToggle={true}
        label='Manual Light/Dark Mode' 
        value={manualTheme}
        useAltButton={false}
        onTogglePress={toggleManualTheme}  
      />   

      {manualTheme && ( 

        <BaseRowModalFooter 
          iconName='adjust' 
          iconSize={16}
          useToggle={true}
          label='Light/Dark' 
          value={userAppSettings.manual_dark_mode === true}
          onTogglePress={updateLightDark}  
          />  
      )} 

      <BaseRowModalFooter 
        iconName='adjust' 
        iconSize={16}
        useToggle={true}
        label='High Contrast Mode' 
        value={userAppSettings.high_contrast_mode}
        onTogglePress={updateHighContrastMode}  
      />  

      <BaseRowModalFooter 
        iconName='text-height' 
        iconSize={16}
        useToggle={true}
        label='Large Text' 
        value={userAppSettings.large_text}
        onTogglePress={updateLargeText}  
      />  

      <BaseRowModalFooter 
        iconName='bell' 
        iconSize={16}
        useToggle={true}
        label='Simplify App For Focus' 
        value={userAppSettings.simplify_app_for_focus}
        onTogglePress={updateSimplifyAppForFocus}
      />  

      <BaseRowModalFooter 
        iconName='bell' 
        iconSize={16}
        useToggle={true}
        label='Receive Notifications' 
        value={userAppSettings.receive_notifications}
        onTogglePress={updateReceiveNotifications} 
      />   

      <BaseRowModalFooter 
        iconName='volume-up' 
        iconSize={16}
        useToggle={true}
        label='Screen Reader' 
        value={userAppSettings.screen_reader}
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
        modalTitle="Using Screen Reader"
      />
    </BaseModalFooterSection>
  );
};

export default SectionAccessibilitySettings;
