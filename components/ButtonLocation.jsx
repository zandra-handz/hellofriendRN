import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonLocation = ({ location, onPress, icon: Icon, iconSize = 34 }) => {

  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend();

  const renderOptionItem = (location) => {
    return (
      <TouchableOpacity
        style={styles.optionButton}
        onPress={onPress}
      >
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon width={iconSize} height={iconSize} color={themeStyles.genericText.color} />
          </View>
        )}
        <View style={styles.textContainer}> 
          {typeof location === 'object' && location !== null ? (
            <>
              <Text style={[styles.optionTitleText, themeStyles.genericText]}>{location.title}</Text>
              <Text style={[styles.optionText, themeStyles.genericText]}>{location.address}</Text>
            </>
          ) : ( 
            <Text style={[styles.optionText, themeStyles.genericText]}>{location}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View> 
      {renderOptionItem(location)}
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
