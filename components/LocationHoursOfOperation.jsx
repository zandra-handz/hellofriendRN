import React, {  useEffect, useRef } from 'react';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useLocationDetailFunctions from '../hooks/useLocationDetailFunctions';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import LocationSendDirAndHrsButton from '../components/LocationSendDirAndHrsButton';
import { useNavigation } from '@react-navigation/native';

const LocationHoursOfOperation = ({ location, data, currentDayDrilledThrice, iconSize=17, fontColor='white' }) => {
    const { themeStyles } = useGlobalStyle();
    const {  getSoonestAvailable } = useLocationDetailFunctions();
 
    const flatListRef = useRef(null);

  const hours = data.weekday_text;

  const nextOpen = getSoonestAvailable(hours);

  const navigation = useNavigation();  

  const handleGoToLocationSendScreen = (day) => {
    navigation.navigate('LocationSend', { location: location, weekdayTextData: hours, selectedDay: day});

  }

const handlePress = (day) => {  
    handleGoToLocationSendScreen(day);

  };


 

  const toggleHoursView = () => {
    //setShowAllHours(!showAllHours);
    console.log('I have commented out the today-only view');
  };

  const splitDayAndTime = (data) => {
    return data.split(': ');
  }


  const days = {
    
    "Mon": 0,
    "Tue" : 1,
    "Wed" : 2,
    "Thu": 3,
    "Fri": 4,
    "Sat" : 5,
    "Sun": 6, 
}

const startingIndex = () => { 
  console.log('starting index');

  try { 
    console.log('next open', nextOpen);
 
    if (nextOpen in days) {
      return days[nextOpen];
    } else {
      console.log(`nextOpen (${nextOpen}) is not a valid day key.`);
    }
  } catch (error) {
    console.log('error using days to find index', error);
  }

  try {
    if (currentDayDrilledThrice in days) {
      return days[currentDayDrilledThrice];
    }
  } catch (error) {
    console.log('error in startingIndex function', error);
  }
 
  return 0;
};


    useEffect(() => {
      console.log('scroll use effect triggered');
      if (data) { 
       
      console.log('scrolling index');
        const index = startingIndex(nextOpen); 
        console.log('index', index);

        if (index && index !== -1 && flatListRef.current) {
          console.log('flatlist scrolling now!');
         flatListRef.current.scrollToIndex({ index, animated: false });
        }
      }
      }, [data]); 

  return (
    <View style={[styles.card, themeStyles.genericTextBackground]}>
      
        <TouchableOpacity onPress={toggleHoursView} style={[styles.iconContainer, themeStyles.genericTextBackground, {zIndex: 10, width: 20, flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, height: 27}]}>
            <FontAwesome5 name="clock" size={iconSize} color={fontColor} />

        </TouchableOpacity> 
        <Animated.FlatList 
            ref={flatListRef}
            data={hours}
            horizontal={true}
            
            ListHeaderComponent={() => 
                <View style={[styles.iconContainer, {width: 'auto'}]}>
                     <FontAwesome5 name="clock" size={iconSize} color={'transparent'} />
     
                </View>
            }
            keyExtractor={(item, index) => `hours-${index}`}
            getItemLayout={(data, index) => (
                { length: 150, offset: 150 * index, index}

            )}

            renderItem={({ item, index }) => (
                <View style={{width: 150}}>
                    <LocationSendDirAndHrsButton  
                      onPress={handlePress}
                      dayIndex={index}
                      isNextOpen={splitDayAndTime(item)[0].startsWith(nextOpen)}
                      day={splitDayAndTime(item)[0].substring(0, 3)}
                      time={splitDayAndTime(item)[1].replace(/:00/g, '')}
                      width={'90%'}
                      />   
                </View>

            )}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            initialScrollIndex={days[currentDayDrilledThrice]}
            ListFooterComponent={() => <View style={{ width: 200}} />}
            snapToInterval={150 + 0}
            snapToAlignment="start"  // Align items to the top of the list when snapped
            decelerationRate="fast" 
          /> 
 
    </View>
  );
};

const styles = StyleSheet.create({
  card: {    
    flex: 1, 
    width: '100%',
  },
  title: {
    fontSize: 14, 
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding: 2,
    marginBottom: 4,
  },
  nextOpenRow: { 
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: `lightgreen`, 
    backgroundColor: 'transparent', //themeStyles.genericTextBackgroundShadeTwo.backgroundColor, 
    width: 'auto',
    paddingHorizontal: '3%', 
    paddingVertical: '1%', 
    borderRadius: 20
  },
  day: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 14,
  },
  nextOpenText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: { 
    textTransform: 'lowercase',
    fontSize: 14,
  },
  toggleText: {
    fontSize: 14, 
    textAlign: 'center', 

  },
  iconContainer: { 
    paddingRight: '1%', 
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default LocationHoursOfOperation;
