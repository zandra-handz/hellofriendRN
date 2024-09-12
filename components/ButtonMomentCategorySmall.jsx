import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG

const ButtonMomentCategorySmall = ({ onPress, categoryText, momentCount, highlighted }) => {
    const { calculatedThemeColors } = useSelectedFriend();
    const [useFriendColors, setUseFriendColors] = React.useState(true);

    // Create a ref for animated opacity
    const fadeAnim = useRef(new Animated.Value(highlighted ? 1 : 0.5)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: highlighted ? 1 : 0.5,
            duration: 300, // Duration of the fade animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [highlighted]);

    return (
        <Animated.View style={[
            styles.container,
            {
                borderWidth: highlighted ? 2 : 1, // Border width when highlighted or not
                borderColor: highlighted ? calculatedThemeColors.lightColor : 'transparent', // Highlighted color or transparent
                opacity: fadeAnim, // Apply animated opacity
            }
        ]}>
            <View style={styles.buttonContainer}>
                <ButtonBottomActionBase
                    onPress={onPress}
                    preLabel={momentCount}
                    preLabelFontSize={18}
                    preLabelColor='white'
                    label={categoryText}
                    height={36}
                    radius={20}
                    fontMargin={3}
                    labelFontSize={12}
                    labelContainerMarginHorizontal={6}
                    showGradient={true}
                    lightColor={useFriendColors ? calculatedThemeColors.lightColor : '#a0f143'}
                    darkColor={useFriendColors ? calculatedThemeColors.darkColor : '#4caf50'}
                    showShape={true}
                    shapePosition="right"
                    shapeSource={ThoughtBubbleOutlineSvg}
                    shapeWidth={40}
                    shapeHeight={40}
                    shapePositionValue={-4}
                    shapePositionValueVertical={-9}
                    shapeLabel={momentCount}
                    shapeLabelColor='white'
                    shapeLabelFontSize={16}
                    shapeLabelPositionRight='96%'
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 10,
        borderRadius: 20, // Match the radius of the button
    },
    buttonContainer: {
        height: 36,
        alignItems: 'center',
        width: 100,
    },
});

export default ButtonMomentCategorySmall;