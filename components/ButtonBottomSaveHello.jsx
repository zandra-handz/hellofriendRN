import React from 'react'; 
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import CompassCuteSvg from '../assets/svgs/compass-cute.svg'; 

const ButtonBottomSaveHello = ({ onPress, disabled }) => {
    return (
        <ButtonBottomActionBase
            onPress={() => onPress(true)} // Pass the onPress handler directly
            label={`Add hello`}
            height={54}
            radius={16} 
            labelFontSize={22}
            labelColor="white" // Set default label color
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showGradient={true} // Default gradient visibility
            darkColor='#4caf50' // Default dark gradient color
            lightColor='rgb(160, 241, 67)' // Default light gradient color
            showShape={true} // Default shape visibility
            shapeSource={CompassCuteSvg}
            shapeWidth={100}
            shapeHeight={100}
            shapePosition="right"
            shapePositionValue={-14}
            shapePositionValueVertical={-10}
            disabled={disabled} // Pass the disabled state to the base component
        />
    );
};

export default ButtonBottomSaveHello;
