import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ActionPageBase from './ActionPageBase'; // Import ActionPageBase component
import { useAuthUser } from '../context/AuthUserContext';

const ActionPageSettings = ({ visible, onClose }) => {
    const { authUserState } = useAuthUser();

    // Dummy components for sections
    const AccessibilitySettings = () => (
        <View>
            <Text>Accessibility settings content goes here</Text>
        </View>
    );

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

    // Define sections for ActionPageBase
    const sections = [
        { title: 'Accessibility', content: <AccessibilitySettings /> },
        { title: 'User Settings', content: <UserSettings /> },
        { title: 'Friends', content: <FriendsSettings /> },
    ];

    // Footer content for ActionPageBase
    const footerContent = "© badrainbowz 2024"; // Copyright info

    return (
        <ActionPageBase
            visible={visible}
            onClose={onClose}
            sections={sections}
            showFooter={true}
            footerContent={footerContent}
        />
    );
};

export default ActionPageSettings;
