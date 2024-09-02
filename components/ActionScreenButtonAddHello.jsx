import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';

const ActionScreenButtonAddHello = ({ onPress }) => {

    return (
        <View style={styles.container}>
            <ButtonLottieAnimation
                onPress={onPress}
                label="HELLO"
                showIcon={false}
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}
                labelFontSize={30}
                labelColor="white"
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                shapePosition="right"
                shapePositionValue={-50}
                shapeSource={require("../assets/shapes/coffeecupnoheart.png")}
                shapeWidth={170}
                shapeHeight={170} 
            />
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      width: '100%', 
      borderRadius: 30,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center', 
    }, 
  });
  
  export default ActionScreenButtonAddHello;
  
