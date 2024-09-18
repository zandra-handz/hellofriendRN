import React from 'react';
import { View, StyleSheet } from 'react-native'; 

const BaseModalFooterSection = ({ 
  children,
  isMakingCall,
  LoadingComponent,
  themeStyles
}) => {
  return ( 
        <View style={[styles.container, themeStyles.modalContainer]}>
          {/* Loading Spinner Overlay */}
          {isMakingCall && (
            <View style={[themeStyles.modalContainer, styles.loadingOverlay]} />
          )}

          {/* Spinner when making call */}
          {isMakingCall && (
            <View style={styles.loadingContainer}>
              <LoadingComponent loading={true} spinnerSize={60} spinnerType='circle' />
            </View>
          )}

          <View style={{ zIndex: 0 }}> 

            {/* Modal content passed as children */}
            {children}
          </View>
        </View> 
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  container: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 0,
    width: '100%',
    alignSelf: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: -6,
    right: 0,
    padding: 10,
  },
  loadingOverlay: { 
    position: 'absolute',
    width: '102%', 
    top: 0,
    bottom: 0,
    right: 0,
    left: 0, 
    zIndex: 1,
  },
  loadingContainer: {  
    position: 'absolute', 
    top: 0,
    bottom: 0,
    right: 0,
    left: 0, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
});

export default BaseModalFooterSection;
