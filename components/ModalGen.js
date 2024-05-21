import React from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import Button from './Button';

const ModalGen = ({ modalVisible, setModalVisible, headerTitle, headerRightComponent, children, buttons = [] }) => {
  const buttonCount = buttons.length;

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{headerTitle}</Text>
              <View style={styles.headerRight}>
                {headerRightComponent}
              </View> 
            </View>

            <View style={styles.contentContainer}>
              {children}
            </View>

            <View style={styles.footer}>
              <Button
                style={styles.buttonClose}
                onPress={() => setModalVisible(false)}
              >
                Close
              </Button>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  style={[styles.button, { width: `${100 / (buttons.length + 1)}%` }, button.style]}
                  onPress={button.onPress}
                >
                  {button.text}
                </Button>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    alignItems: 'left',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    marginLeft: 'auto', // Pushes the left component to the start of the header
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    width: '100%',
  },
  button: {  
    padding: 10,
    backgroundColor: 'black',
    elevation: 2,
    marginBottom: 3,
  },
  buttonClose: { 
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ModalGen;
