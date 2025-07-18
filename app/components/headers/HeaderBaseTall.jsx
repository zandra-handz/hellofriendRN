import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';
import { useCapsuleList } from '@/src/context/CapsuleListContext';
import { useFriendList } from '@/src/context/FriendListContext';
import SearchBar from '../SearchBar';
import  ItemViewMoment from '../components/ItemViewMoment';
import LizardSvg from '@/app/assets/svgs/lizard.svg';
import ArrowLeftCircleOutline from '@/app/assets/svgs/arrow-left-circle-outline.svg'; 
import PhoneChatMessageHeartSvg from '@/app/assets/svgs/phone-chat-message-heart';
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import HeartbeatLifeLineArrowSvg from '@/app/assets/svgs/heartbeat-lifeline-arrow.svg';
import CoffeeMugFancySteamSvg from '@/app/assets/svgs/coffee-mug-fancy-steam';
 

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
 


const HeaderBaseTall = ({
  headerTitle = 'Header title here', 
  navigateTo = 'Moments',
  icon, // Select which SVG to display
}) => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { capsuleList } = useCapsuleList();
  const { loadingNewFriend, friendColorTheme } = useSelectedFriend();
  const navigation = useNavigation();

  const [ isItemModalVisible, setItemModalVisible ] = useState(false);
const [ selectedMoment, setSelectedMoment ] = useState(null);
 

  const iconMap = {
      arrow: ArrowLeftCircleOutline,
      lizard: LizardSvg,
      text: PhoneChatMessageHeartSvg,
      coffeeSteaming: CoffeeMugFancySteamSvg,
      thoughtBubble: ThoughtBubbleOutlineSvg,
      heartbeat: HeartbeatLifeLineArrowSvg, 
  };
 
  const IconComponent = iconMap[icon] || null;

  const handlePress = (item) => {
    console.log('hii', item);
    setSelectedMoment(item);
    setItemModalVisible(true);

  };

  useEffect(() => {
    console.log(selectedMoment);

  }, [selectedMoment]);

  const handleClose = () => {
    setItemModalVisible(false);
    setSelectedMoment(null);

  };



  return (
      <LinearGradient
          colors={[
               themeAheadOfLoading.darkColor,
               themeAheadOfLoading.lightColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerContainer}
      >
          {!loadingNewFriend && (
            <>
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
                          { color: themeAheadOfLoading.fontColorSecondary },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                  >
                      {headerTitle}
                  </Text>

                  <View style={styles.rightIconContainer}>
                      {IconComponent ? (
                          <TouchableOpacity onPress={() => navigation.navigate(navigateTo)}>
                              <IconComponent width={30} height={30} fill={themeAheadOfLoading.fontColorSecondary} />
                          </TouchableOpacity>
                      ) : (
                          <View style={styles.defaultIconWrapper}>
                              <LizardSvg width={74} height={74} color={themeAheadOfLoading.fontColorSecondary} style={styles.defaultIcon} />
                          </View>
                      )}
                  </View>
              </View>
              <View style={[styles.searchBarContent, {paddingTop: '1%'}]}>
                <View style={{width: '40%', height: 38 }}>
                    <SearchBar data={capsuleList} borderColor={themeAheadOfLoading.lightColor} onPress={handlePress} searchKeys={['capsule', 'typedCategory']} />
                    </View>

              </View>
              

              
              </>
              
            
          )}
        {isItemModalVisible && selectedMoment && (
            <ItemViewMoment 
            onClose={handleClose}
            moment={selectedMoment}
            />
        )}


      </LinearGradient>
      
  );

};


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    padding: 10,
    paddingTop: 66,  
    paddingHorizontal: 10, 
    height: 150, 
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
searchBarContent: { 
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    width: 40,  // Fixed width to keep it from moving
  },
  headerText: {
    position: 'absolute', 
    right: 60,  // Maintain a fixed distance from the right icon
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
    width: '70%',  // Adjust width to prevent overlapping
    textAlign: 'right',  // Keep the text aligned to the right
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

export default HeaderBaseTall;
