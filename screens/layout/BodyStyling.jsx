import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';


const BodyStyling = ({minHeight='96%', height='100%', paddingTop='6%', paddingBottom='0%', paddingHorizontal='4%', width='100%', children}) => {


    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();

    return(
        <View style={[styles.container, themeStyles.genericTextBackground,
            { minHeight: minHeight,
                height: height,
                width: width,
                paddingTop: paddingTop,
                paddingBottom: paddingBottom,
                paddingHorizontal: paddingHorizontal,
                borderColor: themeAheadOfLoading.lightColor
            }
        ]}>
            {children}
        </View>
    )

};


const styles = StyleSheet.create({
    container: { 
        alignContent: 'center', 
        alignSelf: 'center',
        borderWidth: 1, 
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderRadius: 30,
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: "hidden",

    },

});


export default BodyStyling;