import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
//<Tab.Screen name="Recent" component={HelloesScreen} />
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchPastHelloes } from '../api'; 
import ItemViewHello from '../components/ItemViewHello';
import { Ionicons } from '@expo/vector-icons'; 
  
import ItemHelloesMulti from '../components/ItemHelloesMulti';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTabBar from '../components/CustomTabBar';


const Tab = createBottomTabNavigator();


const ScreenHelloes = ({ route, navigation }) => { 
    const { themeStyles } = useGlobalStyle();
    const { selectedFriend, calculatedThemeColors } = useSelectedFriend();
    const [isFetchingHelloes, setFetchingHelloes] = useState(false);
    const [helloesList, setHelloesList] = useState([]);
    const [helloesInPersonList, setHelloesInPersonList] = useState([]);const [isModalVisible, setIsModalVisible] = useState(false);
    const [ selectedHello, setSelectedHello ] = useState(null);
  


    useEffect(() => {
        const fetchData = async () => {
            setFetchingHelloes(true);
            try {
                if (selectedFriend) {
                    const helloes = await fetchPastHelloes(selectedFriend.id);
                    
                    setHelloesList(helloes);
    
                    // Filter helloes with type 'in person' and set the filtered list
                    const inPersonList = helloes.filter(hello => hello.type === 'in person');
                    setHelloesInPersonList(inPersonList);
                } else { 
                    setHelloesList([]);
                    setHelloesInPersonList([]);
                }
            } catch (error) {
                console.error('Error fetching helloes list:', error);
            } finally {
                setFetchingHelloes(false);
            }
        };
    
        fetchData();
    }, [selectedFriend]);

    

    const onPress = (hello) => { 
         if (hello) {
             setSelectedHello(hello); 
             setIsModalVisible(true);
         } else {
             console.log('This hello is not in the list.');
         }
     };

     const onClose = () => {
        setIsModalVisible(false);
      };


    const HelloesScreen = () => (
        
        <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
          <ItemHelloesMulti onPress={onPress} helloesData={helloesList} horizontal={false} />
        </View>
      );

      const HelloesInPersonScreen = () => (
        
        <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
          <ItemHelloesMulti onPress={onPress} helloesData={helloesInPersonList} horizontal={false} />
        </View>
      );


 

    return ( 
        <View style={[styles.container]}>
                    {helloesList && helloesInPersonList && !isFetchingHelloes ? (
                        <>  
                        <Tab.Navigator
                            tabBar={props => <CustomTabBar {...props} />}
                            screenOptions={({ route }) => ({
                                tabBarStyle: {
                                backgroundColor: calculatedThemeColors.darkColor,
                                position: 'absolute',
                                flexDirection: 'row',
                                top: 0, 
                                elevation: 0,
                                shadowOpacity: 0,
                                borderTopWidth: 0, 
                                },
                                tabBarActiveTintColor: calculatedThemeColors.fontColor,
                                tabBarInactiveTintColor: calculatedThemeColors.fontColor,
                                tabBarIcon: ({ color }) => {
                                let iconName;
                                if (route.name === `${selectedFriend.name}`) {
                                    iconName = 'star';
                                } else if (route.name === 'Others') {
                                    iconName = 'location';
                                } else if (route.name === 'Recent') {
                                    iconName = 'time';
                                }
                                return <Ionicons name={iconName} size={18} color={calculatedThemeColors.fontColor} />;
                                },
                            })}
                            >
                                <Tab.Screen name="In person" component={HelloesInPersonScreen} />
                                <Tab.Screen name="All" component={HelloesScreen} />
                            </Tab.Navigator>


                            {isModalVisible && selectedHello && (
                                <ItemViewHello hello={selectedHello} onClose={onClose} />
                            )}

                        
                        

                        </>
                        
                    ) : (
                        <Text>Loading...</Text>
                    )} 
            </View> )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: '100%',
        justifyContent: 'space-between',
    },
    sectionContainer: {
        paddingTop: 24,
        width: '100%',
        flex: 1,
      },
    mainContainer: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderRadius: 0,
        padding: 4,
        paddingTop:50,
        height: '100%',
        maxHeight: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ScreenHelloes;
