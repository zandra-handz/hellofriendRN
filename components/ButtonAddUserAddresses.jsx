import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


import FormUserAddressCreate from '../forms/FormUserAddressCreate';
import LocationOutlineSvg from '../assets/svgs/location-outline.svg';

import { useAuthUser } from '../context/AuthUserContext';

import { deleteUserAddress } from '../api';
import ButtonAddress from './ButtonAddress';
import AlertFormSubmit from '../components/AlertFormSubmit';
import ButtonToggleSize from '../components/ButtonToggleSize';
import AlertSuccessFail from '../components/AlertSuccessFail';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import LoadingPage from '../components/LoadingPage';


const ButtonAddUserAddresses = ({ title }) => {
    const { authUserState, userAddresses, removeAddress} = useAuthUser();
    
    const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
    const formRef = useRef(null);
    const [ isMakingCall, setIsMakingCall ] = useState(false); 
    const { themeStyles } = useGlobalStyle();
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    const [toggleAddressForm, setToggleAddressForm] = useState(false);
    const toggleAddressModal = () => setIsAddressModalVisible(true);
    const closeAddressModal = () => setIsAddressModalVisible(false);
 
 

    useEffect(() => {
        console.log(userAddresses); 
        console.log('loggin');
    
       }, []);
    
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
            setIsFormVisible(false); 
        };
        
        const failOk = () => setFailModalVisible(false);
     
        const toggleFormVisibility = () => {
            setIsFormVisible(!isFormVisible);
        }; 
    
        // Includes a temporary 502 detector (call still works) until I fix the backend call
        const handleDeleteAddress = async (title) => {
            const result = await deleteUserAddress(authUserState.user.id, { title });
        
            if (result.success) {
                removeAddress(title);
            } else { 
                console.error('Error deleting address:', result.message);
                 
                if (result.message.includes('502')) {
                    console.warn('Received 502 error, proceeding to remove address:', title);
                    removeAddress(title);
                }
            }
        };
        

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
                    headerContent={<LocationOutlineSvg width={38} height={38} style={themeStyles.modalIconColor} />}
                    questionText={``}
                    formBody={                
                        <View style={styles.addressRow}>
                            {userAddresses.addresses.length > 0 &&
                                userAddresses.addresses.map((addressData, index) => (
                                    <View key={index} style={styles.addressItem}>
                                        <ButtonAddress 
                                            address={addressData} 
                                            onDelete={handleDeleteAddress} 
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
                            {isFormVisible && (
                                <View style={{width: '100%'}}>
                                    <FormUserAddressCreate userId={authUserState.user.id} ref={formRef} />
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                            <Text style={styles.buttonText}>Add Address</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                        </View>
                    } // Fix this line
                    onConfirm={() => {
                        if (formRef.current) {
                            formRef.current.submit(); // Call submit method on the form
                        }
                        closeAddressModal(); // Close the modal after submission
                    }}
                    showButtons={toggleAddressForm}
                    onCancel={closeAddressModal}
                    confirmText="Add"
                    cancelText="Back"
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

export default ButtonAddUserAddresses;
