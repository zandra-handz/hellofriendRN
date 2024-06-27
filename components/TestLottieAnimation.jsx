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
        source={require('../assets/anims/arrows.json')}
        loop
        autoPlay
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 40,
    height: 40,
  },
});

export default TestLottieAnimation;
