import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageInfo from './ActionPageInfo';  
import PaintRollerSvg from '../assets/svgs/paint-roller.svg';  
import HeartbeatLifelineArrowSvg from '../assets/svgs/heartbeat-lifeline-arrow.svg';  

import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonData = ({label=null}) => {
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
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <HeartbeatLifelineArrowSvg width={38} height={38} style={themeStyles.footerIcon} />
        {label && ( 
        <Text style={themeStyles.footerText}>Info</Text>
        )}
      </TouchableOpacity>

      <ActionPageInfo visible={isModalVisible} onClose={toggleModal} />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1, // Divide space equally
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4, // Add some margin to separate the icon from the text
  },
});

export default ButtonData;
