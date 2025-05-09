import React, { useState, useEffect  } from 'react';
import { View, StyleSheet  } from 'react-native';
import { Flow, Swing, Chase, Circle, CircleFade, Fold, Grid, Pulse, Wander, Wave } from 'react-native-animated-spinkit';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useFriendList } from '@/src/context/FriendListContext'; 
import useImageFunctions from '@/src/hooks/useImageFunctions';
import { useAuthUser } from '@/src/context/AuthUserContext';
import { useUpcomingHelloes } from '@/src/context/UpcomingHelloesContext';
import { useCapsuleList } from '@/src/context/CapsuleListContext';
import { useHelloes } from '@/src/context/HelloesContext';
import { useLocations } from '@/src/context/LocationsContext';
 
import useCurrentLocation from '@/src/hooks/useCurrentLocation';
import useTravelTimes from '@/src/hooks/useTravelTimes';

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
  spinnerType = 'flow'}) => {
 
  const { signinMutation } = useAuthUser(); 
  const { createMomentMutation } = useCapsuleList();
  const { travelTimesMutation } = useTravelTimes();
    
  const [ showSpinner, setShowSpinner ] = useState(false); // Initialize state with the loading prop
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const{ locationsIsFetching } = useLocations();
  const { helloesIsFetching  } = useHelloes();
  const { upcomingHelloesIsFetching, upcomingHelloesIsSuccess, newSuccess } = useUpcomingHelloes();
  const { currentLocationIsCalculating } = useCurrentLocation();
  const { createImageMutation } = useImageFunctions();

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
    if (createMomentMutation.isPending) {
      setShowSpinner(createMomentMutation.isPending);
    } else {
      setShowSpinner(false);
    }
  }, [createMomentMutation]);


  useEffect(() => {
    if (createImageMutation.isFetching) {
      console.log('image is saving');
      setShowSpinner(createImageMutation.isFetching);
    } else {
      setShowSpinner(false);
    }
  }, [createImageMutation]);
 

 useEffect(() => { 
    
   if (locationsIsFetching) {
    setShowSpinner(locationsIsFetching);
     } else {
      setShowSpinner(false);
     } 

  }, [locationsIsFetching]); 


  //is not working
  useEffect(() => { 
    
    if (travelTimesMutation.isFetching) {
     setShowSpinner(travelTimesMutation.isFetching);
      } else {
       setShowSpinner(false);
      } 
 
   }, [travelTimesMutation.isFetching]); 
  

  useEffect(() => { 
    
    if (currentLocationIsCalculating) {
     setShowSpinner(currentLocationIsCalculating);
      } else {
       setShowSpinner(false);
      } 
 
   }, [currentLocationIsCalculating]); 

  useEffect(() => { 
    
    if (upcomingHelloesIsFetching) {
     setShowSpinner(upcomingHelloesIsFetching);
      } else {
       setShowSpinner(false);
      } 
 
   }, [upcomingHelloesIsFetching]); 



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
        zIndex: 5000, // High zIndex to stay on top
        elevation: 5000, // Ensures Android rendering priority
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
