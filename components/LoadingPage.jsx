import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Flow, Swing, Chase, Circle, CircleFade, Fold, Grid, Pulse, Wander, Wave } from 'react-native-animated-spinkit';

const spinners = {
  circle: Circle,
  chase: Chase,
  swing: Swing,
  pulse: Pulse,
  grid: Grid,
  flow: Flow,
  circleFade: CircleFade,
  fold: Fold,
  wander: Wander,
  wave: Wave,
};

const LoadingPage = ({
  loading,
  spinnerSize = 90,
  color = 'limegreen',
  spinnerType = 'circle', 
}) => {
  
  if (!loading) return null;

  // Get the spinner component based on the spinnerType prop
  const Spinner = spinners[spinnerType] || Circle; // Default to Circle if spinnerType is invalid

  return (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <Spinner size={spinnerSize} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Semi-transparent background
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingPage;
