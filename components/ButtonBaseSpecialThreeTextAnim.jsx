import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useAuthUser } from '../context/AuthUserContext';
import LoadingPage from '../components/LoadingPage';
import LizardSvg from '../assets/svgs/lizard';

 
// Press function is internal
const ButtonBaseSpecialThreeTextAnim = ({  
        header='UP NEXT',  
        height='100%',
        maxHeight=100,
        darkColor = '#4caf50',
        lightColor = 'rgb(160, 241, 67)',
        imageSize=540,
        image=require("../assets/shapes/fairymagic.png"), 
        imagePositionHorizontal=0, 
        imagePositionVertical=70,
        animSize=100,
        anim=require("../assets/anims/arrows.json"),
        animPositionHorizontal=150, 
        animPositionVertical=-30,

    }) => {
    const { authUserState, userAppSettings } = useAuthUser();

    const { upcomingHelloes, isLoading } = useUpcomingHelloes();
    const lottieViewRef = useRef(null);
    const globalStyles = useGlobalStyle();
    const { selectedFriend, setFriend, loadingNewFriend, calculatedThemeColors } = useSelectedFriend();
    const [ borderColor, setBorderColor ] = useState('transparent');
    const [ nextFriend, setNextFriend ] = useState(null);

      useEffect(() => {
    if (lottieViewRef.current && anim) {
      try {
        lottieViewRef.current.play();
      } catch (error) {
        console.error('Error playing animation:', error);
      }
    }
  }, [anim]);


    const adjustFontSize = (fontSize) => {
        return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
      };
    
      const textStyles = (fontSize, color) => ({
        fontSize: adjustFontSize(fontSize),
        color,
        ...(globalStyles.highContrast && {
          textShadowColor: 'rgba(0, 0, 0, 0.75)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 1,
        }),
      });

    
      useEffect(() => {
        if (upcomingHelloes && upcomingHelloes[0]) {
            setNextFriend(upcomingHelloes[0].friend.name);
        }

      }, [upcomingHelloes]);

      const onPress = () => {
        const { id, name } = upcomingHelloes[0].friend; 
        const selectedFriend = id === null ? null : { id: id, name: name }; 
        setFriend(selectedFriend);  
    
      };
    
    
  
return(
    <View style={[styles.container, {height: height, maxHeight: maxHeight}]}>
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1}}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        {loadingNewFriend && (
            <View style={styles.loadingWrapper}>
            <LoadingPage
                loading={loadingNewFriend} 
                spinnerType='flow' 
            />
            </View>
        )}

        {!loadingNewFriend && (
            <TouchableOpacity onPress={onPress} style={{height: '100%', width: '100%'}}>
                {anim && ( 
                <LottieView
                    ref={lottieViewRef}
                    source={anim}
                    loop
                    autoPlay
                    style={{ zIndex: 2, position: 'absolute',  width: animSize, height: animSize, right: animPositionHorizontal,   top: animPositionVertical}}
                    onError={(error) => console.error('Error rendering animation:', error)}
                /> 
                )}
                


                <View style={styles.textContainer}>

                    <Text style={styles.headerText}>
                        {header}
                    </Text>

                    <Text
                        style={[
                            textStyles(30, 'white'),
                            { fontFamily: 'Poppins-Regular' },
                        ]}
                        >
                        {upcomingHelloes && upcomingHelloes[0] ? upcomingHelloes[0].friend.name : 'No upcoming!'}
                    </Text>

                    <Text style={styles.subtitleText}>
                        {upcomingHelloes && upcomingHelloes[0] ? upcomingHelloes[0].future_date_in_words : ''}
                    </Text>

                
                </View>
                <View style={{position: 'absolute', right: -66, top: -66, transform: [{ rotate: '240deg' }] }}>
                  
                  <LizardSvg color={'black'} width={180} height={180} />
                  </View>



            </TouchableOpacity>
        )}
    </View>

)


};


const styles = StyleSheet.create({

  container: {
    flexDirection: 'row', 
    width: '100%',  
    padding: '5%', 
    paddingRight: '0%',
    alignContent: 'center',
    borderRadius: 40,
    marginVertical: '1%',
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
},
textContainer: { 
    zIndex: 5,
    position: 'absolute',
    paddingLeft: '2%',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-around',

},
headerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 28,

},
subtitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
},
loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});


export default ButtonBaseSpecialThreeTextAnim;

