import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import { updateUserSettings } from '../api'; // Ensure to implement this API call

const FormAccessibilityUpdate = ({ onClose }) => {
    const { authUserState } = useAuthUser();
    const [highContrastMode, setHighContrastMode] = useState(authUserState.user.settings.high_contrast_mode);
    const [largeText, setLargeText] = useState(authUserState.user.settings.large_text);
    const [receiveNotifications, setReceiveNotifications] = useState(authUserState.user.settings.receive_notifications);
    const [screenReader, setScreenReader] = useState(authUserState.user.settings.screen_reader);

    const handleSave = async () => {
        try {
            await updateUserSettings(authUserState.user.id, {
                high_contrast_mode: highContrastMode,
                large_text: largeText,
                receive_notifications: receiveNotifications,
                screen_reader: screenReader
            });
            onClose();
        } catch (error) {
            console.error('Error updating user settings:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>High Contrast Mode</Text>
                <Switch
                    value={highContrastMode}
                    onValueChange={setHighContrastMode}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Large Text</Text>
                <Switch
                    value={largeText}
                    onValueChange={setLargeText}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Receive Notifications</Text>
                <Switch
                    value={receiveNotifications}
                    onValueChange={setReceiveNotifications}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Screen Reader</Text>
                <Switch
                    value={screenReader}
                    onValueChange={setScreenReader}
                />
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        flex: 1,
    },
    saveButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FormAccessibilityUpdate;
