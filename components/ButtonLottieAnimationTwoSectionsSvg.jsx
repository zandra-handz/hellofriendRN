import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, Animated, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'; 
import PersonalConnectionsSvg from '../assets/svgs/personal-connections.svg';

import ProfileTwoUsersSvg from '../assets/svgs/profile-two-users.svg';

const ButtonLottieAnimationTwoSectionsSvg = ({
  onPress, 
  buttonHeight=140,
  borderTopRadius=30,
  borderRadius=30,
  headerText = '',
  mainButtonWidth = '77%',
  label,
  labeltwo = '',
  showLabelTwo=true,
  additionalText = '',
  animationSource,
  rightSideAnimation = false,
  preLabelFontSize = 28,
  preLabelColor = 'white',
  labelFontSize = 16,
  labelColor = 'black',
  additionalTextFontSize = 16,
  additionalTextColor = 'white',
  backgroundColor = 'transparent',
  animationWidth = 40,
  animationHeight = 40,
  showGradient = true,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },
  showIcon = false,
  showShape = true,
  shapePosition = 'left',
  shapeWidth = 260,
  shapeHeight = 260,
  shapePositionValue = -134,
  satellites = false,
  satelliteSectionPosition = 'right',
  satelliteSectionWidth='33.33%',
  satelliteSectionMarginLeft = -20,
  satelliteCount = 3,
  satellitesOrientation = 'horizontal',
  satelliteHeight = 40,
  satelliteHellos = [],
  satelliteOnPress,
  additionalPages = false,
  additionalSatellites = [],
  isLoading = false, 
  svgColor='white',
  SourceSvg: SourceSvg,
}) => {
  const lottieViewRef = useRef(null);
  const globalStyles = useGlobalStyle();
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();
  const [showEmptyContainer, setShowEmptyContainer] = useState(false);
  const [mainViewVisible, setMainViewVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { selectedFriend, friendDashboardData, friendColorTheme, loadingNewFriend } = useSelectedFriend();

  useEffect(() => {
    if (lottieViewRef.current && animationSource) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    }
  }, [animationSource]);

  useEffect(() => {
    if (isLoading || loadingNewFriend) { 
      animateLoadingIndicator();
    } else { 
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, loadingNewFriend]);

  const animateLoadingIndicator = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const getShapeStyle = () => {
    switch (shapePosition) {
      case 'left':
        return { left: shapePositionValue };
      case 'center':
        return { left: '33.33%' };
      case 'right':
        return { right: shapePositionValue };
      default:
        return { left: 0 };
    }
  };

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

  const satelliteWidth = (width / 4) / satelliteCount;

  const renderSatellites = () => {
    const satellitesArray = [];

    // Render satellite hellos
    if (satelliteHellos && satelliteHellos.length > 0) {
      const numSatellites = Math.min(satelliteCount, satelliteHellos.length);

      for (let i = 0; i < numSatellites; i++) {
        satellitesArray.push(
          <TouchableOpacity
            key={i}
            style={[
              styles.satelliteButton,
              { width: 64, borderRadius: 50, margin: 2,padding: 7,   alignItems: 'center', height: satellitesOrientation === 'horizontal' ? satelliteHeight : 64 },
            ]}
            onPress={() => satelliteOnPress(satelliteHellos[i])}
          >
            <View style={{marginBottom: 11, borderWidth: 0, borderRadius: 50, padding: 10, borderColor: 'pink'}}>
              <ProfileTwoUsersSvg height={40} width={40} color="white"/>
            </View>
            
          </TouchableOpacity>
        );
      }
    }

    return satellitesArray;
  };

  const renderAdditionalSatellites = () => (
    <FlatList
      data={additionalSatellites}
      horizontal
      keyExtractor={(item, index) => `satellite-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.additionalSatelliteButton,
            { width: satelliteWidth },
          ]}
          onPress={() => satelliteOnPress(item)}
        >
          <Text style={styles.satelliteText}>{item.friend_name}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View style={[styles.container, { borderBottomRightRadius: borderRadius, borderBottomLeftRadius: borderRadius, borderTopRightRadius: borderTopRadius, borderTopLeftRadius: borderTopRadius}]}>
      {!additionalPages && mainViewVisible && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.mainButtonContainer, { width: satellites ? mainButtonWidth : '100%' }]}>
              <TouchableOpacity
                style={{
                  flexDirection: satelliteSectionPosition === 'right' ? 'row' : 'row-reverse',
                  width: '100%',
                  height: buttonHeight,
                  padding: 10,
                  borderBottomRightRadius: borderRadius,
                  borderBottomLeftRadius: borderRadius,
                  borderTopLeftRadius: borderTopRadius,
                  borderTopRightRadius: borderTopRadius,
                  
                  alignItems: 'center',
                  overflow: 'hidden',
                  backgroundColor: showGradient ? 'transparent' : backgroundColor,
                }}
                onPress={onPress}
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
                  <View style={{ position: 'absolute'}}>
                  
                  {SourceSvg && <SourceSvg color={svgColor} width={shapeWidth} height={shapeHeight} style={getShapeStyle()} />}
                  </View>
                )}
                <View style={{ flexDirection: 'column', paddingHorizontal: 5, paddingBottom: 8, paddingTop: 8, flex: 1 }}>
                  <Text
                    style={[
                      textStyles(preLabelFontSize, preLabelColor),
                      { fontFamily: 'Poppins-Regular', width: '70%', marginBottom: -6 },
                    ]}
                    numberOfLines={1} // Ensure text does not wrap
                    ellipsizeMode='tail' // Display ellipsis at the end
                  >
                    {headerText}
                  </Text>
                  <View style={{ flexDirection: 'column' }}>
                    {rightSideAnimation ? (
                      <>
                        <Text
                          style={[
                            textStyles(labelFontSize, labelColor),
                            { fontFamily: 'Poppins-Light' },
                          ]}
                        >
                          {label}
                        </Text>
                        {showIcon && animationSource && (
                          <LottieView
                            ref={lottieViewRef}
                            source={animationSource}
                            loop
                            autoPlay
                            style={{ width: animationWidth, height: animationHeight, marginHorizontal: animationMargin }}
                            onError={(error) => console.error('Error rendering animation:', error)}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {showIcon && animationSource && (
                          <LottieView
                            ref={lottieViewRef}
                            source={animationSource}
                            loop
                            autoPlay
                            style={{ width: animationWidth, height: animationHeight, marginHorizontal: animationMargin }}
                            onError={(error) => console.error('Error rendering animation:', error)}
                          />
                        )}
                        <Text
                          style={[
                            textStyles(labelFontSize, labelColor),
                            { fontFamily: 'Poppins-Regular' },
                          ]}
                          numberOfLines={1} 
                          ellipsizeMode='tail'
                        >
                          {label} 
                        </Text>
                        {showLabelTwo && ( 
                        <Text
                          style={[
                            textStyles(labelFontSize, labelColor),
                            { fontFamily: 'Poppins-Regular' },
                          ]}
                        >
                          {labeltwo}
                        </Text>
                        )}
                      </>
                    )}
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
              <View style={[styles.satelliteSection, { marginLeft: satelliteSectionMarginLeft, width: satelliteSectionWidth, height: buttonHeight, flexDirection: satellitesOrientation === 'horizontal' ? 'row' : 'column' }]}>
                {renderSatellites()}
              </View>
            )}
          </View>
        </Animated.View>
      )}
      {additionalPages && (
        <View style={[styles.additionalSatelliteSection, { height: buttonHeight }]}>
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
    overflow: 'hidden',
  },
  mainButtonContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  },
  satelliteSection: { 
    borderRadius: 0,
    paddingLeft: 0,  
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkgrey',
  },
  satelliteButton: { 
    alignItems: 'center',  
    alignContents: 'center', 
    justifyContent: 'space-around',
    borderRadius: '50%',
    borderWidth: 1.8, 
    borderColor: 'transparent',  
    backgroundColor: 'transparent',
  },
  additionalSatelliteSection: {
    flexDirection: 'row', 
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  additionalSatelliteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    borderRightWidth: 0.8,
    borderColor: 'darkgray',
    height: 100,
    backgroundColor: 'black',
  },
  satelliteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  svgContainer: { 
    marginLeft: 16,
    width: '2%',
    alignItems: 'right', 
    alignContent: 'right', 
    zIndex: 1,
  }, 
});

export default ButtonLottieAnimationTwoSectionsSvg;
