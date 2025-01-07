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
                          <>
                            <View
                              style={[styles.searchBarContent, { backgroundColor: "transparent" }]}
                            >
                                          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
              paddingHorizontal: "3%",
            }}
          >
            {/* <HelloesSearchBar
              formattedData={flattenHelloes}
              originalData={helloesList}
              height={30}
              width={"27%"}
              borderColor={"transparent"}
              placeholderText={"Search"}
              textAndIconColor={themeAheadOfLoading.fontColorSecondary}
              backgroundColor={"transparent"}
              onPress={openHelloesNav}
              searchKeys={["capsule", "additionalNotes", "date", "location"]}
            /> */}
          </View>
                            
                            </View>
                                    <View
                                      style={[
                                        styles.backColorContainer,
                                        themeStyles.genericTextBackground,
                                        { borderColor: themeAheadOfLoading.lightColor },
                                      ]}
                                    >

                <ScrollView>
                    {imageList.length > 0 ? (
                        <>  
                        <ImagesList height={80} width={80} singleLineScroll={false} />
                        </>
                        
                    ) : (
                        <Text></Text>
                    )}
                </ScrollView>
                </View>
                <ButtonGoToAddImage />
                </>
            </LinearGradient> )
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        
    width: "100%",
    justifyContent: "space-between",
    },
    searchBarContent: {
        width: "100%",
        paddingHorizontal: "1%",
        paddingBottom: "2%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
      },
    backColorContainer: {
        height: "96%",
        alignContent: "center",
        paddingHorizontal: "4%",
        paddingTop: "6%",
        //flex: 1,
        width: "101%",
        bottom: -10,
        alignSelf: "center",
        borderWidth: 1,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderRadius: 30,
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 2000,
      },
    mainContainer: {
        flex: 1,
    },   
});

export default ScreenImages;
