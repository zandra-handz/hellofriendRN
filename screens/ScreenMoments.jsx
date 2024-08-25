import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain';


const ScreenMoments = ({ route, navigation }) => {
    const { capsuleList } = useCapsuleList();
    const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);

    useEffect(() => {
        if (capsuleList.length > 0) {
            setIsCapsuleListReady(true);
        }
    }, [capsuleList]);

    return ( 
            <View style={styles.container}> 
                <ScrollView>
                    {isCapsuleListReady ? (
                        <>  
                        <ItemMomentMultiPlain height={40} width={40} columns={3} singleLineScroll={false} newestFirst={false} svgColor='black' />
                            
                        </>
                        
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </ScrollView>
            </View> )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    mainContainer: {
        flex: 1,
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
