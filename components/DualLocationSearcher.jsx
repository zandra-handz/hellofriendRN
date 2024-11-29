 
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native'; 
import SearchBarGoogleAddress from '../components/SearchBarGoogleAddress';
import ButtonGoToAllLocations from '../components/ButtonGoToAllLocations';
 
const DualLocationSearcher = ({switchSource, onPress}) => {

    return(
        <View style={{zIndex: 2200, flexDirection: 'row', position: 'absolute', width: '100%', paddingHorizontal: '1%', top: '12%'}}>
        <SearchBarGoogleAddress onPress={onPress}/>
        <View>
        <ButtonGoToAllLocations onPress={onPress} /> 
        </View> 
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    alignContent: 'center',
    height: '100%',  
    borderRadius: 30,
    height: 48,
    backgroundColor: 'transparent', 
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: '18%',
  },
  searchInput: { 
    flex: 1, 
    alignItems: 'center',
    alignContent: 'center',
    fontFamily: 'Poppins-Regular', 
    fontSize: 15,
    textAlign: 'left',
    overflow: 'hidden',
    paddingHorizontal: 12, 
    height: 'auto', 
    
  },
  listView: {
    backgroundColor: 'white',
    marginTop: -4,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
    maxHeight: 300,

  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  iconStyle: {
    marginRight: 10,

  },
});

export default DualLocationSearcher;
