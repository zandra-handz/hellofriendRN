 

import React from 'react';
import { View, StyleSheet } from 'react-native';  
import ContentAddFriend from '../components/ContentAddFriend';

import ButtonReviewNewFriendDetails from '../components/ButtonReviewNewFriendDetails';

const ScreenAddFriend = ({includeBottomButton = false}) => { 
   
 

    return (
        <View style={styles.container}> 
            <View style={styles.mainContainer}> 
                <ContentAddFriend />
            </View>
            {includeBottomButton && ( 
            <View style={styles.bottomContainer}> 
                    <ButtonReviewNewFriendDetails />
            </View>
             )}
     
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    mainContainer: {
        flex: 1,
        paddingBottom: 10,
    },  
    bottomContainer: {
        height: '12%', 
        padding: 0,
        paddingTop: 10,
        paddingHorizontal: 10,  
        position: 'absolute', 
        zIndex: 1,
        bottom: 0,
        right: 0,
        left: 0,
    
      },
});

export default ScreenAddFriend;
