import React  from 'react'; 
 
import PickerMenuOptions from './PickerMenuOptions';

import CoffeeMugSolidHeart from '@/app/assets/svgs/coffee-mug-solid-heart';
import PhoneChatMessageHeartSvg from '@/app/assets/svgs/phone-chat-message-heart';

import CoffeeMugFancySteamSvg from '@/app/assets/svgs/coffee-mug-fancy-steam';
import CelebrationSparkOutlineSvg from '@/app/assets/svgs/celebration-spark-outline';


const PickerHelloType = ({ 
    containerText='Type: ',
    selectedTypeChoice, 
    onTypeChoiceChange, 
    useSvg=true,
    labels=['digital', 'in person', 'surprise', 'N/A'],
    widthInPercentage='84%', 
    
    }) => {

    const typeChoices = ["via text or social media", "in person", "happenstance", "unspecified"];
  
   

    const svgIcons = [
        PhoneChatMessageHeartSvg, 
        CoffeeMugSolidHeart,
        CelebrationSparkOutlineSvg,
        CoffeeMugFancySteamSvg, 
      ];


   return (  
            <PickerMenuOptions
                options={typeChoices}
                title={' '} // 'PICK TYPE
                widthForHorizontal={widthInPercentage}
                containerText={containerText}
                onSelectOption={onTypeChoiceChange}
                selectedOption={selectedTypeChoice}  
                useSvg={useSvg}
                svgIcons={svgIcons} 
                labels={labels}
                height={120}
            />  

   );
};

 

export default PickerHelloType;