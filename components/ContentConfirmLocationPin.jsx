import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; // Import the SVG


const ContentConfirmLocationPin = () => {

    return (
        <View>
            <PushPinSolidSvg width={18} height={18} color='black' />
                    
        </View>
    )
};

export default ContentConfirmLocationPin;