import React from 'react';
import IconDynamicBase from '../components/IconDynamicBase';

import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';
import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';
 

import CelebrationSparkOutlineSvg from '../assets/svgs/celebration-spark-outline.svg';

import NoMapOutlineSvg from '../assets/svgs/no-map-outline.svg';


const IconDynamicHelloType = ({ selectedChoice="in person", svgWidth=30, svgHeight=30, svgColor="white" }) => {
  const icons = [PhoneChatMessageHeartSvg, CoffeeMugSolidHeart, CelebrationSparkOutlineSvg, NoMapOutlineSvg];
  
  const choices = [
    'via text or social media',
    'in person',
    'happenstance',
    'unspecified'
  ];

  return (
    <IconDynamicBase
      icons={icons}
      choices={choices}
      selectedChoice={selectedChoice}
      svgWidth={svgWidth}
      svgHeight={svgHeight}
      svgColor={svgColor}
    />
  );
};

export default IconDynamicHelloType;
