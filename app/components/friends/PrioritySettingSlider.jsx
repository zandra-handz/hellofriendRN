import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; 

const PrioritySettingSlider = forwardRef(
  ({ height=200, friendPriority,  sliderColor='limegreen', trackColor='limegreen' , primaryColor='orange' }, ref) => {
 

    // Messages for the slider
    const priorityMessages = ["Unworried", "Medium", "High"];

    const sliderRef = useRef(null);

//this function MUST be placed before the useState declaration using it
//this function exists because I want priority to go in same direction as effort
//and it does not on the backend, thanks to me
    const invertValue = (value) => {

      console.log('running invertValue function on: ', value);
      if (value === 2) {
        console.log('not inverting');
        return value;
      }

      if (value < 2) {
        console.log('inverting to 3');
        return 3;
      }

      if (value === 3) {
        console.log('inverting to 1');
        return 1;
      }
    }

    
    const [sliderValue, setSliderValue] = useState(invertValue(friendPriority));

    // Expose methods to the parent via ref
    useImperativeHandle(ref, () => ({
      setValue: (newValue) => {
        if (sliderRef.current) { 
          sliderRef.current.setNativeProps({ value: newValue }); // Use transformed value
          setSliderValue(newValue); 
        }
      },
      clearValue: () => {
        if (sliderRef.current) {
          sliderRef.current.setNativeProps({ value: 1 }); // Reset to min value
          setSliderValue(1); // Reset state
        }
      },
      getValue: () => invertValue(sliderValue),
    }));

    const selectedMessage = priorityMessages[Math.round(sliderValue) - 1]; // 1-based indexing

    return (
     <View style={[styles.container, {height: height}]}>
        <Text style={[styles.sectionTitle, { color: primaryColor}]}>
          Priority placed on friendship
        </Text>
        <View style={styles.innerContainer}>
          <Slider
            ref={sliderRef}
            style={styles.slider}
            minimumValue={1}
            maximumValue={3}
            value={sliderValue}
            onValueChange={(value) => {
              setSliderValue(value);
              // if (setFriendPriority) setFriendPriority(value);
            }}
            step={1}
            thumbTintColor={sliderColor}
            minimumTrackTintColor={trackColor}
          />
          {selectedMessage && (
            <Text style={[styles.value, {color: primaryColor}]}>
              {selectedMessage}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

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

export default PrioritySettingSlider;
