import React from 'react';
import { TouchableOpacity } from 'react-native';
import ArrowBackSharpOutlineSvg from '../assets/svgs/arrow-back-sharp-outline.svg';

const ButtonBack = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <ArrowBackSharpOutlineSvg width={36} height={36} color="black" />
  </TouchableOpacity>
);

export default ButtonBack;
