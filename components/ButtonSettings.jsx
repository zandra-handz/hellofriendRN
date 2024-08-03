import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons
import ActionPageBase from './ActionPageBase'; // Import ActionPageBase
import SectionAccessibilitySettings from './SectionAccessibilitySettings'; // Import SectionAccessibilitySettings
import SectionFriendSettings from './SectionFriendSettings'; // Import SectionAccessibilitySettings
import SectionAccountSettings from './SectionAccountSettings'; // Import SectionAccessibilitySettings
import { useGlobalStyle } from '../context/GlobalStyleContext';



import { useAuthUser } from '../context/AuthUserContext'; // Import useAuthUser hook

const ButtonSettings = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser(); // Get authUserState from context

  React.useEffect(() => {
    if (isModalVisible) {
      AccessibilityInfo.announceForAccessibility('Settings opened'); // Announce to screen reader
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
        <Icon name="settings" size={24} style={themeStyles.footerIcon} />
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
    fontWeight: 'bold', // Use fontWeight instead of fontStyle for bold text
    marginTop: 4, // Add some margin to separate the icon from the text
  },
});

export default ButtonSettings;
