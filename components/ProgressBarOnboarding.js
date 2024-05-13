import * as React from 'react';
import { ProgressBar, MD3Colors } from 'react-native-paper';

const ProgressBarOnboarding = ({ percentage }) => (
  <ProgressBar progress={percentage} color={MD3Colors.error50} />
);

export default ProgressBarOnboarding;
