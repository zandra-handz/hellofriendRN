import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import IconDynamicHelloType from '../components/IconDynamicHelloType';


const LastHelloBanner = () => {

    const { calculatedThemeColors, friendDashboardData } = useSelectedFriend();
    const { themeStyles } = useGlobalStyle();


    return(
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.leftSectionColumn}>
                    <Text style={[styles.title, themeStyles.genericText]}>
                        LAST HELLO
                    </Text> 
                    <Text style={[styles.text, themeStyles.genericText]}>{friendDashboardData[0].days_since_words}</Text>
                </View>
                   <IconDynamicHelloType selectedChoice={friendDashboardData[0].previous_meet_type} svgHeight={30} svgWidth={30} svgColor={calculatedThemeColors.fontColor} />
              
            </View>
            <View style={styles.rightSection}> 
             
            </View>
        </View>

    );

};

const styles = StyleSheet.create({
    container: {  
        width: '100%',
        position:'absolute',    
        height: '100%',
        paddingLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    
    leftSection: { 
        width: '33%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 20, 
        backgroundColor: 'rgba(41, 41, 41, 0.2)',
        height: '100%',

    },
    leftSectionColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '60%',
        

    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',

    },
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15,

    },
    text: {
        fontFamily: 'Poppins-Bold',
        fontSize: 12,

    },

});


export default LastHelloBanner;