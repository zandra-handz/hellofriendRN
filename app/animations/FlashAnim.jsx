
import React, { useEffect, useRef } from 'react';
 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";


const FlashAnim = ({
    children,
    circleTextSize = 11,
    circleColor = 'orange',
    countColor = 'white',
    flashToColor = 'yellow',  
    textFlashToColor = 'black', 
    active = true,
    pulseDuration = 2000,
}) => {
    const { themeStyles, appAnimationStyles } = useGlobalStyle(); 

      const pulse = useSharedValue(0);

  const startColor = useSharedValue(circleColor);
  const endColor = useSharedValue(flashToColor);
  const textColor = useSharedValue(countColor);

      useEffect(() => {
      pulse.value = withRepeat(withTiming(1, { duration: pulseDuration }), -1, true);
    }, []);

 


      const colorPulseStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
          pulse.value,
          [0, .5],
          [startColor.value, endColor.value]
        );
    
        return {
          backgroundColor,
          color: textColor.value,
        };
      });

    return (
        <>
        {active && (
            
        <Animated.View style={[colorPulseStyle, appAnimationStyles.flashAnimContainer, { borderRadius: circleTextSize, height: circleTextSize * 2, width: circleTextSize * 2 }]}>
            <Animated.Text style={[colorPulseStyle, appAnimationStyles.flashAnimText, themeStyles.primaryText, { fontSize: circleTextSize }]}>
                {children}
            </Animated.Text>
        </Animated.View>
        
        )}
        {!active && (
            <Animated.View>
                {children}
            </Animated.View>
        )}
        </>
    );
};
 

export default FlashAnim;
