import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions, Animated, FlatList } from 'react-native';
import { FlashList } from "@shopify/flash-list"; 
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
 
import ButtonCalendarDateSvgAndLabel from '../components/ButtonCalendarDateSvgAndLabel';
 
const ButtonMultiFeatureUpcoming = ({
  onPress,
  isLoading = false, 
  headerText = 'UP NEXT',
  label,
  additionalText = '', 
  preLabelFontSize = 18,
  preLabelColor = 'white',
  labelFontSize = 22,
  labelColor = 'black',
  additionalTextFontSize = 16,
  additionalTextColor = 'white',
  backgroundColor = 'transparent', 
  showGradient = true,
  darkColor = 'black',
  lightColor = 'black',
  showGradientSatelliteSection = true,
  satelliteDarkColor = 'darkgrey',
  satelliteLightColor = 'darkgrey',
  direction = { x: 1, y: 0 },
  showSatelliteHeader = false, 
  showShape = true,
  shapePosition = 'left',
  shapeSource,
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,
  satellites = false,
  satelliteSectionPosition = 'right',
  satelliteCount = 2,
  satellitesOrientation = 'horizontal',
  satelliteHeight = 40,
  satelliteHellos = [],
  satelliteOnPress,
  additionalPages = false, // New prop for additional pages
  additionalSatellites = [], // New prop for additional satellites
}) => { 
  const globalStyles = useGlobalStyle();
  const { width } = Dimensions.get('window'); 
 
  const [mainViewVisible, setMainViewVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

 

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
    }),
  });

  const extractNumberDate = (dateString) => {
    const match = dateString.match(/\d+/);  
    return match ? match[0] : '';  
  };

  const extractMonth = (dateString) => {
    const match = dateString.match(/([a-zA-Z]+)\s+\d+/);  
    return match ? match[1].slice(0, 3).toUpperCase() : ''; 
  };

 
  

  const satelliteWidth = (width / 3) / satelliteCount;

  const renderSatellites = () => {
    const satellitesArray = [];
 
    if (satelliteHellos && satelliteHellos.length > 0) {
      const numSatellites = Math.min(satelliteCount, satelliteHellos.length);

      for (let i = 0; i < numSatellites; i++) {
        satellitesArray.push(
          <TouchableOpacity
            key={i}
            style={[
              styles.satelliteButton,
              { width: 60, alignItems: 'center', height: satellitesOrientation === 'horizontal' ? satelliteHeight : 60 },
            ]}
            onPress={() => satelliteOnPress(satelliteHellos[i])}
          >


          <ButtonCalendarDateSvgAndLabel 
            numberDate={extractNumberDate(satelliteHellos[i].future_date_in_words)}
            month={extractMonth(satelliteHellos[i].future_date_in_words)} 
            width={60} 
            height={60} 
            showMonth={true} 
            showLabel={false}
            onPress={() => satelliteOnPress(satelliteHellos[i])}
            enabled={true}  
            color='white' 
          />
          </TouchableOpacity>
        );
      }
    }

    return satellitesArray;
  };

  const handlePress = () => {
    if (!isLoading) {
      onPress();
    }
  };

  const renderAdditionalSatellites = () => (
    <FlashList
      data={additionalSatellites}
      horizontal={true}
      keyExtractor={(item, index) => `satellite-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.additionalSatelliteButton,
            { width: satelliteWidth },
          
          ]}
          onPress={() => satelliteOnPress(item)}
        >
      
          <ButtonCalendarDateSvgAndLabel 
                numberDate={extractNumberDate(item.future_date_in_words)}
                month={extractMonth(item.future_date_in_words)} 
                label={item.friend_name}
                width={50} 
                height={50} 
                showMonth={false} 
                enabled={true}  
                color='white' 
                onPress={() => satelliteOnPress(item)}
              />
           
        
        </TouchableOpacity>
      )} 
      estimatedItemSize={54}
      showsHorizontalScrollIndicator={false}

// Optional: Customize scroll indicator insets if needed
     scrollIndicatorInsets={{ right: 1 }}
    />
  );

  return (
    <View style={styles.container}>
      {!additionalPages && mainViewVisible && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { width: satellites ? '76.66%' : '100%' }]}>
              
              <TouchableOpacity
                style={{
                  flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                  width: '100%',
                  height: 140,
                  padding: 10,
                  borderRadius: 30,
                  alignItems: 'center',
                  overflow: 'hidden',
                  backgroundColor: showGradient ? 'transparent' : backgroundColor,
                }}
                onPress={handlePress}
              >
                {showGradient && (
                  <LinearGradient
                    colors={[darkColor, lightColor]}
                    start={{ x: 0, y: 0 }}
                    end={direction}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                {showShape && (
                  <View style={{position: 'absolute', right: -34, top: -55, transform: [{ rotate: '240deg' }] }}>
                    {shapeSource}
                  </View> 
                )}
                <View style={{ flexDirection: 'column', paddingHorizontal: 5, paddingBottom: 8, paddingTop: 8, flex: 1 }}>
                  <Text
                    style={[
                      textStyles(preLabelFontSize, preLabelColor),
                      { fontFamily: 'Poppins-Regular', marginBottom: -6 },
                    ]}
                  >
                    {headerText}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                      <>
                        <Text
                          style={[
                            textStyles(labelFontSize, labelColor),
                            { fontFamily: 'Poppins-Regular' },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {label}
                        </Text>
                      </> 
                  </View>
                  <Text
                    style={[
                      textStyles(additionalTextFontSize, additionalTextColor),
                      { textAlign: 'left', marginBottom: 10 },
                    ]}
                  >
                    {additionalText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {satellites && (
              <View style={[styles.satelliteSection, { backgroundColor: backgroundColor, paddingTop: 0, flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                    {showSatelliteHeader && (
                    <Text
                        style={[
                        textStyles(preLabelFontSize, preLabelColor),
                        { fontFamily: 'Poppins-Regular', marginBottom: -6 , zIndex: 1},
                        ]}
                    >
                       SOON
                  </Text>
                  )}
                {showGradientSatelliteSection && (
                  <LinearGradient
                    colors={[satelliteDarkColor,satelliteLightColor]}
                    start={{ x: 0, y: 0 }}
                    end={direction}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={styles.additionalSatelliteSection}>
          {renderAdditionalSatellites()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0,
    borderRadius: 30,
    overflow: 'hidden',
  },
  mainButtonContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  },
  satelliteSection: {
    width: '33.33%',
    height: 140,
    borderRadius: 0,
    marginLeft: -20,
    paddingLeft: 0,  
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  satelliteButton: { 
    alignItems: 'center',  
    alignContents: 'center', 
    justifyContent: 'space-around',  
  },
  additionalSatelliteSection: {
    flexDirection: 'row',
    height: 140,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  additionalSatelliteButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center', 
    borderRadius: 0, 
    borderRightWidth: .8,
    borderColor: 'darkgray', 
    paddingTop: 30,
    height: '100%',
    width: 50,
    backgroundColor: 'transparent',

    
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: 'white',
    
  },
});

export default ButtonMultiFeatureUpcoming;
