import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Image } from 'react-native-svg'; // Import SVG and Image components from react-native-svg
import ItemViewMoment from '../components/ItemViewMoment';

const windowWidth = Dimensions.get('window').width;

const ItemMomentSingle = ({ momentObject, momentWidth, momentHeight }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [momentText, setMomentText] = useState(null);
  const [momentCategory, setMomentCategory] = useState(null);

  useEffect(() => {
    if (momentObject && momentObject.capsule) {
      setMomentText(momentObject.capsule);
    }
  }, [momentObject]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (!momentObject) {
    return null; // or some loading indicator if needed
  }

  const dynamicStyles = {
    image: {
      width: momentWidth || windowWidth / 2 - 80,
      height: momentHeight || windowWidth / 2 - 80,
      margin: 5,
      borderRadius: 10,
    },
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.bubbleContainer}>
          <Svg width={80} height={80}>
            <Image
              width="100%"
              height="100%"
              href={require('../assets/svgs/bubble-chat.svg')}
            />
          </Svg>
          <Text style={styles.bubbleText}>{momentObject.capsule}</Text>
        </View>
      </TouchableOpacity>
      {isModalVisible && (
        <ItemViewMoment moment={momentObject} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    padding: 10,
    width: '100%',
    flex: 1,
    height: 100,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  bubbleContainer: {  
    justifyContent: 'center',
    alignItems: 'center', 
  },
  bubbleText: {
    position: 'absolute',
    padding: 10,
    fontSize: 16,
    color: 'black',
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
  modalImage: {
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
  icon: {
    marginHorizontal: 10,
  },
});

export default ItemMomentSingle;
