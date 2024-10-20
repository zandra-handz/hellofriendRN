import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { Flow, Swing, Chase, Circle, CircleFade, Fold, Grid, Pulse, Wander, Wave } from 'react-native-animated-spinkit';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';

import { useSelectedFriend } from '../context/SelectedFriendContext';

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

const LoadingPageAdvancedColors = ({
  loading,
  includeLabel = false,
  label = 'Just a moment please!',
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
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend, friendDashboardData, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
  

  // Create animated values for opacity and scale
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    let timeout;
    let resultsTimeout;

    if (loading) {
      setShowSpinner(true);
      setShowResultsMessage(false); 
      timeout = setTimeout(() => {
        setShowSpinner(false);
 
        if (resultsMessage) { 
          opacity.setValue(0);
          scale.setValue(0.5);

          setShowResultsMessage(true);
 
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
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
  }, [loading, delay, resultsMessage, resultsDisplayDuration, opacity, scale]);

  // Return null if the spinner is hidden and no resultsMessage is to be shown
  if (!showSpinner && !showResultsMessage) return null;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    <View style={[styles.container, {backgroundColor:themeAheadOfLoading.darkColor }]}>
        {loadingNewFriend && themeAheadOfLoading && (
            <>
      {includeLabel && !showResultsMessage && (
        <View style={styles.textContainer}>
          <Text style={[styles.loadingTextBold, { color: themeStyles.genericText.color }]}>{label}</Text>
        </View>
      )}
      {showResultsMessage && (
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: opacity, // Apply opacity animation
              transform: [{ scale: scale }], // Apply scale animation
            },
          ]}
        >
          <Animated.Text
            style={[styles.loadingTextBold, { color: themeStyles.genericText.color }]}
          >
            {resultsMessage}
          </Animated.Text>
        </Animated.View>
      )}
      {showSpinner && (
        <View style={styles.spinnerContainer}>
          <Spinner size={spinnerSize} color={themeAheadOfLoading.lightColor} />
        </View>
      )}
      </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    justifyContent: 'center',
    alignItems: 'center', 
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
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingBottom: 20,
  },
});

export default LoadingPageAdvancedColors;
