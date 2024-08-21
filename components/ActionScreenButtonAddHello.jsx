import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import { useGlobalStyle } from '../context/GlobalStyleContext';


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
    arrowContainer: {
      flexDirection: 'column',
      marginRight: -4,
  
    },
    arrowButton: {
      padding: 4,
      marginRight: -8,
      marginLeft: -10,
    },
    animatedView: {
      flex: 1,
    },
    svgContainer: {
      width: 60,
      height: 60,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    SvgImage: {
      transform: [{ scale: 0.8 }],
    }, 
    svgFSContainer: {
      width: 60,
      height: 50,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center', 
      paddingTop: 20,
      marginBottom: -6,
    },
    SvgFSImage: {
      transform: [{ scale: 1.22 }],
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default ActionScreenButtonAddHello;
  
