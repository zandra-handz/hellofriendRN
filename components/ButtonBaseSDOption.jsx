import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const ButtonBaseSDOption =  ({ 
    onPress, 
    icon: Icon,
    iconSize=32,
    iconColor='white',
    includeLabel=true,
    label='label',

    }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.label}>
            <Text style={styles.labelText}>{label}</Text>
            </View>
            <View style={styles.smallCircleButton}>
                {Icon && <Icon height={iconSize} width={iconSize} color={iconColor}/>} 
            </View>  
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'pink',

    },
    smallCircleButton: { 
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',  
    },
    label: { 
        flexWrap: 'wrap',
        width: 40,
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

    },
    labelText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 13,

    },
});

export default ButtonBaseSDOption;
