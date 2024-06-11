import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CardGen from './CardGen';
import { Flow, Grid } from 'react-native-animated-spinkit';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';

const TabScreenNext = () => {
    const { upcomingHelloes, isLoading } = useUpcomingHelloes();
    
    console.log("UPCOMING HELLOES: ", upcomingHelloes);

    return (
        <View style={styles.container}>
          {isLoading ? (
            <View style={styles.spinnerContainer}>
              <Flow size={60} color='hotpink'/>
            </View>

          ):(
            <FlatList
                data={upcomingHelloes}
                renderItem={({ item }) => (
                    <CardGen
                    title={item.friend_name}
                    description={item.future_date_in_words}
                    key={item.id}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
              )}

        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
      padding: 0,
    },
    spinnerContainer: { 
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '50%',
    },
    footerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 10,
    },
    footerImage: {
      width: 100,
      height: 100,
      margin: 5,
      borderRadius: 10,
    },
  });
export default TabScreenNext;
