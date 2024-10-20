import React from 'react';
import { StyleSheet, View, Modal, Dimensions } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import HeaderBaseItemView from '../components/HeaderBaseItemView';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const AlertImage = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  
  const { themeStyles } = useGlobalStyle();
  
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <HeaderBaseItemView onBackPress={toggleModal} headerTitle={modalTitle} />
      <View style={styles.modalContainer}>
        <View 
          style={[
            styles.modalContent, 
            themeStyles.genericTextBackground, 
            { maxHeight: screenHeight * 0.9, paddingBottom: 30 } // Modal content takes up 80% of screen height
          ]}
        >
          {modalContent}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1,
    width: '100%', 
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1,
  },
  modalContent: {
    width: '100%', 
    padding: 4, 
    borderRadius: 0,
    flexDirection: 'column',
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
