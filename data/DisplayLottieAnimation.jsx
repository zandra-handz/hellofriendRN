import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const DisplayLottieAnimation = ({
  label,
  animationSource,
  rightSideAnimation = false,
  labelFontSize = 20,
  labelColor = 'black',
  backgroundColor = 'transparent',
  animationWidth = 40,
  animationHeight = 40,
  fontMargin = 10,
  animationHMargin = 0,
  animationVMargin = 0,
  animationBMargin = 0, // New prop for adjusting animation's bottom padding
}) => {
  const lottieViewRef = useRef(null);

  useEffect(() => {
    if (lottieViewRef.current && animationSource) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    }
  }, [animationSource]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {rightSideAnimation ? (
        <>
          <Text
            style={[
              styles.label,
              {
                fontSize: labelFontSize,
                color: labelColor,
                marginHorizontal: fontMargin,
              },
            ]}
          >
            {label}
          </Text>
          {animationSource && (
            <LottieView
              ref={lottieViewRef}
              source={animationSource}
              loop
              autoPlay
              style={{
                width: animationWidth,
                height: animationHeight,
                marginHorizontal: animationHMargin,
                marginVertical: animationVMargin,
                marginBottom: animationBMargin, // Adjust padding here
              }}
              onError={(error) =>
                console.error('Error rendering animation:', error)
              }
            />
          )}
        </>
      ) : (
        <>
          {animationSource && (
            <LottieView
              ref={lottieViewRef}
              source={animationSource}
              loop
              autoPlay
              style={{
                width: animationWidth,
                height: animationHeight,
                marginHorizontal: animationHMargin,
                marginVertical: animationVMargin,
                marginBottom: animationBMargin, // Adjust padding here
              }}
              onError={(error) =>
                console.error('Error rendering animation:', error)
              }
            />
          )}
          <Text
            style={[
              styles.label,
              {
                fontSize: labelFontSize,
                color: labelColor,
                marginHorizontal: fontMargin,
              },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
    justifyContent: 'flex-start',
    borderRadius: 10,
    padding: 5,
  },
  label: {
    fontFamily: 'Poppins-Regular', // Apply the custom font family
  },
});

export default DisplayLottieAnimation;
