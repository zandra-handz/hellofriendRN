import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';

import CompareTravel from '../components/CompareTravel';


import LocationsOnMapColoredSvg from '../assets/svgs/locations-on-map-colored.svg'; // Import the SVG




const ButtonReviewNewFriendDetails = () => { 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);

    const closeModal = () => setIsModalVisible(false);


    return (
        <View style={styles.container}> 

            <ButtonLottieAnimationSvg
                onPress={openModal}
                preLabel = ''
                label="Review"
                height={64}
                radius={16}
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}
                labelFontSize={22} 
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true} // Add this if you want to show the gradient
                showShape={true} // Ensure this is true to display the SVG shape
                shapePosition="right"
                shapeSource={LocationsOnMapColoredSvg} // Pass the SVG component here
                shapeWidth={110}
                shapeHeight={110}
                shapePositionValue={-14}
                shapePositionValueVertical={-23}
                showIcon={false}  
                />
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

  export default ButtonReviewNewFriendDetails;