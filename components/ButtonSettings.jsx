import React from 'react';
import { Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';
import SectionFriendSettings from './SectionFriendSettings';
import SectionAccountSettings from './SectionAccountSettings';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
 
const ButtonSettings = ({label=null}) => {
  const { themeStyles } = useGlobalStyle(); 
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  

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

  const footerContent = "© Badrainbowz Studio 2024";

  return (
    <>
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <GearsTwoBiggerCircleSvg width={32} height={32} style={themeStyles.footerIcon} />
        {label && ( 
        <Text style={themeStyles.footerText}>Settings</Text>
        )}
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
    flex: 1, 
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
