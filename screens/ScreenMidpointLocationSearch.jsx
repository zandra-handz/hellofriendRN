import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { useAuthUser } from '../context/AuthUserContext'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';


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
        padding: 20,
    },
});

export default ScreenMidpointLocationSearch;
