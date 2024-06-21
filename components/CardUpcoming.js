import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonCapsule from './ButtonCapsule';
import AlertSmallColored from './AlertSmallColored'; // Adjust the path according to your file structure
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const CardUpcoming = ({ title, description, thought_capsules_by_category = {}, showIcon, iconColor, showFooter = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const animatedValue = useSharedValue(0);
  const shimmerOpacity = useSharedValue(1);
  const gradientOffset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(animatedValue.value) }],
      opacity: shimmerOpacity.value,
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(gradientOffset.value, { duration: 2000, easing: Easing.linear }) }],
    };
  });

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(0.5, {
        duration: 500,
        easing: Easing.linear,
      }),
      -1,
      true
    );

    gradientOffset.value = withRepeat(
      withTiming(200, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const toggleModal = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ top: pageY, left: pageX });
    setIsModalVisible(!isModalVisible);
  };

  // Accumulate all capsules from all categories into a single array
  const capsules = Object.values(thought_capsules_by_category).reduce((accumulator, categoryCapsules) => {
    return accumulator.concat(categoryCapsules);
  }, []);

  const startWavingAnimation = () => {
    animatedValue.value = Math.random() * 20 - 10; // Adjust the range for waving effect
  };

  const stopWavingAnimation = () => {
    animatedValue.value = 0;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={startWavingAnimation}
        onPressOut={stopWavingAnimation}
      >
        <Animated.View style={[styles.iconPlaceholderContainer, animatedStyle]}>
          <FontAwesome5 name="hand-holding-heart" size={40} color={iconColor} />
        </Animated.View>
      </TouchableOpacity>
      <View style={[styles.contentContainer, showIcon && styles.contentWithIcon]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        
        {capsules.length > 0 ? (
          <Animated.View style={[styles.capsuleListContainer, gradientStyle]}>
            <LinearGradient
              colors={['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#0000ff', '#9900ff', '#ff00ff']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientBackground}
            />
            <FlatList
              data={capsules}
              renderItem={({ item }) => <ButtonCapsule capsule={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              contentContainerStyle={styles.flatListContent}
            />
          </Animated.View>
        ) : (
          <Text>No capsules found</Text>
        )}

        {showFooter && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="star" size={14} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="pen-alt" size={14} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome5 name="share-alt" size={14} color="#555" solid={false} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
              <FontAwesome5 name="ellipsis-h" size={14} color="#555" solid={false} />
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
    borderRadius: 0,
    padding: 16, // Increased padding
    paddingLeft: 10,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'black',
  },
  iconPlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Adjust as per your design
    height: 80, // Adjust as per your design
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    padding: 0,
  },
  description: {
    fontSize: 16,
    paddingTop: 0,
    color: 'black',
    marginBottom: 2,
  },
  capsuleListContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8, // Add some border radius if desired
    marginTop: 10, // Add some margin if desired
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '200%', // Extend the width to allow for the shimmering effect
  },
  flatListContent: {
    paddingHorizontal: 10, // Adjust as per your design
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0,
    borderTopColor: '#ccc',
    paddingTop: 2,
    marginTop: 2,
  },
  iconButton: {
    padding: 2,
  },
});

export default CardUpcoming;
