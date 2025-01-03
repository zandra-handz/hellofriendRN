import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const EffortSettingSlider = forwardRef(({ friendEffort, setFriendEffort }, ref) => {
  const { themeStyles } = useGlobalStyle();
  
  // Messages for the slider
  const effortMessages = [
    'Check in twice a year',
    'Check in every 60-90 days',
    'Check in every month',
    'Check in every two weeks',
    'Check in every few days'
  ];

  const [sliderValue, setSliderValue] = useState(friendEffort);
  const sliderRef = useRef(null);

  // Expose methods to the parent via ref
  useImperativeHandle(ref, () => ({
    setValue: (newValue) => {
      if (sliderRef.current) {
        sliderRef.current.setNativeProps({ value: newValue });
        setSliderValue(newValue);
      }
    },
    clearValue: () => {
      if (sliderRef.current) {
        sliderRef.current.setNativeProps({ value: 1 });  // Reset to min value
        setSliderValue(1);  // Reset state
      }
    },
    getValue: () => sliderValue,
  }));

  const selectedMessage = effortMessages[Math.round(sliderValue) - 1];  // 1-based indexing

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, themeStyles.subHeaderText]}>
        Effort needed to maintain friendship
      </Text>
      <View style={styles.container}>
        <Slider
          ref={sliderRef}
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value);
            if (setFriendEffort) setFriendEffort(value);
          }}
          step={1}
          thumbTintColor="limegreen"
          minimumTrackTintColor="limegreen"
        />
        {selectedMessage && <Text style={[styles.value, themeStyles.subHeaderText]}>{selectedMessage}</Text>}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
  },
  container: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  slider: {
    marginHorizontal: 0,
    marginBottom: 20,
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default EffortSettingSlider;
