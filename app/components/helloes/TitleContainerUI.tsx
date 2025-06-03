import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'

const TitleContainerUI = ({height, title, children}) => {
  const { themeStyles } = useGlobalStyle();
  return (
    <View style={{height: height, maxHeight: height, width: '100%', flex: 1, marginTop: 10, padding: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 0, height: 'auto'}}>
        <Text style={[themeStyles.primaryText, {fontWeight: 'bold', fontSize: 12 }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

export default TitleContainerUI;