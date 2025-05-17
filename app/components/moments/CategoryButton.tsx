import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'

const CategoryButton = ({label, onPress, isHighlighted}) => {
     const { themeStyles, gradientColors, gradientColorsHome, appContainerStyles, appFontStyles } = useGlobalStyle();
     
  return (

            <TouchableOpacity
              style={[
                appContainerStyles.categoryButton,
                { backgroundColor: isHighlighted ? 'red' : 'transparent',
                    borderColor: isHighlighted ? gradientColorsHome.lightColor : 'transparent'
                 },
              ]}
              onPress={() => {
                onPress(label);
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  appFontStyles.categoryButtonText,
                  themeStyles.genericText,
                //   { color: gradientColorsHome.darkColor },
                ]}
              >
                # {label}
              </Text>
            </TouchableOpacity>
  )
}

export default CategoryButton