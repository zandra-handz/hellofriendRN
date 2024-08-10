import React from 'react';
import IconDynamicBase from '../components/IconDynamicBase';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';
import CoffeeMugSolidHeart from '../assets/svgs/coffee-mug-solid-heart';

import CoffeeCupPaperSolid from '../assets/svgs/coffee-cup-paper-solid';
import CoffeeMugFancySteamSvg from '../assets/svgs/coffee-mug-fancy-steam';

import PhoneChatMessageHeartSvg from '../assets/svgs/phone-chat-message-heart';

import PhoneHeartSvg from '../assets/svgs/phone-heart';


const IconDynamicHelloType = ({ selectedChoice="in person", svgWidth=50, svgHeight=50, svgColor="white" }) => {
  const icons = [PhoneChatMessageHeartSvg, CoffeeMugSolidHeart, ArrowLeftCircleOutlineSvg, ArrowFullScreenOutlineSvg];
  
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
