import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonMediumBase from '../components/ButtonMediumBase';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg';

const ButtonMediumAddFriend = ({ friendName, toggleReviewModal }) => (
    <View style={styles.bottomButtonContainer}>
        <ButtonMediumBase
            onPress={toggleReviewModal} 
            label={`Add ${friendName} To Friends`}
            height={54}
            radius={16}
            fontMargin={3}  
            labelFontSize={22}
            labelColor="white" 
            labelContainerMarginHorizontal={4} 
            showGradient={true}
            showShape={true}
            shapePosition="right"
            shapeSource={CompassCuteSvg}
            shapeWidth={100}
            shapeHeight={100}
            shapePositionValue={-14}
            shapePositionValueVertical={-10} 
        />
    </View>
);

const styles = StyleSheet.create({
    bottomButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center', 
    },
});

export default ButtonMediumAddFriend;
