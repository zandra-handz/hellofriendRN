import React from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Dimensions } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import HeaderBaseItemView from '../components/HeaderBaseItemView'; 
import ButtonBaseSpecialSave from '../components/ButtonBaseSpecialSave';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const MomentView = ({ momentData, navigationArrows, onSliderPull, isModalVisible, toggleModal, modalContent, modalTitle }) => {
  
  const { themeStyles } = useGlobalStyle(); 
  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <>
  <View
    style={{
      position: 'absolute', 
      width: '100%',
      zIndex: 1000,
      top: '50%',
      transform: [{ translateY: -50 }],
      alignItems: 'center',
    }}
  >
    {navigationArrows}
  </View>
      <View style={[styles.modalContainer, themeStyles.genericTextBackground]}> 
        <View 
          style={[
            styles.modalContent, themeStyles.genericText,
            { maxHeight: screenHeight * 1, paddingBottom: 0 }  
          ]}
        >
          <HeaderBaseItemView onBackPress={toggleModal} onSliderPull={onSliderPull} headerTitle={modalTitle} />
          <View style={styles.momentContainer}>
            {momentData && momentData.typedCategory && (
            <View style={styles.categoryContainer}>
              <Text style={[styles.categoryText, themeStyles.genericText]}>
                CATEGORY:  {momentData.typedCategory}
              </Text>
            </View> 
            )}
            <View style={{flex: 1}}>
            
            <ScrollView 
                contentContainerStyle={{ padding: 10 }} // Adds padding inside the ScrollView
                style={{ flex: 1 }} // Ensures ScrollView takes up remaining space
              >
                {momentData && momentData.capsule && (
                <Text style={[styles.momentText, themeStyles.genericText]}>
                  {momentData.capsule}
                </Text>
                 )}
            </ScrollView> 
            </View> 
          
          </View>
          <View style={{position: 'absolute', height: 80, bottom: -6, left: -4, width: '103%'}}>
          <ButtonBaseSpecialSave
              label="SEND "
              maxHeight={80}
              onPress={[() => {}]} 
              isDisabled={false}
              fontFamily={'Poppins-Bold'}
              image={require("../assets/shapes/redheadcoffee.png")}
            
            />
          </View>

         
        </View>
    
      </View>
      </> 
     
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1,
    width: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    zIndex: 1,
  }, 
  modalContent: {
    width: '100%',   
    flexDirection: 'column',
    flex: 1,
  
  },
  momentContainer: { 
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'column', 
    flex: 1, 
    padding: '5%',
    paddingHorizontal: '3%',  
  },
  momentText: {
    fontSize: 17,
    lineHeight: 23,
    flexShrink: 1,

  }, 
  categoryText: {
    //fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: '4%',

  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    

  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',  
  },
  closeButton: {
    paddingRight: 30,  
    paddingLeft: 7,
    paddingTop: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'left',
    flex: 1, 
  }, 
});

export default MomentView;
