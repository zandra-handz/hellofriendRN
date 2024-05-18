import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ButtonsOnboardingNav from './ButtonsOnboardingNav';

const ScreenOnboardingFour = ({ onChange }) => {
    const navigation = useNavigation();
    const [friendDate, setFriendDate] = useState(new Date());
    const [nextButtonColor, setNextButtonColor] = useState('gray');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || friendDate;
        setShowDatePicker(false);

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
            <View style={styles.content}>
                <Text style={styles.message}>When was the last time you met or spoke with your friend?</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.dateText}>{moment(friendDate).format('MMMM Do YYYY')}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={friendDate}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={onChangeDate}
                    />
                )}
            </View>
            <View style={styles.bottom}>
                <ButtonsOnboardingNav
                    showPrevButton={true}
                    showNextButton={true}
                    onPrevPress={goToPrevScreen}
                    onNextPress={goToNextScreen}
                    iconColor={nextButtonColor}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
        backgroundColor: '#f0f0f0',
    },
    dateText: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
    },
    bottom: {
        paddingBottom: 20,
    },
});

export default ScreenOnboardingFour;
