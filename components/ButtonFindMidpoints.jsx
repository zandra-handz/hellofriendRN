// ButtonFindMidpoints.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import TwoCirclesCommonSvg from '../assets/svgs/two-circles-common.svg'; // Import the SVG
import ThreeLocationsSvg from '../assets/svgs/three-locations.svg'; // Import the SVG

const ButtonFindMidpoints = ({ onPress }) => {
    const navigation = useNavigation();

    const navigateToMidpointSearch = () => {
        navigation.navigate('MidpointLocationSearch'); // Navigate to the 'MidpointLocationSearch' screen
        if (onPress) onPress(); // Call the onPress function to close the modal
    };

    return (
        <View style={styles.container}>
            <ButtonLottieAnimationSvg
                onPress={navigateToMidpointSearch}
                preLabel=''
                label={`Search For Midpoints`}
                height={64}
                radius={16}
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}
                labelFontSize={22}
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true}
                showShape={true}
                shapePosition="right"
                shapeSource={TwoCirclesCommonSvg}
                shapeWidth={100}
                shapeHeight={100}
                shapePositionValue={0}
                shapePositionValueVertical={0}
                showIcon={false}
                showTopLevelShape={true}
                TopLevelShapeSvg={ThreeLocationsSvg}
                topLevelShapeWidth={40}
                topLevelShapeHeight={40}
                topLevelShapePositionValue={320}
                topLevelShapePositionValueVertical={20}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        height: '90%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 0,
        paddingBottom: 0,
        paddingTop: 0,
    },
});

export default ButtonFindMidpoints;
