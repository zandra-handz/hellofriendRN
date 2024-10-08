import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ItemViewLocation from '../components/ItemViewLocation';

const ButtonLocation = ({ location, icon: Icon, iconSize = 34 }) => {
  const { themeStyles } = useGlobalStyle();

  const [ isModalVisible, setIsModalVisible ] = useState(false);

  const toggleModal = () => {
    console.log('modal in button location toggled');
    console.log('location in button location: ', location);
    setIsModalVisible(true);


  };

  const closeModal = () => {
    setIsModalVisible(false);

  };


  return (
    <View>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={toggleModal}
      >
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={iconSize} height={iconSize} color={themeStyles.genericText.color} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitleText, themeStyles.genericText]}>{location.title}</Text>
          <Text style={[styles.optionText, themeStyles.genericText]}>{location.address}</Text>
        </View>
      </TouchableOpacity>
      
      {isModalVisible && (
        <ItemViewLocation 
          isModalVisible={true}
          location={location} 
          onClose={closeModal} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  optionTitleText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  optionText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
});

export default ButtonLocation;
