import { View, Text } from 'react-native'
import React, { useEffect, ReactElement } from 'react'
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'


type Props = {
    value: boolean;
    containerStyle: StyleProp;
    timing: number;
    children: ReactElement;
 

}

const FadeDisappear = ({value, containerStyle, timing, children}: Props) => {


    const opacity = useSharedValue(1);

    useEffect(() => {
    
        if (value) {
            opacity.value = withTiming(0, {duration: timing});
        } else {

            opacity.value = withTiming(1, {duration: timing})
            
        }


    }, [value]);


const fadeOutStyle = useAnimatedStyle(() => {

    return {
        opacity: opacity.value
    
    }
});

  return (
    <Animated.View style={[containerStyle, fadeOutStyle ]}>
       {children}
    </Animated.View>
  )
}

export default FadeDisappear