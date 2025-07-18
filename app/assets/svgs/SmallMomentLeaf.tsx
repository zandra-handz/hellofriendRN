import React from "react";
import Svg, { Path, G } from "react-native-svg";

const SmallMomentLeaf = ({
  fill = "none",
  stroke = "black",
  width = 100,
  height = 100,
  strokeWidth = 12,
}) => (
   <Svg width={width} height={height} viewBox="36 -52 200 500">
      <G stroke={stroke} strokeWidth={strokeWidth} fill={fill}>
   
  
        {/* Leaf 2  */}
  
        {/* fill */}
        <Path
          d="M210.76,156.37C201.33,122,162.91,91,117.32,81.08,56.73,67.92,53,27.15,52.9,25.35A5.89,5.89,0,0,0,52,22.69a5.91,5.91,0,0,0-3.49-2.69,6,6,0,0,0-4.16.58,6,6,0,0,0-2.72,3.15C39.65,28.53.88,141.28,60.7,201.92c45.49,46.11,98.53,35.67,116.53,30.3,4,17.59,2.2,29.61,2,30.72a6,6,0,0,0,5.89,6.93A6,6,0,0,0,191,265C197.16,229.36,215.47,173.57,210.76,156.37Z"
          // transform=" scale(1) translate(-30, 0)"
        />
  
        <Path
          d="M210.76,156.37C201.33,122,162.91,91,117.32,81.08,56.73,67.92,53,27.15,52.9,25.35A5.89,5.89,0,0,0,52,22.69a3.57,3.57,0,0,0-.3-.38A5.91,5.91,0,0,0,48.51,20s0-.05-.09-.06-.12,0-.19,0a5.38,5.38,0,0,0-1.65-.21,6,6,0,0,0-2.4.7l-.11.09a6,6,0,0,0-2.72,3.15s0,0,0,0C39.65,28.53.88,141.28,60.7,201.92c45.49,46.11,98.53,35.67,116.53,30.3,4,17.59,2.2,29.61,2,30.72a6,6,0,0,0,4.89,6.87,5.79,5.79,0,0,0,1,.07A6,6,0,0,0,191,265c.23-1.34,2.55-16.86-3.1-38.78C214.92,199.39,215.47,173.57,210.76,156.37ZM69.18,193.54C32.89,156.75,37.36,96,44.54,59.12c6.77,23.33,24.41,55.45,68.79,86.63,36.42,25.6,53.15,53.14,60.65,75.09C158.74,225.73,111.11,236,69.18,193.54Zm114.69,19.81C175.14,190,157.09,161.94,120.19,136c-37.52-26.37-54.45-53-62-73.33C69,74.7,86.34,86.55,114.77,92.73c40.79,8.86,76.32,37,84.48,66.79C204.31,178,199,196.41,183.87,213.35Z"
          // transform=" scale(1) translate(-30, 0)"
        />
      </G>
  
      <G stroke={fill} strokeWidth={strokeWidth} fill={stroke}>
   
  
        {/* Leaf 2  */}
  
        <Path
          d="M69.18,193.54C32.89,156.75,37.36,96,44.54,59.12c6.77,23.33,24.41,55.45,68.79,86.63,36.42,25.6,53.15,53.14,60.65,75.09C158.74,225.73,111.11,236,69.18,193.54Z"
          // transform="scale(1) translate(-30, 0)"
          fill={fill}
          stroke={fill}
          strokeWidth={10}
        />
  
        <Path
          d="M183.87,213.35C175.14,190,157.09,161.94,120.19,136c-37.52-26.37-54.45-53-62-73.33C69,74.7,86.34,86.55,114.77,92.73c40.79,8.86,76.32,37,84.48,66.79C204.31,178,199,196.41,183.87,213.35Z"
          // transform="scale(1) translate(-30, 0)"
          fill={fill}
          stroke={fill}
          strokeWidth={0}
        />
      </G>
    </Svg>
);

export default SmallMomentLeaf;
