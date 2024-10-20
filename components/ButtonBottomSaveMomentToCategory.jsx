import React from 'react'; 
import ButtonBottomActionBaseSmallLongPress from '../components/ButtonBottomActionBaseSmallLongPress';

const ButtonBottomSaveMomentToCategory = ({ onPress, onLongPress, height, label, selected }) => {
    return (
        <ButtonBottomActionBaseSmallLongPress
            onPress={onPress}  
            onLongPress={onLongPress}
            label={label}
            fontFamily={'Poppins-Regular'}
            height={height} 
            radius={0}
            labelFontSize={16}
            labelColor="white"  
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showGradient={true}  
            darkColor='#4caf50'  
            lightColor='rgb(160, 241, 67)'  
            showShape={true}   
            shapeWidth={44}
            shapeHeight={44}
            shapePosition="right"
            shapePositionValue={0}
            shapePositionValueVertical={4}
            disabled={false} 
            selected={selected}
        />
    );
};

export default ButtonBottomSaveMomentToCategory;
