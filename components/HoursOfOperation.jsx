import React, { useState, useEffect, useRef } from 'react';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useLocationDetailFunctions from '../hooks/useLocationDetailFunctions';
import { View, Text, TouchableOpacity, Animated, StyleSheet, FlatList } from 'react-native';

const HoursOfOperation = ({ hours, iconSize=17, fontColor='white' }) => {
    const { themeStyles } = useGlobalStyle();
    const { getCurrentDay, getTodayHours, getSoonestAvailable } = useLocationDetailFunctions();
    const [showAllHours, setShowAllHours] = useState(true);

    const flatListRef = useRef(null);

  const currentDay = getSoonestAvailable(hours);

  const toggleHoursView = () => {
    //setShowAllHours(!showAllHours);
    console.log('I have commented out the today-only view');
  };

  const splitDayAndTime = (data) => {
    return data.split(': ');
  }

  

  const todayHours = getSoonestAvailable(hours);
  const soonestAvailable = getSoonestAvailable(hours);
  const [todayDay, todayTime] = soonestAvailable.split(': ');
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
    if (soonestAvailable) {
      return days[soonestAvailable];
    }
    return 0;
    };

    useEffect(() => {
        const index = startingIndex(soonestAvailable); // Get the starting index
    
        // Only scroll if the index is valid
        if (index !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ index, animated: true });
        }
      }, [soonestAvailable]); // This hook will run whenever soonestAvailable changes
    

  return (
    <View style={[styles.card, themeStyles.genericTextBackground]}>
      
        <TouchableOpacity onPress={toggleHoursView} style={[styles.iconContainer, themeStyles.genericTextBackground, {zIndex: 10, width: 20, flex: 1, position: 'absolute', left: 0, top: 0, height: 20 }]}>
            <FontAwesome5 name="clock" size={iconSize} color={fontColor} />

        </TouchableOpacity>
        {showAllHours ? (
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

            renderItem={({ item }) => (
                <View style={{width: 150}}>
                    <View style={[splitDayAndTime(item)[0].startsWith(currentDay) && styles.currentDayRow, {paddingVertical: '1%', alignContent: 'center', alignItems: 'center', flexDirection: 'row'}]}>

                    <Text style={[styles.day, themeStyles.genericText]}>{splitDayAndTime(item)[0].substring(0, 3)}</Text>
                    <Text style={[styles.time, themeStyles.genericText]}>{splitDayAndTime(item)[1].replace(/:00/g, '')}</Text>
                    
                    </View>
                </View>

           
          //const [day, time] = hour.split(': ');

         // const isToday = day.startsWith(currentDay);
         
           // <View key={index} style={[styles.hourRow, day.startsWith(currentDay) && styles.currentDayRow]}>
           // <Text style={[styles.day, day.startsWith(currentDay) && styles.currentDayText]}>
           // {day.substring(0, 2)}:
           // </Text>
           // <Text style={[styles.time, isToday && styles.currentDayText]}>{time.replace(/:00/g, '')}</Text>
                       
           // </View> 
            )}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            initialScrollIndex={0}
            ListFooterComponent={() => <View style={{ width: 200}} />}
            snapToInterval={150 + 0}
            snapToAlignment="start"  // Align items to the top of the list when snapped
            decelerationRate="fast" 
          /> 

        
      ) : (
        todayHours && (
          <View style={[styles.currentDayRow, {width: 150}]}> 
            <Text style={[themeStyles.genericText, styles.currentDayText]}>{todayTime.replace(/:00/g, '')}</Text>
          
          </View>
        )
      )}
      <TouchableOpacity onPress={toggleHoursView}>
        <Text style={styles.toggleText}>{showAllHours ? 'Back' : 'See all'}</Text>
      </TouchableOpacity>
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
  currentDayRow: { 
    borderWidth: 1, 
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
  currentDayText: {
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
  },
});

export default HoursOfOperation;
