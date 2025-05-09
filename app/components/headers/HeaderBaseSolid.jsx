import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import { useFriendList } from '@/src/context/FriendListContext';
import LizardSvg from '@/app/assets/svgs/lizard.svg';
import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg';
import PhoneChatMessageHeartSvg from '@/app/assets/svgs/phone-chat-message-heart';
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import HeartbeatLifeLineArrowSvg from '@/app/assets/svgs/heartbeat-lifeline-arrow.svg';
import CoffeeMugFancySteamSvg from '@/app/assets/svgs/coffee-mug-fancy-steam';

import { LinearGradient } from 'expo-linear-gradient';
 

import { useNavigation } from '@react-navigation/native';


const HeaderBaseSolid = ({
  headerTitle = 'Header title here', 
  navigateTo = 'Moments', 
  icon,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { loadingNewFriend } = useSelectedFriend();
  const navigation = useNavigation();

  const iconMap = {
      arrow: ArrowLeftCircleOutline,
      lizard: LizardSvg,
      text: PhoneChatMessageHeartSvg,
      coffeeSteaming: CoffeeMugFancySteamSvg,
      thoughtBubble: ThoughtBubbleOutlineSvg,
      heartbeat: HeartbeatLifeLineArrowSvg, 
  };
 
  const IconComponent = iconMap[icon] || null;

  return (
        <LinearGradient
            colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.headerContainer]}
        >
          {!loadingNewFriend && (
              <View style={styles.headerContent}>
                  <View style={styles.leftButtonContainer}>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                          <ArrowLeftCircleOutline height={30} width={30} color={themeAheadOfLoading.fontColor} />
                      </TouchableOpacity>
                  </View>

                  <Text
                      style={[
                          styles.headerText,
                          themeStyles.headerText,
                          { color: themeAheadOfLoading.fontColor },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                  >
                      {headerTitle}
                  </Text>

                  <View style={styles.rightIconContainer}>
                      {IconComponent ? (
                          <TouchableOpacity onPress={() => navigation.navigate(navigateTo)}>
                              <IconComponent width={30} height={30} fill={themeAheadOfLoading.fontColor} />
                          </TouchableOpacity>
                      ) : (
                          <View style={styles.defaultIconWrapper}>
                              <LizardSvg width={74} height={74} color={themeAheadOfLoading.fontColor} style={styles.defaultIcon} />
                          </View>
                      )}
                  </View>
              </View>
          )}
      </LinearGradient>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    paddingTop: 66,  
    paddingHorizontal: 10, 
    height: 110, 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftButtonContainer: {
    width: 40,  // Fixed width to keep it from moving
  },
  headerText: {
    position: 'absolute', 
    right: 60,  // Maintain a fixed distance from the right icon
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
    width: '70%',  // Adjust width to prevent overlapping
    textAlign: 'left',  // Keep the text aligned to the right
  },
  rightIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  defaultIconWrapper: {
    height: 44,
    width: 90,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  defaultIcon: {
    transform: [{ rotate: '240deg' }],
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderBaseSolid;
