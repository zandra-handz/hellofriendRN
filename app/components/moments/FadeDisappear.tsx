import { StyleProp, ViewStyle } from 'react-native'
import React, { useEffect, ReactElement } from 'react'
import Animated, { useSharedValue, withTiming, useAnimatedStyle, useAnimatedProps } from 'react-native-reanimated'

type Props = {
    value: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    timing: number;
    children: ReactElement;
    zIndex?: number;
    disablePointerEventsWhenHidden?: boolean;
}

const FadeDisappear = ({ value, containerStyle, timing, children, zIndex, disablePointerEventsWhenHidden }: Props) => {
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (value) {
            opacity.value = withTiming(0, { duration: timing });
        } else {
            opacity.value = withTiming(1, { duration: timing });
        }
    }, [value]);

    const fadeOutStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    const animatedProps = useAnimatedProps(() => ({
        pointerEvents: (disablePointerEventsWhenHidden && opacity.value === 0) ? 'none' : 'auto',
    }));

    return (
        <Animated.View
            style={[containerStyle, fadeOutStyle, zIndex !== undefined && { zIndex, elevation: zIndex }]}
            animatedProps={disablePointerEventsWhenHidden ? animatedProps : undefined}
        >
            {children}
        </Animated.View>
    )
}

export default FadeDisappear