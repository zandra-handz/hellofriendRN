import React, { useEffect , useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import ArrowLeftCircleOutline from '../assets/svgs/arrow-left-circle-outline.svg';
import InfoOutlineSvg from '../assets/svgs/info-outline.svg';
import ThreeDotsSvg from '../assets/svgs/three-dots.svg'; 
import SlideToDeleteHeader from '../components/SlideToDeleteHeader';
import { LinearGradient } from 'expo-linear-gradient';
import TrashOutlineSvg from '../assets/svgs/trash-outline.svg';

//same as HeaderBaseItemView except allows delete OR edit by comparing created and updated
//made for hello view which is editable on same day as created, else can only be deleted

//onBackPress function instead of stack navigation, to use with modals

const HeaderBaseItemViewTwoOptions = ({
    itemData,
    
    onBackPress,
    onMenuPress,
    onSliderPull,
    headerTitle='Header title here',
    
    
}) => {

    const { themeAheadOfLoading } = useFriendList();
    const { themeStyles } = useGlobalStyle(); 

    // Put this in really fast not sure if can cause a bug
    const editable = (itemData? itemData.created.slice(0,13) === itemData.updated.slice(0,13) : false);



    //useEffect(() => {
      //if (itemData) {
        //console.log(itemData.created.slice(0,13) === itemData.updated.slice(0,13));
        //console.log(itemData.created.slice(0,13));
     // }

    //}, [itemData]);

 
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
        <TouchableOpacity style={{paddingBottom: '5%'}} onPress={onBackPress}>
          <ArrowLeftCircleOutline height={30} width={30}   color={themeAheadOfLoading.fontColor}/>
        </TouchableOpacity> 
      </View>
        <Text style={[
          styles.headerText, themeStyles.headerText, { color: themeAheadOfLoading.fontColorSecondary, paddingLeft: 20}
          ]}> 
            {headerTitle}
        </Text> 
        <View style={styles.rightIconContainer}>
        <TouchableOpacity style={{paddingBottom: '6%'}} onPress={onMenuPress ? onMenuPress : () => {}}>
          <InfoOutlineSvg height={34} width={34} color={themeAheadOfLoading.fontColorSecondary}/>
        
        </TouchableOpacity>
        </View>
          </View>
         
    </> 
    <View style={styles.sliderContainer}>
      <SlideToDeleteHeader
      itemToDelete={itemData}
      onPress={onSliderPull}
      sliderWidth={'100%'} 
      targetIcon={TrashOutlineSvg}
      sliderColor={editable ? 'blue' : 'red'}
      sliderText={editable ? 'EDIT' : 'DELETE'}
    /> 
       </View>
    
    </LinearGradient>  

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
    fontFamily: 'Poppins-Bold',
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
    position: 'absolute',
    bottom: 0,
    left: -4,
    right: 0,
    zIndex: 3,
    height: 30,
    width: '100%',
    

  },
});


export default HeaderBaseItemViewTwoOptions;
