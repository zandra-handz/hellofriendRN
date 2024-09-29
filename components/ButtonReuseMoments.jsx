import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

import ButtonBaseItemViewMain from '../components/ButtonBaseItemViewMain';
import LocationsOnMapColoredSvg from '../assets/svgs/locations-on-map-colored.svg'; // Import the SVG

import AlertList from '../components/AlertList';
import AlertSuccessFail from '../components/AlertSuccessFail';
 
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useAuthUser } from '../context/AuthUserContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { saveThoughtCapsule } from '../api';

const ButtonReuseMoments = ({ momentsData, disabled }) => {
    
  const { authUserState } = useAuthUser(); 
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { setCapsuleList } = useCapsuleList();

  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);
  

  const [ isModalVisible, setIsModalVisible ] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const [saveInProgress, setSaveInProgress ] = useState(false);

  const handleSave = async () => {
    if (selectedFriend && momentsData) {
      setSaveInProgress(true); 
  
      const saveAllMoments = async () => {
        const savePromises = momentsData.map(async (moment) => {
          const requestData = {
            user: authUserState.user.id,
            friend: selectedFriend.id,
            typed_category: moment.typed_category,
            capsule: moment.capsule,
          };
  
          try {
            const response = await saveThoughtCapsule(requestData);
            const newMomentForCapsuleList = {
              id: response.id,
              typedCategory: response.typed_category,
              capsule: response.capsule,
            }; 
            setCapsuleList(prevCapsules => [newMomentForCapsuleList, ...prevCapsules]);
          } catch (error) {
            console.error('Error saving capsule:', error);
          } 
        });
  
        // Wait for all promises to complete
        await Promise.all(savePromises);
        console.log('All capsules have been saved.');
      };
  
      try {
        await saveAllMoments();
        setSuccessModalVisible(true);
        closeModal();
      } catch (error) {
        console.error('One or more capsules failed to save:', error);
        setFailModalVisible(true);
        closeModal();
      } finally {
        setSaveInProgress(false);
      }
    } else {
      console.log('No friend selected or capsules data is missing.');
      setFailModalVisible(true);
      closeModal();
    }
  };
  

    const successOk = () => { 
      setSuccessModalVisible(false);
  };

  const failOk = () => { 
      setFailModalVisible(false);
  };

     

    return (
        <View style={styles.container}>
        <AlertList
            fixedHeight={true}
            height={700}
            isModalVisible={isModalVisible} 
            isFetching={saveInProgress}
            useSpinner={true}
            toggleModal={closeModal}
            headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>Review</Text>}
            content={
                <FlatList
                    data={momentsData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.rowItem}>
                            <Text style={styles.rowLabel}>{item.typed_category}:</Text>
                            <Text>{item.capsule}</Text>
                        </View>
                    )}
                />
            }
            
            onConfirm={handleSave}
            onCancel={closeModal}
            bothButtons={true}
            confirmText="Reuse"
            cancelText="No"
        />
                <AlertSuccessFail
            isVisible={isSuccessModalVisible}
            message={`Moments have been added!`}
            onClose={successOk}
            type='success'
        />

        <AlertSuccessFail
            isVisible={isFailModalVisible}
            message={`Could not readd moments.`}
            onClose={failOk}
            tryAgain={false}
            onRetry={handleSave}
            isFetching={saveInProgress}
            type='failure'
        />

            
            <ButtonBaseItemViewMain 
                onPress={openModal} 
                preLabel = ''
                label="Reload moments?" 
                fontMargin={3}
                animationSource={require("../assets/anims/heartinglobe.json")}
                rightSideAnimation={false}  
                animationWidth={234}
                animationHeight={234}
                labelContainerMarginHorizontal={4}
                animationMargin={-64}
                showGradient={true} 
                showShape={true} 
                shapePosition="right"
                shapeSource={LocationsOnMapColoredSvg} 
                shapeWidth={110}
                shapeHeight={110}
                shapePositionValue={-14}
                shapePositionValueVertical={-23}
                showIcon={false}  
                disabled={disabled}
                />

            </View> 

    );
};

const styles = StyleSheet.create({
    container: { 
      width: '100%', 
    }, 
  });

  export default ButtonReuseMoments;