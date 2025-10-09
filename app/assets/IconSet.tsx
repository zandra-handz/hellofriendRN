import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createIconSet } from 'react-native-vector-icons';
import * as Font from 'expo-font';
import glyphMap from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

// Create your custom icon set
const MyIconSet = createIconSet(
  {
    'pin-outline': glyphMap['pin-outline'],
    'home-outline': glyphMap['home-outline'],
    'plus': glyphMap['plus'],
    'leaf': glyphMap['leaf'],
  },
  'MaterialCommunityIcons'
);

// Reusable component
export default function Icon({ name, size = 24, color = 'black', style }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      MaterialCommunityIcons: require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
    }).then(() => setLoaded(true));
  }, []);

  if (!loaded) return <View />;

  return <MyIconSet name={name} size={size} color={color} style={style} />;
}
