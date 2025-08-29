import { View, Text } from 'react-native'
import React from 'react'
 
const TitleContainerUI = ({primaryColor, height, title, children}) => {
 
  return (
    <View style={{height: height, maxHeight: height, width: '100%', flex: 1, marginTop: 10, padding: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 0, height: 'auto'}}>
        <Text style={ {fontWeight: 'bold', fontSize: 12, color: primaryColor }}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

export default TitleContainerUI;