import { View, Text, StyleSheet } from 'react-native';
import React from 'react'; 
import HelloFriendFooter from '../components/HelloFriendFooter'; 
import { useAuthUser } from '../context/AuthUserContext'; 
 


const Upcoming = () => {
    const { authUserState } = useAuthUser();

    return (
        <>
            <View style={styles.container}> 
                <Text style={styles.message}>
                    Welcome back, {authUserState.username}!
                    
                </Text>
            </View>
                <SpeedFabView />
            <View stle={styles.footerContainer}>
            <HelloFriendFooter />
            </View>
        </>
             
        
        
    );
};

export default Upcoming;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      backgroundColor: 'white',
    },
    footerContainer: { backgroundColor: '#333333' },
    message: {
        fontSize: 60,
        top: '26%',
        textAlign: "center",
        justifyContent: "center",
        width: "100%",
        padding: 28,
    }
  });