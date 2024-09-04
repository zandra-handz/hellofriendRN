import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';

import ShareArrowOutlineSvg from '../assets/svgs/share-arrow-outline.svg';  

const ButtonSendImageToFriend = ({ onPress, friendName }) => { 

    return (
        <View style={styles.container}>  
                <ButtonBottomActionBase
                    onPress={onPress}
                    preLabel = ''
                    label={`Send ${friendName} This Image`}
                    height={64}
                    radius={16}
                    fontMargin={3} 
                    labelFontSize={22}  
                    labelContainerMarginHorizontal={4} 
                    showGradient={true}  
                    showShape={true}  
                    shapePosition="right"
                    shapeSource={ShareArrowOutlineSvg}  
                    shapeWidth={56}
                    shapeHeight={56}
                    shapePositionValue={6}
                    shapePositionValueVertical={4} 
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

  export default ButtonSendImageToFriend;