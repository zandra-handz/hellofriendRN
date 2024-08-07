import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text, ActivityIndicator, ScrollView } from 'react-native';
import LoadingPage from '../components/LoadingPage'; // Assuming you still want to use this

const AlertList = ({
    fixedHeight,
    height,
    isModalVisible,
    isFetching,
    closeAfterFetching = false,
    useSpinner,
    toggleModal,
    headerContent,
    content,
    onConfirm,
    onCancel,
    bothButtons = false,
    confirmText = 'OK',
    cancelText = 'Nevermind',
    type = 'success', // Can be 'success' or 'failure'
}) => {
    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, fixedHeight && { height }]}>
                    {headerContent && <View style={styles.headerContainer}>{headerContent}</View>}
                    {useSpinner && isFetching ? (
                        <LoadingPage loading={isFetching} spinnerType='circle' />
                    ) : (
                        <> 
                        <ScrollView contentContainerStyle={[styles.contentContainer, borderRadius=20]}>
                            {content}
                        </ScrollView>
                    
                        <View style={styles.buttonContainer}>
                            {bothButtons && ( 
                            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                                <Text style={styles.buttonText}>{confirmText}</Text>
                            </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={onCancel} style={[styles.cancelButton, type === 'success' && styles.successCancelButton]}>
                                <Text style={styles.buttonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        </View>
                        </>
                     )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        maxHeight: '68%', // Ensure content only takes up 50% of the height
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: 20,
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        borderRadius: 20, 
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 20,
        marginVertical: 6,
        width: '100%', // Full width
        alignItems: 'center', // Center text inside button
    },
    cancelButton: {
        backgroundColor: 'green', // Default cancel color
        padding: 10,
        borderRadius: 20,
        marginVertical: 6,
        width: '100%', // Full width
        alignItems: 'center', // Center text inside button
    },
    successCancelButton: {
        backgroundColor: '#388E3C', // Dark green for success type
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold', // Match font family from AlertConfirm
    },
});

export default AlertList;
