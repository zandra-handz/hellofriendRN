import React, { useState, useEffect, useCallback  } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native"; 
import useLocationHours from "@/src/hooks/LocationCalls/useLocationHours";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
 
// need to wrap this component in {additionalDetails?.hours?.weekday_text && (
const Hours = ({
  buttonHightlightColor,
  onDaySelect,  
  currentDay,  
  
  daysHrsData,
  initiallySelectedDay, 
  welcomeTextStyle,
  primaryColor,
  primaryBackground = 'red',
}) => { 
  const { fullDays, daysOfWeek, hoursForAllDays, hoursForAllDaysNiceString } =
    useLocationHours(daysHrsData); 
  const [selectedDay, setSelectedDay] = useState(initiallySelectedDay || currentDay || null);  // Change to null to handle "All Days"
  
 

  const handleDayPress = useCallback(


    (dayIndex) => { 
      if (dayIndex === 0) {
        setSelectedDay(null);
      } else {
        setSelectedDay(dayIndex);
      }  
        let dayObject = {};
        dayObject = {'day': daysOfWeek[dayIndex], 'index': dayIndex === 0 ? null : dayIndex};
 
      onDaySelect(dayObject);  
    },
    [hoursForAllDays, fullDays, daysOfWeek, hoursForAllDaysNiceString]
  );


  useFocusEffect(
    useCallback(() => {
      // console.log('FOCUS EFFECT'); 

      setSelectedDay(initiallySelectedDay?.index);
        onDaySelect(initiallySelectedDay); 
    }, [  
      initiallySelectedDay, 
      handleDayPress,
    ])
  );


  useEffect(() => {
  if (currentDay && selectedDay === undefined) { 
    console.log('SETTING CARD WITH CURENT');
    handleDayPress(currentDay?.index);
  }
}, [currentDay, selectedDay]);
 


const renderHours = useCallback(() => {
  if (selectedDay === null) {
    return (
      <View style={[styles.hoursContainer, { alignItems: 'start' }]}>
        {Object.entries(hoursForAllDays).map(([day, time], index) => (
          <Text
            key={index}
            style={[styles.hoursText, {color: primaryColor}]}
          >
            {day}: {time}
          </Text>
        ))}
      </View>
    );
  } else {
    const selectedDayName = daysOfWeek[selectedDay];
    return (
      <View style={styles.hoursContainer}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            justifyContent: 'start',
            width: '100%',
          }}
        >
          <Text style={[  welcomeTextStyle, {color: primaryColor}]}>
            {fullDays && fullDays[selectedDay]}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            justifyContent: 'center',
            width: '100%',
          }}
        >
       <Text style={[  welcomeTextStyle, {color: primaryColor}]}>
            {hoursForAllDays[selectedDayName]}
          </Text>
        </View>
      </View>
    );
  }
}, [selectedDay, hoursForAllDays, daysOfWeek, fullDays, styles, primaryColor, welcomeTextStyle]);

  const renderDayButton = useCallback(
    ({ item, index }) => (
      <Pressable
        key={index}
        style={[
          styles.dayButton,
          selectedDay === index && styles.selectedDayButton,
          {backgroundColor: selectedDay === index ? buttonHightlightColor : 'transparent'

          } 
        ]}
        onPress={() => handleDayPress(index)}
      >
        <Text
          style={[
            styles.dayText,
         
            selectedDay === index && styles.selectedDayText,
            {color: primaryColor}
          ]}
        >
          {item}
        </Text>
      </Pressable>
    ),
    [styles, handleDayPress, primaryColor, selectedDay]
  );

  return (
    <View
      style={[
        styles.container,
 
        { backgroundColor: primaryBackground, flexShrink: 1 },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
          alignItems: "center",
        }}
      >
        <View
          style={{
                paddingVertical: 10, 
            flexDirection: "row",
            height: "100%",
            alignItems: "center", 
            justifyContent: 'space-between', 
            height: 'auto',
        
          
          }}
        >
          <Text
            style={[
              styles.title,
              { color: primaryColor }
            ]}
          >
            {/* Hours */}
            Switch:
            {/* {fullDays[selectedDay]} */}
          </Text>
          <View
            style={{
              
              marginHorizontal: 10,
              height: "100%",
              width: "100%",
              alignItems: "center",  
            }}
          >
            <FlatList
            contentContainerStyle={{height: '100%', alignItems: 'center' }} // need alignItems here to put this in the center and align with 'Hours' text that shares the flex row with it
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={daysOfWeek}
              renderItem={renderDayButton}
              ListFooterComponent={<View style={{ width: 300 }}></View>}
            />
          </View>
        </View>
      </View>
 
      {renderHours()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    alignSelf: "center",
    paddingVertical: 10,
    width: "100%",
  },
  daysContainer: {
    paddingVertical: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayButton: {
    borderWidth: 0.8,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 4,
    width: 60,
    height: 40,
  },
  selectedDayButton: {},
  dayText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedDayText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  hoursContainer: {
    height: "auto",
    width: "100%",
    alignItems: 'center',
    //  alignItems: "center",
  },
  hoursText: {
    fontSize: 15,
  },
});

export default Hours;
