import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
 

import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 
 

const ButtonSendImageToFriend = ({ onPress, friendName }) => { 

    return (
        <View style={styles.container}> 
            <View style={styles.buttonContainer}> 
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
                    shapeSource={DistanceDottedSvg}  
                    shapeWidth={86}
                    shapeHeight={86}
                    shapePositionValue={-4}
                    shapePositionValueVertical={-14}
                    showIcon={false}  
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

  export default ButtonSendImageToFriend;