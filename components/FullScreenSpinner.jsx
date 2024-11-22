import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { Flow, Swing, Chase, Circle, CircleFade, Fold, Grid, Pulse, Wander, Wave } from 'react-native-animated-spinkit';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useMessage } from '../context/MessageContext';
import { useFriendList } from '../context/FriendListContext';

const spinners = {
  circle: Circle,
  chase: Chase,
  swing: Swing,
  pulse: Pulse,
  grid: Grid,
  flow: Flow,
  circleFade: CircleFade,
  fold: Fold,
  wander: Wander,
  wave: Wave,
};

const FullScreenSpinner = ({   
  spinnerSize = 90, 
  spinnerType = 'grid'}) => {

    const { isFetchingData } = useMessage();

  const [showSpinner, setShowSpinner] = useState(false); // Initialize state with the loading prop
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

 
  useEffect(() => { 
    
      if (isFetchingData.fetching) {
        setShowSpinner(true);
      } else {
        setShowSpinner(false);
      } 
 
  }, [isFetchingData]); 

   if (!showSpinner) return null;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    
    <View style={[styles.container, {backgroundColor: themeStyles.genericText.backgroundColor}]}>


      {showSpinner && (
        <View style={[styles.spinnerContainer, {backgroundColor: 'transparent'}]}>
          <Spinner size={spinnerSize} color={themeAheadOfLoading.darkColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        zIndex: 1000, // High zIndex to stay on top
        elevation: 1000, // Ensures Android rendering priority
      },
  textContainer: {
    position: 'absolute',
    top: '36%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingTextBold: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingBottom: 20,
  },
});

export default FullScreenSpinner;
