import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UICalendarPageDynamic from './UICalendarPageDynamic'; // Import the calendar component

const SoonButton = ({
    width=50,
    height=50,
    dateAsString='Tuesday, January 10',
    numDate='10',
    friendName='N/A',
    month='NOV',
    color='#000002',
    onPress,
    disabled=false,
}) => {

    const formatNumDate = (dateString) => {
        const match = dateString.match(/\d+/);  
        return match ? match[0] : '';  
      };
    
      const formatMonth = (dateString) => {
        const match = dateString.match(/([a-zA-Z]+)\s+\d+/);  
        return match ? match[1].slice(0, 3) : ''; 
      };
    
    return(
        <TouchableOpacity
            onPress={ onPress ? onPress : () => {}}
            style={[styles.container, {height: height, width: width}]}
            disabled={disabled} >
            <View style={styles.blurOverlay} />

            <View style={{flexDirection: 'row', height: '100%', width: '100%',   justifyContent: 'flex-start'}}>
                
            <View style={{flexDirection: 'column', width: '100%', flex: 1}}>

                <Text style={styles.text}>{friendName}</Text>

            </View>
            <View style={[styles.calendarContainer]}>
            <View style={{paddingRight: '8%'}}>

            <Text>{formatMonth(dateAsString)}</Text>
            </View>
                
                        <UICalendarPageDynamic
                        numberDate={formatNumDate(dateAsString)}
                        month={formatMonth(dateAsString)}
                        showMonth={false} // Hide the month inside the SVG if showMonth is true
                        width={24}
                        height={24}
                        color={'#000002'}
                        />
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
        fontSize: 14,
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

export default SoonButton;