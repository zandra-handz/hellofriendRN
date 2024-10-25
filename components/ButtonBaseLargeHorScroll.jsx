import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions  } from 'react-native';
import { FlashList } from "@shopify/flash-list";  
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFriendList } from '../context/FriendListContext';

 
import ButtonCalendarDateSvgAndLabel from '../components/ButtonCalendarDateSvgAndLabel';
 
const ButtonBaseLargeHorScroll = ({
  height,  
  borderRadius=20,
  borderColor='transparent',
  darkColor = '#4caf50',
  lightColor = 'rgb(160, 241, 67)',
}) => {   
  const { width } = Dimensions.get('window'); 
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { setFriend } = useSelectedFriend();
  const { friendList, getThemeAheadOfLoading } = useFriendList();
  
  
  
  const extractNumberDate = (dateString) => {
    const match = dateString.match(/\d+/);  
    return match ? match[0] : '';  
  };

  const extractMonth = (dateString) => {
    const match = dateString.match(/([a-zA-Z]+)\s+\d+/);  
    return match ? match[1].slice(0, 3).toUpperCase() : ''; 
  };



  const calendarButtonWidth = (width / 5);
  const calendarButtonHeight = (height / .6);

  const handlePress = (hello) => {
    console.log('handle on press triggered ! ! ! ! ! ! ');
    const { id, name } = hello.friend; 
    const selectedFriend = id === null ? null : { id: id, name: name }; 
    setFriend(selectedFriend);  
    const friend = friendList.find(friend => friend.id === hello.friend.id);
    getThemeAheadOfLoading(friend);

  };


  const renderUpcomingHelloes = () => {

    return (
      <FlashList
        data={upcomingHelloes.slice(0)}
        horizontal={true}
        keyExtractor={(item, index) => `satellite-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.button,
              { borderColor: 'transparent',
                width: calendarButtonWidth,
                height: '100%' },
            ]}
            onPress={() => handlePress(item)}
          >
            <ButtonCalendarDateSvgAndLabel 
              numberDate={extractNumberDate(item.future_date_in_words)}
              month={extractMonth(item.future_date_in_words)} 
              label={item.friend_name}
              showLabel={true}
              containerHeight={'100%'}
              width={30} 
              height={30} 
              showMonth={true} 
              enabled={true}  
              color={'black'} 
              onPress={() => (handlePress(item))}
            />
          </TouchableOpacity>
        )}
        estimatedItemSize={54}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
      />
    );
  };
  

  return (
    <View style={[styles.container, {borderRadius: borderRadius, borderColor: borderColor, height: height, maxHeight: 140}]}>
      <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1}}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
       
       <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SOON</Text>
        </View>
      
        <View style={[styles.buttonContainer, {height: calendarButtonHeight, backgroundColor: 'transparent'}]}>
         
            <>
            
          {renderUpcomingHelloes()} 
          </>  
        </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',   
    flexDirection: 'column', 
    overflow: 'hidden',
    marginVertical: '1%',
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: '4%',
    paddingTop: '1%',
    paddingBottom: '0%',
  }, 
  headerContainer: {
    width: '100%', 
    paddingVertical: '0%',

  },
  headerText: {
    fontFamily: 'Poppins-Regular',
    paddingLeft: '3%',
    
    fontSize: 18,

  },
  satelliteSection: {
    width: '33.33%', 
    borderRadius: 0,
    marginLeft: -20,
    paddingLeft: 0,  
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  satelliteButton: { 
    alignItems: 'center',  
    alignContents: 'center', 
    justifyContent: 'space-around',  
  },
  buttonContainer: {
    flexDirection: 'row',   
    flex: 1, 
    backgroundColor: 'green', 
  },
  button: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center', 
    borderRadius: 10, 
    marginLeft: '.6%',
    borderRightWidth: .8, 
    paddingTop: 0,  
    backgroundColor: 'transparent',
    backgroundColor: 'rgba(41, 41, 41, 0.1)',

    
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: 'white',
    
  },
});

export default ButtonBaseLargeHorScroll;
