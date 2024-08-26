import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AlertImage from '../components/AlertImage';

import { useSelectedFriend } from '../context/SelectedFriendContext';

import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';



import HelloFriendInvite from '../components/HelloFriendInvite';


import ThoughtBubbleTwoSolidSvg from '../assets/svgs/thought-bubble-two-solid.svg'; // Import the SVG
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG


const ButtonMomentCategory = ({onPress, categoryText, momentCount}) => {

    const { friendColorTheme } = useSelectedFriend();
   
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [lightColor, setLightColor] = useState('black');
    const [darkColor, setDarkColor] = useState('black');
  
    useEffect(() => {
      if (friendColorTheme && friendColorTheme.useFriendColorTheme !== false) {
        if(friendColorTheme.invertGradient) {
          setLightColor(friendColorTheme.darkColor || 'black');
          setDarkColor(friendColorTheme.lightColor || 'black');
        } else {
          setLightColor(friendColorTheme.lightColor || 'black');
          setDarkColor(friendColorTheme.darkColor || 'black');
        };
      }
      if (friendColorTheme && friendColorTheme.useFriendColorTheme == false) {
        setLightColor('black');
        setDarkColor('black');
      }
    }, [friendColorTheme]);
  

    const openModal = () => setIsModalVisible(true);

    const closeModal = () => setIsModalVisible(false);



    return (
        <View style={styles.container}>
        <AlertImage
            isModalVisible={isModalVisible}
            toggleModal={closeModal} 
            modalContent={<HelloFriendInvite />}
            modalTitle={'Send Hello plans!'}

 
        > 
      </AlertImage>
            <View style={styles.buttonContainer}> 


            <ButtonLottieAnimationSvg
                onPress={onPress}
                preLabel = {momentCount}
                preLabelFontSize = {18} 
                preLabelColor='white'  
                label={categoryText}
                height={46}
                radius={10}
                fontMargin={3}
                rightSideAnimation={false}
                labelFontSize={17} 
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true}
                lightColor={lightColor}
                darkColor={darkColor}
                showShape={true} 
                shapePosition="right"
                shapeSource={ThoughtBubbleOutlineSvg} 
                shapeWidth={66}
                shapeHeight={66}
                shapePositionValue={-4}
                shapePositionValueVertical={-11}
                shapeLabel={momentCount}
                shapeLabelColor='white'
                shapeLabelFontSize={24}
                shapeLabelPositionRight='95%' 
                showIcon={false} 
                />

            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },   
    buttonContainer: {
      height: '90%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      marginHorizontal: 0,
      paddingBottom: 0, 
      paddingTop: 0,
    },
  });

  export default ButtonMomentCategory;