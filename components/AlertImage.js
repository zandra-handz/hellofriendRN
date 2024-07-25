import React from 'react';
import { TouchableOpacity, StyleSheet, View, Modal, Text } from 'react-native';

import { FontAwesome5 } from 'react-native-vector-icons';
import ArrowBackSharpOutlineSvg from '../assets/svgs/arrow-back-sharp-outline.svg';


const AlertImage = ({ isModalVisible, toggleModal, modalContent, modalTitle }) => {
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <ArrowBackSharpOutlineSvg width={36} height={36} color="black" style={styles.SvgFSImage} />
          </TouchableOpacity>
          {modalTitle && <Text style={styles.modalTitle}>{modalTitle}</Text>}
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
    height: '100%',
    zIndex: 1,
  },
  modalContent: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: '100%',
    bottom: 0,
    position: 'relative',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute', 
    top:6,
    left: 18, 
    marginTop: 4,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20, 
    fontWeight: '500',
    marginBottom: 10,
    marginTop: -46,
    marginTop: 4,
    marginLeft: 62,
    textAlign: 'left',
  },
});

export default AlertImage;
