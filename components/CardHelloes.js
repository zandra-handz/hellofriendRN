import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonCapsule from './ButtonCapsule';
import AlertSmallColored from './AlertSmallColored'; // Adjust the path according to your file structure

const CardHelloes = ({ title, description, capsules, showIcon = true, iconColor, showFooter = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const toggleModal = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setModalPosition({ top: pageY, left: pageX });
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={styles.iconContainer}>
          <FontAwesome5 name="coffee" size={30} color="#555" solid={false} style={styles.icon} />
        </View>
      )}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        
        <FlatList
          data={capsules}
          renderItem={({ item }) => <ButtonCapsule capsule={item} />}
          keyExtractor={(item) => item.id}
          horizontal
        />

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
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
    width: '100%',
    padding: 16,
  },
  iconContainer: {
    position: 'absolute',
    left: -15,
    top: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  icon: {
    padding: 10,
  },
  contentContainer: {
    marginLeft: 40, // Adjusted to accommodate the icon
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

export default CardHelloes;
