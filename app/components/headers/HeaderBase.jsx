import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import { useFriendList } from '@/src/context/FriendListContext';
import LizardSvg from '@/app/assets/svgs/lizard.svg';
import ClockOutlineSvg from '@/app/assets/svgs/clock-outline.svg';
import DistanceZigZagSvg from "@/app/assets/svgs/distance-zigzag.svg";

import EditPencilOutlineSvg from '@/app/assets/svgs/edit-pencil-outline.svg';
import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg';
import PhoneChatMessageHeartSvg from '@/app/assets/svgs/phone-chat-message-heart';
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import HeartbeatLifeLineArrowSvg from '@/app/assets/svgs/heartbeat-lifeline-arrow.svg';
import CoffeeMugFancySteamSvg from '@/app/assets/svgs/coffee-mug-fancy-steam';
import ImageGallerySingleOutlineSvg from "@/app/assets/svgs/image-gallery-single-outline.svg";
import CoffeeSvg from '@/app/assets/svgs/coffee-solid.svg';
 

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const HeaderBase = ({
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
      edit: EditPencilOutlineSvg,
      clock: ClockOutlineSvg,
      distanceZigZag: DistanceZigZagSvg,
      image: ImageGallerySingleOutlineSvg,
      coffee: CoffeeSvg,
  };
 
  const IconComponent = iconMap[icon] || null;

  return (
      <LinearGradient
          colors={[
              themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerContainer}
      >
          {!loadingNewFriend && (
              <>
                  <View style={styles.leftButtonContainer}>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                          <ArrowLeftCircleOutline height={30} width={30} color={themeAheadOfLoading.fontColor} />
                      </TouchableOpacity>
                  </View>


                  <View style={styles.rightIconContainer}>
                    
                  <Text
                      style={[
                          styles.headerText,
                          themeStyles.headerText,
                          { color: themeAheadOfLoading.fontColorSecondary },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                  >
                      {headerTitle}
                  </Text>
                      {IconComponent ? (
                          <TouchableOpacity onPress={() => navigation.navigate(navigateTo)}>
                              <IconComponent style={{marginHorizontal: '2%'}} width={30} height={30} color={themeAheadOfLoading.fontColorSecondary}   />
                          </TouchableOpacity>
                      ) : (
                          <View style={styles.defaultIconWrapper}>
                              <LizardSvg width={74} height={74} color={themeAheadOfLoading.fontColorSecondary} style={styles.defaultIcon} />
                          </View>
                      )}
                  </View>
              </>
          )}
      </LinearGradient>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    paddingTop: 66,  
    paddingHorizontal: '3%', 
    height: 110, 
    flexDirection: 'row', 
    width: '100%',
    backgroundColor: 'pink',
    justifyContent: 'space-between',
  }, 
  leftButtonContainer: {
    width: 40,  // Fixed width to keep it from moving
  },
  headerText: { // Maintain a fixed distance from the right icon
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',  
  },
  rightIconContainer: { 
   
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
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

export default HeaderBase;
