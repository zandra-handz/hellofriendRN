import React, { useEffect } from "react";
import { Alert, StyleSheet, Pressable } from 'react-native';
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
 import { MaterialCommunityIcons } from "@expo/vector-icons"; 
 import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
const ButtonResetHelloes = ({ iconSize=15 }) => {
  const {  handleRemixAllNextHelloes, remixAllNextHelloesMutation } = useUpcomingHelloes(); // MOVE TO CONTEXT
 
 const { themeStyles, manualGradientColors } = useGlobalStyle();
 
 
    const handleOnPress = () => {
   
      Alert.alert('Warning!', 'Reset all suggested hello dates? (You can run this reset three times a day.)', [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
              {text: 'Reset', onPress: () => handleRemixAllNextHelloes()},
 
      ]); 
  };
  const confirmResetHelloes = async () => {
 
    

    await handleRemixAllNextHelloes();

  };

  

  // useEffect(() => {
  //   if (remixAllNextHelloesMutation.isSuccess) {
 
  //     // showMessage(true, null, `All friend dates reset!`);
  //   } else if (remixAllNextHelloesMutation.isError) {
  //     console.log('error'); 
  //   }

  // }, [remixAllNextHelloesMutation]);
  return ( 

<Pressable onPress={handleOnPress}
  style={({ pressed }) => [
    styles.container,
    {backgroundColor: manualGradientColors.lightColor},
    pressed && styles.pressedStyle, 
  ]}>
<MaterialCommunityIcons 
name={'refresh'}
size={iconSize}
color={manualGradientColors.homeDarkColor}

/>

  </Pressable>
 
    
      
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: 'auto',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: '.5%', 
    paddingVertical: '.5%',
    alignItems: 'center',
  },
  pressedStyle: {

  },
  on: {
    backgroundColor: '#4cd137',
  },
  off: {
    backgroundColor: '#dcdde1',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2, 
  },
});

export default ButtonResetHelloes;
