import React from 'react'; 
import ButtonBottomActionBaseSmallLongPress from '../scaffolding/ButtonBottomActionBaseSmallLongPress';

const ButtonBottomSaveMomentToCategory = ({ onPress, onLongPress, height, label, selected }) => {
    return (
        <ButtonBottomActionBaseSmallLongPress
            onPress={onPress}  
            onLongPress={onLongPress}
            label={label}
            fontFamily={'Poppins-Regular'}    
            shapeWidth={44}
            shapeHeight={44}
            shapePosition="right"
            shapePositionValue={0}
            shapePositionValueVertical={4} 
            selected={selected}
        />
    );
};

export default ButtonBottomSaveMomentToCategory;
