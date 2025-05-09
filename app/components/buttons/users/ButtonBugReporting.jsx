import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity, AccessibilityInfo } from 'react-native';
 
import InfoOutlineSvg from '@/app/assets/svgs/info-outline.svg'; 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import AlertFormNoSubmit from '../components/AlertFormNoSubmit';
import { Linking } from 'react-native';


const ButtonBugReporting = ({
  iconSize=34, 
}) => {
  const { themeStyles } = useGlobalStyle();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  React.useEffect(() => {
    if (isModalVisible) {
      AccessibilityInfo.announceForAccessibility('Information opened');
    }
  }, [isModalVisible]);

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <InfoOutlineSvg width={iconSize} height={iconSize} style={themeStyles.footerIcon} />
      </TouchableOpacity>

      <AlertFormNoSubmit
            isModalVisible={isModalVisible}  
            headerContent={<InfoOutlineSvg width={38} height={38} color={themeStyles.modalIconColor.color} />}
            questionText="Bug Reporting"
            formBody={  
              <ScrollView contentContainerStyle={styles.bodyContainer}>
                <View style={styles.sectionContainer}>
                  <Text style={[styles.text, themeStyles.genericText]}>Found a bug or have other feedback?</Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={[styles.text, themeStyles.genericText]}>
                    Please 
                  </Text>
                  <Button onPress={() => Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description') }
      title="support@example.com" />
                </View>

                <View style={styles.headerContainer}>
                  <Text style={[styles.headerText, themeStyles.subHeaderText]}>What is a 'Moment'?</Text>
                </View>       


               
                </ScrollView>}
            formHeight={610} 
            onCancel={toggleModal} 
            cancelText="Back"
        />
    </>
  );
};

const styles = StyleSheet.create({
  bodyContainer: { 
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    textAlign: 'left',

  },
  headerContainer: {
    margin: '2%',

  },
  sectionContainer: {
    margin: '2%',

  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,

  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,


  },

});


export default ButtonBugReporting;
