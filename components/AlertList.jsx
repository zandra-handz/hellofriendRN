import React, { useEffect, useRef} from 'react';
import { useGlobalStyle} from '../context/GlobalStyleContext';
import { TouchableOpacity, StyleSheet, View, Modal, Text, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import LoadingPage from '../components/LoadingPage';  
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import SearchBar from '../components/SearchBar';
import { Dimensions } from 'react-native';

const AlertList = ({ 
    isModalVisible,
    isFetching, 
    useSpinner,
    toggleModal,
    headerContent,
    includeBottomButtons=true,
    questionText='test',
    content,
    
    includeSearch=false,
    searchData,
    searchField,
    searchOnPress,
    onConfirm,
    onCancel,
    bothButtons = false,
    confirmText = 'OK',
    cancelText = 'Nevermind',
    type = 'success',
}) => {

    const { themeStyles } = useGlobalStyle(); 
    const fadeAnim = useRef(new Animated.Value(0)).current; 
    const modalHeight = Dimensions.get('window').height * 0.86;

    useEffect(() => { 
        Animated.timing(fadeAnim, {
          toValue: isModalVisible ? 1 : 0,
          duration: 300,  
          useNativeDriver: true,
        }).start();
      }, [isModalVisible]);

    return (
        <Modal transparent={true} visible={isModalVisible} animationType="slide" onRequestClose={toggleModal}>
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
               
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1}}  
                >
                    <View style={[styles.modalContent, themeStyles.genericTextBackground, { height: modalHeight, borderColor: themeStyles.genericTextBackgroundShadeTwo.backgroundColor }]}>
                        {headerContent && 
                            <View style={[styles.headerContainer, themeStyles.genericText]}> 
                                <View style={styles.firstSection}>
                                    {!includeBottomButtons && (
                                        <TouchableOpacity onPress={onCancel} style={styles.closeButtonTop}> 
                                            <ArrowLeftCircleOutlineSvg width={40} height={40} color={themeStyles.genericText.color} />
                                        </TouchableOpacity>
                                    )}
                                </View>
    
                                <View style={[styles.headerSection, styles.middleSection]}>
                                    {headerContent}
                                </View>
    
                                <View style={styles.lastSection}>
                                    {!includeBottomButtons && includeSearch && (
                                        <View style={{width: '90%'}}>
                                        <SearchBar data={searchData} onPress={searchOnPress} searchKeys={searchField}/>  
                                        </View>
                                    )}
                                </View>
                            </View>
                        }
                        {questionText && <Text style={[styles.questionText, themeStyles.genericText]}>{questionText}</Text>}
    
                        {useSpinner && isFetching ? (
                            <LoadingPage loading={isFetching} spinnerType='circle' />
                        ) : (
                            <> 
                                <View style={{ height: '76%', width: Dimensions.get("screen").width - 60 }}>
                                    {content} 
                                </View>
    
                                {includeBottomButtons && ( 
                                    <View style={styles.buttonContainer}>
                                        {bothButtons && ( 
                                            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                                                <Text style={styles.buttonText}>{confirmText}</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity onPress={onCancel} style={[styles.cancelButton, type === 'success' && styles.successCancelButton]}>
                                            <Text style={styles.buttonText}>{cancelText}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        zIndex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.84)',  // Slightly transparent background
    },
    modalContent: {
        width: '92%',  
        minHeight: 200,   
        padding: 10,
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        paddingBottom: 30, 
        flexDirection: 'column',
        justifyContent: 'space-between',
        
        marginTop: 50,
    },
    closeButtonTop: { 
        padding: 5,
    },
    headerContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures equal spacing
        alignContent: 'center',
        alignItems: 'center', 
        width: '100%',
        zIndex: 3,
    },
    headerSection: {
        flex: 1,  
        justifyContent: 'center',
        alignItems: 'center',
      
    },
    firstSection: {
        flex: 1, // Each section takes up equal space
        justifyContent: 'center',  
    },
    lastSection: {
        flex: 1,  
        justifyContent: 'center',
        alignItems: 'center', 
        zIndex: 2,
    },
    middleSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: { 
        width: '100%',
        fontSize: 20, 
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        zIndex: 0,

    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 20,
        marginVertical: 6,
        width: '100%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 20,
        marginVertical: 6,
        width: '100%',
        alignItems: 'center',
    },
    successCancelButton: {
        backgroundColor: '#388E3C',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
});

export default AlertList;
