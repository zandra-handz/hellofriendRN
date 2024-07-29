import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import SelectorUserAddress from '../components/SelectorUserAddress';

import HelloFriendInvite from '../components/HelloFriendInvite';

import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; // Import the SVG
import SpeechBubbleEllipsisSolidSvg from '../assets/svgs/speech-bubble-ellipsis-solid.svg'; // Import the SVG
import CompassGeoSvg from '../assets/svgs/compass-geo.svg'; // Import the SVG

import InputConsiderTheDrive from './InputConsiderTheDrive';

import { Ionicons } from '@expo/vector-icons';
import QuickAddHello from '../speeddial/QuickAddHello';

const ButtonMomentCategory = ({onPress, categoryText}) => {
    const { authUserState } = useAuthUser();
    const { selectedFriend } = useSelectedFriend();
    const { selectedLocation } = useLocationList();
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);

    const closeModal = () => setIsModalVisible(false);


    return (
        <View style={styles.container}>
        <AlertImage
            isModalVisible={isModalVisible}
            toggleModal={closeModal} 
            modalContent={<HelloFriendInvite />}
            modalTitle={'Send Hello plans!'}

 
        > 
      </AlertImage>
            <View style={styles.buttonContainer}> 


            <ButtonLottieAnimationSvg
                onPress={onPress}
                preLabel = ''
                label={categoryText}
                height={46}
                radius={10}
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}
                labelFontSize={17} 
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true} // Add this if you want to show the gradient
                showShape={true} // Ensure this is true to display the SVG shape
                shapePosition="right"
                shapeSource={SpeechBubbleEllipsisSolidSvg} // Pass the SVG component here
                shapeWidth={76}
                shapeHeight={76}
                shapePositionValue={-4}
                shapePositionValueVertical={-14}
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
      paddingBottom: 0, 
      paddingTop: 0,
    },
  });

  export default ButtonMomentCategory;