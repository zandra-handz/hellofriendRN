import React from 'react';
import { View, StyleSheet } from 'react-native';
import CardGen from './CardGen'; 
import useUpcomingHelloes from '../hooks/UseUpcomingHelloes';

const NextHelloes = () => {
    const { upcomingHelloes } = useUpcomingHelloes();

    return (
        <View style={styles.container}>
            {upcomingHelloes.map((item) => (
                <CardGen
                    title={item.friend_name}
                    description={item.future_date_in_words} 
                    key={item.id}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NextHelloes;
