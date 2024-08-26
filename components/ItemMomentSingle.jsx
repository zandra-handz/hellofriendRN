import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import ItemViewMoment from '../components/ItemViewMoment';
import BubbleChatSquareSolidSvg from '../assets/svgs/bubble-chat-square-solid.svg'; // Import the SVG

const windowWidth = Dimensions.get('window').width;

const ItemMomentSingle = ({ momentObject, momentWidth, momentHeight, svgColor='white' }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [momentText, setMomentText] = useState(null); 

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
    return null;  
  }

  const calculateFontSize = (width) => width * 0.06;

  const calculateBubbleContainerDimensions = (width, height) => ({
    width: width * .96,
    height: height * 0.58,
  });

  const calculateLeftPadding = (bubbleWidth) => bubbleWidth * 0.06;

  const bubbleContainerDimensions = calculateBubbleContainerDimensions(momentWidth, momentHeight);

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={openModal}>
        <View style={[styles.relativeContainer, { width: momentWidth || windowWidth / 2 - 80, height: momentHeight || windowWidth / 2 - 80 }]}>
          <BubbleChatSquareSolidSvg width={momentWidth} height={momentHeight} color={svgColor} style={styles.svgImage} />
          <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
            <Text style={[styles.bubbleText, { fontSize: calculateFontSize(momentWidth || windowWidth / 2 - 80), top: bubbleContainerDimensions.height * 0.2 }]}>{momentObject.capsule}</Text>
          </View>
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
    padding: 0,
    backgroundColor: 'transparent', 
    alignContent: 'center',
    justifyContent: 'center',
  },
  relativeContainer: {
    position: 'relative', 
  },
  bubbleContainer: {
    position: 'absolute',
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'flex-start', // Align items to the left
    zIndex: 1,
  },
  bubbleText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    
  },
  svgImage: {
    position: 'absolute',
    top: 0,   
    backgroundColor: 'transparent', 
    zIndex: 0, 
  },  
});

export default ItemMomentSingle;
