import * as React from 'react';
import { ProgressBar, MD3Colors } from 'react-native-paper';

const ProgressBarOnboarding = ({ percentage }) => (
  <ProgressBar
    progress={percentage}
    color="hotpink" // Replace with your desired color
    style={{ height: 4 }} // Adjust the height as needed
  />
);

export default ProgressBarOnboarding;
