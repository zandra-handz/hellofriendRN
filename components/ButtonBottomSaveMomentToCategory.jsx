import React from 'react'; 
import ButtonBottomActionBaseSmallLongPress from '../components/ButtonBottomActionBaseSmallLongPress';

const ButtonBottomSaveMomentToCategory = ({ onPress, onLongPress, label, selected }) => {
    return (
        <ButtonBottomActionBaseSmallLongPress
            onPress={() => onPress(true)}  
            onLongPress={onLongPress}
            label={label}
            fontFamily={'Poppins-Bold'}
            height={50} 
            radius={10}
            labelFontSize={16}
            labelColor="white"  
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            showGradient={true}  
            darkColor='#4caf50'  
            lightColor='rgb(160, 241, 67)'  
            showShape={true}   
            shapeWidth={30}
            shapeHeight={30}
            shapePosition="right"
            shapePositionValue={10}
            shapePositionValueVertical={4}
            disabled={false} 
            selected={selected}
        />
    );
};

export default ButtonBottomSaveMomentToCategory;
