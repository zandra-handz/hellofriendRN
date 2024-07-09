// ItemViewFooter.js

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ButtonSignOut from './ButtonSignOut';
import ButtonSettings from './ButtonSettings';
import ButtonInfo from './ButtonInfo'; // Make sure to import your ButtonInfo component
import AlertMicro from './AlertMicro';
import ButtonToActionMode from './ButtonToActionMode';
import { useNavigationState } from '@react-navigation/native';

import { FontAwesome5 } from 'react-native-vector-icons';


const ItemViewFooter = ({ onClose, onEdit, onDelete, onShare, includeTag, setIncludeTag }) => {
  const navigationState = useNavigationState(state => state);
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === 'hellofriend'; // Adjust this based on your navigation setup

  return (
    <View style={styles.container}>
      {isOnActionPage ? (
        <View style={styles.section}>
          <ButtonSignOut
            icon="logout"
            iconOnly={false}
            label="Logout"
            confirmationAlert={true}
            modal={AlertMicro}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <ButtonToActionMode iconName="arrow-left" navigateScreen="hellofriend" />
        </View>
      )}

      <View style={styles.divider} />

      <ButtonSettings />

      <View style={styles.divider} />

      {/* Replace TouchableOpacity with ButtonInfo */}
      <ButtonInfo />

      <View style={styles.divider} />

      {/* Buttons specific to ItemViewImage */}
      <TouchableOpacity style={styles.button} onPress={onEdit}>
        <FontAwesome5 name="edit" size={24} color="blue" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onDelete}>
        <FontAwesome5 name="trash-alt" size={24} color="red" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onShare}>
        <FontAwesome5 name="share" size={24} color="green" style={styles.icon} />
      </TouchableOpacity>
      <View style={styles.tagContainer}>
        <Text style={styles.tagLabel}>Include 'hellofriend' tag</Text>
        <TouchableOpacity onPress={() => setIncludeTag(!includeTag)}>
          <FontAwesome5
            name={includeTag ? "check-square" : "square"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 64,
    width: '100%',
    marginBottom: 0,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  section: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  button: {
    marginLeft: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default ItemViewFooter;
