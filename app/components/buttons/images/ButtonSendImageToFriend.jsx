import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonBottomActionBase from '@/src/components/ButtonBottomActionBase';

import ShareArrowOutlineSvg from '@/app/assets/svgs/share-arrow-outline.svg';  

const ButtonSendImageToFriend = ({ onPress, friendName }) => { 

    return (
        <View style={styles.container}>  
                <ButtonBottomActionBase
                    onPress={onPress}
                    preLabel = ''
                    label={`Send to ${friendName}`}
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
      width: '100%', 
    },    
  });

  export default ButtonSendImageToFriend;