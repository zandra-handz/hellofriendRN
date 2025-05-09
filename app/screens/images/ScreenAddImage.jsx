 

import React from 'react';
import { View, StyleSheet } from 'react-native';

// state
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useFriendList } from '@/src/context/FriendListContext';
import ContentAddImage from '@/app/components/images/ContentAddImage';

// nav
import { useRoute } from '@react-navigation/native'; 

const ScreenAddImage = () => {  

    const {  updateSafeViewGradient  } = useFriendList();
     updateSafeViewGradient(true);
        const route = useRoute();
        const imageUri = route.params?.imageUri ?? false;  

    const {themeStyles} = useGlobalStyle();
     
    return (
        <View style={[styles.container, themeStyles.container]}>  
                <ContentAddImage imageUri={imageUri} /> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 0,
    }, 
});

export default ScreenAddImage;