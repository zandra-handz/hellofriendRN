import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useGlobalStyle } from "../context/GlobalStyleContext";

const PrioritySettingSlider = forwardRef(
  ({ height=200, friendPriority, setFriendPriority, sliderColor='limegreen', trackColor='limegreen'  }, ref) => {
    const { themeStyles } = useGlobalStyle();

    // Messages for the slider
    const priorityMessages = ["High", "Medium", "Unworried"];

    const [sliderValue, setSliderValue] = useState(friendPriority);
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
          sliderRef.current.setNativeProps({ value: 1 }); // Reset to min value
          setSliderValue(1); // Reset state
        }
      },
      getValue: () => sliderValue,
    }));

    const selectedMessage = priorityMessages[Math.round(sliderValue) - 1]; // 1-based indexing

    return (
     <View style={[styles.container, {height: height}]}>
        <Text style={[styles.sectionTitle, themeStyles.subHeaderText]}>
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
              if (setFriendPriority) setFriendPriority(value);
            }}
            step={1}
            thumbTintColor={sliderColor}
            minimumTrackTintColor={trackColor}
          />
          {selectedMessage && (
            <Text style={[styles.value, themeStyles.subHeaderText]}>
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
