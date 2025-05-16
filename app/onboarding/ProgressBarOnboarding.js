import * as React from 'react';
import { ProgressBar } from 'react-native-paper';
import HeaderBaseTitleOnly from '@/app/components/headers/HeaderBaseTitleOnly';

const ProgressBarOnboarding = ({ percentage }) => (
  <>
  <HeaderBaseTitleOnly />
    <ProgressBar
      progress={percentage}
      color="darkgreen" 
      style={{ height: 4 }}  
    />
    
  </>
);

export default ProgressBarOnboarding;
