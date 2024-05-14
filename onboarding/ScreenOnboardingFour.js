import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import { FontAwesome } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';


const ScreenOnboardingFour = ({ onChange }) => {
    const navigation = useNavigation(); 

    const [friendDate, setFriendDate] = useState(new Date());
    const [nextButtonColor, setNextButtonColor] = useState('gray'); 
    const [showDatePicker, setShowDatePicker] = useState(false);  

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || friendDate;
        setShowDatePicker(false);  
    
        // Extracting date part without timestamp
        const dateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
        setFriendDate(dateWithoutTime);  
        console.log(dateWithoutTime);
        setNextButtonColor('hotpink');  
    };
    

    const goToNextScreen = () => {
        if (nextButtonColor === 'hotpink') {
            navigation.navigate('Five');  
            onChange(friendDate);
        }
    };

    const goToPrevScreen = () => {
        navigation.navigate('Three'); 
    };

    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Step Three</Text>
            <Text style={styles.message}>When was the last time you met or spoke with your friend?</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <Text>{friendDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={friendDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}
            <View style={styles.buttonContainer}> 
                <TouchableOpacity onPress={goToPrevScreen}>
                    <FontAwesome name="angle-left" size={34} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToNextScreen} style={[styles.button, { borderColor: nextButtonColor }]}>
                    <FontAwesome name="angle-right" size={34} color={nextButtonColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10, 
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginTop: 40,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    message: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        borderWidth: 0,
        borderRadius: 5,
    },
});

export default ScreenOnboardingFour;
