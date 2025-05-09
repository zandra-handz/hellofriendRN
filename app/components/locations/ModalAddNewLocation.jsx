import React, { useState } from 'react';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'; 
import ShopAddOutlineSvg from '@/app/assets/svgs/shop-add-outline.svg';
import AlertFormSubmit from '../alerts/AlertFormSubmit'; 
import { useLocations } from '@/src/context/LocationsContext';

import { useFriendList } from '@/src/context/FriendListContext';
import PickerParkingType from '../selectors/PickerParkingType';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

const ModalAddNewLocation = ({
    isVisible,  
    title, 
    address,
    close,
}) => {
    const { themeStyles } = useGlobalStyle(); 
    const { friendList } = useFriendList();
    const { handleCreateLocation } = useLocations();
    
    const [parkingType, setParkingType] = useState(null);
    const [parkingTypeText, setParkingTypeText] = useState(null);
    const [typeChoices] = useState([
        'location has free parking lot', 
        'free parking lot nearby', 
        'street parking', 
        'fairly stressful or unreliable street parking',
        'no parking whatsoever',
        'unspecified'
    ]);
    const [personalExperience, setPersonalExperience] = useState('');
    const [customTitle, setCustomTitle] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [isMakingCall, setIsMakingCall] = useState(false); 

    const onParkingTypeChange = (index) => {
        setParkingType(index); 
        setParkingTypeText(`${typeChoices[index]}`); 
        console.log(`Parking type selected: ${typeChoices[index]}`);
    };

    const handleFriendSelect = (friendId) => {
        const updatedFriends = selectedFriends.includes(friendId)
            ? selectedFriends.filter(id => id !== friendId)
            : [...selectedFriends, friendId];
        setSelectedFriends(updatedFriends);
    };

    const handleSubmit = async () => {
        setIsMakingCall(true); 
        const trimmedCustomTitle = customTitle?.trim() || null;
        const friends = selectedFriends.map(id => Number(id));

        try {
            await handleCreateLocation(friends, title, address, parkingTypeText, trimmedCustomTitle, personalExperience);
             close(); // Close after submission completes
        } catch (error) {
            console.error('Error creating location:', error);
        }  
    };
 

    return (
        <AlertFormSubmit
            isModalVisible={isVisible} 
            isMakingCall={isMakingCall}
            headerContent={<ShopAddOutlineSvg width={38} height={38} color={themeStyles.modalIconColor.color} />}
            questionText="Save location"
            formBody={
                <View style={[styles.container, themeStyles.genericTextBackground]}> 
                    {showSaveMessage && <Text style={styles.saveMessage}>Location saved successfully!</Text>}
                    <Text style={[styles.title, themeStyles.subHeaderText]}>{title}</Text>
                    <Text style={[styles.address, themeStyles.genericText]}>{address}</Text>

                    <TextInput
                        style={[styles.input, themeStyles.input]}
                        value={customTitle}
                        onChangeText={setCustomTitle}
                        placeholder='Optional custom title' 
                        placeholderTextColor='darkgray'
                    />

                    <PickerParkingType 
                        containerText=''
                        selectedTypeChoice={parkingType}
                        onTypeChoiceChange={onParkingTypeChange}
                    />

                    <TextInput
                        style={[themeStyles.input, styles.textArea]}
                        value={personalExperience}
                        onChangeText={setPersonalExperience}
                        placeholder='Optional notes'
                        placeholderTextColor='darkgray'
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.friendCheckboxesContainer}>
                        <FlatList
                            data={friendList}
                            keyExtractor={(item) => item.id.toString()} // Ensure each key is unique
                            renderItem={({ item }) => (
                                <CheckBox
                                    title={item.name}
                                    checked={selectedFriends.includes(item.id)}
                                    onPress={() => handleFriendSelect(item.id)}
                                />
                            )}
                            style={styles.flatList}
                            showsVerticalScrollIndicator={false}
                        />
                    </View> 
                </View>
            }
            formHeight={610}
            onConfirm={handleSubmit}
            onCancel={() => {
                if (!isMakingCall && showSaveMessage) {
                    close();
                }
            }}
            confirmText="Save location"
            cancelText="Cancel"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0, 
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    title: {
        fontSize: 18, 
        fontFamily: 'Poppins-Bold', 
    },
    address: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular', 
    },
    saveMessage: {
        color: 'green',
        marginBottom: 10,
    },
    input: {
        height: 'auto',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10, 
        paddingHorizontal: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20, 
    },
    friendCheckboxesContainer: {
        height: 200,  
    },
    flatList: { 
    },
});

export default ModalAddNewLocation;
