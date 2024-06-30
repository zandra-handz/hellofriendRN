import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonCapsule from './ButtonCapsule';
import ButtonChatCapsule from './ButtonChatCapsule';
import AlertSmallColored from './AlertSmallColored'; // Adjust the path according to your file structure
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const CardUpcoming = ({ title, description, thought_capsules_by_category = {}, showIcon = true, iconColor, showFooter = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(animatedValue.value) }],
    };
  });

  const startWavingAnimation = () => {
    animatedValue.value = Math.random() * 20 - 10; // Adjust the range for waving effect
  };

  const stopWavingAnimation = () => {
    animatedValue.value = 0;
  };

  const toggleModal = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ top: pageY, left: pageX });
    setIsModalVisible(!isModalVisible);
  };

  // Accumulate all capsules from all categories into a single array
  const capsules = Object.values(thought_capsules_by_category).reduce((accumulator, categoryCapsules) => {
    return accumulator.concat(categoryCapsules);
  }, []);

  return (
    <View style={styles.container}>
      {showIcon && (
        <TouchableOpacity
          onPressIn={startWavingAnimation}
          onPressOut={stopWavingAnimation}
        >
          <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <FontAwesome5 name="hand-holding-heart" size={30} color={iconColor} />
          </Animated.View>
        </TouchableOpacity>
      )}
      <View style={[styles.contentContainer, showIcon && styles.contentWithIcon]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        
        {capsules.length > 0 ? (
          <View style={styles.capsuleListContainer}>
            <FlatList
              data={capsules}
              renderItem={({ item }) => <ButtonChatCapsule capsule={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        ) : (
          <Text>No capsules found</Text>
        )}

        {showFooter && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="star" size={20} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="pen-alt" size={20} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="share-alt" size={20} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
              <FontAwesome5 name="ellipsis-h" size={20} color="#555" solid={false} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <AlertSmallColored
        isVisible={isModalVisible}
        toggleModal={() => setIsModalVisible(false)}
        position={modalPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
    width: '100%',
    borderTopWidth: 0.5, // Add top border
    borderTopColor: 'black',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, // Adjust size as per your design
    height: 60, // Adjust size as per your design
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  contentWithIcon: {
    paddingLeft: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  capsuleListContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8, // Add some border radius if desired
    marginTop: 10, // Add some margin if desired
  },
  flatListContent: {
    paddingHorizontal: 10, // Adjust as per your design
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  iconButton: {
    padding: 6,
  },
});

export default CardUpcoming;
