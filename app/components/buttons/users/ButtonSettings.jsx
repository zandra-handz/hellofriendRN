import React from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageBase from '@/app/components/user/ActionPageBase';
import SectionAccessibilitySettings from '@/app/components/user/SectionAccessibilitySettings';
import SectionFriendSettings from '@/app/components/friends/SectionFriendSettings';
import SectionAccountSettings from '@/app/components/user/SectionAccountSettings';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

import GearsTwoBiggerCircleSvg from '@/app/assets/svgs/gears-two-bigger-circle.svg';
 
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
