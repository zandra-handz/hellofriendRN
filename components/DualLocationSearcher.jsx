import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { View, StyleSheet, Animated, Text, TouchableOpacity } from 'react-native'; 
import ListCheckSvg from '../assets/svgs/list-check.svg';
import GoogleLogoSvg from '../assets/svgs/google-logo.svg';
import SearchBarGoogleAddress from '../components/SearchBarGoogleAddress';
import SearchBarSavedLocations from '../components/SearchBarSavedLocations';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import SearchBarAnimationWrapper from '../components/SearchBarAnimationWrapper';


const DualLocationSearcher = ({onPress, locationListDrilledOnce}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const searchStringRef = useRef(null);
  const [ savedLocationsSearchIsVisible, setSavedLocationsVisibility ] = useState(false);
  const [ mountingText, setMountingText ] = useState('');
  const [searchString, setSearchString] = useState('');

  const updateSearchString = (text) => {
    setSearchString(text);

    // Update the text in both components via ref
    if (searchStringRef && searchStringRef.current) {
      searchStringRef.current.setText(text);
    }
  };

  //useEffect(() =>{ 
    //if (searchString){
      //console.log(searchString);

   // }
   //}, [searchString]);

   //useEffect(() => {
   // if (locationListDrilledOnce) {
    //  console.log(locationListDrilledOnce);

    //};

   //}, [locationListDrilledOnce]);


  const switchViews = () => {
    setMountingText(searchString);
    setSavedLocationsVisibility(!savedLocationsSearchIsVisible);
    
  };

  return (
    <View style={styles.container}> 
    
    {!savedLocationsSearchIsVisible && (
      <View style={{width: '100%', flexDirection: 'row',  position: 'absolute', justifyContent: 'flex-end', width: '100%'}}>   
          <View style={styles.googleSearchContainer}>
            <SearchBarAnimationWrapper>
              <SearchBarGoogleAddress 
                ref={searchStringRef} 
                mountingText={mountingText}
                onPress={onPress} 
                visible={true}
                onTextChange={updateSearchString}  
              /> 
            </SearchBarAnimationWrapper>
          </View>  
      </View> 
    )}
       
{savedLocationsSearchIsVisible && (  
  <View style={{width: '100%', flexDirection: 'row', height: 48, position: 'absolute', justifyContent: 'flex-end', width: '100%'}}>   
    <View style={styles.savedLocationsContainer}>
      <SearchBarAnimationWrapper>
        <SearchBarSavedLocations
          locationListDrilledTwice={locationListDrilledOnce}
          ref={searchStringRef}  
          mountingText={mountingText} 
          triggerAnimation={savedLocationsSearchIsVisible}
          onTextChange={updateSearchString} 
          onPress={onPress}  
          searchStringRef={searchStringRef} 
        /> 
      </SearchBarAnimationWrapper>  
    </View>
  </View>
)}
<View style={styles.buttonContainer}>

<TouchableOpacity 
onPress={switchViews} 
style={[styles.circleButton, themeStyles.footerIcon, { backgroundColor: manualGradientColors.homeDarkColor }]}>
{!savedLocationsSearchIsVisible && <ListCheckSvg width={24} height={24} color={manualGradientColors.lightColor} />}
{savedLocationsSearchIsVisible && <GoogleLogoSvg width={24} height={24} />}
    </TouchableOpacity> 
    
</View> 
  
 
  </View >
  );
};

const styles = StyleSheet.create({
  container: { 
    position: 'absolute',
    top: 80,
    flex: 1, 

    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', 
    padding: 0,
    zIndex: 1000,
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute', 
    right: '1%',
    marginBottom: 2,
    height: 'auto',  
    width: 54,
    
    justifyContent: 'flex-end',
    zIndex: 4000,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    alignContent: 'center',
    height: '100%',  
    borderRadius: 30,
    height: 48,
    backgroundColor: 'transparent', 
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: '18%',
  },
  searchInput: { 
    flex: 1, 
    alignItems: 'center',
    alignContent: 'center',
    fontFamily: 'Poppins-Regular', 
    fontSize: 15,
    textAlign: 'left',
    overflow: 'hidden',
    paddingHorizontal: 12, 
    height: 'auto', 
  },
  listView: {
    backgroundColor: 'white',
    marginTop: -4,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
    maxHeight: 300,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  iconStyle: {
    marginRight: 10,
  },
  savedLocationsContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '86%',  
    zIndex: 2200,
    elevation: 2200,

  },
  googleSearchContainer: { 
      justifyContent: 'flex-start',
      width: '86%',
      backgroundColor: 'transparent', 
      padding: 0,
      zIndex: 1,
    },
});

export default DualLocationSearcher;
