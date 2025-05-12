// <!-- <?xml version="1.0"?>
// <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 512 512">
//   <path 
//     fill="currentFill"
//     stroke="currentColor"
//     stroke-width="1"
//     d="
//       M391.37,28.21 
//       c-2-3.1-3.19-4.9-3.3-5
//       a6,6,0,0,0-10.8,3.1 
//       c-4.77,78.82-35.79,109.49-195.29,193 
//       C121.37,250.88,85.74,288.11,76,329.8 
//       c-10.32,44.11,12.59,76.29,13.57,77.64 
//       A6.38,6.38,0,0,0,91,408.84 
//       C74.84,451.6,81.15,486,81.29,486.67 
//       A6,6,0,0,0,93,484.33 
//       c-.48-2.44-5.8-32.07,7.71-69.35 
//       a182.32,182.32,0,0,0,94.36,25.8 
//       A206.29,206.29,0,0,0,243.29,435 
//       c68.22-16.41,129.24-66.33,167.41-137 
//       C476.48,176.28,407.79,54.28,391.37,28.21 
//       Z"
//   />
// </svg> -->
// import React from 'react';
// import Svg, { Path } from 'react-native-svg';

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LeafSingleOutlineInvertedSvg = ({ fill, stroke, width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 512 512">
    <Path
      fill={fill} // Dynamically pass the fill color
      stroke={stroke} // Dynamically pass the stroke color
      strokeWidth="3" // Optional: You can adjust stroke width here
      d="
        M391.37,28.21 
        c-2-3.1-3.19-4.9-3.3-5
        a6,6,0,0,0-10.8,3.1 
        c-4.77,78.82-35.79,109.49-195.29,193 
        C121.37,250.88,85.74,288.11,76,329.8 
        c-10.32,44.11,12.59,76.29,13.57,77.64 
        A6.38,6.38,0,0,0,91,408.84 
        C74.84,451.6,81.15,486,81.29,486.67 
        A6,6,0,0,0,93,484.33 
        c-.48-2.44-5.8-32.07,7.71-69.35 
        a182.32,182.32,0,0,0,94.36,25.8 
        A206.29,206.29,0,0,0,243.29,435 
        c68.22-16.41,129.24-66.33,167.41-137 
        C476.48,176.28,407.79,54.28,391.37,28.21 
        Z"
    />
  </Svg>
);

export default LeafSingleOutlineInvertedSvg;
