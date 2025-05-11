import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useFriendList } from '@/src/context/FriendListContext';


const LeafTopContainer = ({height='100%', width='101%', minHeight='96%', paddingTop=0, paddingBottom='0%', paddingHorizontal='0%', children}) => {


    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    
    return(
        <View style={[styles.container, themeStyles.genericTextBackground,
            { width: width,
                height: height,
                minHeight: minHeight,
                paddingTop: paddingTop,
                paddingBottom: paddingBottom,
                paddingHorizontal: paddingHorizontal,
                borderColor: themeAheadOfLoading.lightColor
            }
        ]}>
            {children && children}
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

    },

});


export default LeafTopContainer;