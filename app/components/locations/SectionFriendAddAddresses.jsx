import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FormFriendAddressCreate from '@/src/forms/FormFriendAddressCreate';
import LocationOutlineSvg from '@/app/assets/svgs/location-outline.svg';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import { fetchFriendAddresses, deleteFriendAddress } from '@/src/calls/api';
import ButtonAddress from '@/app/components/buttons/locations/ButtonAddress';
import AlertSuccessFail from '../alerts/AlertSuccessFail';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
 
import LoadingPage from '../appwide/spinner/LoadingPage';

const SectionFriendAddAddresses = ({ toggleClose }) => {
    const { selectedFriend } = useSelectedFriend();
    const [friendAddresses, setFriendAddresses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
    const formRef = useRef(null);
    const [ isMakingCall, setIsMakingCall ] = useState(true);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    const [refetch, triggerRefetch] = useState(false);
    const { themeStyles } = useGlobalStyle();

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsMakingCall(true);
            try {
                const data = await fetchFriendAddresses(selectedFriend.id);
                setFriendAddresses(data);
            } catch (error) {
                console.error('Error fetching friend addresses:', error);
            } finally {
                setIsMakingCall(false);
            }
        };
        fetchAddresses();
    }, [selectedFriend]);

    useEffect(() => {
        if (refetch) { 
            const fetchAddresses = async () => {
                setIsMakingCall(true);
                try {
                    const data = await fetchFriendAddresses(selectedFriend.id);
                    setFriendAddresses(data);
                } catch (error) {
                    console.error('Error fetching friend addresses:', error);
                } finally {
                    setIsMakingCall(false);
                }
            };
            fetchAddresses();
            triggerRefetch(false);
        }
    }, [refetch]);

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
        setIsFormVisible(false);
        formRef.current.reset();  
    };

    const successOk = () => {
        setSuccessModalVisible(false);
        toggleClose();
        triggerRefetch(true);
    };
    
    const failOk = () => setFailModalVisible(false);
 
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <View style={styles.addressSection}>
            <View style={styles.header}>
                <LocationOutlineSvg width={38} height={38} style={themeStyles.modalIconColor} />
            </View>
            <View style={{ minHeight: 70 }}> 
                <LoadingPage 
                    loading={isMakingCall}
                    spinnerSize={50}
                    spinnerType={'circle'}
                />
    
                <View style={styles.addressRow}>
                    {friendAddresses.length > 0 &&
                        friendAddresses.map((friendAddress, index) => (
                            <View key={index} style={styles.addressItem}>
                                <ButtonAddress
                                    address={friendAddress}
                                    onDelete={() => handleDeleteAddress(friendAddress.id)}
                                />
                            </View>
                        ))
                    }
                    {!isMakingCall && ( 
                    <View style={styles.addressItem}>
                        <TouchableOpacity onPress={toggleFormVisibility} style={styles.toggleButton}>
                            <Text style={styles.buttonText}>{isFormVisible ? 'Hide Form' : 'Add New'}</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                </View>
    
                {isFormVisible && (
                    <>
                        <FormFriendAddressCreate friendId={selectedFriend.id} ref={formRef} />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                <Text style={styles.buttonText}>Add Address</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
    
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
    header: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 20,
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
        marginRight: 20,
    },
    buttonContainer: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    toggleButton: {
        backgroundColor: '#4cd137',
        paddingHorizontal: 12,
        paddingVertical: 5,
        alignContent: 'center',
        borderRadius: 20,  
        justifyContent: 'center',
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
        fontFamily: 'Poppins-Bold',
        textAlign: 'center', 
    },
});

export default SectionFriendAddAddresses;
