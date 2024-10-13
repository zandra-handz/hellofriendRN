import React from 'react'; 
import ButtonBottomActionBaseSmallLongPress from '../components/ButtonBottomActionBaseSmallLongPress';

const ButtonBottomSaveMomentToCategory = ({ onPress, onLongPress, label, selected }) => {
    return (
        <ButtonBottomActionBaseSmallLongPress
            onPress={onPress}  
            onLongPress={onLongPress}
            label={label}
            fontFamily={'Poppins-Bold'}
            height={54} 
            radius={4}
            labelFontSize={17}
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
            shapePositionValue={10}
            shapePositionValueVertical={4}
            disabled={false} 
            selected={selected}
        />
    );
};

export default ButtonBottomSaveMomentToCategory;
