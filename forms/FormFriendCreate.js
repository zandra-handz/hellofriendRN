import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../api';
import useFriendList from '../hooks/UseFriendList'; // Import hook to access friendList state

function FormFriendCreate() {
    const [friendName, setFriendName] = useState('');
    const [firstName, setFirstName] = useState('John'); // Dummy value for first name
    const [lastName, setLastName] = useState('Doe'); // Dummy value for last name
    const [lastDate, setLastDate] = useState('');
    const [successMessage, setSuccessMessage] = useState(null); // State for success message
    const { friendList, setFriendList } = useFriendList([]); // Access friendList state

    const createFriend = async () => {
        const formattedDate = new Date(lastDate).toISOString().split('T')[0]; // Extract date part without time

        const postData = {
            name: friendName,
            first_name: firstName,
            last_name: lastName,
            first_meet_entered: formattedDate
        };

        try {
            const res = await api.post('/friends/create/', postData);
            if (res.status === 201) {
                const { id, name } = res.data; // Extract ID and name from response data
                setFriendList([...friendList, { id, name }]); // Add new friend to the friend list
                setSuccessMessage('Friend created!'); // Set success message
                // Reset form fields
                setFriendName('');
                setFirstName(''); // Reset first name
                setLastName(''); // Reset last name
                setLastDate('');
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            } else {
                alert('Failed to make friend.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Add a Friend</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={friendName}
                onChangeText={setFriendName}
            />
            <TextInput
                style={styles.input}
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last meet up"
                value={lastDate}
                onChangeText={setLastDate}
            />
            <Button title="Submit" onPress={createFriend} />
            {successMessage && (
                <Text style={styles.successMessage}>{successMessage}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    successMessage: {
        marginTop: 10,
        color: 'green',
    },
});

export default FormFriendCreate;
