import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from 'react-native';
import ActionPageBase from './ActionPageBase';
import SectionAccessibilitySettings from './SectionAccessibilitySettings';
import { useAuthUser } from '../context/AuthUserContext';

const ActionPageSettings = ({ visible, onClose }) => {
    const { authUserState } = useAuthUser();
    const [testSwitchValue, setTestSwitchValue] = useState(false);

    // Ensure state initialization based on props or context
    useEffect(() => {
        // Initialize state based on authUserState or other context
        setTestSwitchValue(authUserState.someValue || false);
    }, [authUserState]);

    const handleTestSwitchToggle = () => {
        setTestSwitchValue(prevState => !prevState);
    };

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
