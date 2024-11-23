import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import HelloFriendInvite from '../components/HelloFriendInvite';

import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 

import ItemModal from '../components/ItemModal';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';


const ButtonSendDirectionsToFriend = () => { 
    const { selectedFriend } = useSelectedFriend(); 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);


    return (
        <View style={styles.container}>
        <ItemModal
            isModalVisible={isModalVisible}
            toggleModal={closeModal} 
            modalContent={<HelloFriendInvite />}
            modalTitle={'Send Hello plans!'}
        > 
      </ItemModal>
 
            <ButtonBottomActionBase
                onPress={openModal}
                preLabel = ''
                label={`Send ${selectedFriend.name} This Location`}
                height={58}
                radius={12}
                labelFontSize={22} 
                fontMargin={3}  
                labelContainerMarginHorizontal={4} 
                showShape={true}  
                shapePosition="right"
                shapeSource={DistanceDottedSvg} 
                shapeWidth={86}
                shapeHeight={86}
                shapePositionValue={-4}
                shapePositionValueVertical={-14} 
                />
 
        </View>

    );
};

const styles = StyleSheet.create({
    container: {  
      width: '100%',  
    },    
  });

  export default ButtonSendDirectionsToFriend;