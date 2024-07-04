import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';
import { AccessibilityInfo } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';

const ActionPageSettings = ({ visible, onClose }) => {
    const { authUserState } = useAuthUser();

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
            AccessibilityInfo.announceForAccessibility(visible ? 'Settings modal opened.' : 'Settings modal closed.');
        };

        // Announce accessibility state change when modal visibility changes
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
