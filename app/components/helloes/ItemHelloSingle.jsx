import React, { useState, useEffect } from 'react';
import { View, StyleSheet,   TouchableOpacity } from 'react-native';
import ItemViewHello from '../components/ItemViewHello';
import IconDynamicHelloType from '../components/IconDynamicHelloType';

 

const ItemHelloSingle = ({ helloObject, svgHeight=24, svgWidth=24, svgColor='white' }) => {
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
      <IconDynamicHelloType selectedChoice={helloObject.type} svgHeight={svgHeight} svgWidth={svgHeight} svgColor={svgColor}/>
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
    marginRight: 20,
    marginBottom: 8,
    width: '100%',   
  }, 
});

export default ItemHelloSingle;
