import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CardCheckboxMidpointLocation = ({ id, name, address, mydistance, frienddistance, mytraveltime, friendtraveltime, travel_times }) => {

  useEffect(() => { 
    console.log(frienddistance);
  }, []);

  return (
    <View style={styles.container}> 
      <View style={styles.iconPlaceholderContainer}>
          <View style={[styles.iconPlaceholder, { backgroundColor: 'hotpink' }]} />

      
      </View>
      <View style={[styles.contentContainer, styles.contentWithIcon]}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{address}</Text>
        </View> 
        <View styles={styles.bottomBar}>
        <Text style={styles.iconButton}>me: {mytraveltime} | {mydistance.toFixed(2)} mi</Text>
        <Text style={styles.iconButton}>friend: {friendtraveltime} | {frienddistance.toFixed(2)} mi</Text>

          <Text style={styles.address}></Text>
        </View>
      </View>
      <View style={styles.rightPlaceholderContainer}>
          <View style={[styles.rightPlaceholder, { backgroundColor: 'hotpink' }]} />

      
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 8,
    paddingLeft: 10,
    marginBottom: 0,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
    width: '100%',
    borderTopWidth: 0.5, 
    borderTopColor: 'black',
  },
  iconPlaceholderContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: 'auto', // One-sixth of the width
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Placeholder color
  },
  rightPlaceholderContainer: {
    position: 'absolute',
    top: 0, 
    right: 20, 
    width: 40, 
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 8,
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',  
  },
  contentContainer: {
    flex: 1,
  },
  contentWithIcon: {
    paddingLeft: 8, // Add some padding to separate from the icon placeholder
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
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
  },
});




export default CardCheckboxMidpointLocation;

