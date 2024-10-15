import React, { useState } from 'react';
import {TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageInfo from './ActionPageInfo';  
import HeartbeatLifelineArrowSvg from '../assets/svgs/heartbeat-lifeline-arrow.svg';  
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonData = () => {
  const { themeStyles } = useGlobalStyle();
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
        <HeartbeatLifelineArrowSvg width={38} height={38} style={themeStyles.footerIcon} />

      </TouchableOpacity>

      <ActionPageInfo visible={isModalVisible} onClose={toggleModal} />
    </>
  );
};

export default ButtonData;
