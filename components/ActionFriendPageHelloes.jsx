import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import ButtonLottieAnimationSatellitesHelloes from './ButtonLottieAnimationSatellitesHelloes';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchPastHelloes } from '../api';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg'; // Import the SVG
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';
import ActionFriendPageAllHelloes from '../components/ActionFriendPageAllHelloes';
import IconDynamicHelloType from '../components/IconDynamicHelloType';


const ActionFriendPageHelloes = ({ onPress }) => {
  const { selectedFriend, setFriend, friendDashboardData } = useSelectedFriend(); 
  const [helloesList, setHelloesList] = useState([]);
  const [isFSModalVisible, setIsFSModalVisible] = useState(false);
  

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
  let mainHelloType = null;
  let mainHelloDetails = [];
  let satelliteHelloes = [];
  let satellitesFirstPage = 1;
  let additionalSatelliteCount = null;
  let additionalHelloes = [];

  let overrideView = true;

  if (helloesList.length > 0) {
    mainHello = helloesList[0];
    mainHelloType = helloesList[0].type;
    
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

  const handleFullScreen = () => {
    setIsFSModalVisible(true); 
  };

  const closeModal = () => {
    setIsFSModalVisible(false); 
  };

  
  const handlePress = (hello) => {
    const { location } = hello;   
    console.log('ALL HELLOES!!', hello);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        {additionalSatelliteCount > 0 || overrideView ? (
          <ButtonLottieAnimationSatellitesHelloes
            onPress={() => handlePress(mainHello)} 
            navigateToFirstPage={navigateToFirstPage}
            firstItem={mainHello ? mainHello : 'Loading...'}
            allItems={helloesList ? helloesList : 'Loading...'}
            subHeaderText={mainHello ? mainHello.locationName : 'Loading...'}
            
            additionalText={
              mainHello && friendDashboardData.length > 0 && friendDashboardData[0].days_since !== undefined
                ? friendDashboardData[0].days_since === 1
                  ? `${friendDashboardData[0].days_since} day ago`
                  : `${friendDashboardData[0].days_since} days ago`
                : ''
            }
            typeIcon={mainHello ? <IconDynamicHelloType selectedChoice={mainHello.type} svgHeight={70} svgWidth={70} /> : null}
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
            showShape={false}
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
            firstItem={mainHello ? mainHello.date : 'Loading...'}
            allItems={helloesList ? helloesList : 'Loading...'}
            subHeaderText={mainHello ? mainHello.locationName: 'Loading...'}
            
            additionalText={
              mainHello && friendDashboardData.length > 0 && friendDashboardData[0].days_since !== undefined
                ? friendDashboardData[0].days_since === 1
                  ? `${friendDashboardData[0].days_since} day ago`
                  : `${friendDashboardData[0].days_since} days ago`
                : ''
            }
            typeIcon={mainHello ? <IconDynamicHelloType selectedChoice={mainHello.type} /> : null}
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
            showShape={false}
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

      {((!showSecondButton && additionalSatelliteCount > 0) || !showSecondButton && overrideView) && (
        <>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
            <View style={styles.svgFSContainer}>
              <ArrowFullScreenOutlineSvg width={60} height={46} style={styles.SvgFSImage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <View style={styles.svgContainer}>
              <ArrowRightCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
            </View>
          </TouchableOpacity>
        </View>
        </>
      )}

      {showSecondButton && (
        <>
        <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={handleFullScreen} style={styles.arrowButton}>
            <View style={styles.svgFSContainer}>
              <ArrowFullScreenOutlineSvg width={60} height={46} style={styles.SvgFSImage} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToFirstPage} style={styles.arrowButton}>
            <View style={styles.svgContainer}>
              <ArrowLeftCircleOutlineSvg width={100} height={100} style={styles.SvgImage} />
            </View>
          </TouchableOpacity>
        </View>
        </>
      )}
      <ActionFriendPageAllHelloes
        helloData={helloesList}
        isModalVisible={isFSModalVisible}
        toggleModal={closeModal} onClose={closeModal} />
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
  arrowContainer: {
    flexDirection: 'column',
    marginRight: -4,

  },
  arrowButton: {
    padding: 4,
    marginRight: -8,
    marginLeft: -10,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  svgContainer: {
    width: 60,  
    height: 60,  
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',  
  },
  SvgImage: {
    transform: [{ scale: .8 }],  
  },
  svgFSContainer: {
    width: 60,
    height: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingTop: 20,
    marginBottom: -6,
  },
  SvgFSImage: {
    transform: [{ scale: 1.22 }],
  },
});

export default ActionFriendPageHelloes;
