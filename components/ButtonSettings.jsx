import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';
import SectionFriendSettings from './SectionFriendSettings';
import SectionAccountSettings from './SectionAccountSettings';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import SettingsOutlineSvg from '../assets/svgs/settings-outline.svg';
import { useAuthUser } from '../context/AuthUserContext';

const ButtonSettings = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser();

  React.useEffect(() => {
    if (isModalVisible) {
      AccessibilityInfo.announceForAccessibility('Settings opened');
    }
  }, [isModalVisible]); 

  const sections = [
    { title: 'Accessibility', content: <SectionAccessibilitySettings /> },
    { title: 'Friends', content: <SectionFriendSettings /> },
    { title: 'Account', content: <SectionAccountSettings /> }, 
  ];

  const footerContent = "© badrainbowz 2024";

  return (
    <>
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <SettingsOutlineSvg width={30} height={30
          
        } style={themeStyles.footerIcon} />
        <Text style={themeStyles.footerText}>Settings</Text>
      </TouchableOpacity>

      <ActionPageBase
        visible={isModalVisible}
        onClose={toggleModal}
        sections={sections}
        showFooter={true}
        footerContent={footerContent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1, // Divide space equally
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'black',  
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4, // Add some margin to separate the icon from the text
  },
});

export default ButtonSettings;
