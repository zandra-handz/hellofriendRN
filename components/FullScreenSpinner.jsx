import React, { useState, useEffect  } from 'react';
import { View, StyleSheet  } from 'react-native';
import { Flow, Swing, Chase, Circle, CircleFade, Fold, Grid, Pulse, Wander, Wave } from 'react-native-animated-spinkit';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';
import  useLocationFunctions from '../hooks/useLocationFunctions';
import { useAuthUser } from '../context/AuthUserContext';
import useHelloesData from '../hooks/useHelloesData';

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
 
    const { signinMutation } = useAuthUser(); 


  const [showSpinner, setShowSpinner] = useState(false); // Initialize state with the loading prop
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const{ locationsIsFetching } = useLocationFunctions();
  const { helloesIsFetching, helloesIsLoading } = useHelloesData();

  useEffect(() => {
    console.log('FULL SCREEN SPINNER RERENDERED');
  }, []);

  useEffect(() => {
    if (signinMutation.isPending) {
      setShowSpinner(signinMutation.isPending);
    } else {
      setShowSpinner(false);
    }
  }, [signinMutation]);
 

 useEffect(() => { 
    
   if (locationsIsFetching) {
    setShowSpinner(locationsIsFetching);
     } else {
      setShowSpinner(false);
     } 

  }, [locationsIsFetching]); 


  useEffect(() => { 
    
    if (helloesIsFetching) {
     setShowSpinner(helloesIsFetching);
      } else {
       setShowSpinner(false);
      } 
 
   }, [helloesIsFetching]); 


   if (!showSpinner) return null;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    
    <View style={[styles.container, {backgroundColor: themeStyles.genericText.backgroundColor || 'transparent'}]}>


      {showSpinner ? (
        <View style={[styles.spinnerContainer, {backgroundColor: 'transparent'}]}>
          <Spinner size={spinnerSize} color={themeAheadOfLoading.darkColor || '#000002'} />
        </View>
      ) : (
        null
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
        zIndex: 2000, // High zIndex to stay on top
        elevation: 2000, // Ensures Android rendering priority
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
    zIndex: 2000,
    elevation: 2000,
  },
  loadingTextBold: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingBottom: 20,
  },
});

export default FullScreenSpinner;
