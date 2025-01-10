import React, { useState, useEffect } from "react";
import { View, Modal, TextInput, Text, Animated, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useFriendList } from '../context/FriendListContext';

import ArrowNextStemlessLineSvg from '../assets/svgs/arrow-next-stemless-line.svg';
import ArrowPrevStemlessLineSvg from '../assets/svgs/arrow-prev-stemless-line.svg';

const DoubleChecker = ({
  isVisible,
  toggleVisible,
  singleQuestionText='single question goes here',
  noButtonText='go back',
  yesButtonText='yes',
  onPress,
}) => {

    const { themeStyles, manualGradientColors } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();

      const { width, height } = Dimensions.get("window");
    

      //copy-pastad from ContentAddHello to play around with
      const oneFifthHeight = height / 5;
      const oneSixthHeight = height / 6;
      const oneSeventhHeight = height / 7; 
      const oneHalfHeight = height / 2;  

    return(
        <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true }>
            <View style={styles.backgroundContainer}>
            
            <View style={[styles.modalContainer, themeStyles.genericTextBackgroundShadeTwo, {borderColor: manualGradientColors.lightColor}]}>
                <View style={styles.singleQuestionContainer}>
                    <Text numberOfLines={1} style={[styles.singleQuestionText, themeStyles.genericText]}>
                    {singleQuestionText}
                    </Text>
                </View>
                <View style={styles.buttonRowContainer}>
                    
                    <TouchableOpacity
                    style={[styles.noButton, themeStyles.genericTextBackgroundShadeThree, {borderColor: 'transparent'}]} 
                    onPress={toggleVisible}> 
                    <ArrowPrevStemlessLineSvg style={styles.prevArrowContainer} height={20} width={20} color={themeStyles.genericText.color}/>
                    <Text style={[styles.buttonText, themeStyles.genericText]}>{noButtonText}</Text>
                    
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.yesButton, themeStyles.genericTextBackgroundShadeThree, {borderColor: 'transparent'}]} onPress={onPress}> 
                    <Text style={[styles.buttonText, themeStyles.genericText]}>{yesButtonText}</Text>
                    <ArrowNextStemlessLineSvg style={styles.nextArrowContainer}  height={20} width={20} color={themeStyles.genericText.color}/>
                    
                    </TouchableOpacity>
                </View>
            </View>
            
            </View>

        </Modal>
    )
};


const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        zIndex: 0,
        margin: 0,
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.84)", 
        paddingHorizontal: '6%',
        
        zIndex: 1000, 
      },
    modalContainerIfNoBackground: {
        height: 'auto',
        marginHorizontal: 20, 
        top: '40%', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 20,
        alignItems: 'center',
        //borderWidth: StyleSheet.hairlineWidth,
        borderWidth: 1,
        borderColor: 'limegreen',
        padding: 20,
        zIndex: 1000, 
    },
    modalContainer: {
        height: '16%',
        width: '100%',
        marginHorizontal: 20, 
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 30,
        alignItems: 'center',
        //borderWidth: StyleSheet.hairlineWidth,
        borderWidth: 1,
        paddingTop: '8%',
        zIndex: 1000, 
    }, 
    singleQuestionContainer: {
        flex: 1,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
        //backgroundColor: 'pink',
        height: '5%', 

    },
    singleQuestionText: {
        fontSize: 17,
        fontFamily: 'Poppins-Regular',
        //textTransform: 'uppercase',
        //fontWeight: 'bold',
        lineHeight: 22,
    },
    buttonRowContainer: {
        width: '100%',
        //backgroundColor: 'orange',
        flexDirection: 'row',
        height: '44%', //height of buttons set here
        justifyContent: 'space-between',
        overflow: 'hidden',

    },
    noButton: { 
        height: '100%',
        width: '49%',
        flex: 1,
        flexDirection: 'row',
        borderBottomLeftRadius: 30, 
        paddingHorizontal: '4%',
        justifyContent: 'center', 
        alignItems: 'center',  
        borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: '2%',
        //borderColor: 'hotpink',

    },
    yesButton: { 
        height: '100%',
        width: '49%',
        flex: 1,
        flexDirection: 'row',
        borderBottomRightRadius: 30,   
        paddingHorizontal: '4%',
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: '2%',
        //borderColor: 'hotpink',

    },
    prevArrowContainer: {
        position: 'absolute',
        left: 20,

    },
    nextArrowContainer: {
        position: 'absolute',
        right: 20,

    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        //textTransform: 'uppercase',

    }
    

});

export default DoubleChecker;