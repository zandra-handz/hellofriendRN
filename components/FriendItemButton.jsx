import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 
const FriendItemButton = ({
    width=50,
    height=50,   
    buttonTitle='N/A',

    onPress,
    disabled=false,
}) => { 
    
    return(
        <TouchableOpacity
            onPress={ onPress ? onPress : () => {}}
            style={[styles.container, {height: height, width: width}]}
            disabled={disabled} >
            <View style={styles.blurOverlay} />

            <View style={{flexDirection: 'row', height: '100%', width: '100%',   justifyContent: 'flex-start'}}>
                
            <View style={{flexDirection: 'column', width: '100%', flex: 1}}>

                <Text style={styles.text}>{buttonTitle}</Text>

            </View>
            <View style={[styles.calendarContainer]}>
            <View style={{paddingRight: '8%'}}>
 
            </View>
                 
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        borderWidth: 0,
        padding: '4%',  
        borderColor: 'black',
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        overflow: 'hidden',
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        opacity: 0.2,  
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: '4%', 
        

    },
    calendarContainer: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '30%',
        height: '50%',
        margin: '4%',
        backgroundColor: 'transparent',

    },
});

export default FriendItemButton;