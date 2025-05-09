import React from 'react';
import { StyleSheet, View, Modal, Dimensions } from 'react-native';
import { useGlobalStyle } from '@/app/context/GlobalStyleContext';
import HeaderBaseItemView from '@/app/components/HeaderBaseItemView';


const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const ItemModal = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  
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
  loadingWrapper: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%', 
    padding: 4, 
    borderRadius: 0,
    flexDirection: 'column', 
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

export default ItemModal;
