import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import HelloFriendInvite from '../components/HelloFriendInvite';

import ButtonLottieAnimationSvg from '../components/ButtonLottieAnimationSvg';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 




import AlertImage from '../components/AlertImage';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonSendDirectionsToFriend = () => { 
    const { selectedFriend } = useSelectedFriend(); 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

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
 
            <ButtonLottieAnimationSvg
                onPress={openModal}
                preLabel = ''
                label={`Send ${selectedFriend.name} This Location`}
                height={58}
                radius={12}
                labelFontSize={22} 
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false} 
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64} 
                showShape={true}  
                shapePosition="right"
                shapeSource={DistanceDottedSvg} 
                shapeWidth={86}
                shapeHeight={86}
                shapePositionValue={-4}
                shapePositionValueVertical={-14}
                showIcon={false} 
                />
 
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: 'transparent',
    },    
  });

  export default ButtonSendDirectionsToFriend;