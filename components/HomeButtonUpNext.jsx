import React, { useEffect, useRef} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import LoadingPage from '../components/LoadingPage';
import LizardSvg from '../assets/svgs/lizard';

 
// Press function is internal
const HomeButtonUpNext = ({  
        header='UP NEXT',  
        height='100%',
        maxHeight=100,
        borderRadius=20,
        borderColor='transparent',
        darkColor = '#4caf50',
        lightColor = 'rgb(160, 241, 67)', 
        animSize=100,
        anim=require("../assets/anims/arrows.json"),
        animPositionHorizontal=150, 
        animPositionVertical=-30,

    }) => { 

    const { upcomingHelloes, isLoading } = useUpcomingHelloes();
    const { friendList, getThemeAheadOfLoading } = useFriendList();
    const lottieViewRef = useRef(null);
    const globalStyles = useGlobalStyle();
    const { gradientColors } = useGlobalStyle();
    const { setFriend, loadingNewFriend } = useSelectedFriend();
    const hideAnimation = true;


      useEffect(() => {
    if (lottieViewRef.current && anim && !hideAnimation) {
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

     

      const onPress = () => {
        const { id, name } = upcomingHelloes[0].friend; 
        const selectedFriend = id === null ? null : { id: id, name: name }; 
        setFriend(selectedFriend);  
        const friend = friendList.find(friend => friend.id === id);
        getThemeAheadOfLoading(friend);
    
      };
    
    
  
return(
    <View style={[styles.container, {borderRadius: borderRadius, borderColor: borderColor, height: height, maxHeight: maxHeight}]}>
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1}}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        {loadingNewFriend || isLoading && (
            <View style={styles.loadingWrapper}>
            <LoadingPage
                loading={loadingNewFriend || isLoading} 
                spinnerSize={70}
                color='#000002'
                spinnerType='grid'
            />
            </View>
        )}

        {!loadingNewFriend && !isLoading && (
            <TouchableOpacity onPress={onPress} style={{height: '100%', width: '100%'}}>

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
                        {upcomingHelloes && !isLoading && upcomingHelloes[0] ? upcomingHelloes[0].friend.name : 'No upcoming!'}
                    </Text>

                    <Text style={styles.subtitleText}>
                        {upcomingHelloes && !isLoading && upcomingHelloes[0] ? upcomingHelloes[0].future_date_in_words : ''}
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
    alignContent: 'center', 
    marginVertical: '1%',
    borderWidth: 0, 
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
},
loadingWrapper: {
  flex: 1,
  width: '100%', 
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


export default HomeButtonUpNext;

