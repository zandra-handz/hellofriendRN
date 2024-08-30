import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import ActionPageInfo from './ActionPageInfo'; // Import the ActionPageInfo component
import InfoOutlineSvg from '../assets/svgs/info-outline.svg'; // Import the SVG icon
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
      <TouchableOpacity style={styles.section} onPress={toggleModal}>
        <InfoOutlineSvg width={24} height={24} style={themeStyles.footerIcon} />
        <Text style={themeStyles.footerText}>Info</Text>
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

export default ButtonInfo;
