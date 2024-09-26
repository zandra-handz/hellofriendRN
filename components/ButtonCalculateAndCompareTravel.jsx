import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import CompareTravel from '../components/CompareTravel';

import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import LocationsOnMapColoredSvg from '../assets/svgs/locations-on-map-colored.svg'; 

import AlertImage from '../components/AlertImage'; 



const ButtonCalculateAndCompareTravel = () => {
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

            
            <ButtonBottomActionBase
                onPress={openModal} 
                preLabel = ''
                label="Compare Travel Times" 
                fontMargin={3}  
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
                />

            </View> 

    );
};

const styles = StyleSheet.create({
    container: { 
      width: '100%', 
    }, 
  });

  export default ButtonCalculateAndCompareTravel;