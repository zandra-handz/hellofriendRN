import React, { useState } from 'react'; 
import { View} from 'react-native';
import PickerMenuOptions from '../components/PickerMenuOptions';

import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';
import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';

import CoffeeMugFancySteamSvg from '../assets/svgs/coffee-mug-fancy-steam';
import CelebrationSparkOutlineSvg from '../assets/svgs/celebration-spark-outline';


const PickerHelloType = ({ 
    containerText='Type: ',
    selectedTypeChoice, 
    onTypeChoiceChange, 
    useSvg=true,
    labels=['digital', 'in person', 'surprise', 'N/A'],
    widthInPercentage='84%',
    height=40
    
    }) => {

    const [typeChoices, setTypeChoices] = useState(["via text or social media", "in person", "happenstance", "unspecified"]);
  
   

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

 

export default PickerHelloType;