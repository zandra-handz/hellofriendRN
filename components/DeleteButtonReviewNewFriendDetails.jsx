import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
 
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';

 
 


const ButtonReviewNewFriendDetails = () => { 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);

    const closeModal = () => setIsModalVisible(false);


    return (
        <View style={styles.container}> 

            <ButtonBottomActionBase
                onPress={openModal}
                preLabel = ''
                label="Review"
                height={64}
                radius={16}
                fontMargin={3} 
                labelFontSize={22}  
                labelContainerMarginHorizontal={4} 
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