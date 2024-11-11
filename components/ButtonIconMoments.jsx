import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg';
import BobbingAnim from '../animations/BobbingAnim';
import FlashAnim from '../animations/FlashAnim'; 

const ButtonIconMoments = ({
    iconSize = 36,
    iconColor = 'black',
    countColor = 'white',
    circleColor = 'red',
    countTextSize = 12,
    onPress,
}) => {
    const { capsuleCount } = useCapsuleList();

    return (
        <TouchableOpacity onPress={onPress ? onPress : () => {}} style={styles.container}>
                   
            <BobbingAnim bobbingDistance={2} duration={800}>
                <View style={styles.animatedContainer}>
                    <ThoughtBubbleOutlineSvg height={iconSize} width={iconSize} color={iconColor} />
                    <View style={{ top: '-17%', right: '27%' }}>
                        <FlashAnim circleColor={circleColor} circleTextSize={countTextSize} countColor={countColor}>
                            {capsuleCount}
                        </FlashAnim>
                    </View>
                </View> 
            </BobbingAnim>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
    },
    animatedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countText: {
        fontFamily: 'Poppins-Bold',
    },
});

export default ButtonIconMoments;
