import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const ColorSwatchesSvg = ({ darkColor = '#FF5733', lightColor = '#33FF57', height = 30, width = 30 }) => (
  <Svg height={height} width={width} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <Defs>
      {/* Define gradient with dynamic colors */}
      <LinearGradient id="twoColorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={darkColor} stopOpacity="1" />
        <Stop offset="100%" stopColor={lightColor} stopOpacity="1" />
      </LinearGradient>
    </Defs>

    {/* First path using the dynamic gradient */}
    <Path
      d="M22.0009 16.5V19.5C22.0009 20.88 20.8809 22 19.5009 22H12.3609C11.4709 22 11.0309 20.93 11.6509 20.3L17.5209 14.3C17.7109 14.11 17.9709 14 18.2309 14H19.5009C20.8809 14 22.0009 15.12 22.0009 16.5Z"
      fill={lightColor}
    />
    {/* Second path using a static color */}
    <Path
      d="M18.3702 11.2895L15.6602 13.9995L13.2002 16.4495C12.5702 17.0795 11.4902 16.6395 11.4902 15.7495C11.4902 12.5395 11.4902 7.25953 11.4902 7.25953C11.4902 6.98953 11.6002 6.73953 11.7802 6.54953L12.7002 5.62953C13.6802 4.64953 15.2602 4.64953 16.2402 5.62953L18.3602 7.74953C19.3502 8.72953 19.3502 10.3095 18.3702 11.2895Z"
      fill={darkColor}
    />
    {/* Third path using currentColor */}
    <Path
      d="M7.5 2H4.5C3 2 2 3 2 4.5V18C2 18.27 2.03 18.54 2.08 18.8C2.11 18.93 2.14 19.06 2.18 19.19C2.23 19.34 2.28 19.49 2.34 19.63C2.35 19.64 2.35 19.65 2.35 19.65C2.36 19.65 2.36 19.65 2.35 19.66C2.49 19.94 2.65 20.21 2.84 20.46C2.95 20.59 3.06 20.71 3.17 20.83C3.28 20.95 3.4 21.05 3.53 21.15L3.54 21.16C3.79 21.35 4.06 21.51 4.34 21.65C4.35 21.64 4.35 21.64 4.35 21.65C4.5 21.72 4.65 21.77 4.81 21.82C4.94 21.86 5.07 21.89 5.2 21.92C5.46 21.97 5.73 22 6 22C6.41 22 6.83 21.94 7.22 21.81C7.33 21.77 7.44 21.73 7.55 21.68C7.9 21.54 8.24 21.34 8.54 21.08C8.63 21.01 8.73 20.92 8.82 20.83L8.86 20.79C9.56 20.07 10 19.08 10 18V4.5C10 3 9 2 7.5 2ZM6 19.5C5.17 19.5 4.5 18.83 4.5 18C4.5 17.17 5.17 16.5 6 16.5C6.83 16.5 7.5 17.17 7.5 18C7.5 18.83 6.83 19.5 6 19.5Z"
      fill="url(#twoColorGradient)"
    />
  </Svg>
);

export default ColorSwatchesSvg;
