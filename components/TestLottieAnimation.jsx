import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const TestLottieAnimation = () => {
  const lottieViewRef = useRef(null);

  useEffect(() => {
    if (lottieViewRef.current) {
      lottieViewRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={lottieViewRef}
        source={require('../assets/anims/heartincircles.json')}
        loop
        autoPlay
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    
  },
  lottie: {
    width: 140,
    height: 140,
  },
});

export default TestLottieAnimation;
