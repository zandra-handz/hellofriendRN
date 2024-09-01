import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import ItemViewHello from '../components/ItemViewHello';
import IconDynamicHelloType from '../components/IconDynamicHelloType';


const windowWidth = Dimensions.get('window').width;

const ItemHelloSingle = ({ helloObject, helloWidth, helloHeight }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    if (helloObject && helloObject.title) {
      setTitle(helloObject.title);
    }
  }, [helloObject]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (!helloObject) {
    return null; 
  }
 
  return (
    <View style={styles.helloContainer}>
      <TouchableOpacity onPress={openModal}>
      <IconDynamicHelloType selectedChoice={helloObject.type} svgHeight={24} svgWidth={24} svgColor="white"/>
      </TouchableOpacity>
      {isModalVisible && (
        <ItemViewHello hello={helloObject} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  helloContainer: {
    padding: 0, 
    marginHorizontal: 20,
    marginBottom: 8,
    width: '100%',   
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHello: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
  }, 
});

export default ItemHelloSingle;
