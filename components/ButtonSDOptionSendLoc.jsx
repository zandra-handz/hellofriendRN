import React, { useState } from 'react'; 

import HelloFriendInvite from '../components/HelloFriendInvite';

import ButtonBaseSDOption from '../components/ButtonBaseSDOption';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 

import AlertImage from '../components/AlertImage';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';



const ButtonSDOptionSendLoc = () => {

    const { calculatedThemeColors } = useSelectedFriend(); 
    const [ isModalVisible, setIsModalVisible ] = useState(false);

    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    return(
        <>
        <ButtonBaseSDOption 
            onPress={openModal} 
            icon={DistanceDottedSvg}
            iconColor={calculatedThemeColors.fontColor}
            iconSize={32}
        />

        <AlertImage
            isModalVisible={isModalVisible}
            toggleModal={closeModal} 
            modalContent={<HelloFriendInvite />}
            modalTitle={'Send Hello plans!'}
        > 
      </AlertImage>
      </>

    );
};

export default ButtonSDOptionSendLoc;
