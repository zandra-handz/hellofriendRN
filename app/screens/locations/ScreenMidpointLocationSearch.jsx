import React from 'react';
import { View, StyleSheet } from 'react-native';

import ContentFindMidpoint from '@/app/components/locations/ContentFindMidpoint';
import { useFriendList } from '@/src/context/FriendListContext';
const ScreenMidpointLocationSearch = () => { 
    const {  updateSafeViewGradient  } = useFriendList();
     updateSafeViewGradient(true);

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
