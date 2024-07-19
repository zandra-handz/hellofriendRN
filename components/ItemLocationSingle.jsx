import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import ItemViewLocation from '../components/ItemViewLocation'; 
import BubbleChatSvg from '../assets/svgs/bubble-chat.svg'; // Import the SVG
import CoffeeBeansOutlineSvg from '../assets/svgs/coffee-beans-outline.svg';
import CoffeeShopOutlineSvg from '../assets/svgs/coffee-shop-outline';
import CoffeeShopColoredSvg from '../assets/svgs/coffee-shop-colored';


const windowWidth = Dimensions.get('window').width;

const ItemLocationSingle = ({ locationObject, locationWidth, locationHeight }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [locationTittle, setLocationTitle] = useState(null);

  useEffect(() => {
    if (locationObject && locationObject.capsule) {
      setLocationTitle(locationObject.title);
    }
  }, [locationObject]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (!locationObject) {
    return null;  
  }

  const dynamicStyles = {
    image: {
      width: locationWidth || windowWidth / 2 - 80,
      height: locationHeight || windowWidth / 2 - 80,
      margin: 5,
      borderRadius: 10,
    },
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.relativeContainer}>  
          <CoffeeShopOutlineSvg width={40} height={40} color="white" style={styles.svgImage} />
          
          <View style={styles.bubbleContainer}>
            <Text style={styles.bubbleText}>{locationObject.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {isModalVisible && (
        <ItemViewLocation location={locationObject} onClose={closeModal} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    padding: 0,
    width: 110,
    flex: 1,
    height: 210, 
    alignContent: 'center',
    justifyContent: 'center',
  },
  relativeContainer: {  
    position: 'relative',
    width: '100%',
    height: '100%',  
     
  },
  bubbleContainer: {
    position: 'absolute',  
    margin: 'auto',
    marginLeft: 40,
    marginTop: 30,
    width: 150,
    height: 60,
    zIndex: 1, 
  },
  
  bubbleText: { 
    fontSize: 14,
    color: 'transparent',
    fontFamily: 'Poppins-Bold',
  },
  svgImage: {
    position: 'absolute',
    top: 0, 
    marginTop: 0,
    backgroundColor: 'transparent',  
    zIndex: 0, // Ensure SVG is below text
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

export default ItemLocationSingle;
