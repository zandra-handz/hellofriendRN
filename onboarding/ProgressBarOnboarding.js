import * as React from 'react';
import { ProgressBar } from 'react-native-paper';
import HeaderBaseTitleOnly from '../components/HeaderBaseTitleOnly';

const ProgressBarOnboarding = ({ percentage }) => (
  <>
  <HeaderBaseTitleOnly  headerTitle={'Getting started'}/>
    <ProgressBar
      progress={percentage}
      color="darkgreen" // Replace with your desired color
      style={{ height: 4 }} // Adjust the height as needed
    />
    
  </>
);

export default ProgressBarOnboarding;
