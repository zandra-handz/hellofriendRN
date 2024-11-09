import React from 'react';
import { View, StyleSheet } from 'react-native';
 
const FriendSettingsSection = ({  
  children,
  isMakingCall,
  LoadingComponent, 
}) => {
  return ( 
        <View style={[styles.container]}>
          {isMakingCall && (
            <View style={[styles.loadingOverlay]} />
          )}
          {isMakingCall && (
            <View style={[styles.loadingContainer]}>
              <LoadingComponent loading={true} spinnerSize={60} spinnerType="flow" />
            </View>
          )} 
              {children}  
        </View> 
  );
};

const styles = StyleSheet.create({ 
  container: { 
    width: '100%',  
    height: 'auto',

  }, 
  loadingOverlay: {
    flex: 1, 
    zIndex: 3,
  },
  loadingContainer: {  
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  }, 
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
});


export default FriendSettingsSection;
