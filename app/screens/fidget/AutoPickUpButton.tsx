import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import SvgIcon from '@/app/styles/SvgIcons'


type Props = {
    color: string;
    backgroundColor: string;
    onPress: () => void; 
    buttonDiameter: number;
    buttonPadding: number;
    iconSize: number;
    
    
    

}

const AutoPickUpButton = ({color='red', backgroundColor='orange', onPress,  buttonDiameter=40, buttonPadding=20, iconSize=20}: Props) => {
 
  return (
    <Pressable onPress={onPress} style={[styles.manualButton, {height: buttonDiameter, width: buttonDiameter, backgroundColor: backgroundColor, padding: buttonPadding}]}>
        <SvgIcon name={`auto_mode`} color={color} size={iconSize} />
         
    </Pressable>
  )
}

const styles = StyleSheet.create({
 
  manualButton: {
    paddingVertical: 20,
    borderRadius: 999,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
   //      borderWidth: 1,
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 1,
  },
});


export default AutoPickUpButton