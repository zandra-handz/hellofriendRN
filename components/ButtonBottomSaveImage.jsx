import React from 'react'; 
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import PhotosTwoSvg from '../assets/svgs/photos-two.svg';

const ButtonBottomSaveImage = ({ onPress, disabled }) => {
    return (
        <ButtonBottomActionBase
            onPress={() => onPress(true)}  
            preLabel=''
            label={`Upload image`}
            height={54} 
            fontMargin={3} 
            labelFontSize={22}
            labelColor="white" 
            labelContainerMarginHorizontal={4} 
            showGradient={true}
            showShape={true}
            shapePosition="right"
            shapeSource={PhotosTwoSvg}
            shapeWidth={90}
            shapeHeight={90}
            shapePositionValue={-14}
            shapePositionValueVertical={-10} 
            disabled={disabled}  
        />
    );
};

export default ButtonBottomSaveImage;
