import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ButtonToggleSize = ({ title, onPress, textButton=false, text='Go', iconName, iconSize=24 }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{title}</Text>
        <Icon name={iconName} size={iconSize} color="white" />
        {textButton && <Text style={styles.text}>{text}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4cd137', // Green background
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    marginRight: 5,
  },
});

export default ButtonToggleSize;
