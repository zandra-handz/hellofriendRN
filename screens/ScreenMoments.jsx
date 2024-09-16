import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import { LinearGradient } from 'expo-linear-gradient'; 

import  { useSelectedFriend } from '../context/SelectedFriendContext';

const ScreenMoments = ({ route, navigation }) => {
    const { themeStyles, gradientColors } = useGlobalStyle(); 
    const {calculatedThemeColors} = useSelectedFriend();
    const { capsuleList } = useCapsuleList();
    const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);

    useEffect(() => {
        if (capsuleList.length > 0) {
            setIsCapsuleListReady(true);
        }
    }, [capsuleList]);

    return ( 
        
        <LinearGradient
        colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, themeStyles.signinContainer]}
      >
                <View style={{flex: 1, width: '100%'}}>
                    {isCapsuleListReady ? (
                        <>  
                        <ItemMomentMultiPlain height={40} width={40} columns={3} singleLineScroll={false} newestFirst={false} svgColor={themeStyles.footerIcon} />
                            
                        </>
                        
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </View> 
            </LinearGradient> 
            )
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        padding: 0,
        justifyContent: 'space-between',
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    modalContent: {
        width: '100%', 
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

export default ScreenMoments;
