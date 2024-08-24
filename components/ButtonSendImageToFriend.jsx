import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
 
 
import ShareOutlineLongSvg from '../assets/svgs/share-outline-long.svg';
import ShareArrowOutlineSvg from '../assets/svgs/share-arrow-outline.svg';  

const ButtonSendImageToFriend = ({ onPress, friendName }) => { 

    return (
        <View style={styles.container}>  
                <ButtonLottieAnimationSvg
                    onPress={onPress}
                    preLabel = ''
                    label={`Send ${friendName} This Image`}
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
                    showGradient={true}  
                    showShape={true}  
                    shapePosition="right"
                    shapeSource={ShareArrowOutlineSvg}  
                    shapeWidth={56}
                    shapeHeight={56}
                    shapePositionValue={6}
                    shapePositionValueVertical={4}
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

  export default ButtonSendImageToFriend;