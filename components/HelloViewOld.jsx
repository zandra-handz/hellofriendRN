import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ItemModal from '../components/ItemModal';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useCapsuleList } from '../context/CapsuleListContext'; 
import { useGlobalStyle } from '../context/GlobalStyleContext';
import PickerMultiMomentsArchived from '../components/PickerMultiMomentsArchived';
import ViewMultiMomentsArchived from '../components/ViewMultiMomentsArchived';
import DisplayHelloNotes from '../components/DisplayHelloNotes';
 
import ButtonReuseMoments from '../components/ButtonReuseMoments';

const HelloView = ({ hello, onClose }) => {
  const { themeStyles } = useGlobalStyle();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isReselectMomentsModalVisible, setReselectMomentsModalVisible] = useState(false);
  const { selectedFriend, calculatedThemeColors } = useSelectedFriend();
  const { capsuleList  } = useCapsuleList();
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
 

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    onClose();
  };

 
  const handleMomentSelect = (selectedMoments) => {
    setMomentsSelected(selectedMoments);
    if (selectedMoments && selectedMoments.length > 0) {
      setMomentsToSave(true);
      console.log('moments set to true');
    } else {
      setMomentsToSave(false);
      console.log('moments set to false');
    };
    console.log('Selected Moments in Parent:', selectedMoments);
  };

  return (
    <ItemModal
      isModalVisible={isModalVisible}
      toggleModal={closeModal}
      modalContent={
        hello ? (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.itemTitleContainer}>
                <Text style={[styles.itemTitle, themeStyles.subHeaderText]} >{hello.date}</Text> 
              </View>
              <View style={styles.infoContainer}> 
                <View style={styles.detailRow}>
                  <Text style={[styles.detailsText, themeStyles.genericText]}> {hello.type}</Text> 
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailsText, themeStyles.genericText]}>@ {hello.locationName} </Text> 
                </View> 
                <View style={styles.notesRow}> 
                  <DisplayHelloNotes 
                    notes={hello.additionalNotes}
                    borderColor={calculatedThemeColors.lightColor} />
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
                <ButtonReuseMoments 
                  onPress={toggleReselectModal} 
                  momentsData={momentsSelected}
                  disabled={!momentsToSave} 
                  /> 
          </View>
        ) : null
      }
      modalTitle={`Helloes for ${selectedFriend.name}`}
    />
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%',
    height: '100%',
    justifyContent: 'space-between', 
    paddingHorizontal: 2,
  }, 
  headerContainer: { 
    width: '100%',
    textAlign: 'left',  
  },
  itemTitleContainer: {
    width: '100%',
    paddingTop: 20,  
    },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',   
  },
  detailsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',  
  },
  infoContainer: {
    flexDirection: 'column', 
    alignItems: 'flex-start', 
  }, 
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%',
  },
  notesRow: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center', 
    width: '100%',
  },
  archivedMomentsContainer: {  
    width: '100%',  
    height: 280, 
  }, 
    momentsContainer: {  
    height: 280,
    width: '100%', 
    borderRadius: 8,  
  },
});

export default HelloView;
