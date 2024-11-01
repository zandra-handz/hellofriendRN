import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

 import CoffeeShopStoreSimpleSvg from '../assets/svgs/coffee-shop-store-simple';


const windowWidth = Dimensions.get('window').width;

const ItemLocationSingle = ({ locationObject, locationWidth=30, locationHeight=30, spacer=30 }) => {
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
 
  return (
    <View style={[styles.imageContainer, {width: locationWidth, marginRight: spacer}]}>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.relativeContainer}>  
          <CoffeeShopStoreSimpleSvg width={locationWidth} height={locationHeight} color="white" style={styles.svgImage} />
          
          <View style={styles.bubbleContainer}>
            <Text style={styles.bubbleText}>{locationObject.address}</Text>
          </View>
        </View>
      </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {   
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
});

export default ItemLocationSingle;
