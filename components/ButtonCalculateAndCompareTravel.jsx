import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';

import { Ionicons } from '@expo/vector-icons';
import QuickAddHello from '../speeddial/QuickAddHello';
import AlarmClockGeoSvg from '../assets/svgs/alarm-clock-geo.svg'; // Import the SVG



const ButtonCalculateAndCompareTravel = () => {
    const { authUserState } = useAuthUser();
    const { selectedFriend } = useSelectedFriend();
    const { selectedLocation } = useLocationList();
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);


    return (
        <View style={styles.container}>
        <AlertImage
            isModalVisible={isModalVisible} 

 
        > 
      </AlertImage>
            <View style={styles.buttonContainer}>

            <ButtonLottieAnimationSvg
                onPress={openModal}
                preLabel = ''
                label="Compare Travel Times"
                height={64}
                radius={16}
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}
                labelFontSize={22}
                labelColor="white"
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true} // Add this if you want to show the gradient
                showShape={true} // Ensure this is true to display the SVG shape
                shapePosition="right"
                shapeSource={AlarmClockGeoSvg} // Pass the SVG component here
                shapeWidth={100}
                shapeHeight={100}
                shapePositionValue={-14}
                shapePositionValueVertical={-10}
                showIcon={false} // Ensure this is set as needed
                />

            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },   
    buttonContainer: {
      height: '90%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      marginHorizontal: 0,
      paddingBottom: 6, 
      paddingTop: 0,
    },
  });

  export default ButtonCalculateAndCompareTravel;