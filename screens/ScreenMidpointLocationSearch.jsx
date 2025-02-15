import React from 'react';
import { View, StyleSheet } from 'react-native';

import ContentFindMidpoint from '../components/ContentFindMidpoint';

const ScreenMidpointLocationSearch = () => { 

    return (
        <View style={styles.container}>
            <ContentFindMidpoint />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',  
    },
});

export default ScreenMidpointLocationSearch;
