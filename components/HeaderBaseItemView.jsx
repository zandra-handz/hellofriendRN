import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import InfoOutline from '../assets/svgs/info-outline.svg';
import ThreeDotsSvg from '../assets/svgs/three-dots.svg';
import SlideToAction from '../components/SlideToAction';
import { LinearGradient } from 'expo-linear-gradient';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';



//onBackPress function instead of stack navigation, to use with modals

const HeaderBaseItemView = ({
    onBackPress,
    onMenuPress,
    onSliderPull,
    headerTitle='Header title here',
    
}) => {

    const { themeAheadOfLoading } = useFriendList();
    const { themeStyles } = useGlobalStyle(); 

   

  return (
    <> 
        <LinearGradient
          colors={[
              themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerContainer}
      > 
      <>
      <View style={styles.headerContent}>
      <View style={styles.leftButtonContainer}>
        <TouchableOpacity onPress={onBackPress}>
          <ArrowLeftCircleOutline height={30} width={30}   color={themeAheadOfLoading.fontColor}/>
        </TouchableOpacity> 
      </View>
        <Text style={[
          styles.headerText, themeStyles.headerText, { color: themeAheadOfLoading.fontColor, paddingLeft: 20}
          ]}> 
            {headerTitle}
        </Text> 
        <View style={styles.rightIconContainer}>
        <TouchableOpacity onPress={onMenuPress ? onMenuPress : () => {}}>
          <ThreeDotsSvg height={30} width={30} color={themeAheadOfLoading.fontColor}/>
        
        </TouchableOpacity>
        </View>
          </View>
         
    </> 
    
    </LinearGradient>  
    <View style={styles.sliderContainer}>
      <SlideToAction
      onPress={onSliderPull}
      sliderWidth={'100%'} 
      targetIcon={TrashOutlineSvg}
    /> 
       </View>
   </>
    
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    paddingTop: 20,  //66 
    paddingHorizontal: 10, 
    height: 90, //110
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftButtonContainer: {
    width: 40,
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
  sliderContainer: {
    height: 30,
    width: '100%',

  },
});


export default HeaderBaseItemView;
