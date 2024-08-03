import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Flow, Circle, CircleFade, Fold } from 'react-native-animated-spinkit';

const spinners = {
  circle: Circle,
  flow: Flow,
  circleFade: CircleFade,
  fold: Fold,
};

const LoadingPage = ({
  loading,
  spinnerSize = 90,
  color = 'limegreen',
  spinnerType = 'circle', // Default to 'circle'
}) => {
  // Only render the component if loading is true
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
