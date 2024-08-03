import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, AccessibilityInfo, PanResponder } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useAuthUser } from '../context/AuthUserContext';

const ActionPageBase = ({ visible, onClose, sections, showFooter = false, footerContent }) => {
    const globalStyles = useGlobalStyle();
    const { userAppSettings } = useAuthUser();

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // Detect a significant downward swipe
                if (gestureState.dy > 50) { // Customize the threshold as needed
                    onClose();
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // Final check when the touch is released
                if (gestureState.dy > 50) { // Customize the threshold as needed
                    onClose();
                }
            },
        })
    ).current;

    useEffect(() => {
        const handleAccessibilityAnnouncement = () => {
            AccessibilityInfo.announceForAccessibility(visible ? 'Modal opened.' : 'Modal closed.');
        };

        if (visible) {
            handleAccessibilityAnnouncement();
        }
    }, [visible]);

    const adjustFontSize = (fontSize) => {
        return globalStyles.fontSize === 20 ? fontSize + 6 : fontSize;
    };

    const textStyles = (fontSize) => ({
        fontSize: adjustFontSize(fontSize),
        ...(globalStyles.highContrast && {
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 1,
        }),
    });

    return (
        <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
            <View style={styles.overlay} {...panResponder.panHandlers}>
                <View style={styles.container}>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <FontAwesome5 name="times" size={20} color="black" solid={false} />
                    </TouchableOpacity>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        accessible={true}
                        accessibilityRole="adjustable"
                        accessibilityLabel="Modal Content"
                        importantForAccessibility="yes"
                    >
                        {sections.map((section, index) => (
                            <View key={index} style={styles.section}>
                                <Text style={[styles.sectionTitle, textStyles(18)]}>{section.title}</Text>
                                
                                {section.content}
                                <View style={styles.divider}></View>
                            </View>
                        ))}
                        {showFooter && (
                            <View style={styles.footer}>
                                <Text style={[styles.footerText, textStyles(16)]}>{footerContent}</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius:  0,
        borderTopRightRadius: 0,
        padding: 12,
        width: '100%',
        maxHeight: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        marginBottom: 8,
    },
    titleDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 8,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 8,
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 10,
        alignItems: 'center',
    },
    footerText: {},
});

export default ActionPageBase;
