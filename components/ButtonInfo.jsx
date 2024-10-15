import React, { useState } from 'react';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageInfo from './ActionPageInfo'; 
import InfoOutlineSvg from '../assets/svgs/info-outline.svg'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonInfo = () => {
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
        <InfoOutlineSvg width={23} height={23} style={themeStyles.footerIcon} />
      </TouchableOpacity>

      <ActionPageInfo visible={isModalVisible} onClose={toggleModal} />
    </>
  );
};


export default ButtonInfo;
