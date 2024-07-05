import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icons
import ActionPageBase from './ActionPageBase'; // Import ActionPageBase
import SectionAccessibilitySettings from './SectionAccessibilitySettings'; // Import SectionAccessibilitySettings
import { useAuthUser } from '../context/AuthUserContext'; // Import useAuthUser hook

const ButtonSettings = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { authUserState } = useAuthUser(); // Get authUserState from context

  React.useEffect(() => {
    if (isModalVisible) {
      AccessibilityInfo.announceForAccessibility('Settings opened'); // Announce to screen reader
    }
  }, [isModalVisible]);

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

  return (
    <>
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <Icon name="settings" size={24} color="black" />
        <Text style={styles.footerText}>Settings</Text>
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
    color: 'black', // Changed color to make the text visible
    textAlign: 'center',
    fontWeight: 'bold', // Use fontWeight instead of fontStyle for bold text
    marginTop: 4, // Add some margin to separate the icon from the text
  },
});

export default ButtonSettings;
