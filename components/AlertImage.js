import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import Ionicons from 'react-native-vector-icons/Ionicons';  


const AlertImage = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  
  const { themeStyles } = useGlobalStyle();
  
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, themeStyles.genericTextBackground]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={23} color={themeStyles.modalIconColor.color} /> 
            </TouchableOpacity>
            {modalTitle && <Text style={[styles.modalTitle, themeStyles.subHeaderText]}>{modalTitle}</Text>}
          </View>
          {modalContent}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    padding: 4, 
    borderRadius: 0,
    height: '100%', 
    flex: 1,
    justifyContent: 'space-between',
    
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',  
  },
  closeButton: {
    paddingRight: 30,  
    paddingLeft: 7,
    paddingTop: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'left',
    flex: 1, 
  }, 
});
 

export default AlertImage;
