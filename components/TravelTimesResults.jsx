import React, {  useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import  useTravelTimes from '../hooks/useTravelTimes';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ClockOutlineSvg from '../assets/svgs/clock-outline.svg';


const TravelTimesResults = ({ 
    userAddress, 
    friendAddress, 
    friendName,
    destinationLocation, 
    triggerFetch,
    fontSize=24,
  }) => {

    const { themeStyles } = useGlobalStyle();
    const { travelTimesMutation, fetchTravelTimes, userTravelTime, friendTravelTime, travelTimeResults, travelTimeResultsView } = useTravelTimes();

    useEffect(() => {
      if (triggerFetch) { 
          try { 
            console.log(userAddress);
            console.log(friendAddress);
            console.log(destinationLocation);
            
  
            const results = fetchTravelTimes( 
              userAddress, 
              friendAddress, 
              destinationLocation 
          );
            //console.log(results); 
            console.log("Travel comparisons requested successfully");
          } catch (error) {
            console.error("Error getting travel comparisons:", error);

        };
   
      }
    }, [triggerFetch, userAddress, friendAddress, destinationLocation]);
  
    const renderComparisonResults = () => {
      if (!travelTimeResults) return null;


    const ResultsCard = (headerText, travelTimesData) => {
      return(
        <View style={[styles.resultsCard, themeStyles.genericTextBackgroundShadeTwo ]}>
         
          <Text style={[styles.resultsHeader, themeStyles.genericText, {fontSize: fontSize}]}>{headerText}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <ClockOutlineSvg height={fontSize} width={fontSize} color={themeStyles.genericText.color} style={{paddingHorizontal: '2%'}}/>
            <Text style={[styles.resultsText, themeStyles.genericText, {marginLeft: '4%', fontSize: fontSize}]}>{travelTimesData.time}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <Text style={[styles.resultsText, themeStyles.genericText, {fontWeight: 'bold', fontSize: fontSize / 1.5}]}>{travelTimesData.miles}les</Text>
          </View>
        </View>
      )
    }

  
      return ( 
        <View style={styles.container}>

          {userTravelTime && (
            <>
          {ResultsCard('Me', userTravelTime)}
            </>
          )}

          {friendTravelTime && (
            <>
          {ResultsCard(friendName, friendTravelTime)}
          </>
        )}
          
          </View> 
      );
    };
  
    return (
      <View style={styles.container}>
        {travelTimesMutation.isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {travelTimeResultsView && !travelTimesMutation.isLoading ? renderComparisonResults() : null}
        {!travelTimeResultsView && !travelTimesMutation.isLoading && (
          <Text style={styles.message}></Text>
        )}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%', 
    justifyContent: 'space-between', 
    padding: 0,
  },
  resultsCard: {
    flex: 1, 
    width: '100%', 
    flexDirection: 'column',
    textAlign: 'left', 
    borderRadius: 20,
    padding: 20,
    marginHorizontal: '2%',
  },
  resultsHeader: {
    textTransform: 'uppercase',
    lineHeight: 30,
    fontSize: 24,
    fontWeight: 'bold',

  },
  resultsText: {
    lineHeight: 30, 

  },
  resultsContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  card: { 
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  detail: {
    fontSize: 14, 
  },
  message: {
    fontSize: 16, 
    color: 'white',
  },
});

export default TravelTimesResults;