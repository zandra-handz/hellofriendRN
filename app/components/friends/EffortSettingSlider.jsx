import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; 

const EffortSettingSlider = forwardRef(({ height=200, friendEffort,  sliderColor='limegreen', trackColor='limegreen', primaryColor='orange' }, ref) => {
 
  
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
    <View style={[styles.container, {height: height}]}>
      <Text style={[styles.sectionTitle, {color: primaryColor}]}>
        Effort needed to maintain friendship
      </Text>
      <View style={styles.innerContainer}>
        <Slider
          ref={sliderRef}
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value); 
          }}
          step={1}
          thumbTintColor={sliderColor}
          minimumTrackTintColor={trackColor}
        />
        {selectedMessage && <Text style={[styles.value, {color: primaryColor}]}>{selectedMessage}</Text>}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    lineHeight: 26, 
    //fontWeight: 'bold',
  },
  innerContainer: {
    //alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    //backgroundColor: 'pink', 
    //paddingTop: '4%',
    width: '100%',
  },
  slider: {  
    paddingVertical: '2%',
  },
  value: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default EffortSettingSlider;
