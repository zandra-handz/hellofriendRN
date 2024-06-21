import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ModalGen from '../components/ModalGen';
import FriendSelect from '../data/FriendSelect';
import QuickAddThought from './QuickAddThought'; 
import  QuickAddHello from './QuickAddHello';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const SpeedFabView = () => {
  const { selectedFriend } = useSelectedFriend();
  const [showSpeedDial, setSpeedDial] = useState(false);
  const rotationAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const button1Opacity = useRef(new Animated.Value(0)).current;
  const button2Opacity = useRef(new Animated.Value(0)).current;
  const button3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(button3Opacity, {
        toValue: showSpeedDial ? 1 : 0,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(button2Opacity, {
        toValue: showSpeedDial ? 1 : 0,
        duration: 100,
        delay: showSpeedDial ? 2 : 0, // Delay for button 2 animation
        useNativeDriver: true
      }),
      Animated.timing(button1Opacity, {
        toValue: showSpeedDial ? 1 : 0,
        duration: 60,
        delay: showSpeedDial ? 3 : 0, // Delay for button 1 animation
        useNativeDriver: true
      })
    ];

    Animated.stagger(50, animations).start();
  }, [showSpeedDial]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (showSpeedDial) {
      pulse.start();
    } else {
      pulse.stop();
      pulseAnimation.setValue(1);
    }

    return () => pulse.stop(); // Clean up the animation on unmount
  }, [showSpeedDial]);

  const rotateButton = () => {
    Animated.timing(rotationAnimation, {
      toValue: showSpeedDial ? 1 : 0,
      duration: 140,
      useNativeDriver: true
    }).start();
  };

  const openSpeedDial = () => {
    setSpeedDial(!showSpeedDial);
    rotateButton();
  };

  const openModal1 = () => {
    setModal1Visible(true);
  };

  const openModal2 = () => {
    setModal2Visible(true);
  };

  const openModal3 = () => {
    setModal3Visible(true);
  };

  const rotation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg']
  });

  const closeModal = () => {
    setModal1Visible(false);
  };

  return (
    <View style={styles.container}>
    <ModalGen
      modalVisible={modal1Visible}
      setModalVisible={setModal1Visible}
      headerTitle={selectedFriend ? `Add hello for ${selectedFriend.name}` : 'Add hello'}
      headerRightComponent={<FriendSelect />}
      buttons={[
        { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
        { text: 'Cancel', onPress: () => console.log('Cancel button pressed!') }
      ]}
    > 
    <QuickAddHello onClose={closeModal} /> 
    </ModalGen>

    <ModalGen modalVisible={modal2Visible} setModalVisible={setModal2Visible} />
      <ModalGen 
        modalVisible={modal3Visible} 
        setModalVisible={setModal3Visible} 
        headerTitle={selectedFriend ? `Add moment to give ${selectedFriend.name}` : 'Add moment'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => console.log('Cancel button pressed!') }
        ]}
        >
        <QuickAddThought />

      </ModalGen>
      {showSpeedDial && (
        <Animated.View style={[styles.speedView]}>
          <Animated.View style={[styles.customButton, { opacity: button1Opacity }]}>
            <TouchableOpacity onPress={openModal1}>
              <Text style={styles.buttonText}>Add hello</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={{ height: 8 }}></View>
          <Animated.View style={[styles.customButton, { opacity: button2Opacity }]}>
            <TouchableOpacity onPress={openModal2}>
              <Text style={styles.buttonText}>Add image</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={{ height: 8 }}></View>
          <Animated.View style={[styles.customButton, { opacity: button3Opacity }]}>
            <TouchableOpacity onPress={openModal3}>
              <Text style={styles.buttonText}>Add moment</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
      <Animated.View style={[styles.fabButton, { transform: [{ rotate: rotation }, { scale: pulseAnimation }], backgroundColor: showSpeedDial ? 'hotpink' : '#292929' }]}>
        <TouchableOpacity onPress={openSpeedDial} style={styles.touchable}>
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    alignItems: 'flex-end'
  },
  customButton: {
    backgroundColor: 'black',
    paddingVertical: 24,
    paddingHorizontal: 26,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#292929',
  },
  fabButton: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#292929',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
  speedView: {
    paddingVertical: 8,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SpeedFabView;
