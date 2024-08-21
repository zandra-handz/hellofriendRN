import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
  includeLabel = false,
  label = 'Just a moment please!',
  spinnerSize = 90,
  color = 'limegreen',
  spinnerType = 'wander',
}) => {

  if (!loading) return null;

  // Get the spinner component based on the spinnerType prop
  const Spinner = spinners[spinnerType] || Circle; // Default to Circle if spinnerType is invalid

  return (
    <View style={styles.container}>
      {includeLabel && (
        <View style={styles.textContainer}>
          <Text style={styles.loadingTextBold}>{label}</Text>
        </View>
      )}
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
  textContainer: {
    position: 'absolute',
    top: '36%', // Position the text above the spinner, can be adjusted
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTextBold: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default LoadingPage;
