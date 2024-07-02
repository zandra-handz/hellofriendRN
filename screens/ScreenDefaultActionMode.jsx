import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalGen from '../components/ModalGen';
import FriendSelect from '../data/FriendSelect';
import QuickAddHello from '../speeddial/QuickAddHello';
import QuickAddImage from '../speeddial/QuickAddImage';
import QuickAddThought from '../speeddial/QuickAddThought';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonLottieAnimation from '../components/ButtonLottieAnimation';
import ActionPageSettings from '../components/ActionPageSettings';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { Ionicons } from '@expo/vector-icons';

const ScreenDefaultActionMode = ({ navigation }) => {
  const { selectedFriend } = useSelectedFriend();
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);

  const openModal1 = () => setModal1Visible(true);
  const openModal2 = () => setModal2Visible(true);
  const openModal3 = () => setModal3Visible(true);
  const openModalSettings = () => setModalSettingsVisible(true);

  return (
    <View style={styles.container}>
      <ModalGen
        modalVisible={modal1Visible}
        setModalVisible={setModal1Visible}
        headerTitle={selectedFriend ? `Add hello for ${selectedFriend.name}` : 'Add hello'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => setModal1Visible(false) }
        ]}
      >
        <QuickAddHello onClose={() => setModal1Visible(false)} />
      </ModalGen>
      <ModalGen
        modalVisible={modal2Visible}
        setModalVisible={setModal2Visible}
        headerTitle={selectedFriend ? `Add image for ${selectedFriend.name}` : 'Add image'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => setModal2Visible(false) }
        ]}
      >
        <QuickAddImage onClose={() => setModal2Visible(false)} />
      </ModalGen>
      <ModalGen
        modalVisible={modal3Visible}
        setModalVisible={setModal3Visible}
        headerTitle={selectedFriend ? `Add moment to give ${selectedFriend.name}` : 'Add moment'}
        headerRightComponent={<FriendSelect />}
        buttons={[
          { text: 'Confirm', onPress: () => console.log('Confirm button pressed!') },
          { text: 'Cancel', onPress: () => setModal3Visible(false) }
        ]}
      >
        <QuickAddThought onClose={() => setModal3Visible(false)} />
      </ModalGen>

      <ModalGen
        modalVisible={modalSettingsVisible}
        setModalVisible={setModalSettingsVisible}
        headerTitle="Settings"
        buttons={[
          { text: 'Close', onPress: () => setModalSettingsVisible(false) }
        ]}
      >
        <ActionPageSettings />
      </ModalGen>

      <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="calendar" size={24} color="white" />
        <Text style={styles.navigationButtonText}>main app</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <ButtonLottieAnimation
          onPress={openModal3} 
          label="MOMENT"
          fontMargin={3}
          animationSource={require("../assets/anims/heartinglobe.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          animationWidth={234}
          animationHeight={234}
          labelContainerMarginHorizontal={4}
          animationMargin={-64}  
          shapePosition="right"
          shapeSource={require("../assets/shapes/rainbowleaf.png")}
          shapeWidth={240}
          shapeHeight={240}
          shapePositionValue={-104}  
          showIcon={false}
        />
        <ButtonLottieAnimation
          onPress={openModal2} 
          label="IMAGE"
          showIcon={false}
          fontMargin={3}
          animationSource={require("../assets/anims/koispinner.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          animationWidth={260}
          animationHeight={260}
          labelContainerMarginHorizontal={-4}
          animationMargin={-68}
          animationSource={require("../assets/anims/goldspinningstar.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          animationWidth={80}
          animationHeight={80}
          labelContainerMarginHorizontal={-6}
          animationMargin={20}
          shapePosition="right"
          shapeSource={require("../assets/shapes/fernbasic.png")}
          shapeWidth={340}
          shapeHeight={340}
          shapePositionValue={-136}
        />
        <ButtonLottieAnimation
          onPress={openModal1} 
          label="HELLO"
          showIcon={false}
          fontMargin={3}
          animationSource={require("../assets/anims/goldspinningstar.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          animationWidth={80}
          animationHeight={80}
          labelContainerMarginHorizontal={-6}
          animationMargin={20}
          animationSource={require("../assets/anims/heartinglobe.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          animationWidth={234}
          animationHeight={234}
          labelContainerMarginHorizontal={4}
          animationMargin={-64}  
          shapePosition="right"
          shapeSource={require("../assets/shapes/coffeebeans.png")}
          shapeWidth={260}
          shapeHeight={260}
          shapeSource={require("../assets/shapes/happyskull.png")}
          shapeWidth={200}
          shapeHeight={200}
          shapePositionValue={-70}
        />
        <ButtonLottieAnimation
          onPress={openModalSettings}
          label="FRIEND"
          animationSource={require("../assets/anims/goldspinningstar.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          fontMargin={3}
          animationWidth={80}
          animationHeight={80}
          labelContainerMarginHorizontal={-6}
          animationMargin={20}
          animationSource={require("../assets/anims/heartsinglecircle.json")}
          rightSideAnimation={false}
          labelFontSize={30}
          labelColor="white"
          animationWidth={240}
          animationHeight={240}
          labelContainerMarginHorizontal={4}
          animationMargin={-68}
          shapeSource={require("../assets/shapes/redleafsimple.png")}
          shapeWidth={340}
          shapeHeight={340}
          shapePosition="right"
          shapePositionValue={-190}
          shapeSource={require("../assets/shapes/pinkflower.png")}
          shapeWidth={440}
          shapeHeight={440}
          shapePositionValue={-310}
          showIcon={false}
        />
      </View>
      <HelloFriendFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  navigationButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonContainer: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 20,
  },
});

export default ScreenDefaultActionMode;
 