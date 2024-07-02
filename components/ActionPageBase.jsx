import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, PanResponder, Animated } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ActionPageBase = ({ visible, onClose, sections, showFooter = false, footerContent }) => {
    const scrollRef = useRef(null);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // Check if the gesture is a downward swipe
                if (gestureState.dy > 0 && gestureState.dy > 10) {
                    // Close the modal when swiped down
                    onClose();
                }
            },
            onPanResponderRelease: () => {},
        })
    ).current;

    return (
        <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
            <View style={styles.overlay} {...panResponder.panHandlers}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome5 name="times" size={20} color="black" solid={false} />
                    </TouchableOpacity>
                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {sections.map((section, index) => (
                            <View key={index} style={styles.section}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.titleDivider}></View>
                                {section.content}
                                <View style={styles.divider}></View>
                            </View>
                        ))}
                        <View style={{ paddingBottom: 40 }} />
                    </ScrollView>
                    {showFooter && (
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>{footerContent}</Text>
                        </View>
                    )}
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    section: {
        marginBottom: 20,
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    titleDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 10,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 10,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
    },
});

export default ActionPageBase;
