import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 
const LocationImages = ({ photos }) => { 

    const { themeStyles } = useGlobalStyle();

  if (!photos || photos.length === 0) {
    return null;
  } else {
    console.log('images: ', photos);
  }

  return (
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.genericText]}>Photos</Text> 
      </View> 
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {photos.map((photoUrl, index) => (
            <>
            <Image key={index} style={styles.image} source={{ uri: photoUrl }} contentFit="cover"  />
           
            
            </>
          ))}
        </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30, 
    margin: '4%',
    
    alignContents: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  scrollView: {
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'limegreen',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});

export default LocationImages;
