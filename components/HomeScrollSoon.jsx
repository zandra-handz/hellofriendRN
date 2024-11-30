import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native';

import { useUpcomingHelloes } from '../context/UpcomingHelloesContext'; 
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFriendList } from '../context/FriendListContext';
import SoonButton from '../components/SoonButton';
import FriendItemButton from '../components/FriendItemButton';

import { useNavigation } from '@react-navigation/native';


import { useSelectedFriend } from '../context/SelectedFriendContext';

import LoadingPage from '../components/LoadingPage';

const HomeScrollSoon = ({
  height,  
  borderRadius=20,
  borderColor='transparent',
  darkColor = '#4caf50',
  lightColor = 'rgb(160, 241, 67)',
}) => {   
  const { width } = Dimensions.get('window'); 
  
  const navigation = useNavigation();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { friendList, getThemeAheadOfLoading } = useFriendList();
 
  
  const soonButtonWidth = 140;
 // const friendItemButtonWidth = 160;

  const soonListRightSpacer = Dimensions.get("screen").width - 136;

  const friendItemButtonWidth = Dimensions.get("screen").width / 2.6;

  const buttonRightSpacer = 6;
 
  const calendarButtonHeight = (height / .6);

  const handlePress = (hello) => {
    console.log('next hello date: ', hello.future_date_in_words);
    const { id, name } = hello.friend; 
    const selectedFriend = id === null ? null : { id: id, name: name }; 
    setFriend(selectedFriend);  
    const friend = friendList.find(friend => friend.id === hello.friend.id);
    getThemeAheadOfLoading(friend);

  };

  const handleNavigationPress = (name) => {
    navigation.navigate({name});
  };

    
  const renderUpcomingHelloes = () => {

    return (
      <Animated.FlatList
        data={upcomingHelloes.slice(0)}
        horizontal={true}
        keyExtractor={(item, index) => `satellite-${index}`}
        getItemLayout={(data, index) => (
          { length: soonButtonWidth, offset: soonButtonWidth * index, index }
      )}

        renderItem={({ item }) => (

          <View style={{marginRight: buttonRightSpacer, height: '30%', flex: 1}}>
            <SoonButton 
              height={'30%'} 
              friendName={item.friend_name} 
              dateAsString={item.future_date_in_words}
              width={soonButtonWidth} 
              onPress={() => (handlePress(item))} /> 
              
          </View>
        )} 
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
        initialScrollIndex={0}
        ListFooterComponent={() => <View style={{ width: soonListRightSpacer }} />}
        
        snapToInterval={soonButtonWidth + buttonRightSpacer}  // Set the snapping interval to the height of each item
        snapToAlignment="start"  // Align items to the top of the list when snapped
        decelerationRate="fast" 
      />
    );
  };

  const friendOptions = [
    { 
      name: 'Helloes',
      message:'View past helloes'

    }, 
    { 
      name: 'Locations',
      message: 'Pick a meet-up spot!',
 
  },

    { 
      name: 'Helloes',
      message:'More options coming soon!'

    }, 

  ];

  
  const renderFriendItems = () => {

    return (
      <Animated.FlatList
        data={friendOptions}
        horizontal={true}
        keyExtractor={(item, index) => `satellite-${index}`}
        getItemLayout={(data, index) => (
          { length: friendItemButtonWidth, offset: friendItemButtonWidth * index, index }
      )}

        renderItem={({ item }) => (

          <View style={{marginRight: buttonRightSpacer, height: '30%', flex: 1}}>
            <FriendItemButton 
              height={'30%'}   
              buttonTitle={item.message} 
              width={friendItemButtonWidth} 
              onPress={() => (handleNavigationPress(item.name))} /> 
              
          </View>
        )} 
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
        initialScrollIndex={0}
        ListFooterComponent={() => <View style={{ width: soonListRightSpacer }} />}
        
        snapToInterval={friendItemButtonWidth + buttonRightSpacer}  // Set the snapping interval to the height of each item
        snapToAlignment="start"  // Align items to the top of the list when snapped
        decelerationRate="fast" 
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

{isLoading && (  
              <View style={styles.loadingWrapper}>

              <LoadingPage 
                loading={isLoading}
                includeLabel={false}
                label=''
                spinnerSize={70}
                color='#000002'
                spinnerType='grid'
              />  
              </View>
            )}
          {!isLoading && (  
            <>
          <View style={styles.headerContainer}>
            { !selectedFriend && (
            <Text style={styles.headerText}>SOON</Text>
          )}
          { selectedFriend && (
            <Text style={styles.headerText}>HELLO HELPERS</Text>
          )}
            </View>
          
            <View style={[styles.buttonContainer, {height: calendarButtonHeight, backgroundColor: 'transparent'}]}>
          
              {!selectedFriend && (
              <>
              {renderUpcomingHelloes()} 
              </>
            )} 
            { selectedFriend && (
              <>
              {renderFriendItems()}
              </>
            )} 

            </View>  
            </>
          )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',   
    flexDirection: 'column', 
    overflow: 'hidden',
    marginVertical: '1%',
    borderWidth: 0,
    borderColor: 'black',
    paddingHorizontal: '4%',
    paddingTop: '1%',
    paddingBottom: '0%',
  }, 
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',

  },
  loadingWrapper: {
    flex: 1,
    width: '100%', 
  },
  headerContainer: {
    width: '100%', 
    paddingVertical: '0%',

  },
  headerText: {
    fontFamily: 'Poppins-Bold',
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

export default HomeScrollSoon;