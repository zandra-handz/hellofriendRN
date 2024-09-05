import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import HelloFriendFooter from '../components/HelloFriendFooter';

const ScreenMoments = ({ route, navigation }) => {
    const { themeStyles } = useGlobalStyle(); 
    const { capsuleList } = useCapsuleList();
    const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);

    useEffect(() => {
        if (capsuleList.length > 0) {
            setIsCapsuleListReady(true);
        }
    }, [capsuleList]);

    return ( 
        <View 
            style={[
            styles.container, 
            themeStyles.container, 
            ]}
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
                <View style={{width: '100%', position: 'absolute', bottom: 0}}> 
                <HelloFriendFooter />
                </View>
            </View> 
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
