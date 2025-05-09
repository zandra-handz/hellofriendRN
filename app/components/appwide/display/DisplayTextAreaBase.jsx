import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import DisplayModalFocus from '../components/DisplayModalFocus';
import MaximizeOutlineSvg from '@/app/assets/svgs/maximize-outline.svg';  

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const DisplayTextAreaBase = ({ 
    containerText = 'hi',
    displayText = '',
    placeholderText = 'None',   
    width = '100%',
    height = 240, // Add height prop for scrollable area
    borderColor = 'lightgray',
}) => {

    const { themeStyles } = useGlobalStyle();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
            <Text style={[styles.title, themeStyles.subHeaderText]}>
                {containerText}
            </Text>
            <TouchableOpacity onPress={handleOpenModal} >
                    <MaximizeOutlineSvg height={20} width={20} color={themeStyles.genericIcon.color} />
            </TouchableOpacity>
            </View>
            <View style={[styles.inner, themeStyles.genericTextBackgroundShadeTwo, {borderColor: borderColor}]}>
                <ScrollView style={[styles.scrollArea, { width, height }]}>
                    <Text style={[styles.displayText, themeStyles.genericText]}>
                        {displayText || placeholderText}
                    </Text>
                </ScrollView>


            </View>

            <DisplayModalFocus
                isModalVisible={isModalVisible}
                handleCloseModal={handleCloseModal}
                displayText={displayText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: '100%',
        height: 240,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',  
    },
    titleRow: {
        width: '100%',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row', 
        paddingBottom: 10,

    },
    inner: {
        flex: 1,   
        width: '100%', 
        padding: 14,
        borderWidth: .4,
        borderRadius: 20, 
    },
    scrollArea: {
        flex: 1,
        borderRadius: 20,
    },
    displayText: { 
        fontFamily: 'Poppins-Regular',
        fontSize: 14, 
    },
    maxButtonContainer: {
        position: 'absolute',
        top: -52,
        right: -22,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        zIndex: 2,
    },
});

export default DisplayTextAreaBase;
