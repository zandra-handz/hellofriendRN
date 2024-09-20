import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FormFriendAddressCreate from '../forms/FormFriendAddressCreate';
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchFriendAddresses, deleteFriendAddress } from '../api';
import ButtonAddress from './ButtonAddress';
import AlertSuccessFail from '../components/AlertSuccessFail';
import ToggleButton from '../components/ToggleButton'; // Ensure you have this component
import BaseRowExpContModalFooter from '../components/BaseRowExpContModalFooter';

const RowExpFriendAddAddresses = ({ title }) => {
    const { selectedFriend } = useSelectedFriend();
    const [friendAddresses, setFriendAddresses] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef(null);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    const [refetch, triggerRefetch] = useState(false);

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
    }, [selectedFriend ]);


    useEffect(() => {
        if (refetch) {
        const fetchAddresses = async () => {
            try {
                const data = await fetchFriendAddresses(selectedFriend.id);
                setFriendAddresses(data);
            } catch (error) {
                console.error('Error fetching friend addresses:', error);
            }
        };
        fetchAddresses();
        triggerRefetch(false);
    } 
    }, [ refetch]);


    const handleDeleteAddress = async (addressId) => {
        try {
            await deleteFriendAddress(selectedFriend.id, addressId);
            fetchAddresses(); // Refresh addresses after deletion
        } catch (error) {
            console.error('Error deleting address:', error);
        }
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
        setIsExpanded(false);
        formRef.current.reset(); // Ensure reset is available in the form
    };

    const successOk = () => {
        setSuccessModalVisible(false); 
        setIsExpanded(false);
        triggerRefetch(true);

    };
    const failOk = () => setFailModalVisible(false);

    return (
        <View style={styles.container}>
            <BaseRowExpContModalFooter
                iconName="map"
                iconSize={20}
                label={title}
                useToggle={true}
                value={isExpanded}
                onTogglePress={() => setIsExpanded(!isExpanded)}
                useAltButton={false}
                altButtonText="Add Address"
                onAltButtonPress={() => setIsExpanded(true)} // Expand when adding an address
            >
                <View style={styles.addressSection}>
                    <LocationOutlineSvg width={28} height={28} color='black' />
                    <View>
                        {friendAddresses.length > 0 ? (
                            <View style={styles.addressRow}>
                                {friendAddresses.map((friendAddress, index) => (
                                    <View key={index} style={styles.addressItem}>
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
            </BaseRowExpContModalFooter>
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
        padding: 16,
    },
    addressRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addressSection: {
        marginTop: 10,
    },
    addressItem: {
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
});

export default RowExpFriendAddAddresses;
