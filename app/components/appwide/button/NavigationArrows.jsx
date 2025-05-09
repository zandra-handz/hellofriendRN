//I wanted to position: 'absolute' this like i did my spinner buttons, but
//then decided to do that in the parent in case i want to use these for 
//any smaller (not FS) components
//cause this component was kind of a pain in the ass when i worked on it :)

//can use this in parent components to position:
//<View
//style={{
//  position: 'absolute', 
//  width: '100%',
//  zIndex: 1000,
//  top: '50%',
//  transform: [{ translateY: -50 }],
//  alignItems: 'center',
//}}
//>


 
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeftCircleOutlineSvg from '@/app/assets/svgs/arrow-left-circle-outline.svg';
import ArrowRightCircleOutlineSvg from '@/app/assets/svgs/arrow-right-circle-outline.svg';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

const NavigationArrows = ({ iconSize=50, iconOpacity=1, opacity=.3, currentIndex, imageListLength, onPrevPress, onNextPress }) => {
  
  const { manualGradientColors } = useGlobalStyle();

  return (
    <View style={[styles.navigationContainer]}>
      {currentIndex > 0 ? (
        <TouchableOpacity 
          onPress={onPrevPress} 
          style={[styles.arrowButton, {opacity: opacity, backgroundColor: manualGradientColors.homeDarkColor}]}
        >
          <ArrowLeftCircleOutlineSvg width={iconSize} height={iconSize} style={{opacity: iconOpacity}} color={manualGradientColors.lightColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
 
      {currentIndex < imageListLength - 1 ? (
        <TouchableOpacity 
          onPress={onNextPress} 
          style={[styles.arrowButton, {opacity: opacity, backgroundColor: manualGradientColors.homeDarkColor}]}
        >
          <ArrowRightCircleOutlineSvg width={iconSize} height={iconSize} style={{opacity: iconOpacity}} color={manualGradientColors.lightColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row', 
    flex: 1, 
    width: '100%', 
    height: 'auto', 
    justifyContent: 'space-between',
    paddingHorizontal: 0,  
  },
  arrowButton: {
    padding: 0,  
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 60,  
  },
});

export default NavigationArrows;
