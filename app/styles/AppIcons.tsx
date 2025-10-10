// AppIcon.js
import React from 'react';
import { View } from 'react-native';
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';

// Example SVG imports
// import LeafSvg from '../assets/icons/leaf.svg';
// import GeckoSvg from '@/app/assets/svgs/'
// import CoffeeSvg from '../assets/icons/coffee.svg';

// Map vector icon packs
const iconPacks = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

// Map SVG icons
const svgIcons = {
//   leaf: LeafSvg,
//   coffee: CoffeeSvg,
};

export default function AppIcon({
  name,
  pack = 'MaterialCommunityIcons', // default pack
  size = 24,
  color = 'black',
  width,
  height,
  style,
}) {
  // Render SVG if available
  if (svgIcons[name]) {
    const SvgIcon = svgIcons[name];
    return <SvgIcon width={width ?? size} height={height ?? size} fill={color} style={style} />;
  }

  // Render vector icon
  const Pack = iconPacks[pack];
  if (!Pack) {
    console.warn(`Unknown icon pack: "${pack}"`);
    return <View style={{ width: size, height: size }} />;
  }

  return <Pack name={name} size={size} color={color} style={style} />;
}
