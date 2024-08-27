import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputAddFriendName = ({ friendName, setFriendName, isFriendNameUnique, setIsFriendNameUnique, setRevealRest, friendList }) => {
    const friendNameRef = useRef(null);

    const handleFriendNameChange = (text) => {
        setFriendName(text);

        const isUnique = !friendList.some(friend => friend.name.toLowerCase() === text.toLowerCase());

        if (isUnique && text.length) {
            setIsFriendNameUnique(true);
            console.log('The value is unique.');
        } else {
            setIsFriendNameUnique(false);
            setRevealRest(false); 
            console.log('The value is already in the friend list.');
        }
    };

    const setVisibility = () => {
        if (isFriendNameUnique) {
            setRevealRest(true);
            console.log('Reveal rest of the form'); 
        }
    };

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Enter friend's name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={friendNameRef}
                    style={[styles.textInput, !isFriendNameUnique && friendName.length > 0 && styles.errorInput]}
                    value={friendName}
                    placeholder="Name" 
                    onChangeText={handleFriendNameChange}
                    onSubmitEditing={setVisibility}
                />
                {!isFriendNameUnique && friendName.length > 0 && (
                    <Text style={styles.errorText}>This name is already in your friend list. Please choose another name.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
    },
    inputContainer: {
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 18,
        padding: 10,
        fontFamily: 'Poppins-Regular',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
});

export default InputAddFriendName;
