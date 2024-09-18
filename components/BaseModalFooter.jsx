import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BaseModalFooter = ({
  visible,
  onClose,
  children,
  isMakingCall,
  LoadingComponent,
  themeStyles,
  topOfSpinnerContainer=50
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide" presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={[styles.container, themeStyles.modalContainer]}>
          {/* Loading Spinner Overlay */}
          {isMakingCall && (
            <View style={[themeStyles.modalContainer, styles.loadingOverlay, {top: topOfSpinnerContainer}]} />
          )}

          {/* Spinner in action */}
          {isMakingCall && (
            <View style={[styles.loadingContainer, {top: topOfSpinnerContainer}]}>
              <LoadingComponent loading={true} spinnerSize={60} spinnerType='circle' />
            </View>
          )}

          <View style={{ zIndex: 0 }}>
            {/* Close button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} style={[styles.icon, themeStyles.modalIconColor]} />
            </TouchableOpacity>

            {/* Modal content passed as children */}
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  loadingContainer: {
    position: 'absolute', 
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  icon: {
    marginRight: 10,
    marginLeft: 2,
  },
});

export default BaseModalFooter;
