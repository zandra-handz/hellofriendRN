import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';

const SliderThatForwardsRef = forwardRef(
  (
    {
      value = 0,
      onValueChange,
      labelStyle,
      min = 0,
      max = 100,
      messages,
      label,
    },
    ref
  ) => {
    const [sliderValue, setSliderValue] = useState(value);
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
          sliderRef.current.setNativeProps({ value: min });
          setSliderValue(min);
        }
      },
      getValue: () => sliderValue,
    }));

    const selectedMessage = messages ? messages[Math.round(sliderValue)] : null;

    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <Slider
          ref={sliderRef}
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value);
            if (onValueChange) onValueChange(value);
          }}
          step={1}
          thumbTintColor="limegreen"
          minimumTrackTintColor="limegreen"
        />
        {selectedMessage && <Text style={[styles.value, labelStyle]}>{selectedMessage}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 0,
    fontFamily: 'Poppins-Regular',
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

export default SliderThatForwardsRef;
