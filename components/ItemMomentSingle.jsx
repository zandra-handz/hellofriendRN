import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Image } from 'react-native-svg'; // Import SVG and Image components from react-native-svg
import ItemViewMoment from '../components/ItemViewMoment';
import BubbleChatSquareSolidSvg from '../assets/svgs/bubble-chat-square-solid.svg'; // Import the SVG

const windowWidth = Dimensions.get('window').width;

const ItemMomentSingle = ({ momentObject, momentWidth, momentHeight, svgColor='white' }) => {
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

  const calculateFontSize = (width) => {
    return width * 0.094; // Adjust this multiplier to get the desired proportion
  };

  const calculateBubbleContainerDimensions = (width, height) => {
    return {
      width: width * 1, // Adjust this multiplier to get the desired width
      height: height * 0.63, // Adjust this multiplier to get the desired height
    };
  };

  const calculateLeftPadding = (bubbleWidth) => {
    return bubbleWidth * 0.064; // Adjust this multiplier to get the desired left padding
  };

  const bubbleContainerDimensions = calculateBubbleContainerDimensions(momentWidth || windowWidth / 2 - 80, momentHeight || windowWidth / 2 - 80);

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
    padding: 10,
    flex: 1, 
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

export default ItemMomentSingle;
