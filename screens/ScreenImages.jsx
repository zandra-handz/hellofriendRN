import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonGoToAddImage from '../components/ButtonGoToAddImage';
import useImageFunctions from '../hooks/useImageFunctions';
import ImagesList from '../components/ImagesList';

const ScreenImages = ({ route, navigation }) => {
    const { imageList } = useImageFunctions();
    const { themeStyles } = useGlobalStyle();
    //const [isImageListReady, setIsImageListReady] = useState(false);

   // useEffect(() => {
     //   if (imageList.length > 0) {
       //     setIsImageListReady(true);
       // }
   // }, [imageList]);

    return ( 
            <View style={[styles.container, themeStyles.genericTextBackground]}> 
                <ScrollView>
                    {imageList.length > 0 ? (
                        <>  
                        <ImagesList height={120} width={120} singleLineScroll={false} />
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
});

export default ScreenImages;
