import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesHelloes from './ButtonLottieAnimationSatellitesHelloes';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchPastHelloes } from '../api';

const ActionFriendPageHelloes = ({ onPress }) => {
  const { selectedFriend, setFriend } = useSelectedFriend(); 
  const [helloesList, setHelloesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            if (selectedFriend) {
                const helloes = await fetchPastHelloes(selectedFriend.id);
                
                setHelloesList(helloes);  
                console.log("fetchData Helloes List: ", helloes);
            } else { 
                setHelloesList(helloes || []);
            }
        } catch (error) {
            console.error('Error fetching helloes list:', error);
        }
    };

    fetchData();
}, [selectedFriend]);


  
  let mainHello = null;
  let satelliteHelloes = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalHelloes = [];

  if (helloesList.length > 0) {
    mainHello = helloesList[0];
    satelliteHelloes = helloesList.slice(1);
    additionalSatelliteCount = satelliteHelloes.length - satellitesFirstPage;

    if (additionalSatelliteCount > 0) {
      additionalHelloes = helloesList.slice(satellitesFirstPage + 1);
    } else {
      additionalHelloes = null;
    }
  }

  const [showSecondButton, setShowSecondButton] = useState(false);
  const opacityAnim = new Animated.Value(1);

  const navigateToFirstPage = () => {
    setShowSecondButton(false);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    setShowSecondButton(true);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  
  const handlePress = (hello) => {
    const { location } = hello;   
    console.log('ALL HELLOES!!', hello);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 ? (
          <ButtonLottieAnimationSatellitesHelloes
            onPress={() => handlePress(mainHello)} 
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainHello ? mainHello.type : 'Loading...'}
            allItems={helloesList ? helloesList : 'Loading...'}
            additionalText={mainHello ? mainHello.date : ''}
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={require('../assets/shapes/greenfloral.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteHelloes}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={showSecondButton}
            additionalSatellites={helloesList}
            satelliteOnPress={(hello) => handlePress(hello)} 
          />
        ) : (
          <ButtonLottieAnimationSatellitesHelloes
            onPress={() => handlePress(mainHello)}
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainHello ? mainHello : 'Loading...'}
            allItems={helloesList ? helloesList : 'Loading...'}
            
            fontMargin={3}
            animationSource={require('../assets/anims/heartinglobe.json')}
            rightSideAnimation={false}
            labelFontSize={16}
            labelColor="white"
            animationWidth={234}
            animationHeight={234}
            lightColor="black"
            labelContainerMarginHorizontal={4}
            animationMargin={-64}
            shapePosition="right"
            shapeSource={require('../assets/shapes/funkycoloredpattern.png')}
            shapeWidth={340}
            shapeHeight={340}
            shapePositionValue={-154}
            showIcon={false}
            satellites={!showSecondButton}
            satelliteSectionPosition="right"
            satelliteCount={satellitesFirstPage}
            satelliteHellos={satelliteHelloes}
            satellitesOrientation="horizontal"
            satelliteHeight="60%"
            additionalPages={false}
            satelliteOnPress={(hello) => handlePress(hello)} 
          />
        )}
      </Animated.View>

      {!showSecondButton && additionalSatelliteCount > 0 && (
        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      )}

      {showSecondButton && (
        <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
    borderRadius: 30,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    padding: 10,
    marginRight: 10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ActionFriendPageHelloes;
