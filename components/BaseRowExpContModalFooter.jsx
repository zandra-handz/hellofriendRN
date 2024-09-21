import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import your context hook
import ToggleButton from '../components/ToggleButton';
import ButtonToggleSize from '../components/ButtonToggleSize';


const BaseRowExpContModalFooter = ({
    iconName,
    iconSize,
    label,
    useToggle = true,
    value,
    onTogglePress,
    useAltButton = false,
    onAltButtonPress,
    altIsSimpleText = false,
    altButtonText = 'Alt Bt Txt',
    altButtonOther,
    altButtonComplete,
    useCustom = false,
    customLabel,
    onCustomPress,
    children,  
}) => {
    const { themeStyles } = useGlobalStyle();

    const handleToggleExpand = () => {
        if (onTogglePress) {
            onTogglePress(); // Call the parent's toggle function
        }
        if (onAltButtonPress) {
            onAltButtonPress(); // Call alt button press function if provided
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5 name={iconName} size={iconSize} style={[styles.icon, themeStyles.modalIconColor]} />
                    <Text style={[styles.label, themeStyles.modalText]}>{label}</Text>
                    {useCustom && onCustomPress && (
                        <TouchableOpacity onPress={onCustomPress} style={styles.customButton}>
                            <Text>{customLabel}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <>
                    {useToggle && !useAltButton && (
                        <ToggleButton value={value} onToggle={onTogglePress} />
                    )}
                    {useAltButton && (
                        <>
                            {altIsSimpleText && altButtonText && (
                                <TouchableOpacity onPress={handleToggleExpand} style={styles.customButton}>
                                    <Text>{altButtonText}</Text>
                                </TouchableOpacity>
                            )}
                            {!altIsSimpleText && altButtonOther && (
                                <ButtonToggleSize
                                    title={''}
                                    onPress={onTogglePress}
                                    iconName={altButtonOther}
                                    style={styles.buttonToggleSize}
                                /> 
                            )}
                            {!altIsSimpleText && altButtonComplete && (
                                <View>{altButtonComplete ? altButtonComplete : null}</View>
                            )}
                        </>
                    )}
                </>
            </View>
            {value && ( // Use the value prop to determine visibility
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    customButton: {
        marginLeft: 6,
        borderRadius: 15,
        backgroundColor: '#ccc',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    buttonToggleSize: {
        backgroundColor: '#e63946',
        width: 70,
        height: 35,
        borderRadius: 20,
    },
    altButton: {
        borderRadius: 15,
        paddingVertical: 4,
        alignContent: 'center',
        paddingHorizontal: 10,
    },
    content: {
        marginTop: 8,
        padding: 0, 
        borderRadius: 10, 
    },
});

export default BaseRowExpContModalFooter;
