import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useAuthUser } from '../context/AuthUserContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useLocationList } from '../context/LocationListContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import SearchMapSvg from '../assets/svgs/search-map.svg';

import CompareTravel from '../components/CompareTravel';


import { Ionicons } from '@expo/vector-icons';
import QuickAddHello from '../speeddial/QuickAddHello';
import AlarmClockGeoSvg from '../assets/svgs/alarm-clock-geo.svg'; // Import the SVG
import LocationsOnMapSvg from '../assets/svgs/locations-on-map.svg'; // Import the SVG
import LocationsOnMapColoredSvg from '../assets/svgs/locations-on-map-colored.svg'; // Import the SVG




const ButtonSearchGoogleMap = ({ onPress }) => {
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
            modalContent={<CompareTravel/>}
            modalTitle={'Compare travel times'}


 
        > 
      </AlertImage>
            <View style={styles.buttonContainer}>

            <ButtonLottieAnimationSvg
                onPress={onPress}
                preLabel = ''
                label="Search Map"
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
                shapeSource={SearchMapSvg} // Pass the SVG component here
                shapeWidth={110}
                shapeHeight={110}
                shapePositionValue={-8}
                shapePositionValueVertical={-20}
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

  export default ButtonSearchGoogleMap;