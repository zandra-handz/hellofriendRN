import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';

import SearchBarForFormattedData from '../components/SearchBarForFormattedData';
import HelloView from '../components/HelloView';
import { Ionicons } from '@expo/vector-icons'; 
  
import HelloesList from '../components/HelloesList';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTabBar from '../components/CustomTabBar';

import useHelloesData from '../hooks/useHelloesData';
//to transition over to
import HelloesNavigator from '../components/HelloesNavigator';


const Tab = createBottomTabNavigator();


const ScreenHelloes = ({ route, navigation }) => { 
    const { themeStyles } = useGlobalStyle();
    const { selectedFriend } = useSelectedFriend();
    const { themeAheadOfLoading } = useFriendList();
    const [isModalVisible, setIsModalVisible] = useState(false);

    //to transition over to
    const [ isHelloesNavVisible, setHelloesNavVisible ] = useState(false);
    const [selectedHelloToView, setSelectedHelloToView] = useState(null);
      

    const [ selectedHello, setSelectedHello ] = useState(null);
   const { helloesList, inPersonHelloes, flattenHelloes } = useHelloesData();

    
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
          <HelloesList onPress={onPress} helloesData={helloesList} horizontal={false} />
        </View>
      );

      const HelloesInPersonScreen = () => { 
        return (
            <View style={[styles.sectionContainer, themeStyles.genericTextBackground]}>
              <HelloesList onPress={onPress} helloesData={inPersonHelloes} horizontal={false} />
            </View>
        );
    };
 

    return ( 
        <View style={[styles.container, {backgroundColor: themeAheadOfLoading.darkColor}]}>

                <>  
                <View style={[styles.searchBarContent, {backgroundColor: themeAheadOfLoading.darkColor}]}>

                    <SearchBarForFormattedData formattedData={flattenHelloes} originalData={helloesList} placeholderText={'Search'} borderColor={'transparent'} onPress={onPress} searchKeys={['date', 'locationName',  'capsule',  'additionalNotes']} />

                </View>
                        <Tab.Navigator
                            tabBar={props => <CustomTabBar {...props} />}
                            screenOptions={({ route }) => ({
                                tabBarStyle: {
                                backgroundColor: themeAheadOfLoading.darkColor,
                                flexDirection: 'row',
                                top: 0, 
                                elevation: 0,
                                shadowOpacity: 0,
                                borderTopWidth: 0, 
                                },
                                tabBarActiveTintColor: themeAheadOfLoading.fontColor,
                                tabBarInactiveTintColor: themeAheadOfLoading.fontColor,
                                tabBarIcon: ({ color }) => {
                                let iconName;
                                if (selectedFriend && route.name === `${selectedFriend.name}`) {
                                    iconName = 'star';
                                } else if (route.name === 'Others') {
                                    iconName = 'location';
                                } else if (route.name === 'Recent') {
                                    iconName = 'time';
                                }
                                return <Ionicons name={iconName} size={18} color={themeAheadOfLoading.fontColor} />;
                                },
                            })}
                            >
                                <Tab.Screen name="In person" component={HelloesInPersonScreen} />
                                <Tab.Screen name="All" component={HelloesScreen} />
                            </Tab.Navigator>


                            {isModalVisible && selectedHello && (
                                <View style={{width: '100%', height: '100%'}}> 
                                <HelloView hello={selectedHello} onClose={onClose} />
                                </View>
                            )}

                        
                        

                        </> 
            </View>
             )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: '100%',
        justifyContent: 'space-between',
    },
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchBarContent: {
        width: '100%',
        paddingHorizontal: '1%',
        paddingVertical: '2%',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1000,
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
