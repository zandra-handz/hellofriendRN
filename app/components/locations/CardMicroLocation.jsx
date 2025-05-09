import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 
const colorSchemes = {
    pink: {
        iconColor: '#F06292', // Light pink
        leftColumn: '#C2185B', // Dark pink
        rightColumn: '#C2185B', // Very light pink
    },
    blue: {
        iconColor: '#64B5F6', // Light blue
        leftColumn: '#1976D2', // Dark blue
        rightColumn: '#1976D2', // Very light blue
    },
    green: {
        iconColor: '#66BB6A', // Light green
        leftColumn: '#388E3C', // Dark green
        rightColumn: '#388E3C', // Very light green
    }
};

const CardMicroLocation = ({
    location,
    width,
    height,
    showBigSvg,
    onPress,
    SvgComponent,
    colorScheme = 'black' // Default color scheme
}) => {
    const calculateFontSize = (containerWidth) => containerWidth * 0.11;

    // Get the color scheme based on the provided colorScheme prop
    const { iconColor, leftColumn, rightColumn } = colorSchemes[colorScheme] || {
        iconColor: 'black',
        leftColumn: 'darkgray',
        rightColumn: 'grey'
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.relativeContainer, { width, height }]}>
                {showBigSvg && (
                    <SvgComponent width={width} height={height * 0.7} style={styles.svgImage} />
                )}
                <View style={[styles.buttonContentContainer, { width: width * 1.24, height: width * 0.8 }]}>
                    <View style={[styles.leftColumn, { backgroundColor: leftColumn }]}>
                        <View style={[styles.iconContainer, { width: width * 0.6, height: width * 0.2 }]}>
                            <SvgComponent width={width * 0.40} height={width * 0.44} color={iconColor} />
                        </View>
                    </View>
                    <View style={[styles.rightColumn, { backgroundColor: rightColumn }]}>
                        <View style={{ flex: 2 }}>
                            <Text style={[styles.titleText, { fontSize: calculateFontSize(width) }]}>
                                {location.zipCode}
                            </Text>
                        </View>
                        <View style={{ flex: 2.6 }}>
                            <Text style={[styles.titleText, { fontSize: calculateFontSize(width) }]}>
                                {location.title}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    relativeContainer: {
        position: 'relative',
    },
    buttonContentContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingLeft: 0,
        borderRadius: 30,
    },
    leftColumn: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 2,
        paddingRight: 30,
        flexDirection: 'column',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        marginRight: -2,
        position: 'relative', // Needed for absolute positioning of icon
    },
    iconContainer: {
        position: 'absolute',
        top: -1,
        padding: 3,
        zIndex: 1, // Ensure the icon is above other elements
    },
    zipCodeContainer: {
        marginTop: 22,
        alignItems: 'center', // Center zip code text horizontally
    },
    rightColumn: {
        flex: 2.8,
        justifyContent: 'center',
        padding: 10,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        marginLeft: -10,
    },
    zipCodeText: {
        fontFamily: 'Poppins-Bold',
        color: 'white',
        textAlign: 'center', // Centered text
        width: '100%',
    },
    titleText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        textAlign: 'left',
    },
    svgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
});

export default CardMicroLocation;
