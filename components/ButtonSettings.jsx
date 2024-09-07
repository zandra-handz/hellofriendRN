import React from 'react';
import { Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';
import SectionFriendSettings from './SectionFriendSettings';
import SectionAccountSettings from './SectionAccountSettings';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import SettingsOutlineSvg from '../assets/svgs/settings-outline.svg';
import GearsTwoSvg from '../assets/svgs/gears-two.svg';
import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
 
const ButtonSettings = ({label=null}) => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { themeStyles } = useGlobalStyle(); 

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
        <GearsTwoBiggerCircleSvg width={34} height={34} style={themeStyles.footerIcon} />
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
