import { View, Text, DimensionValue, StyleSheet } from 'react-native'
import React from 'react'
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'

type Props = {
    helloData: object;
    combinedHeight: DimensionValue;
    index: number;
    
    
}

const HelloItem = ({helloData, itemHeight, bottomMargin, combinedHeight, index}: Props) => {
    const { themeStyles } = useGlobalStyle();
  return (
    <View style={[styles.container, {height: combinedHeight,  backgroundColor: index % 2 === 0 ? themeStyles.primaryBackground.backgroundColor : 'gray'}]}>
      <Text style={themeStyles.primaryText}>{helloData.date}</Text>
        <Text style={themeStyles.primaryText}>{helloData.type}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

});

export default HelloItem