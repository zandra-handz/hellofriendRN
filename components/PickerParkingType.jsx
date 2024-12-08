import React, { useState } from 'react'; 
import { View} from 'react-native';
import PickerMenuOptions from '../components/PickerMenuOptions';

import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';
import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';
import CoffeeMugFancySteamSvg from '../assets/svgs/coffee-mug-fancy-steam';
import CelebrationSparkOutlineSvg from '../assets/svgs/celebration-spark-outline';


const PickerParkingType = ({ 
    containerText='Type: ',
    selectedTypeChoice, 
    onTypeChoiceChange, 
    useSvg=false,
    labels=['location has free parking lot', 
          'free parking lot nearby', 
          'street parking', 
          'fairly stressful or unreliable street parking',
          'no parking whatsoever',
          'unspecified'],

    widthInPercentage='100%',
    height=40
    
    }) => {

    const typeChoices = [
      'location has free parking lot', 
      'free parking lot nearby', 
      'street parking', 
      'fairly stressful or unreliable street parking',
      'no parking whatsoever',
      'unspecified'];
   
    const svgIcons = [
        PhoneChatMessageHeartSvg, 
        CoffeeMugSolidHeart,
        CelebrationSparkOutlineSvg,
        CoffeeMugFancySteamSvg, 
      ];


   return (  
          <View style={{height: height}}>
      
            <PickerMenuOptions
                options={typeChoices}
                widthForHorizontal={widthInPercentage}
                containerText={containerText}
                onSelectOption={onTypeChoiceChange}
                selectedOption={selectedTypeChoice}  
                useSvg={useSvg}
                svgIcons={svgIcons} 
                labels={labels}
            /> 

          </View> 

   );
};

 

export default PickerParkingType;