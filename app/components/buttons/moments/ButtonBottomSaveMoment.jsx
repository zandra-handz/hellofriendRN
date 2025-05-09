import React from 'react'; 
import ButtonBottomActionBase from '@/app/components/buttons/scaffolding/ButtonBottomActionBase';

const ButtonBottomSaveMoment = ({ onPress, disabled }) => {
    return (
        <ButtonBottomActionBase
            onPress={() => onPress(true)}  
            label={`Add moment`}
            height={54} 
            labelFontSize={22}
            labelColor="white"  
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showGradient={true}  
            darkColor='#4caf50'  
            lightColor='rgb(160, 241, 67)'  
            showShape={true}   
            shapeWidth={100}
            shapeHeight={100}
            shapePosition="right"
            shapePositionValue={-14}
            shapePositionValueVertical={-10}
            disabled={disabled} 
        />
    );
};

export default ButtonBottomSaveMoment;
