import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { Flow, Swing, Chase, Circle, CircleFade, Fold, Grid, Pulse, Wander, Wave } from 'react-native-animated-spinkit';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

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
  labelColor = 'white',
  resultsMessage = null, // Optional results message
  spinnerSize = 90,
  color = 'limegreen',
  spinnerType = 'wander',
  delay = 0, // Delay in milliseconds before the spinner hides
  resultsDisplayDuration = 2000, // Duration to show results message (default 3 seconds)
}) => {
  const [showSpinner, setShowSpinner] = useState(loading); // Initialize state with the loading prop
  const [showResultsMessage, setShowResultsMessage] = useState(false); // State for showing results message
  const { themeStyles } = useGlobalStyle();

  // Create animated values for opacity, scale, and color flash
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const colorFlash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeout;
    let resultsTimeout;

    if (loading) {
      setShowSpinner(true);
      setShowResultsMessage(false); // Reset results message when loading starts
    } else {
      timeout = setTimeout(() => {
        setShowSpinner(false);

        // If resultsMessage is provided, show it after the spinner stops
        if (resultsMessage) {
          // Reset the opacity, scale, and color flash
          opacity.setValue(0);
          scale.setValue(0.5);
          colorFlash.setValue(0);

          setShowResultsMessage(true);

          // Animate the opacity, scale, and color flash (expand and fade in with spring effect)
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 5,
              tension: 100,
              useNativeDriver: true,
            }),
            Animated.loop(
              Animated.sequence([
                Animated.timing(colorFlash, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: false,
                }),
                Animated.timing(colorFlash, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: false,
                }),
              ])
            ).start(),
          ]).start();

          resultsTimeout = setTimeout(() => {
            // Animate fade out and shrink
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(scale, {
                toValue: 0.5,
                duration: 500,
                useNativeDriver: true,
              }),
            ]).start(() => setShowResultsMessage(false)); // Hide the message after animation
          }, resultsDisplayDuration);
        }
      }, delay);
    }

    // Cleanup timeouts on unmount or when loading changes
    return () => {
      clearTimeout(timeout);
      clearTimeout(resultsTimeout);
    };
  }, [loading, delay, resultsMessage, resultsDisplayDuration, opacity, scale, colorFlash]);

  // Interpolate the color flash animation
  const interpolatedColor = colorFlash.interpolate({
    inputRange: [0, 1],
    outputRange: ['limegreen', 'cyan'], // Customize colors here
  });

  // Return null if the spinner is hidden and no resultsMessage is to be shown
  if (!showSpinner && !showResultsMessage) return null;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    <View style={styles.container}>
      {includeLabel && !showResultsMessage && (
        <View style={styles.textContainer}>
          <Text style={[styles.loadingTextBold, { color: labelColor }]}>{label}</Text>
        </View>
      )}
      {showResultsMessage && (
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: opacity,
              transform: [{ scale: scale }],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.loadingTextBold,
              { color: interpolatedColor },
            ]}
          >
            {resultsMessage}
          </Animated.Text>
        </Animated.View>
      )}
      {showSpinner && (
        <View style={styles.spinnerContainer}>
          <Spinner size={spinnerSize} color={color} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  textContainer: {
    position: 'absolute',
    top: '36%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTextBold: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingBottom: 20,
  },
});

export default LoadingPage;
