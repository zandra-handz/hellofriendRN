import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { SharedValue } from 'react-native-reanimated';
import DebugButton from '@/app/screens/fidget/DebugButton';
import moment from 'moment';
type Props = {
    color: string;
    momentSV: SharedValue;
    onSelect: (capsule_id: string) => void;
}

const YieldMoment = ({color, momentSV, onSelect}: Props) => {


    const handleYield = () => {
            console.log('yield pressed', momentSV.value)
        if (momentSV && momentSV?.value?.id)
            console.log('pressin', momentSV.value?.id)
        onSelect(momentSV.value?.id, momentSV.value.geckoGameType);

    };

  return (
    <DebugButton
    onPress={handleYield}

    />
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%'},
  innerContainer: {flexDirection: 'column'},
  rowContainer: {flexDirection: 'row'},
  labelWrapper: {},
  label: {},
});

export default YieldMoment