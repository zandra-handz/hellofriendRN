import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import { useNavigation } from '@react-navigation/native';
import LoadingPage from '../components/LoadingPage';

 
// Press function is internal
// HAS DOUBLE TAP PRESS AS WELL :)

const DOUBLE_PRESS_DELAY = 300;

const ButtonBaseSpecialSelectedAnim = ({  
        header='SELECTED:',   
        height='100%',
        maxHeight=100,
        borderRadius=20,
        borderColor='transparent',
        darkColor = '#4caf50',
        lightColor = 'rgb(160, 241, 67)',
        imageSize=0,
        image=require("../assets/shapes/fairymagic.png"), 
        imagePositionHorizontal=0, 
        imagePositionVertical=70,
        showAnim=false,
        animSize=100,
        anim=require("../assets/anims/arrows.json"),
        animPositionHorizontal=0, 
        animPositionVertical=0,

    }) => {

    const navigation = useNavigation();
    const lottieViewRef = useRef(null);
    const globalStyles = useGlobalStyle();
    //friendLoaded = dashboard data retrieved successfully
    const { selectedFriend, friendLoaded, friendDashboardData, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
 
    const lastPress = useRef(0);
    const pressTimeout = useRef(null); 

    const navigateBackToFriendFocus = () => {
        navigation.navigate('FriendFocus');
      };
    
      const navigateToMoments = () => {
        navigation.navigate('Moments');
      };

      const navigateToAddMoment = () => {
        navigation.navigate('MomentFocus');
      };

      const handleSinglePress = () => { 
          navigateToMoments();
        };
    
      const handleDoublePress = () => {
        console.log('Double press detected');
        navigateToAddMoment(); 
      };
    
    const onPress = () => {
        const now = Date.now();
        if (now - lastPress.current < DOUBLE_PRESS_DELAY) { 
          clearTimeout(pressTimeout.current);
          handleDoublePress();
        } else { 
          pressTimeout.current = setTimeout(() => {
            handleSinglePress();
          }, DOUBLE_PRESS_DELAY);
        }
        lastPress.current = now;
      };



      useEffect(() => {
    if (lottieViewRef.current && anim) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    }
  }, [anim]);


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

     

    
  
    return(
        <View style={[styles.container, {borderRadius: borderRadius, borderColor: borderColor, height: height, maxHeight: maxHeight}]}>
            <LinearGradient
              colors={[darkColor, lightColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1}}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
            {loadingNewFriend && !friendLoaded && (
                <View style={styles.loadingWrapper}>
                <LoadingPage
                    loading={loadingNewFriend} 
                    spinnerType='flow' 
                />
                </View>
            )}
    
            {!loadingNewFriend && friendLoaded && (
                <TouchableOpacity onPress={onPress} style={{height: '100%', width: '100%'}}>
                    {anim && showAnim && ( 
                    <LottieView
                        ref={lottieViewRef}
                        source={anim}
                        loop
                        autoPlay
                        style={{ zIndex: 2, position: 'absolute',  width: animSize, height: animSize, right: animPositionHorizontal,   top: animPositionVertical}}
                        onError={(error) => console.error('Error rendering animation:', error)}
                    /> 
                    )}
                    
    
    
                    <View style={styles.textContainer}>
    
                        <Text style={styles.headerText}>
                            {header}
                        </Text>
    
                        <Text
                            style={[
                                textStyles(30, 'white'),
                                { fontFamily: 'Poppins-Regular' },
                            ]}
                            >
                            {selectedFriend && friendDashboardData? selectedFriend.name : 'None'}
                        </Text>
    
                        <Text style={styles.subtitleText}>
                            {friendDashboardData ? friendDashboardData[0].future_date_in_words : 'No date available'}
                        </Text>
    
                    
                    </View>
                        {image && (
                        <Image
                        source={image}
                        style={{  
                            width: imageSize,
                            height: imageSize, 
                            top: imagePositionVertical,
                            right: imagePositionHorizontal,
                        }}
                        resizeMode="contain"
                        />
                        )} 
    
    
    
                </TouchableOpacity>
            )}
        </View>
    
    )
    
    
    };
    
    
    const styles = StyleSheet.create({
    
      container: {
        flexDirection: 'row', 
        width: '100%',  
        padding: '5%', 
        paddingRight: '0%',
        alignContent: 'center', 
        marginVertical: '1%',
        borderWidth: 1, 
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    textContainer: { 
        zIndex: 5,
        position: 'absolute',
        paddingLeft: '2%',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-around',
    
    },
    headerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 28,
    
    },
    subtitleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
    });


export default ButtonBaseSpecialSelectedAnim;

