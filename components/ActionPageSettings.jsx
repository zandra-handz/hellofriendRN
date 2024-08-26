import React, { useEffect } from 'react';
import { View, Text, AccessibilityInfo } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';

const ActionPageSettings = ({ visible, onClose }) => { 

  const UserSettings = () => (
    <View>
      <Text>User settings content goes here</Text>
    </View>
  );

  const FriendsSettings = () => (
    <View>
      <Text>Friends settings content goes here</Text>
    </View>
  );

  const sections = [
    { title: 'Accessibility', content: <SectionAccessibilitySettings /> },
    { title: 'User Settings', content: <UserSettings /> },
    { title: 'Friends', content: <FriendsSettings /> },
  ];

  const footerContent = "© badrainbowz 2024";

  useEffect(() => {
    const handleAccessibilityAnnouncement = () => {
      // Delay the announcement slightly to ensure modal visibility is fully updated
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(visible ? 'Settings modal opened.' : 'Settings modal closed.');
      }, 500);
    };

    handleAccessibilityAnnouncement();
  }, [visible]);

  return (
    <ActionPageBase
      key={visible ? 'modal-open' : 'modal-closed'} // Ensure key changes when modal visibility changes
      visible={visible}
      onClose={onClose}
      sections={sections}
      showFooter={true}
      footerContent={footerContent}
    />
  );
};

export default ActionPageSettings;
