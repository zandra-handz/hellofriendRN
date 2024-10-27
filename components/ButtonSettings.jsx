import React from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';
import SectionFriendSettings from './SectionFriendSettings';
import SectionAccountSettings from './SectionAccountSettings';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
 
const ButtonSettings = () => {
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
    { title: 'ACCESSIBILITY', content: <SectionAccessibilitySettings /> },
    { title: 'FRIENDS', content: <SectionFriendSettings /> },
    { title: 'ACCOUNT', content: <SectionAccountSettings /> }, 
  ];

  const footerContent = "© Badrainbowz Studio 2024";

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <GearsTwoBiggerCircleSvg width={32} height={32} style={themeStyles.footerIcon} />
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

export default ButtonSettings;
