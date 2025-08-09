import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalStyle } from '@/src/context/GlobalStyleContext'

type Props = {
    infoText: string;
}

const ModalInfoText = ({infoText='Info about this modal goes here'}: Props) => {

    const { themeStyles, appFontStyles } = useGlobalStyle();
  return (
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.subWelcomeText,
            { fontSize: 14, lineHeight: 22 },
          ]}
        >
          {infoText}
        </Text>
  )
}

export default ModalInfoText