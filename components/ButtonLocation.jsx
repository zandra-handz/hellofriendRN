import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
 import { useNavigation } from '@react-navigation/native';
 import { useGlobalStyle } from '../context/GlobalStyleContext'; 

const ButtonLocation = ({ location, height=100, favorite=false, color = 'white', bottomMargin = 0, iconColor = 'white', icon: Icon, iconSize = 30 }) => {

  const navigation = useNavigation();  
  const { themeStyles } = useGlobalStyle(); 
 
  

  const handleGoToLocationViewScreen = () => { 
    navigation.navigate('Location', { location: location, favorite: favorite });
  
  }; 

  const handlePress = async () => {  
    handleGoToLocationViewScreen();

  };

  return (
    <View>
      <TouchableOpacity
              style={[
                styles.container,
                themeStyles.genericTextBackgroundShadeTwo,
                { height: height,
                  marginBottom: bottomMargin
                 },
              ]}
        onPress={handlePress} 
      >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%", 
                    flex: 1,
                    //marginBottom: "3%",
                  }}
                >

        {Icon && (
          <View style={styles.iconContainer}>
            
            <Icon width={iconSize} height={iconSize} color={iconColor} />
          </View>
        )}
        <View style={styles.titleContainer}> 
           <Text style={[styles.title, themeStyles.subHeaderText]}>
            {location.title}
            </Text>
            </View>
         </View>
          <View style={styles.textContainer}>
          <Text style={[styles.optionText, {color: color}]}>{location.address}</Text>
    
        
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",  
    borderRadius: 30, 
    padding: 20,
    overflow: "hidden", 
  },
  optionTitleText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  optionText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  }, 
  iconContainer: {
    flexDirection: "row",

    width: "9%",
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    width: "70%",

    flex: 1,
    flexGrow: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "lowercase",
  },
});

export default ButtonLocation;
