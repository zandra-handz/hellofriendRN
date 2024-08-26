import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Button } from 'react-native';
import AlertImage from '../components/AlertImage';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain'; // Import ItemMomentMultiPlain component
import PickerMultiMomentsArchived from '../components/PickerMultiMomentsArchived';
import ViewMultiMomentsArchived from '../components/ViewMultiMomentsArchived';

import NavigationArrows from '../components/NavigationArrows';

import FooterActionButtons from '../components/FooterActionButtons';
import ButtonReuseMoments from '../components/ButtonReuseMoments';

const ItemViewHello = ({ hello, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isReselectMomentsModalVisible, setReselectMomentsModalVisible] = useState(false);
  const { selectedFriend } = useSelectedFriend();
  const { capsuleList, setCapsuleList } = useCapsuleList();
  const [showCheckboxVersion, setShowCheckboxVersion ] = useState(false);
  const [momentsToSave, setMomentsToSave] = useState(false);

  const [momentsSelected, setMomentsSelected] = useState([]);
  

  useEffect(() => {
    if (capsuleList) {
      setReselectMomentsModalVisible(false);
      setMomentsSelected([]);
      setMomentsToSave(false);
    }
  }, [capsuleList]);

  const toggleReselectModal = () => {
    setReselectMomentsModalVisible(!isReselectMomentsModalVisible);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  };

  const handleUpdate = async () => {
    try { 
      onClose();
    } catch (error) {
      console.error('Error updating moment:', error);
    }
  };

  const handleDelete = async () => {
    try { 
      onClose();
    } catch (error) {
      console.error('Error deleting moment:', error);
    }
  };
  const handleMomentSelect = (selectedMoments) => {
    setMomentsSelected(selectedMoments);
    if (selectedMoments.length > 0) {
      setMomentsToSave(true);
      console.log('moments set to true');
    } else {
      setMomentsToSave(false);
      console.log('moments set to false');
    };
    console.log('Selected Moments in Parent:', selectedMoments);
  };

  return (
    <AlertImage
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        hello ? (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.name} >{hello.date}</Text> 
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.detailsColumn}>
                <View style={styles.detailRow}>
                <Text style={styles.detailsText}> {hello.type}</Text> 
                </View>
                <View style={styles.detailRow}>
                <Text style={styles.detailsText}>@ {hello.locationName} </Text> 
                </View>
              </View>
            </View>  

            {!isReselectMomentsModalVisible && ( 
            <View style={styles.momentsContainer}> 
            <ViewMultiMomentsArchived
              archivedMoments={hello.pastCapsules}
              reuseButtonOnPress={toggleReselectModal}
             />
          </View>
          )}
            {isReselectMomentsModalVisible && ( 
            <View style={styles.momentsContainer}> 
            <PickerMultiMomentsArchived
              archivedMoments={hello.pastCapsules}
              onMomentSelect={handleMomentSelect}
              onCancel={toggleReselectModal}
             />
          </View>
          )}
          {showCheckboxVersion && (  
            <View style={styles.archivedMomentsContainer}>
              <ScrollView> 
              <ItemMomentMultiPlain passInData={true} data={hello.pastCapsules} singleLineScroll={false} />
              </ScrollView> 
            </View> 
          )}
            <FooterActionButtons
              height='7%'
              bottom={15} 
              backgroundColor='white'
              buttons={[
                <ButtonReuseMoments 
                  onPress={toggleReselectModal} 
                  momentsData={momentsSelected}
                  disabled={!momentsToSave} 
                  />, 
              ]}
            />
          </View>
        ) : null
      }
      modalTitle={`View hello with ${selectedFriend.name}!`}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 84,
  },
  headerContainer: {
    flexDirection: 'row',  
    textAlign: 'left',
    width: '100%',
    backgroundColor: 'transparent', 
    marginBottom: 2, 
  },
  name: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase', 
    width: '100%',
    flex: 1,
  },
  detailsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
    width: '100%',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailsColumn: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  archivedMomentsContainer: { 
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',  
    borderRadius: 0, 
  },
  buttonContainer: { 
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
    momentsContainer: { 
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 8,
    padding: 0,
    minHeight: 400, 
  },
});

export default ItemViewHello;
