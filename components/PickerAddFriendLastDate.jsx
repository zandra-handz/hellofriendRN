import React from 'react';
import { View, StyleSheet } from 'react-native';
import PickerDate from '../components/PickerDate';

const PickerAddFriendLastDate = ({ friendDate, setFriendDate, showDatePicker, setShowDatePicker }) => {
    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {
            const dateWithoutTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            );
            setFriendDate(dateWithoutTime);
            console.log('Selected Date:', dateWithoutTime);
        }
    };

    return (
        <View>
            <PickerDate
                value={friendDate}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onChangeDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                dateTextStyle={styles.dateText}
                containerStyle={styles.sectionContainer}
                labelStyle={styles.sectionTitle}
                buttonStyle={styles.datePickerButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dateText: {
        fontSize: 16,
        marginVertical: 14,
        fontFamily: 'Poppins-Regular',
    },
});

export default PickerAddFriendLastDate;
