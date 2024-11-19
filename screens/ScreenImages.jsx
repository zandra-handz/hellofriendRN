import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonGoToAddImage from '../components/ButtonGoToAddImage';
import useImageFunctions from '../hooks/useImageFunctions';
import ItemImageMulti from '../components/ItemImageMulti';

const ScreenImages = ({ route, navigation }) => {
    const { imageList } = useImageFunctions();
    const { themeStyles } = useGlobalStyle();
    const [isImageListReady, setIsImageListReady] = useState(false);

    useEffect(() => {
        if (imageList.length > 0) {
            setIsImageListReady(true);
        }
    }, [imageList]);

    return ( 
            <View style={[styles.container, themeStyles.genericTextBackground]}> 
                <ScrollView>
                    {isImageListReady ? (
                        <>  
                        <ItemImageMulti height={120} width={120} singleLineScroll={false} />
                        </>
                        
                    ) : (
                        <Text></Text>
                    )}
                </ScrollView>
                <ButtonGoToAddImage />
            </View> )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20,
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

export default ScreenImages;
