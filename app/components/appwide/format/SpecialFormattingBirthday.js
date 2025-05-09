import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const getZodiacSign = (month, day) => {
    // Determine the zodiac sign based on the month and day
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return 'Aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return 'Taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        return 'Gemini';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        return 'Cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return 'Leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return 'Virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        return 'Libra';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        return 'Scorpio';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        return 'Sagittarius';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return 'Capricorn';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return 'Aquarius';
    } else {
        return 'Pisces';
    }
};

const SpecialFormattingBirthday = ({ birthDate }) => {
    // Check if birthDate is valid
    if (!birthDate || typeof birthDate !== 'string' || birthDate.split('-').length !== 3) {
        return null;
    }

    // Parse the birthDate string into year, month, and day
    const [year, month, day] = birthDate.split('-').map(Number);

    // Construct the date object
    const date = new Date(year, month - 1, day);

    const formatDate = (date) => {
        const options = { month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const zodiacIconMap = {
        Aries: 'fire',
        Taurus: 'bullseye',
        Gemini: 'gem',
        Cancer: 'moon',
        Leo: 'lion',
        Virgo: 'virgo',
        Libra: 'balance-scale',
        Scorpio: 'scorpion',
        Sagittarius: 'bowling-ball',
        Capricorn: 'mountain',
        Aquarius: 'water',
        Pisces: 'fish',
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="birthday-cake" size={21} color="black" style={{ marginLeft: 0, marginRight: 11 }} />
            <Text>{formatDate(date)} </Text>
            <FontAwesome5 name={zodiacIconMap[getZodiacSign(month, day)]} size={20} color="black" style={{ marginLeft: 6 }} />
        </View>
    );
};

export default SpecialFormattingBirthday;
