import React from 'react';
import { View, StyleSheet } from 'react-native';
import ButtonLottieAnimationSatellites from './ButtonLottieAnimationSatellites';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';

const ActionPageUpcomingButton = ({ onPress }) => {
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();

  // Extract the first upcoming hello and the next three for satellites
  let mainHello = null;
  let satelliteHellos = [];

  if (!isLoading && upcomingHelloes.length > 0) {
    mainHello = upcomingHelloes[0];
    satelliteHellos = upcomingHelloes.slice(1, 4); // Slice to get next three
  }

  return (
    <View style={styles.container}>
      <ButtonLottieAnimationSatellites
        onPress={onPress}
        label={mainHello ? mainHello.friend_name : "Loading..."} // Use friend's name or fallback to "UPCOMING"
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
        satellites={true}
        satelliteSectionPosition="right"
        satelliteCount={3}
        satelliteHellos={satelliteHellos} // Pass satellite hellos as prop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
    borderRadius: 30,
    overflow: 'hidden', // Ensure inner elements respect the rounded border
  },
});

export default ActionPageUpcomingButton;
