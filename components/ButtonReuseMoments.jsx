import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import CompareTravel from '../components/CompareTravel';

import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import LocationsOnMapColoredSvg from '../assets/svgs/locations-on-map-colored.svg'; // Import the SVG

import AlertImage from '../components/AlertImage'; 


const ButtonReuseMoments = ({ onPress }) => {
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

            
            <ButtonLottieAnimationSvg 
                onPress={onPress} 
                preLabel = ''
                label="Reload moments?" 
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}  
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true} 
                showShape={true} 
                shapePosition="right"
                shapeSource={LocationsOnMapColoredSvg} 
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
      width: '100%',
      backgroundColor: 'transparent',
    }, 
  });

  export default ButtonReuseMoments;