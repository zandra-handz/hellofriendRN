import React, { useState } from 'react';
import {TouchableOpacity, AccessibilityInfo } from 'react-native';
 
import HeartbeatLifelineArrowSvg from '@/app/assets/svgs/heartbeat-lifeline-arrow.svg';  
 
const ButtonData = () => { 
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  React.useEffect(() => {
    if (isModalVisible) {
      AccessibilityInfo.announceForAccessibility('Information opened');
    }
  }, [isModalVisible]);

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <HeartbeatLifelineArrowSvg width={38} height={38} 
        // style={themeStyles.footerIcon} 
        />

      </TouchableOpacity>

     
    </>
  );
};

export default ButtonData;
