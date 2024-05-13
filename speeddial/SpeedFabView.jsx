import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ModalGen from '../components/ModalGen';
import FriendSelect from '../data/FriendSelect';
import QuickAddThought from './QuickAddThought'; // Import QuickAddThought component

const SpeedFabView = () => {
  const [showSpeedDial, setSpeedDial] = useState(false);
  const [rotationAnimation] = useState(new Animated.Value(0));
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [button1Opacity] = useState(new Animated.Value(0));
  const [button2Opacity] = useState(new Animated.Value(0));
  const [button3Opacity] = useState(new Animated.Value(0));

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
        delay: showSpeedDial ? 3 : 0, // Delay for button 2 animation
        useNativeDriver: true
      }),
      Animated.timing(button1Opacity, {
        toValue: showSpeedDial ? 1 : 0,
        duration: 60,
        delay: showSpeedDial ? 5 : 0, // Delay for button 1 animation
        useNativeDriver: true
      })
    ];

    Animated.stagger(50, animations).start();
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
    setSpeedDial(false);
  };

  const openModal2 = () => {
    setModal2Visible(true);
    setSpeedDial(false);
  };

  const openModal3 = () => {
    setModal3Visible(true);
    setSpeedDial(false);
  };

  return (
    <View style={styles.container}>
      <ModalGen modalVisible={modal1Visible} setModalVisible={setModal1Visible}>
        <FriendSelect />
        </ModalGen>  
      
      <ModalGen modalVisible={modal2Visible} setModalVisible={setModal2Visible} />
      <ModalGen modalVisible={modal3Visible} setModalVisible={setModal3Visible}>
        <FriendSelect />
        <QuickAddThought /> 
      </ModalGen>
      {showSpeedDial && (
        <Animated.View style={[styles.speedView]}>
          <Animated.View style={[styles.customButton, { opacity: button1Opacity }]}>
            <TouchableOpacity onPress={openModal1}>
              <Text style={styles.buttonText}>Add hello!</Text>
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
              <Text style={styles.buttonText}>Add thought</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
      <Animated.View style={[styles.fabButton]}>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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
    fontSize: 40,
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
  },
});

export default SpeedFabView;
