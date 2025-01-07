import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from "../context/FriendListContext";
import ButtonGoToAddImage from '../components/ButtonGoToAddImage';
import useImageFunctions from '../hooks/useImageFunctions';
import ImagesList from '../components/ImagesList'; 


import { LinearGradient } from "expo-linear-gradient";

const ScreenImages = ({ route, navigation }) => {
    const { imageList } = useImageFunctions();
    const { themeStyles } = useGlobalStyle();
      const { themeAheadOfLoading } = useFriendList();
    //const [isImageListReady, setIsImageListReady] = useState(false);

   // useEffect(() => {
     //   if (imageList.length > 0) {
       //     setIsImageListReady(true);
       // }
   // }, [imageList]);

    return ( 
                <LinearGradient
                  colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.container]}
                >

                <View style={{ flex: 1}}>
                    {imageList.length > 0 ? (
                        <>  
                        <ImagesList height={80} width={80} singleLineScroll={false} />
                        </>
                        
                    ) : (
                        <Text></Text>
                    )}
                </View> 
                <ButtonGoToAddImage />
                
            </LinearGradient> )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        
    width: "100%",
    justifyContent: "space-between",
    },

    mainContainer: {
        flex: 1,
    },   
});

export default ScreenImages;
