import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonChatCapsule from './ButtonChatCapsule';
import AlertSmallColored from './AlertSmallColored';

const CardUpcoming = ({
  title,
  description,
  thought_capsules_by_category = {},
  showIcon = true,
  iconColor,
  showFooter = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const toggleModal = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ top: pageY, left: pageX });
    setIsModalVisible(!isModalVisible);
  };

  const capsules = Object.values(thought_capsules_by_category).reduce((accumulator, categoryCapsules) => {
    return accumulator.concat(categoryCapsules);
  }, []);

  return (
    <View style={styles.container} accessibilityRole="button" accessibilityLabel={`Card for ${title}`}>
      {showIcon && (
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="hand-holding-heart" size={30} color={iconColor} />
          </View>
        </TouchableOpacity>
      )}
      <View style={[styles.contentContainer, showIcon && styles.contentWithIcon]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} accessibilityLabel={`Title: ${title}`}>
            {title}
          </Text>
        </View>
        <Text style={styles.description} accessibilityLabel={`Description: ${description}`}>
          {description}
        </Text>

        {capsules.length > 0 ? (
          <View style={styles.capsuleListContainer}>
            <FlatList
              data={capsules}
              renderItem={({ item }) => (
                <ButtonChatCapsule
                  capsule={item}
                  accessibilityLabel={`Chat Capsule: ${item.label}`}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              contentContainerStyle={styles.flatListContent}
              accessibilityRole="list"
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
