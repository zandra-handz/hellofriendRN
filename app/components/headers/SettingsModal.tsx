import React from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageBase from '@/app/components/user/ActionPageBase';
import SectionAccessibilitySettings from '@/app/components/user/SectionAccessibilitySettings';
import SectionFriendSettings from '@/app/components/friends/SectionFriendSettings';
import SectionAccountSettings from '@/app/components/user/SectionAccountSettings';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
 
const SettingsModal = ({isVisible, closeModal}) => {

//   React.useEffect(() => {
//     if (isModalVisible) {
//       AccessibilityInfo.announceForAccessibility('Settings opened');
//     }
//   }, [isModalVisible]); 

  const sections = [
    { title: 'ACCESSIBILITY', content: <SectionAccessibilitySettings /> },
    { title: 'FRIENDS', content: <SectionFriendSettings /> },
    { title: 'ACCOUNT', content: <SectionAccountSettings /> }, 
  ];

  const footerContent = "© Badrainbowz Studio 2025";

  return (
    <> 
      <ActionPageBase
        visible={isVisible}
        onClose={closeModal}
        sections={sections}
        showFooter={true}
        footerContent={footerContent}
      />
    </>
  );
}; 

export default SettingsModal;
