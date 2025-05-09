import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import TwoCirclesCommonSvg from '@/app/assets/svgs/two-circles-common.svg'; 
import ThreeLocationsSvg from '@/app/assets/svgs/three-locations.svg'; 
 

const ButtonFindMidpoints = ({ onPress }) => {
    const navigation = useNavigation();

    const navigateToMidpointSearch = () => {
        navigation.navigate('MidpointLocationSearch');  
        if (onPress) onPress();  
    };

    return (
        <View style={styles.container}>
            <ButtonBottomActionBase
                onPress={navigateToMidpointSearch}
                preLabel=''
                label={`Search For Midpoints`}
                height={64}
                radius={16}
                fontMargin={3} 
                labelFontSize={22} 
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
