
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileCircleSvg from '../assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg
import { useGlobalStyle } from '../context/GlobalStyleContext';
import AlertList from '../components/AlertList';
import RowItemFriendDelete from '../components/RowItemFriendDelete';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const ButtonSelectFriend = ({ friend }) => {
    const { selectedFriend, calculatedThemeColors } = useSelectedFriend();
    const { themeStyles } = useGlobalStyle();  
    const [isFriendDetailsModalVisible, setIsFriendDetailsModalVisible] = useState(false);
    const [ rowColor, setRowColor ] = useState(themeStyles.genericTextBackgroundShadeTwo.backgroundColor || 'transparent');
    const [ lightColor, setLightColor ] = useState(friend.lightColor || 'gray');
    const [ darkColor, setDarkColor ] = useState(friend.darkColor || 'gray');
    const [ textColor, setTextColor ] = useState(themeStyles.genericText.color);

    const toggleFriendDetailsModal = () => {
        setIsFriendDetailsModalVisible(true);

    };

    useEffect(() => {
        if (selectedFriend && calculatedThemeColors) { 
            if (friend.id === selectedFriend.id) {
                setRowColor(calculatedThemeColors.darkColor);
                setLightColor(calculatedThemeColors.fontColor);
                setDarkColor(calculatedThemeColors.fontColor);
                setTextColor(calculatedThemeColors.fontColor);
            } else {
                setRowColor(themeStyles.genericTextBackgroundShadeTwo.backgroundColor || 'transparent');
            }
        };

    }, [selectedFriend]);

    //to restore gradient: [1] - [0]
  const renderProfileIcon = () => { 
        return ( 
            
            <ProfileCircleSvg width={40} height={40} startColor={darkColor || 'black'} endColor={darkColor || 'black'} />
              
        ); 
  };



    const closeFriendDetailsModal = () => {
        setIsFriendDetailsModalVisible(false);

    };
    
    return (
        <View style={[styles.row, {backgroundColor: rowColor, borderColor: textColor}]}>
           
                <View style={styles.iconContainer}> 
                    {renderProfileIcon()}
                
                </View>
                
            <Text numberOfLines={1} style={[styles.name, {color: textColor}]}>{friend.name}</Text> 
             
            <AlertList
                    fixedHeight={true} 
                    isModalVisible={isFriendDetailsModalVisible}
                    content={
                        <View>
                        <RowItemFriendDelete friend={friend} 
                        />
                        </View>
                    }
                    useSpinner={false}
                    toggleModal={closeFriendDetailsModal}
                    headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>{friend.name}</Text>}
                    onConfirm={closeFriendDetailsModal}
                    onCancel={closeFriendDetailsModal}
                    cancelText="Go Back"
                />
        </View>

        



    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 10,  
        width: '100%',
        height: 90,
        textAlign: 'center',

          
        borderWidth: 0, 
        borderRadius: 10, 
    },
    name: {
        alignSelf: 'center', 
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    iconContainer: {
        paddingBottom: 6, 
        width: '100%',
        alignItems: 'center',

    },
    button: {
        color: 'blue'
    }
});

export default ButtonSelectFriend;
