import React from 'react'; 
import ButtonBottomActionBaseSmall from '../components/ButtonBottomActionBaseSmall';

const ButtonBottomSaveMomentToCategory = ({ onPress, label, selected }) => {
    return (
        <ButtonBottomActionBaseSmall
            onPress={() => onPress(true)}  
            label={label}
            height={40} 
            radius={0}
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
