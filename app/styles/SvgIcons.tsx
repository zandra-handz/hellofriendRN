// SvgIcon.js
import React from "react";
import { View } from "react-native";

import LeafSvg from "./svgs/leaf";
import CalendarSvg from "./svgs/calendar";
import PencilSvg from "./svgs/pencil";
import PinOutlineSvg from "./svgs/pin-outline";
import CalendarOutlineSvg from "./svgs/calendar-outline";

// Import your SVGs here
// Example:
// import LeafSvg from '../assets/icons/leaf.svg';
// import CoffeeSvg from '../assets/icons/coffee.svg';

const svgIcons = {
  leaf: LeafSvg, // welcome message
  calendar: CalendarSvg, // hello quick view
  pencil: PencilSvg, // hello quick view
  pin_outline: PinOutlineSvg, // friend header
  calendar_outline: CalendarOutlineSvg, // friend header
};

export default function SvgIcon({
  name,
  size = 24,
  color = "black",
  width,
  height,
  style,
}) {
  const Icon = svgIcons[name];

  if (!Icon) {
    console.warn(`Unknown SVG icon: "${name}"`);
    return <View style={{ width: width ?? size, height: height ?? size }} />;
  }

  return (
    <Icon
      width={width ?? size}
      height={height ?? size}
      fill={color}
      style={style}
    />
  );
}
