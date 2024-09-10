import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
    widthInPercentage='84%'
    
    }) => {

    const [typeChoices, setTypeChoices] = useState(["via text or social media", "in person", "happenstance", "unspecified"]);
  
    const labels = [
        'digital', 'in person', 'surprise', 'N/A'
      ];


    const svgIcons = [
        PhoneChatMessageHeartSvg, 
        CoffeeMugSolidHeart,
        CelebrationSparkOutlineSvg,
        CoffeeMugFancySteamSvg, 
      ];


   return ( 
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

   );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      justifyContent: 'space-between',
    },
    mainContainer: {
      flex: 1,
      padding: 0,
      justifyContent: 'space-between',
      paddingBottom: 68,
    },
    typeChoicesContainer: {  
      borderRadius: 8,
      top: 22, 
      width: '100%',
      padding: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.0,
      shadowRadius: 0,
      elevation: 0,
      marginVertical: 0, 
      height: 90,  
    },
});

export default PickerHelloType;