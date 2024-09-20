import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FormFriendAddressCreate from '../forms/FormFriendAddressCreate';
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';
import { useSelectedFriend } from '../context/SelectedFriendContext';

import { fetchFriendAddresses, deleteFriendAddress } from '../api';
import ButtonAddress from './ButtonAddress';
import AlertFormSubmit from '../components/AlertFormSubmit';
import ButtonToggleSize from '../components/ButtonToggleSize';
import AlertSuccessFail from '../components/AlertSuccessFail';

const ButtonAddFriendAddresses = ({ title }) => {
    const { selectedFriend } = useSelectedFriend();
    const [friendAddresses, setFriendAddresses] = useState([]);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const formRef = useRef(null);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    const [toggleAddressForm, setToggleAddressForm] = useState(false);
    const toggleAddressModal = () => setIsAddressModalVisible(true);
    const closeAddressModal = () => setIsAddressModalVisible(false);

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

    const successOk = () => setSuccessModalVisible(false);
    const failOk = () => setFailModalVisible(false);

    return (
        <>
            <ButtonToggleSize
                title={title}
                onPress={toggleAddressModal}
                iconName="map"
                style={styles.buttonToggleSize}
            />
            <AlertFormSubmit
                isModalVisible={isAddressModalVisible}
                toggleModal={closeAddressModal}
                headerContent={<LocationOutlineSvg width={28} height={28} color='black' />}
                questionText={``}
                formBody={
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
                        <TouchableOpacity onPress={handleToggleAddressForm}>
                            <Text>{toggleAddressForm ? 'Hide address form' : 'Add address'}</Text>
                        </TouchableOpacity>
                        {toggleAddressForm && (
                            <FormFriendAddressCreate friendId={selectedFriend.id} ref={formRef} />
                        )}
                    </View>
                }
                onConfirm={() => {
                    if (formRef.current) {
                        formRef.current.submit(); // Call submit method on the form
                    }
                    closeAddressModal(); // Close the modal after submission
                }}
                showButtons={toggleAddressForm}
                onCancel={closeAddressModal}
                confirmText="Add"
                cancelText="Nevermind"
            />
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
        </>
    );
};

const styles = StyleSheet.create({
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
});

export default ButtonAddFriendAddresses;
