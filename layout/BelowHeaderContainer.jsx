import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useFriendList } from '../context/FriendListContext';


const BelowHeaderContainer = ({height=30, alignItems="center", marginBottom="2%", justifyContent="flex-end", children}) => {


    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();
    
    return(
        <View style={[styles.container, 
            { height: height,
                minHeight: height, //not sure what is using this, set to height for now
                maxHeight: height, //not sure what is using this, set to height for now
                justifyContent: justifyContent,
                alignItems: alignItems,
                marginBottom: marginBottom,
              }
        ]}>
            {children && children}
        </View>
    )

};


const styles = StyleSheet.create({
    container: { 
        width: "100%", 
        flexDirection: "row", 
        paddingHorizontal: "4%",
      },

});


export default BelowHeaderContainer;