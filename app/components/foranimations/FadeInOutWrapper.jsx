import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const FadeInOutWrapper = ({ isVisible, children }) => {
  const animation = useRef(new Animated.Value(0)).current;
 

 
  useEffect(() => {
    if (isVisible) { 
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else { 
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: animation,  
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
     
    zIndex: 1000,
    flex: 1,
    width: '100%', 
    ...StyleSheet.absoluteFillObject, 
    
    }, 
    fullScreen: {
        zIndex: 1000,
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.5)', // Optional background
        justifyContent: 'center',
        alignItems: 'center',

    },
});

export default FadeInOutWrapper;
