import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native'; 
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import { useFriendList } from '@/src/context/FriendListContext';

const ButtonMomentCategorySmall = ({ onPress, categoryText, momentCount, highlighted }) => {
 
    const { themeAheadOfLoading } = useFriendList();
 
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
                borderColor: highlighted ? themeAheadOfLoading.lightColor : 'transparent', // Highlighted color or transparent
                opacity: fadeAnim, // Apply animated opacity
            }
        ]}>
            <View style={styles.buttonContainer}> 
                <ButtonBottomActionBase
                    onPress={onPress}
                    preLabel={momentCount || '--'}
                    preLabelFontSize={18}
                    preLabelColor='black'
                    labelColor={themeAheadOfLoading.fontColorSecondary}
                    label={categoryText}
                    height={36}
                    radius={20}
                    fontMargin={0}
                    labelFontSize={14}
                    labelContainerMarginHorizontal={0}
                    showGradient={true}
                    lightColor={themeAheadOfLoading.lightColor || '#a0f143'}
                    darkColor={themeAheadOfLoading.darkColor || '#4caf50'}
                    showShape={true}
                    shapePosition="right"
                    shapeSource={ThoughtBubbleOutlineSvg}
                    shapeWidth={40}
                    shapeHeight={40}
                    shapePositionValue={-4}
                    shapePositionValueVertical={-9}
                    shapeLabel={momentCount || '--'}
                    shapeLabelColor={themeAheadOfLoading.fontColorSecondary}
                    shapeColor={'black'}
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
        borderRadius: 20, // Match the radius of the button
    },
    buttonContainer: {
        height: 36,
        alignItems: 'center',
        width: 'auto',
    },
});

export default ButtonMomentCategorySmall;
