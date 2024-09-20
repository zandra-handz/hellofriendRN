import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FormFriendAddressCreate from '../forms/FormFriendAddressCreate';
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendAddresses, deleteFriendAddress } from '../api';
import ButtonAddress from './ButtonAddress';
import AlertSuccessFail from '../components/AlertSuccessFail';
import ButtonToggleSize from '../components/ButtonToggleSize';

const SectionFriendAddAddresses = ({ title }) => {
    const { selectedFriend } = useSelectedFriend();
    const [friendAddresses, setFriendAddresses] = useState([]);
    const [toggleAddressForm, setToggleAddressForm] = useState(false);
    const formRef = useRef(null);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await fetchFriendAddresses(selectedFriend.id);
                setFriendAddresses(data);
            } catch (error) {
                console.error('Error fetching friend addresses:', error);
            }
        };
        fetchAddresses();
    }, [selectedFriend]);

    const handleDeleteAddress = async (addressId) => {
        try {
            await deleteFriendAddress(selectedFriend.id, addressId);
            fetchAddresses(); // Refresh addresses after deletion
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleToggleAddressForm = () => {
        setToggleAddressForm(prevState => !prevState);
    };

    const handleConfirm = async () => {
        if (formRef.current) {
            const isSuccess = await formRef.current.submit();
            if (isSuccess) {
                setSuccessModalVisible(true);
                fetchAddresses();
            } else {
                setFailModalVisible(true);
            }
        }
    };

    const handleCancel = () => {
        setToggleAddressForm(false);
        formRef.current.reset(); // Ensure reset is available in the form
    };

    const successOk = () => setSuccessModalVisible(false);
    const failOk = () => setFailModalVisible(false);

    return (
        <View style={styles.container}>
            <ButtonToggleSize
                title={title}
                onPress={handleToggleAddressForm}
                iconName="map"
                style={styles.buttonToggleSize}
            />
            {toggleAddressForm && (
                <View style={styles.addressSection}>
                    <LocationOutlineSvg width={28} height={28} color='black' />
                    <View>
                        {friendAddresses.length > 0 ? (
                            <View style={[styles.addressRow, { marginLeft: 34 }]}>
                                {friendAddresses.map((friendAddress, index) => (
                                    <View key={index} style={styles.addressSection}>
                                        <ButtonAddress
                                            address={friendAddress}
                                            onDelete={() => handleDeleteAddress(friendAddress.id)}
                                        />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text>No addresses available.</Text>
                        )}
                        <FormFriendAddressCreate friendId={selectedFriend.id} ref={formRef} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                <Text style={styles.buttonText}>Add Address</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            <AlertSuccessFail
                isVisible={isSuccessModalVisible}
                message='Address added!'
                onClose={successOk}
                type='success'
            />
            <AlertSuccessFail
                isVisible={isFailModalVisible}
                message='Could not add address :('
                onClose={failOk}
                tryAgain={false}
                type='failure'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    buttonToggleSize: {
        backgroundColor: '#e63946',
        width: 70,
        height: 35,
        borderRadius: 20,
    },
    addressRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addressSection: { 
        marginBottom: 10,
    },
    buttonContainer: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 20,
        flex: 1,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default SectionFriendAddAddresses;
