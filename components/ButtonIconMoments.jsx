import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg';
import LeavesTwoFallingOutlineThickerSvg from '../assets/svgs/leaves-two-falling-outline-thicker.svg';
import BobbingAnim from '../animations/BobbingAnim';
import FlashAnim from '../animations/FlashAnim'; 

const ButtonIconMoments = ({
    height=50,
    iconSize = 36,
    iconColor = 'black',
    countColor = 'white',
    circleColor = 'red',
    countTextSize = 12,
    onPress,
}) => {
    const { capsuleCount } = useCapsuleList();

    return (
        <TouchableOpacity onPress={onPress ? onPress : () => {}} style={[styles.container, {height: height}]}>
                   
            <BobbingAnim bobbingDistance={2} duration={800}>
                <View style={styles.animatedContainer}>
                      <View style={{ backgroundColor: 'transparent', flex: 1, width: '100%', justifyContent: 'center'}}>
                        
                    <LeavesTwoFallingOutlineThickerSvg height={iconSize} width={iconSize} color={iconColor} />
                    <View style={{ top: '-7%', right: '1%', position: 'absolute' }}>
                        <FlashAnim circleColor={circleColor} circleTextSize={countTextSize} countColor={countColor}>
                            {capsuleCount}
                        </FlashAnim>
                    </View>
                    
                    </View>
                </View> 
            </BobbingAnim>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {  
        flexDirection: 'row', 
        justifyContent: 'center',
    },
    animatedContainer: {
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        flex: 1,
    },
    countText: {
        fontFamily: 'Poppins-Bold',
    },
});

export default ButtonIconMoments;
