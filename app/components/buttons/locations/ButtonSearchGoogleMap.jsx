import React from 'react';
import { View, StyleSheet } from 'react-native'; 
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import SearchMapSvg from '@/app/assets/svgs/search-map.svg';
 




const ButtonSearchGoogleMap = ({ onPress }) => {

    return (
        <View style={styles.container}>

            <View style={styles.buttonContainer}>

            <ButtonBottomActionBase
                onPress={onPress}
                preLabel = ''
                label="Search Map"
                height={64}
                radius={16}
                fontMargin={3} 
                labelFontSize={22}  
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true}  
                showShape={true}  
                shapePosition="right"
                shapeSource={SearchMapSvg}  
                shapeWidth={110}
                shapeHeight={110}
                shapePositionValue={-8}
                shapePositionValueVertical={-20} 
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