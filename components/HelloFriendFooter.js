import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonSignOut from './ButtonSignOut';
import ButtonSettings from './ButtonSettings';
import ButtonInfo from './ButtonInfo'; // Import the ButtonInfo component
import AlertMicro from './AlertMicro';
import AlertConfirm from './AlertConfirm';
import ButtonToActionMode from './ButtonToActionMode';
import { useNavigationState } from '@react-navigation/native';

export default function HelloFriendFooter() {
  const navigationState = useNavigationState(state => state);
  const currentRouteName = navigationState.routes[navigationState.index]?.name;
  const isOnActionPage = currentRouteName === 'hellofriend';

  return (
    <View style={styles.container}>
      {isOnActionPage ? (
        <View style={styles.section}>
          <ButtonSignOut
            icon="logout"
            iconOnly={false}
            label="Logout"
            confirmationAlert={true}
            modal={AlertConfirm}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <ButtonToActionMode iconName="arrow-left" navigateScreen="hellofriend" />
        </View>
      )}

      <View style={styles.divider} />

      <ButtonSettings />

      <View style={styles.divider} />
 
      <ButtonInfo />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 64,
    width: '100%',
    marginBottom: 0,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  section: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
