import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CardHelloes from './CardHelloes';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useSelectedFriend } from '../context/SelectedFriendContext'
import { fetchPastHelloes } from '../api';

const TabScreenHelloes = () => {
    const { upcomingHelloes } = useUpcomingHelloes();
    console.log("UPCOMING HELLOES: ", upcomingHelloes);

    const { selectedFriend } = useSelectedFriend();
    const [helloesList, setHelloesList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedFriend) {
                    const helloes = await fetchPastHelloes(selectedFriend.id);
                    
                    setHelloesList(helloes);  
                    console.log("fetchData Helloes List: ", helloes);
                } else { 
                    setHelloesList(helloes || []);
                }
            } catch (error) {
                console.error('Error fetching helloes list:', error);
            }
        };

        fetchData();
    }, [selectedFriend]);


    return (
        <View style={styles.container}>
            <FlatList
                data={helloesList}
                renderItem={({ item }) => (
                    <CardHelloes
                    title={item.date}
                    description={item.type}
                    capsules={item.pastCapsules}
                    key={item.id}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
      padding: 0,
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
export default TabScreenHelloes;
