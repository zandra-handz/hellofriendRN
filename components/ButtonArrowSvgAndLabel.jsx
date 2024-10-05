import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ProfileCircleSvg from '../assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg
import ProfileTwoUsers from '../assets/svgs/profile-two-users';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ButtonArrowSvgAndLabel = ({icon = 'arrow', direction = 'right', label, onPress, setProfileIconColor = false, profileIconColor, screenSide = 'left' }) => {
  
  const { themeStyles } = useGlobalStyle();

  const renderProfileIcon = () => {
    if (setProfileIconColor && Array.isArray(profileIconColor) && profileIconColor.length === 2) {
      return (
        <ProfileCircleSvg width={46} height={46} startColor={profileIconColor[1]} endColor={profileIconColor[0]} />
      );
    } else {
      return (
        <ProfileCircleSvg width={46} height={46} style={styles.SvgImage} />
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.arrowButton, screenSide === 'left' ? styles.marginRight : styles.marginLeft]}
    >
      <View style={{ width: '90%', position: 'absolute', top: -16 }}>
        <Text style={[{ fontFamily: 'Poppins-Bold', fontSize: 13, color: setProfileIconColor && profileIconColor ? profileIconColor[0] : 'white', textAlign: 'center' }, themeStyles.upcomingNavText]}>
          {label}
        </Text>
      </View>
      <View style={styles.svgContainer}>
      {direction === 'right' ? (
        icon === 'two-users' ? (
          <ProfileTwoUsers width={36} height={36} style={[styles.SvgImage, themeStyles.upcomingNavIcon]} />
        ) : (
          <ArrowRightCircleOutlineSvg width={46} height={46} style={[styles.SvgImage, themeStyles.upcomingNavIcon]} />
        )
      ) : direction === 'left' ? (
        <ArrowLeftCircleOutlineSvg width={46} height={46} style={[styles.SvgImage, themeStyles.upcomingNavIcon]} />
      ) : (
        renderProfileIcon()
      )}

            </View>
          </TouchableOpacity>
        );
      };

const styles = StyleSheet.create({
  arrowButton: {
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: '2%',
  },
  marginRight: {
    marginRight: '2%',
  },
  svgContainer: {
    width: 54,
    height: '40%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SvgImage: {
    color: 'black',
  },
});

export default ButtonArrowSvgAndLabel;
