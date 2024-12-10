import React, { useState } from 'react';  
 
import ButtonBaseSDOption from '../components/ButtonBaseSDOption';
import DistanceDottedSvg from '../assets/svgs/distance-dotted.svg'; 

import ItemModal from '../components/ItemModal';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';



const ButtonSDOptionCalculateTravel = () => {

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

        <ItemModal
            isModalVisible={isModalVisible} 
            toggleModal={closeModal} 
            modalContent={<View><Text>REMOVED OLD COMPARE TRAVEL COMPONENT THAT WAS HERE</Text></View>}
            modalTitle={'Compare travel times'}
        > 
        </ItemModal> 
      </>

    );
};

export default ButtonSDOptionCalculateTravel;
